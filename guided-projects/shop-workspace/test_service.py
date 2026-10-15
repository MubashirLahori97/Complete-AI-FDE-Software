import io
import json
import logging
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

from fastapi.testclient import TestClient
from server import OpenAIAdapter, connect, create_app, initialize, similarity

class ServiceTests(unittest.TestCase):
    def setUp(self):
        self.folder=tempfile.TemporaryDirectory()
        self.db=str(Path(self.folder.name)/'test.db')
        initialize(self.db,demo=True)
        self.now=1000
        self.app=create_app(self.db,clock=lambda:self.now)
        self.client=TestClient(self.app)
    def tearDown(self):
        self.client.close();self.folder.cleanup()
    def signin(self,name='amina',client=None):
        client=client or self.client
        response=client.post('/api/auth/login',json={'username':name,'password':'learn-with-amina'})
        self.assertEqual(response.status_code,200,response.text)
        return {'X-CSRF-Token':response.json()['csrf']}
    def message(self,text='Hello',key='request_123',client=None,headers=None):
        return (client or self.client).post('/api/messages',json={'text':text},headers={**(headers or {}),'Idempotency-Key':key})
    def test_health_and_anonymous(self):
        self.assertEqual(self.client.get('/api/health').json()['mode'],'offline-extractive')
        self.assertEqual(self.client.get('/api/messages').status_code,401)
    def test_login_invalid_and_private_fields(self):
        self.assertEqual(self.client.post('/api/auth/login',json={'username':'amina','password':'wrong'}).status_code,401)
        headers=self.signin(); me=self.client.get('/api/auth/me').json()
        self.assertEqual(set(me),{'username','role','csrf'})
        cookie=self.client.cookies['amina_session']
        with connect(self.db) as connection:
            self.assertIsNone(connection.execute('SELECT token FROM sessions WHERE token=?',(cookie,)).fetchone())
        self.assertEqual(self.message(headers=headers).status_code,201)
    def test_csrf_and_origin(self):
        headers=self.signin()
        self.assertEqual(self.message().status_code,403)
        self.assertEqual(self.message(headers={**headers,'Origin':'https://attacker.invalid'}).status_code,403)
    def test_validation_before_storage(self):
        headers=self.signin()
        for body in [{'text':' '},{'text':'a'*201},{'text':3},{'text':'Hi','shop':'bilal'}]:
            self.assertEqual(self.client.post('/api/messages',json=body,headers={**headers,'Idempotency-Key':'invalid_123'}).status_code,422)
        self.assertEqual(self.client.get('/api/messages').json(),{'messages':[]})
    def test_idempotency_and_changed_body(self):
        headers=self.signin()
        one=self.message(' Hello ',headers=headers);two=self.message('Hello',headers=headers)
        self.assertEqual(one.json(),two.json())
        self.assertEqual(one.json()['text'],'Hello')
        self.assertEqual(self.message('Changed',headers=headers).status_code,409)
        self.assertEqual(len(self.client.get('/api/messages').json()['messages']),1)
    def test_customer_and_cross_shop(self):
        headers=self.signin('sara');id=self.message(headers=headers).json()['id']
        for name in ['omar','bilal']:
            with TestClient(self.app) as other:
                self.signin(name,other)
                self.assertEqual(other.get(f'/api/messages/{id}').status_code,404)
                self.assertEqual(other.get('/api/messages').json()['messages'],[])
        with TestClient(self.app) as staff:
            self.signin('amina',staff)
            self.assertEqual(staff.get(f'/api/messages/{id}').status_code,200)
    def test_expiry_and_logout(self):
        headers=self.signin();self.now+=3601
        self.assertEqual(self.client.get('/api/messages').status_code,401)
        headers=self.signin()
        self.assertEqual(self.client.post('/api/auth/logout',headers=headers).status_code,204)
        self.assertEqual(self.client.get('/api/messages').status_code,401)
    def test_persistence_after_app_restart(self):
        headers=self.signin();record=self.message(headers=headers).json()
        with TestClient(create_app(self.db,clock=lambda:self.now)) as restarted:
            self.signin('amina',restarted)
            self.assertIn(record,restarted.get('/api/messages').json()['messages'])
    def test_scoped_evidence_and_abstention(self):
        headers=self.signin()
        result=self.client.post('/api/ask',json={'text':'return unopened goods'},headers=headers).json()
        self.assertEqual(result['mode'],'offline-extractive')
        self.assertEqual(result['citations'][0]['id'],'amina-returns')
        self.assertNotIn('Bilal',json.dumps(result))
        self.assertEqual(self.client.post('/api/ask',json={'text':'spaceship insurance'},headers=headers).json()['citations'],[])
    def test_customer_cannot_ask_or_propose(self):
        headers=self.signin('sara')
        self.assertEqual(self.client.post('/api/ask',json={'text':'returns'},headers=headers).status_code,403)
        self.assertEqual(self.client.post('/api/proposals',json={'order_id':1,'amount':100},headers=headers).status_code,403)
    def test_approval_and_replay_transaction(self):
        headers=self.signin()
        proposal=self.client.post('/api/proposals',json={'order_id':1,'amount':1200},headers=headers).json()['id']
        path=f'/api/proposals/{proposal}'
        self.assertEqual(self.client.post(path+'/execute',headers=headers).status_code,409)
        self.assertEqual(self.client.post(path+'/approve',headers=headers).status_code,200)
        self.assertEqual(self.client.post(path+'/execute',headers=headers).status_code,200)
        self.assertEqual(self.client.post(path+'/execute',headers=headers).status_code,409)
        with connect(self.db) as connection:
            self.assertEqual(connection.execute('SELECT refunded FROM orders WHERE id=1').fetchone()['refunded'],1200)
    def test_expired_proposal_and_cross_shop(self):
        headers=self.signin();proposal=self.client.post('/api/proposals',json={'order_id':1,'amount':100},headers=headers).json()['id']
        with TestClient(self.app) as other:
            others=self.signin('bilal',other)
            self.assertEqual(other.post(f'/api/proposals/{proposal}/approve',headers=others).status_code,409)
        self.now+=301
        self.assertEqual(self.client.post(f'/api/proposals/{proposal}/approve',headers=headers).status_code,409)
    def test_invalid_refund_and_balance_change(self):
        headers=self.signin()
        self.assertEqual(self.client.post('/api/proposals',json={'order_id':1,'amount':True},headers=headers).status_code,422)
        ids=[self.client.post('/api/proposals',json={'order_id':1,'amount':4000},headers=headers).json()['id'] for _ in range(2)]
        for id in ids:self.client.post(f'/api/proposals/{id}/approve',headers=headers)
        self.assertEqual(self.client.post(f'/api/proposals/{ids[0]}/execute',headers=headers).status_code,200)
        self.assertEqual(self.client.post(f'/api/proposals/{ids[1]}/execute',headers=headers).status_code,409)
        with connect(self.db) as connection:
            self.assertEqual(connection.execute('SELECT executed FROM proposals WHERE id=?',(ids[1],)).fetchone()['executed'],0)
    def test_limit_and_log_privacy(self):
        headers=self.signin();stream=io.StringIO();handler=logging.StreamHandler(stream);logger=logging.getLogger('amina.events');logger.addHandler(handler);logger.setLevel(logging.INFO)
        try:
            for _ in range(20):self.assertEqual(self.client.post('/api/ask',json={'text':'PLANTED_PRIVATE_SECRET'},headers=headers).status_code,200)
            self.assertEqual(self.client.post('/api/ask',json={'text':'anything'},headers=headers).status_code,429)
            self.assertNotIn('PLANTED_PRIVATE_SECRET',stream.getvalue())
            self.assertNotIn(headers['X-CSRF-Token'],stream.getvalue())
        finally:logger.removeHandler(handler)
    def test_provider_failure_and_unauthorized_adapter_source(self):
        class Broken:
            def retrieve(self,*args):raise TimeoutError('secret provider detail')
        class Leak:
            def retrieve(self,*args):return [{'id':'bilal-private','version':1,'text':'private'}]
        for adapter in [Broken(),Leak()]:
            with TestClient(create_app(self.db,adapter=adapter,clock=lambda:self.now)) as client:
                headers=self.signin('amina',client)
                result=client.post('/api/ask',json={'text':'returns'},headers=headers)
                self.assertEqual(result.status_code,200)
                self.assertEqual(result.json()['citations'],[])
                self.assertNotIn('secret',result.text)
    def test_real_adapter_request_and_output_validation_with_sdk_double(self):
        captured=[]
        class Responses:
            def create(self,**kwargs):
                captured.append(kwargs)
                return SimpleNamespace(status='completed',output_text=json.dumps({'source_id':'returns','quote':'7 days'}))
        adapter=OpenAIAdapter.__new__(OpenAIAdapter);adapter.model='configured-model';adapter.client=SimpleNamespace(responses=Responses())
        doc={'id':'returns','text':'7 days','version':1}
        self.assertEqual(adapter.answer('returns',[doc]),doc)
        self.assertEqual(captured[0]['text']['format']['type'],'json_schema')
        self.assertEqual(captured[0]['max_output_tokens'],300)
        self.assertIsNone(adapter.answer('returns',[{**doc,'text':'different policy'}]))
        self.assertEqual(similarity([1,0],[2,0]),1)
        with self.assertRaises(ValueError):similarity([1],[1,2])

if __name__=='__main__':unittest.main()
