function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    const d=new Date();
    const h=pad(d.getHours()), m=pad(d.getMinutes()), s=pad(d.getSeconds());
    const days=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const months=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    document.getElementById('clock').textContent = `${h}:${m}:${s}`;
    document.getElementById('date').textContent = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  tick(); setInterval(tick,1000);