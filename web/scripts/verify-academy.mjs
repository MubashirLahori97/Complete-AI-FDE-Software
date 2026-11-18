import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash,randomUUID} from 'node:crypto';
import {chromium} from 'playwright';
import {web} from './validate-course.mjs';
const base=process.argv[2];
if(!base)throw new Error('Provide the academy base URL, including its trailing slash.');
const projects=JSON.parse(fs.readFileSync(path.join(web,'src/lesson-projects.json'),'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const version=randomUUID();
for(let offset=0;offset<projects.length;offset+=6){
  const results=await Promise.allSettled(projects.slice(offset,offset+6).map(async project=>{
    const response=await fetch(base+`projects/${project.starter}?verify=${version}`);
    assert.equal(response.status,200,`Day ${project.day} download`);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(fs.readFileSync(path.join(web,'dist/projects',project.starter))));
  }));
  for(const result of results)if(result.status==='rejected')throw result.reason;
}
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_BROWSER_PATH?{executablePath:process.env.PLAYWRIGHT_BROWSER_PATH}:{})});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+`?academy=${version}#/`);
  await page.getByRole('link',{name:'FDE Academy home'}).waitFor();
  await page.getByRole('heading',{name:'A little progress, every day.'}).waitFor();
  assert.equal(await page.locator('.sample-invite').count(),0);
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:/^Learning path/}).click();
  await page.locator('.lesson-row').first().waitFor();assert.equal(await page.locator('.lesson-row').count(),30);
  for(const project of projects){
    await page.evaluate(day=>{location.hash=`/lesson/${day}?tab=project`;},project.day);
    await page.locator('.lesson-project-intro h2').filter({hasText:project.title}).waitFor();
    await page.getByRole('heading',{name:'Project acceptance checks'}).waitFor();
    assert.equal(await page.locator('.lesson-project-checks input[type=checkbox]').count(),5);
  }
  await page.getByRole('link',{name:'Overview',exact:true}).click();await page.getByRole('heading',{name:'A little progress, every day.'}).waitFor();
  await page.getByRole('link',{name:'Resources',exact:true}).click();await page.getByRole('link',{name:'guided shop examples',exact:true}).click();
  await page.getByRole('heading',{name:'Start with one small thing.'}).waitFor();
  await page.locator('.course-brand').click();await page.getByRole('heading',{name:'A little progress, every day.'}).waitFor();
  assert.deepEqual(errors,[]);
  if(process.env.FDE_ACADEMY_SCREENSHOT)await page.screenshot({path:process.env.FDE_ACADEMY_SCREENSHOT,fullPage:true});
}finally{await browser.close();}
console.log(JSON.stringify({base,homepage:'FDE Academy',originalDailyProjects:projects.length,projectDownloadsMatched:projects.length,optionalExamplesReturnToAcademy:true}));
