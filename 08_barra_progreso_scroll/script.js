const bar=document.getElementById('bar');
function onScroll(){
  const h=document.documentElement, sc=h.scrollTop, max=h.scrollHeight-h.clientHeight;
  bar.style.width = (sc/max*100)+'%';
}
onScroll(); document.addEventListener('scroll', onScroll, {passive:true});