const keys=['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+','='];
const k=document.getElementById('keys'); const scr=document.getElementById('scr');
keys.forEach(x=>{const b=document.createElement('button'); b.textContent=x; if('/-*+'.includes(x)) b.classList.add('op'); if(x==='=') b.classList.add('eq'); if(x==='C') b.classList.add('cl'); k.appendChild(b);});
k.addEventListener('click', e=>{
  if(e.target.tagName!=='BUTTON') return;
  const v=e.target.textContent;
  if(v==='C'){ scr.value='0'; return; }
  if(v==='='){ try{ scr.value=String(Function('return '+scr.value)()); } catch{ scr.value='Error'; } return; }
  scr.value = scr.value==='0' && '0123456789'.includes(v) ? v : scr.value + v;
});