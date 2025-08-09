let n=Number(localStorage.getItem('clicks_js'))||0;
  const btn=document.getElementById('btn'); const count=document.getElementById('count');
  count.textContent=n;
  btn.addEventListener('click',()=>{ count.textContent=++n; localStorage.setItem('clicks_js',n); });