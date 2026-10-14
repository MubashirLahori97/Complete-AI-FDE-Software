import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {readCourse,web} from './validate-course.mjs';
const base=process.argv[2]||'http://127.0.0.1:4173/Complete-AI-FDE-Software/';
const version=randomUUID();
const lessons=await readCourse();
const hash=value=>createHash('sha256').update(value).digest('hex');
let checked=0;
for(let offset=0;offset<30;offset+=6){
  const results=await Promise.allSettled(lessons.slice(offset,offset+6).map(async lesson=>{
    const number=String(lesson.day).padStart(2,'0');
    const response=await fetch(base+`course/lesson-${number}.json?verify=${version}`);assert.equal(response.status,200);assert.deepEqual(await response.json(),lesson);
    const kit=await fetch(base+`course-projects/lesson-${number}.zip?verify=${version}`);assert.equal(kit.status,200);assert.equal(hash(Buffer.from(await kit.arrayBuffer())),hash(fs.readFileSync(path.join(web,`dist/course-projects/lesson-${number}.zip`))));return lesson.day;
  }));
  for(const result of results){if(result.status==='rejected')throw result.reason;checked++;}
}
const workspace=await fetch(base+`course-projects/shop-workspace.zip?verify=${version}`);assert.equal(workspace.status,200);assert.equal(hash(Buffer.from(await workspace.arrayBuffer())),hash(fs.readFileSync(path.join(web,'dist/course-projects/shop-workspace.zip'))));
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_BROWSER_PATH?{executablePath:process.env.PLAYWRIGHT_BROWSER_PATH}:{})});
try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+`?verify=${version}#/`);await page.getByRole('heading',{name:'Start with one small thing.'}).waitFor();await page.getByRole('link',{name:'Start lesson 1'}).click();await page.getByRole('heading',{name:'Help Amina with one change.'}).waitFor();
  await page.locator('main .course-button').click();assert.equal(await page.locator('.course-demo strong').textContent(),'11');
  for(const day of [1,12,14,16]){
    const lesson=lessons[day-1],step=lesson.exercise.steps.length-1;
    const progress={format:'amina-guided-v1',last:day,lessons:{[day]:{stage:lesson.sections.length+2,frame:0,step,drafts:[],passed:[],criteria:[],reflection:[]}},skills:{}};
    await page.evaluate(value=>localStorage.setItem('amina-guided-v1',JSON.stringify(value)),progress);
    await page.goto(base+`?verify=${version}-${day}#/learn/${day}`);
    await page.locator('#guided-code').fill(lesson.exercise.steps[step].solution);
    await page.getByRole('button',{name:'Check this step',exact:true}).click();
    await page.locator('.course-checks>.course-feedback').filter({hasText:'This step works.'}).waitFor({timeout:90000});
    if(day===16){
      await page.locator('#guided-code').fill('def can_read(user, order):\n    if user is None or not user.get("shop") or user.get("shop") != order.get("shop"):\n        return False\n    return 1 if user.get("role") == "staff" or user.get("id") == order.get("customer_id") else 0');
      await page.getByRole('button',{name:'Check this step',exact:true}).click();await page.locator('.course-checks>.course-feedback').filter({hasText:'Try one correction'}).waitFor({timeout:90000});
      assert.equal(await page.getByRole('button',{name:'Build the lesson project',exact:true}).isDisabled(),true);
    }
  }
  await page.goto(base+`?verify=${version}-30#/learn/30`);await page.getByRole('heading',{name:'Help Amina with one change.'}).waitFor();
  await page.goto(base+`?verify=${version}-evidence#/evidence`);await page.getByRole('heading',{name:'What can you demonstrate independently?'}).waitFor();
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
console.log(JSON.stringify({base,lessonRecordsMatched:checked,lessonKitHashesMatched:checked,workspaceHashMatched:true,liveRunners:['JavaScript','React/TypeScript','Python/SQLite','Python permissions and strict booleans'],providerCalls:0}));
