let i=0; const track=document.getElementById('track'); const total=track.children.length;
function render(){ track.style.transform=`translateX(-${i*100}%)`; }
document.getElementById('next').onclick=()=>{ i=(i+1)%total; render(); }
document.getElementById('prev').onclick=()=>{ i=(i-1+total)%total; render(); }
render();