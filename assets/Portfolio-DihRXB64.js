import{c as y,j as e,x as v,D as k,X as N,F as c,K as m,Y as x,A as r,Z as o,G as $,P as b,z as g,f as p,n as w}from"./index-DDp6o04f.js";const L=y("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);function z({progress:i,update:j}){const t=(n,s)=>j({...i,projects:{...i.projects,[n]:s}}),u=()=>{const n=m.map(s=>{const l=i.projects[s.id]||x();return`## ${s.title}

${s.description}

Demo: ${l.demo||"Not recorded"}
Repository: ${l.repo||"Not recorded"}

### Evidence and reflection

${l.notes||"Not recorded"}

### Self-assessment

${s.checks.map((a,d)=>`- [${l.checks[d]?"x":" "}] ${a}`).join(`
`)}`});w("fde-portfolio.md",`# ${i.name?`${i.name} — `:""}FDE Learning Portfolio

Self-reported learning evidence. Links and results have not been independently verified.

${n.join(`

---

`)}

# Lesson projects

${p.map(s=>`## Lesson ${s.day}: ${s.title}

${i.notes[s.day]||"Build evidence not recorded."}

${s.acceptance.map((l,a)=>`- [${i.lessonProjectChecks[s.day]?.[a]?"x":" "}] ${l}`).join(`
`)}`).join(`

`)}`,"text/markdown")};return e.jsxs(e.Fragment,{children:[e.jsx(v,{eyebrow:"PROOF OF WORK",title:"Build a portfolio with evidence.",description:"Show the problem, your decisions, what you tested, and what actually happened.",action:e.jsxs("button",{className:"button light",onClick:u,children:[e.jsx(k,{size:16}),"Export portfolio"]})}),e.jsx(N,{progress:i}),e.jsx("h2",{children:"Optional implementation portfolio"}),e.jsxs("div",{className:"portfolio-intro",children:[e.jsx(c,{size:24}),e.jsxs("div",{children:[e.jsx("strong",{children:"Your project is the story. Evidence makes it credible."}),e.jsx("p",{children:"Start with one project you have actually built. Add its code or demo link and explain one test you ran. Leave unfinished projects blank. Checks record your own assessment; the app does not verify links or certify readiness."})]})]}),e.jsx("div",{className:"portfolio-grid",children:m.map(n=>{const s=i.projects[n.id]||x(),l=s.checks.filter(Boolean).length;return e.jsxs("section",{className:"project-card",children:[e.jsxs("div",{className:"project-heading",children:[e.jsxs("div",{children:[e.jsx("p",{className:"eyebrow",children:n.type}),e.jsx("h2",{children:n.title})]}),e.jsx("span",{className:"project-symbol",children:e.jsx(c,{size:22})})]}),e.jsx("p",{className:"muted",children:n.description}),e.jsxs("a",{href:`#/lesson/${n.day}`,className:"text-link small-text",children:["Open lesson ",n.day,e.jsx(r,{size:14})]}),e.jsx("label",{className:"form-label",htmlFor:`${n.id}-demo`,children:"Live demo URL"}),e.jsxs("div",{className:"url-input",children:[e.jsx(L,{size:15}),e.jsx("input",{id:`${n.id}-demo`,type:"url",value:s.demo,placeholder:"https://your-demo.example",maxLength:2e3,onChange:a=>t(n.id,{...s,demo:a.target.value})})]}),s.demo&&!o(s.demo)&&e.jsx("p",{className:"inline-warning",children:"Use a complete http:// or https:// URL."}),e.jsx("label",{className:"form-label",htmlFor:`${n.id}-repo`,children:"Repository URL"}),e.jsxs("div",{className:"url-input",children:[e.jsx(c,{size:15}),e.jsx("input",{id:`${n.id}-repo`,type:"url",value:s.repo,placeholder:"https://github.com/you/project",maxLength:2e3,onChange:a=>t(n.id,{...s,repo:a.target.value})})]}),s.repo&&!o(s.repo)&&e.jsx("p",{className:"inline-warning",children:"Use a complete http:// or https:// URL."}),e.jsx("label",{className:"form-label",htmlFor:`${n.id}-notes`,children:"Decisions, tests & results"}),e.jsx("textarea",{id:`${n.id}-notes`,className:"notes-field",rows:4,maxLength:1e4,value:s.notes,placeholder:"The problem was… I chose… I tested… The result was…",onChange:a=>t(n.id,{...s,notes:a.target.value})}),e.jsx("div",{className:"project-checks",children:n.checks.map((a,d)=>e.jsx($,{checked:s.checks[d]||!1,onChange:f=>{const h=[...s.checks];h[d]=f,t(n.id,{...s,checks:h})},children:a},a))}),e.jsx(b,{value:l/n.checks.length*100,label:`${n.title} self-assessment`}),e.jsxs("div",{className:"project-footer",children:[e.jsxs("span",{children:[e.jsx(g,{size:14}),l," / ",n.checks.length," checks recorded"]}),e.jsxs("div",{children:[o(s.demo)&&e.jsxs("a",{href:o(s.demo),target:"_blank",rel:"noopener noreferrer",children:["Demo",e.jsx(r,{size:13})]}),o(s.repo)&&e.jsxs("a",{href:o(s.repo),target:"_blank",rel:"noopener noreferrer",children:["Code",e.jsx(r,{size:13})]})]})]})]},n.id)})}),e.jsxs("section",{className:"daily-projects-section",children:[e.jsx("h2",{children:"Your 30 lesson projects"}),e.jsx("p",{className:"muted",children:"Build a smaller project with every lesson. Choose your strongest work for the showcase above."}),e.jsx("div",{className:"daily-projects-grid",children:p.map(n=>{const s=i.lessonProjectChecks[n.day]?.filter(Boolean).length||0;return e.jsxs("a",{className:"daily-project-row",href:`#/lesson/${n.day}?tab=project`,children:[e.jsx("span",{className:"day-number",children:String(n.day).padStart(2,"0")}),e.jsxs("div",{children:[e.jsx("h3",{children:n.title}),e.jsxs("p",{children:[s," / ",n.acceptance.length," checks recorded"]})]}),e.jsx(r,{size:16})]},n.day)})})]})]})}export{z as default};
