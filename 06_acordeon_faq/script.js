document.getElementById('faq').addEventListener('click',e=>{
  if(e.target.tagName==='H3'){ e.target.parentElement.classList.toggle('open'); }
});