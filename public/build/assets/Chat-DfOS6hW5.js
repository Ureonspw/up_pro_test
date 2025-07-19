import{r as x,j as t}from"./app-BpLDJMvu.js";import{G as f}from"./index-BpRkNtKl.js";const _="_chatWindow_1yhh2_1",k="_title_1yhh2_7",j="_chat_1yhh2_1",w="_loader_1yhh2_30",v="_user_1yhh2_35",N="_error_1yhh2_47",T="_inputArea_1yhh2_52",d={chatWindow:_,title:k,chat:j,loader:w,user:v,error:N,inputArea:T};function A(a){const s=/```(\w*)\n([\s\S]*?)```/g,c=[];let o=0,n;for(;(n=s.exec(a))!==null;){const r=a.substring(o,n.index);r.trim()&&r.split(`
`).forEach((l,u)=>{c.push(t.jsx("p",{children:l},o+u))}),c.push(t.jsx("pre",{children:t.jsx("code",{children:n[2]})},n.index)),o=s.lastIndex}const i=a.substring(o);return i.trim()&&i.split(`
`).forEach((r,l)=>{c.push(t.jsx("p",{children:r},o+l))}),c}function I({file:a,selectedLanguage:s}){const o=new f("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U").getGenerativeModel({model:"models/gemini-2.0-flash"}),[n,i]=x.useState([]),[r,l]=x.useState("");async function u(){if(r.length){let e=[...n,{role:"user",text:r},{role:"loader",text:""}];l(""),i(e);try{const h=s==="yoruba"?`
          Dahun ìbéèrè yìí lórí àkọ́ọ̀lẹ̀ tí a fi dá e lẹ́lẹ̀ : ${r}.
          Dahun gẹ́gẹ́ bí chatbot pẹ̀lú àwọn ìròyìn kúkurú àti ọ̀rọ̀ nìkan (kò sí àwọn àmì àgbékalẹ̀, àwọn àmì tàbí àwọn àmì àti ohun àtàyébáláà).
          Tí àkọ́ọ̀lẹ̀ náà bá ní kóòdù, fi hàn ní ọ̀nà tó tọ́, pẹ̀lú àwọn ìlà tuntun àti àgbédémọ̀ tó dára. Tún ṣe àgbékalẹ̀ ọ̀rọ̀ náà dáadáa.
          Tí kóòdù bá gùn, fi èdè náà kún un lẹ́yìn àwọn backticks mẹ́ta.
          Ìtàn ìbánisọ̀rọ̀: ${JSON.stringify(n)}
          
          GBỌDỌ̀ DAHUN NÍ YORÙBÁ NÌKAN, kò tó bá ti jẹ́ pé ìbéèrè náà wà ní èdè mìíràn.
          `:`
          Répondez à cette question sur le document ci-joint : ${r}.
          Répondez en tant que chatbot avec des messages courts et du texte uniquement (pas de démarques, de balises ou de symboles).
          Si le document contient du code, affiche-le correctement formaté, avec des retours à la ligne et une indentation propre. Formate aussi bien le texte stp.
          Si le code est long, ajoute le langage après les 3 backticks.
          Chat history: ${JSON.stringify(n)}
          `,p=await o.generateContent([{inlineData:{data:a.file,mimeType:a.type}},h]);e=[...e.filter(m=>m.role!=="loader"),{role:"model",text:p.response.text()}],i(e)}catch(h){const p=s==="yoruba"?"Àṣìṣe nínú ríràn àwọn ìròyìn, jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.":"Error sending messages, please try again later.";e=[...e.filter(m=>m.role!=="loader"),{role:"error",text:p}],i(e),console.error(h)}}}const b=s==="yoruba"?"Ìbánisọ̀rọ̀":"Chat",y=s==="yoruba"?"Béèrè ìbéèrè rẹ níhìn-ín nípa àkọ́ọ̀lẹ̀ náà":"Posez votre question ici a propos du document",g=s==="yoruba"?"Firánṣẹ́":"Envoyer";return t.jsxs("section",{className:d.chatWindow,children:[t.jsx("h2",{className:d.title,children:b}),n.length>0&&t.jsx("div",{className:d.chat,children:n.map((e,h)=>t.jsx("div",{className:d[e.role],children:A(e.text)},h))}),t.jsxs("div",{className:d.inputArea,children:[t.jsx("input",{value:r,onChange:e=>l(e.target.value),type:"text",placeholder:y}),t.jsx("button",{onClick:u,children:g})]})]})}export{I as default};
