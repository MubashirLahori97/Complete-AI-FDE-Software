"""Seed evaluation of the offline retrieval baseline; no provider call."""
import json
from server import lexical
documents=[{'id':'returns','text':'Unopened goods may be returned within 7 days.'},{'id':'hours','text':'The shop opens at 9 am.'}]
cases=[('unopened goods','returns'),('shop opens','hours'),('spaceship insurance',None),('returned within 7 days','returns'),('9 am','hours'),('refund all orders',None)]
rows=[]
for question,expected in cases:
    found=lexical(question,documents)
    actual=found[0]['id'] if found else None
    rows.append({'question':question,'expected':expected,'actual':actual,'correct':actual==expected})
print(json.dumps({'mode':'offline-lexical','total':len(rows),'correct':sum(row['correct'] for row in rows),'rows':rows},indent=2))
print('This seed report does not measure a real model. Build the independent labelled dataset in lesson 24.')
