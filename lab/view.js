/* concept viewer: builds one concept's three slides and wires GSAP animation + keyboard */
(function(){
  const q=new URLSearchParams(location.search), id=q.get('c')||'01';
  const C=CONCEPTS.find(c=>c.id===id)||CONCEPTS[0]; if(q.has('shot')){document.body.classList.add('shot');gsap.ticker.lagSmoothing(0);}
  document.title='Synapse concept '+C.id+' — '+C.name;
  const stage=document.getElementById('stage'); stage.style.width=C.stage[0]+'px'; stage.style.height=C.stage[1]+'px'; stage.className='c'+C.id;
  document.getElementById('cs').textContent=C.css;
  const copy=LAB.copy; stage.innerHTML=['title','problem','arch'].map((k,i)=>`<section class="slide" id="s${i+1}">${C[k](copy)}</section>`).join('');
  const fit=()=>{stage.style.transform=`scale(${Math.min(innerWidth/C.stage[0],innerHeight/C.stage[1])})`};addEventListener('resize',fit);fit();
  const slides=[...stage.querySelectorAll('.slide')]; let idx=0;
  const $=s=>document.getElementById(s);
  const ui={render(i,ph,total){const S=$('capS'),T=$('capT'),D=$('capD'),N=$('capN');if(!T)return;if(i===0){S&&(S.textContent='Overview');T.textContent='How the system works, at a glance';D&&(D.textContent='Press → to follow a lecture from the learner’s request to a spoken explanation.');N&&(N.textContent='0 / '+total);}else{S&&(S.textContent='Step '+i+' of '+total);T.textContent=ph.t;D&&(D.textContent=ph.d);N&&(N.textContent=i+' / '+total);}},playing(){}};
  const svg=document.getElementById('dsvg'); const E=LabEngine(svg,C.diagram,ui); E.goto(0);
  const A={rise:{y:34,opacity:0},left:{x:-60,opacity:0},scale:{scale:.92,opacity:0},clip:{clipPath:'inset(0 100% 0 0)',opacity:0},drop:{y:-34,opacity:0},fade:{opacity:0}}[C.anim||'rise'];
  function show(n){n=Math.max(0,Math.min(2,n));slides.forEach((s,k)=>s.classList.toggle('active',k===n));idx=n;
    const els=slides[n].querySelectorAll('[data-a]');if(els.length)gsap.from(els,{...A,duration:.8,stagger:.09,ease:'power3.out',clearProps:'all'});
    if(n===2)E.enter();else E.leave();$('hud').innerHTML='<b>'+C.id+'</b> · '+C.name+' · '+(n+1)+'/3';}
  const next=()=>{if(idx===2&&E.next())return;show(idx+1)},prev=()=>{if(idx===2&&E.prev())return;show(idx-1)};
  addEventListener('keydown',e=>{if(['ArrowRight',' ','PageDown','Enter'].includes(e.key)){e.preventDefault();next()}if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();prev()}
    if(e.key==='f'||e.key==='F')document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();if((e.key==='p'||e.key==='P')&&idx===2)E.play();});
  stage.addEventListener('click',e=>{if(e.target.closest('a'))return;const r=stage.getBoundingClientRect();(e.clientX<r.left+r.width*.3)?prev():next()});
  const [hs,hstep]=location.hash.slice(1).split('.');
  document.fonts.ready.then(()=>{show((parseInt(hs)||1)-1);if(hstep!==undefined)setTimeout(()=>E.goto(+hstep),500);});
})();
