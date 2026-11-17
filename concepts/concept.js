/* shared runtime for the concept prototypes */
(function(){
  if(window.CONCEPT_CAT) for(const k in window.CONCEPT_CAT) Object.assign(CAT[k]||(CAT[k]={}),window.CONCEPT_CAT[k]);
  document.querySelectorAll('[data-ic]').forEach(e=>{ if(e.dataset.ic) e.innerHTML=iconSvg(e.dataset.ic); });
  const stage=document.getElementById('stage'), slides=[...document.querySelectorAll('.slide')];
  const fit=()=>{ stage.style.transform=`scale(${Math.min(innerWidth/1920,innerHeight/1080)})`; };
  addEventListener('resize',fit); fit();
  let idx=0, D=null;
  const capT=document.getElementById('capT'), capD=document.getElementById('capD'), capS=document.getElementById('capS');
  const svg=document.getElementById('sysSvg');
  if(svg){
    const ui={render(i,ph,total){ if(!capT) return; if(i===0){ capS&&(capS.textContent='Overview'); capT.textContent='How the system works, at a glance'; capD&&(capD.textContent='Press → to follow a lecture from request to spoken explanation.'); }
        else { capS&&(capS.textContent='Step '+i+' of '+total); capT.textContent=ph.t; capD&&(capD.textContent=ph.d); } },
      playing(){} };
    D=Diagram(svg,SYS,ui); D.goto(0);
  }
  function show(n,dir){
    n=Math.max(0,Math.min(slides.length-1,n));
    slides.forEach((s,i)=>{ s.classList.toggle('active',i===n); });
    idx=n; document.body.dataset.slide=n+1;
    const pc=document.getElementById('pc'); if(pc) pc.textContent=(n+1)+' / '+slides.length;
    if(slides[n].querySelector('#sysSvg')&&D){ D.enter(); }
  }
  function next(){ if(slides[idx].querySelector('#sysSvg')&&D&&D.next()) return; show(idx+1); }
  function prev(){ if(slides[idx].querySelector('#sysSvg')&&D&&D.prev()) return; show(idx-1); }
  addEventListener('keydown',e=>{ if(['ArrowRight',' ','PageDown','Enter'].includes(e.key)){e.preventDefault();next();} if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();prev();}
    if(e.key==='f'||e.key==='F'){ document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.(); }
    if((e.key==='p'||e.key==='P')&&D) D.play(); });
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ b.dataset.go==='next'?next():prev(); });
  const [hs,hstep]=location.hash.slice(1).split('.'); show((parseInt(hs)||1)-1);
  if(hstep!==undefined&&D) setTimeout(()=>D.goto(+hstep),300);
  if(location.search.includes('shot')) document.body.classList.add('shot');
})();
