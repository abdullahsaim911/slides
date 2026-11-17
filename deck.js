/* ===== Synapse deck controller ===== */
document.querySelectorAll('[data-ic]').forEach(e=>{ if(e.dataset.ic) e.innerHTML=iconSvg(e.dataset.ic); });

if(location.search.includes('shot')) document.body.classList.add('shot');
const stage=document.getElementById('stage');
const slides=[...document.querySelectorAll('.slide')];
let idx=0, diagrams={};

/* ---- scale stage to window ---- */
function fit(){ const s=Math.min(innerWidth/1920,innerHeight/1080); stage.style.transform=`scale(${s})`; }
addEventListener('resize',fit); fit();

/* ---- counters ---- */
function runCounters(slide){
  slide.querySelectorAll('[data-count]').forEach(n=>{
    const to=+n.dataset.count; const t0=performance.now()+400; let done=false; n.textContent='0';
    const step=now=>{ if(done) return; const p=Math.min(1,Math.max(0,(now-t0)/1600)); n.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    setTimeout(()=>{ done=true; n.textContent=to; },2200);
  });
}

/* ---- slide 5 demo ---- */
const DEMO='At 04:12 the instructor draws a velocity–time graph. The line rises steadily from zero, which means constant acceleration. The shaded area under the line is the distance travelled.';
let demoT=null;
function runDemo(){
  const txt=document.getElementById('demoTxt'), curve=document.getElementById('demoCurve'), wave=document.getElementById('wave');
  if(!wave.children.length){ for(let i=0;i<42;i++){ const b=document.createElement('i'); b.style.animationDelay=(i*-0.09)+'s'; b.style.animationDuration=(0.7+(i%7)*0.12)+'s'; wave.appendChild(b);} }
  clearInterval(demoT); txt.innerHTML='<span class="cur"></span>';
  curve.style.transition='none'; curve.style.strokeDashoffset=520; void curve.getBoundingClientRect();
  curve.style.transition='stroke-dashoffset 3s ease'; curve.style.strokeDashoffset=0;
  let i=0; setTimeout(()=>{ demoT=setInterval(()=>{ i++; txt.innerHTML=DEMO.slice(0,i)+'<span class="cur"></span>'; if(i>=DEMO.length) clearInterval(demoT); },34); },900);
}

/* ---- slide 8 modules ---- */
const MODS=[
 ['video','multimodal','Video Ingestion','Validates the lecture source and prepares it for analysis.','YouTube · FFmpeg'],
 ['audio','multimodal','Audio & Transcription','Timestamped transcript from captions, with speech-recognition fallback.','faster-whisper'],
 ['film','multimodal','Frame Analysis','Selects representative frames and rates their visual complexity.','OpenCV · CLIP'],
 ['hand','multimodal','Gesture Detection','Captures instructor gestures and pointing for added context.','Interaction cues'],
 ['merge','multimodal','Multimodal Synchronization','Aligns speech with visuals and selects the moments to explain.','Intervention detection'],
 ['eye','inference','Visual Understanding','A vision-language model reads the selected frame.','Qwen3-VL · vLLM'],
 ['braces','multimodal','Structured Evidence','Canonical evidence, aligned speech and a coverage plan.','Pydantic'],
 ['brain','inference','Explanation Generation','Grounded text at brief, standard or detailed depth.','Ollama · Gemini'],
 ['volume','multimodal','Text-to-Speech','Natural spoken explanations, streamed or complete.','Pocket TTS · Kokoro'],
 ['mic','frontend','Voice Interaction','Speech commands and short spoken replies.','Whisper · MiniLM · Piper'],
 ['monitor','frontend','Accessible Frontend','Lecture player, keyboard navigation and live-region output.','React · Electron'],
 ['library','backend','Library & Accounts','Saved explanations, bookmarks, notes and history.','SQLAlchemy'],
];
document.getElementById('mods').innerHTML=MODS.map((m,i)=>{const c=CAT[m[1]];
 return `<div class="mod" data-r style="--d:${150+i*45};--k:${c.k}"><i data-ic>${iconSvg(m[0])}</i><h3>${m[2]}</h3><p>${m[3]}</p><div class="tg">${m[4]}</div></div>`}).join('');

/* ---- legends ---- */
const legend=(id,items)=>{ document.getElementById(id).innerHTML=items.map(k=>`<span><i style="--c:${CAT[k[0]].f};--k:${CAT[k[0]].k}"></i>${k[1]}</span>`).join(''); };
legend('leg6',[['frontend','Frontend'],['backend','Backend'],['multimodal','Multimodal'],['inference','AI inference'],['storage','Storage'],['external','External']]);
legend('leg7',[['backend','Coordination'],['multimodal','Processing'],['inference','AI models'],['storage','Storage'],['frontend','Delivery']]);

/* ---- diagrams ---- */
function mountDiagram(slideId,svgId,barId,cfg,title,intro){
  const bar=document.getElementById(barId); bar.dataset.title=title; bar.dataset.intro=intro;
  let d; const ui=makeBar(bar,()=>d); d=Diagram(document.getElementById(svgId),cfg,ui); ui.bind(); ui.render(0,null,cfg.phases.length);
  diagrams[slideId]=d;
}
mountDiagram('s6','sysSvg','bar6',SYS,'How the system works, at a glance','Press → to follow a lecture from the learner’s request to a spoken explanation, or use Auto-play.');
mountDiagram('s7','pipeSvg','bar7',PIPE,'The multimodal AI pipeline','Press → to watch data move through parallel extraction, the join, AI inference and accessible delivery.');

/* ---- navigation ---- */
function show(n, dir=1, startEnd=false){
  n=Math.max(0,Math.min(slides.length-1,n));
  const prev=slides[idx];
  if(prev && n!==idx){ prev.classList.remove('active'); prev.classList.toggle('left',dir>0); prev.classList.toggle('right',dir<0); diagrams[prev.id]?.leave(); }
  idx=n; const s=slides[idx];
  s.classList.remove('left','right'); void s.offsetWidth; s.classList.add('active');
  document.getElementById('progress').style.width=((idx+1)/slides.length*100)+'%';
  document.getElementById('count').textContent=`${idx+1} / ${slides.length}`;
  history.replaceState(null,'','#'+(idx+1));
  runCounters(s);
  if(window.__onSlide) window.__onSlide(idx,prev?slides.indexOf(prev):-1,slides.length);
  if(s.id==='s5') runDemo();
  if(diagrams[s.id]){ const d=diagrams[s.id]; d.enter(); if(startEnd) setTimeout(()=>d.goto(d.total),150); }
}
function next(){ const d=diagrams[slides[idx].id]; if(d&&d.next()) return; show(idx+1,1); }
function prev(){ const d=diagrams[slides[idx].id]; if(d&&d.prev()) return; show(idx-1,-1,true); }
addEventListener('keydown',e=>{
  if(e.target.tagName==='BUTTON'&&e.key===' ') e.preventDefault();
  switch(e.key){
    case 'ArrowRight':case 'ArrowDown':case 'PageDown':case ' ':case 'Enter': e.preventDefault(); next(); break;
    case 'ArrowLeft':case 'ArrowUp':case 'PageUp':case 'Backspace': e.preventDefault(); prev(); break;
    case 'Home': show(0,-1); break;
    case 'End': show(slides.length-1,1); break;
    case 'f':case 'F': toggleFs(); break;
    case 'p':case 'P': diagrams[slides[idx].id]?.play(); break;
    case 'h':case 'H': document.getElementById('hud').classList.toggle('hide'); break;
  }
});
function toggleFs(){ if(!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }
document.getElementById('bNext').onclick=next; document.getElementById('bPrev').onclick=prev; document.getElementById('bFs').onclick=toggleFs;
let idleT; addEventListener('mousemove',()=>{ document.body.classList.remove('idle'); clearTimeout(idleT); idleT=setTimeout(()=>document.body.classList.add('idle'),3000); });
/* touch swipe */
let tx=null; addEventListener('touchstart',e=>tx=e.touches[0].clientX); addEventListener('touchend',e=>{ if(tx===null)return; const dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>60) dx<0?next():prev(); tx=null; });

const [hs,hstep]=location.hash.slice(1).split('.'); const start=parseInt(hs)||1;
document.fonts.ready.then(()=>{ show(start-1,1); if(hstep!==undefined){ const d=diagrams[slides[idx].id]; if(d) setTimeout(()=>d.goto(+hstep),300); } });
