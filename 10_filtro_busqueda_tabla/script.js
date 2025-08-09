const q=document.getElementById('q'); const rows=[...document.querySelectorAll('#t tbody tr')];
q.addEventListener('input',()=>{
  const s=q.value.toLowerCase();
  rows.forEach(tr=>{
    const hit=[...tr.children].some(td=>td.textContent.toLowerCase().includes(s));
    tr.classList.toggle('hide', !hit);
  });
});