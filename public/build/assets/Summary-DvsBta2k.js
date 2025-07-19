import{r as p,j as a}from"./app-JikxPErj.js";import{G as w}from"./index-BpRkNtKl.js";import v from"./Loader-BzyE4l69.js";import{P as b,S as f,r as g}from"./PDFButton-6Zp8ghOD.js";const S="_summary_1w9te_1",_="_error_1w9te_40",j="_summaryContent_1w9te_45",C="_enregistrer_1w9te_54",m={summary:S,error:_,summaryContent:j,enregistrer:C};function F(o){return new Promise((s,r)=>{const t=new FileReader;t.onloadend=()=>s(t.result),t.onerror=r,t.readAsDataURL(o)})}async function B(o){const s=await b.create(),r=s.addPage([595,842]),{width:t,height:l}=r.getSize(),e=50,i=await s.embedFont(f.HelveticaBold),d=await s.embedFont(f.Helvetica),u=await s.embedFont(f.HelveticaOblique);r.drawText("e~Learning",{x:e,y:l-e,size:24,font:i,color:g(.1,.7,.3)});const n=12;let c=l-e-40;o.split(`
`).forEach(x=>{c<e+40||(r.drawText(x,{x:e,y:c,size:n,font:d,color:g(0,0,0)}),c-=n+6)}),r.drawText("Fiche de révision",{x:e,y:e-10,size:10,font:u,color:g(.5,.5,.5)});const h=await s.save();return new Blob([h],{type:"application/pdf"})}function D({file:o}){const r=new w("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U").getGenerativeModel({model:"models/gemini-1.5-flash"}),[t,l]=p.useState(""),[e,i]=p.useState("idle"),d=async()=>{if(!t)return;const n=await B(t),c=await F(n);localStorage.setItem("pdfBase64",c);const y=URL.createObjectURL(n);localStorage.setItem("pdfUrl",y),window.location.href="/enregistrement_page"};async function u(){i("loading");try{const n=await r.generateContent([{inlineData:{data:o.file,mimeType:o.type}},`
      Crée une fiche de révision basée sur le contenu du document.

      La fiche de révision doit être claire et structurée, avec des sections bien définies (par exemple : Définitions, Concepts clés, Méthodologie, Exemples, Astuces).

      Si le document contient du code, affiche-le correctement formaté, avec des retours à la ligne et une indentation propre.

      La fiche doit être synthétique, avec des phrases courtes et claires. Mets en évidence les points essentiels à retenir pour faciliter la mémorisation.

      Évite absolument d'utiliser des caractères spéciaux comme ** ou * ou tout autre symbole de mise en forme dans les titres ou les points.

      Sépare chaque section de manière lisible par un saut de ligne. Commence les titres de sections directement par le nom de la section (par exemple : Définitions, Concepts clés, Méthodologie, Exemples, Astuces).

      Présente le code dans des blocs clairement indentés avec retour à la ligne.

      N'ajoute aucune mise en forme particulière autre que des paragraphes clairs et un code lisible. Ne commence pas la fiche par "Bien sûr" ou d'autres expressions inutiles.

      Sois direct et précis.
      `]);i("success"),l(n.response.text())}catch{i("error")}}return p.useEffect(()=>{e==="idle"&&u()},[e]),a.jsxs("section",{className:m.summary,children:[a.jsx("img",{src:o.imageUrl,alt:"Preview"}),a.jsx("h2",{children:"Résumé"}),e==="loading"?a.jsx(v,{}):e==="success"?a.jsx("pre",{className:m.summaryContent,children:t}):e==="error"?a.jsx("p",{className:m.error,children:"Error getting the summary"}):null,a.jsx("div",{className:m.enregistrer,onClick:d,children:" enregistrer"})]})}export{D as default};
