const openBtn=document.getElementById('open'), dlg=document.getElementById('dlg'), closeBtn=document.getElementById('close');
openBtn.addEventListener('click',()=>{ dlg.style.display='grid'; closeBtn.focus(); });
closeBtn.addEventListener('click',()=>{ dlg.style.display='none'; openBtn.focus(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') { dlg.style.display='none'; openBtn.focus(); } });