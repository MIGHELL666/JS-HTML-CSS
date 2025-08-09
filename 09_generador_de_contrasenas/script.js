const sets={may:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',min:'abcdefghijklmnopqrstuvwxyz',num:'0123456789',sym:'!@#$%^&*()_+-=[]{};:,.?/'};
function gen(){
  const L=Math.max(4, Math.min(64, Number(len.value)||16));
  let pool=''; for(const id of ['may','min','num','sym']) if(document.getElementById(id).checked) pool+=sets[id];
  if(!pool){ out.textContent='Selecciona al menos 1 conjunto'; return; }
  let s=''; for(let i=0;i<L;i++) s+=pool[Math.floor(Math.random()*pool.length)];
  out.textContent=s;
}
gen.addEventListener('click', gen);