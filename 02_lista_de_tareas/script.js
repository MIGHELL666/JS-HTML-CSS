const list=document.getElementById('list');
  const empty=document.getElementById('empty');
  document.getElementById('form').addEventListener('submit', e=>{
    e.preventDefault();
    const v=document.getElementById('txt').value.trim();
    if(!v) return;
    const li=document.createElement('li');
    const cb=document.createElement('input'); cb.type='checkbox';
    const span=document.createElement('span'); span.textContent=v;
    const del=document.createElement('button'); del.textContent='✕'; del.style.marginLeft='auto'; del.style.background='transparent'; del.style.color='#e5e7eb'; del.style.border='none'; del.style.cursor='pointer';
    li.append(cb,span,del);
    list.prepend(li);
    empty.style.display='none';
    document.getElementById('txt').value='';
  });
  list.addEventListener('change', e=>{
    if(e.target.type==='checkbox'){ e.target.parentElement.classList.toggle('done', e.target.checked); }
  });
  list.addEventListener('click', e=>{
    if(e.target.tagName==='BUTTON'){ e.target.parentElement.remove(); if(!list.children.length) empty.style.display='block'; }
  });