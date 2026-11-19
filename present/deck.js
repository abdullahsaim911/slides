/* Synapse deck: every slide plays the project's own mechanism.
   caption (what the instructor says, vague words highlighted) -> pointer (gesture detection) -> Synapse's spoken description. */
const $=id=>document.getElementById(id), stage=$('stage'), frame=$('frame');
const Q=new URLSearchParams(location.search); if(Q.has('shot')){gsap.ticker.lagSmoothing(0);}
document.querySelectorAll('[data-ic]').forEach(e=>{ if(e.dataset.ic) e.innerHTML=iconSvg(e.dataset.ic); });
const fit=()=>{stage.style.transform=`scale(${Math.min(innerWidth/1920,innerHeight/1080)})`};addEventListener('resize',fit);fit();

/* diagram colours for this theme */
const PAL={user:['#DDDAFC','#362CAC'],frontend:['#DDDAFC','#362CAC'],backend:['#CDF1DB','#14683F'],multimodal:['#C8EEE9','#064E4A'],inference:['#FCDBE4','#B0245A'],storage:['#FDE6B2','#8A5A00'],external:['#D9DCEF','#373E5C']};
for(const k in PAL) CAT[k]={f:PAL[k][0],k:PAL[k][1]};
const noUI={render(){},playing(){}};
const sysD=Diagram($('sysSvg'),SYS,noUI), pipeD=Diagram($('pipeSvg'),PIPE,noUI); sysD.goto(0); pipeD.goto(0);

/* modules */
const MODS=[['video','Video Ingestion','Validates the lecture source and prepares it for analysis.','YouTube · FFmpeg'],['audio','Audio & Transcription','Timestamped transcript from captions, with speech-recognition fallback.','faster-whisper'],['film','Frame Analysis','Selects representative frames and rates their visual complexity.','OpenCV · CLIP'],['hand','Gesture Detection','Captures instructor gestures and pointing for added context.','Interaction cues'],['merge','Multimodal Synchronization','Aligns speech with visuals and selects the moments to explain.','Intervention detection'],['eye','Visual Understanding','A vision-language model reads the selected frame.','Qwen3-VL · vLLM'],['braces','Structured Evidence','Canonical evidence, aligned speech and a coverage plan.','Pydantic'],['brain','Explanation Generation','Grounded text at brief, standard or detailed depth.','Mistral'],['volume','Text-to-Speech','Natural spoken explanations, streamed or complete.','Pocket TTS · Kokoro'],['mic','Voice Interaction','Speech commands and short spoken replies.','Whisper · MiniLM · Piper'],['monitor','Accessible Frontend','Lecture player, keyboard navigation and live-region output.','React · Electron'],['filecheck','Assessment','Lecture-grounded Q&A and quiz questions that test understanding.','Transcript-grounded']];
$('mods').innerHTML=MODS.map((m,i)=>`<div class="mod" data-t="mod${i+1}"><i data-ic>${iconSvg(m[0])}</i><h3>${m[1]}</h3><p>${m[2]}</p><div class="tg">${m[3]}</div></div>`).join('');

/* ---------- step data ---------- */
const T=s=>({sel:s});
const text=sel=>frame.querySelector(sel).textContent.replace(/\s+/g,' ').trim();
const diagSteps=(D,caps)=>D.phases.map((ph,k)=>{const last=ph.steps[ph.steps.length-1],eid=last[last.length-1];return{cap:caps[k],pre:()=>D.goto(k+1),targets:[{el:()=>D.nodes[D.edges[eid].tgt].g,v:ph.d}]}});
const SLIDES=[
 {title:'Synapse',steps:[
  {cap:'Welcome, everyone. As you can see *here*, this is Synapse.',targets:[{sel:'[data-t=title]',v:'Synapse. Multimodal AI accessibility for online STEM education of blind learners.'}]},
  {cap:'And *this* is our final year project.',targets:[{sel:'[data-t=meta]',v:'A final year project from COMSATS University Islamabad, Lahore Campus, session 2023 to 2027.'}]}]},
 {title:'Project team',steps:[
  {cap:'*These* three built it.',targets:[{sel:'[data-t=m1]',v:'Hafiz Abdullah Saim, group leader.'},{sel:'[data-t=m2]',v:'Maha Khalid.'},{sel:'[data-t=m3]',v:'Memoona Shahid.'}]},
  {cap:'And *he* supervised us.',targets:[{sel:'[data-t=sup]',v:'Supervisor: Mr. Amaid Zia, lecturer in the Department of Computer Science.'}]}]},
 {title:'Problem statement',steps:[
  {cap:'As you can see *here*, *this* many people are affected.',targets:[{sel:'[data-t=st1]',v:'285 million people worldwide live with a visual impairment.'}]},
  {cap:'And *these* are completely blind.',targets:[{sel:'[data-t=st2]',v:'39 million of them are completely blind.'}]},
  {cap:'But *this* is the real problem.',targets:[{sel:'[data-t=st3]',v:'70 percent of STEM content becomes inaccessible when visuals are not converted.'}]},
  {cap:'Today’s tools miss *all of this*.',targets:[{sel:'[data-t=g1]',v:'Screen readers stop at text.'},{sel:'[data-t=g2]',v:'Captions miss the visuals.'},{sel:'[data-t=g3]',v:'The tools work in isolation.'}]}]},
 {title:'Proposed solution',steps:[
  {cap:'So *this* goes in, and *that* comes out.',targets:[{sel:'[data-t=lead]',v:'A voice-controlled app that helps blind learners understand educational videos.'},{sel:'[data-t=f1]',v:'A lecture video plays.'},{sel:'[data-t=f2]',v:'The learner asks, by voice, for the current part to be explained.'},{sel:'[data-t=f3]',v:'What is said, what is shown and what is being pointed at are analysed together.'},{sel:'[data-t=f4]',v:'They become one clear, context-aware explanation.'},{sel:'[data-t=f5]',v:'And it is read aloud to the learner.'}]}]},
 {title:'What is Synapse?',steps:[
  {cap:'So here is what *this* means.',targets:[{sel:'[data-t=tag]',v:'When the instructor says look at this, Synapse tells you what this is. It is a multimodal AI system that combines speech recognition, computer vision, gesture detection and a large language model to explain a lecture’s visuals out loud.'}]},
  {cap:'First, it understands *this*.',targets:[{sel:'[data-t=p1]',v:'It understands the lecture: turning speech into text, reading diagrams, charts and equations, and noticing what is being pointed at.'}]},
  {cap:'Then it explains *that*.',targets:[{sel:'[data-t=p2]',v:'It explains aloud, in clear spoken words, at the level of detail you choose, at the right moment or when you ask.'}]},
  {cap:'And *this* is how you use it.',targets:[{sel:'[data-t=p3]',v:'It works without sight, with voice commands, full keyboard navigation and a screen-reader friendly design.'}]},
  {cap:'And *these* keep you learning.',targets:[{sel:'[data-t=p4]',v:'It keeps learning going, with saved explanations and notes, questions about the lecture, and practice questions to test yourself.'}]}]},
 {title:'Complete system architecture',diag:sysD,steps:diagSteps(sysD,['First, *this* opens, and *that* streams in.','Then *it* goes through *there*.','*These* all run at once.','So *that* feeds *this*.','And *this* comes back to *you*.','Ask for *this* part, and *it* goes first.','Say *this*, and *it* answers aloud.','Ask *this*, and *it* answers from the lecture.','And *this* stays *here*.'])},
 {title:'Core modules',steps:[{cap:'Each of *these* does one job.',hold:.1,targets:MODS.map((m,i)=>({sel:`[data-t=mod${i+1}]`,v:m[1].replace('&','and')+'.'}))}]},
 {title:'Detailed pipeline architecture',diag:pipeD,steps:diagSteps(pipeD,['Fresh lecture? *This* starts a job.','*These* run in parallel.','*They* all meet *here*.','*This* checks *that* first.','*That* frame goes to *this* model.','No picture? Use *this* instead.','*This* lines up with *that*.','*This* writes the explanation.','And *that* becomes speech.','*This* finally reaches you.'])},
 {title:'What is done',steps:[{cap:'Everything on *this* list is built.',hold:.1,targets:[{sel:'[data-t=dl]',v:'Built end to end, in the browser and as a desktop app.'},...[...Array(10)].map((_,i)=>({sel:`[data-t=d${i+1}]`,v:text(`[data-t=d${i+1}]`)}))]}]},
 {title:'Challenges',steps:[
  ['Avoiding invented details','Visual observations become structured evidence; a coverage plan and bounded inputs constrain the explanation.'],
  ['Choosing what to describe','Coverage planning picks what matters, and learners choose the depth.'],
  ['Managing explanation timing','Playback pauses only when an explanation takes over.'],
  ['Recovering from partial failures','Durable jobs and checkpoints keep finished work.'],
  ['Balancing time and cost','A three-stage pipeline with caching reuses results.'],
  ['Building an accessible interface','Keyboard, voice, live regions and a playback gate.']
 ]
 .map((c,i)=>({cap:['*This* one is about trust.','And *that* one is about choices.','*This* one is about timing.','And *that* one is about failures.','*This* one is about cost.','And *this* last one is about you.'][i],targets:[{sel:`[data-t=c${i+1}]`,v:c[0]+'. '+c[1]}]}))},
 {title:'Future work',steps:[
  {cap:'Next, *these* six.',hold:.1,targets:[...Array(6)].map((_,i)=>({sel:`[data-t=r${i+1}]`,v:text(`[data-t=r${i+1}] h3`)+'.'}))},
  {cap:'Thank you. Any questions about *any* of *this*?',targets:[{sel:'[data-t=thanks]',v:'Thank you. Questions and discussion.'}]}]}
];

/* ---------- pointer, voice, caption ---------- */
const ret=$('ret'),capT=$('capT'),voT=$('voT'),sr=$('sr'),bars=[...document.querySelectorAll('#wv i')];
const rc={x:0,y:0,w:0,h:0};
const G=el=>{const r=el.getBoundingClientRect(),s=stage.getBoundingClientRect(),k=s.width/1920;return{x:(r.left-s.left)/k,y:(r.top-s.top)/k,w:r.width/k,h:r.height/k}};
const drawRet=()=>{const{x,y,w,h}=rc,L=Math.min(30,w/3,h/3),P=ret.children;P[0].setAttribute('d',`M${x} ${y+L}V${y}H${x+L}`);P[1].setAttribute('d',`M${x+w-L} ${y}H${x+w}V${y+L}`);P[2].setAttribute('d',`M${x+w} ${y+h-L}V${y+h}H${x+w-L}`);P[3].setAttribute('d',`M${x+L} ${y+h}H${x}V${y+h-L}`)};
const vis=v=>{ret.style.opacity=v?1:0};
const capMarkup=s=>s.split(/(\*[^*]+\*)/).map(p=>p.startsWith('*')?`<span class="w dx">${p.slice(1,-1)}</span>`:p.replace(/(\S+)/g,'<span class="w">$1</span>')).join('');
const tgEl=tg=>tg.el?tg.el():frame.querySelector(tg.sel);
let retTw=null,curEl=null,vo={n:0},wvTw=null,ttsOn=false,autoTw=null;
/* the target frame: snaps onto whatever the instructor's vague word refers to */
function aim(el,animate){
  curEl=el;const t=G(el),pad=12,R={x:t.x-pad,y:t.y-pad,w:t.w+pad*2,h:t.h+pad*2};
  if(retTw)retTw.kill();vis(true);
  if(!animate){Object.assign(rc,R);drawRet();return}
  if(!rc.w)Object.assign(rc,{x:R.x+R.w/2-10,y:R.y+R.h/2-10,w:20,h:20});
  retTw=gsap.to(rc,{...R,duration:.5,ease:'power3.out',onUpdate:drawRet});
}
function wv(on){if(wvTw)wvTw.kill();wvTw=null;if(on)wvTw=gsap.to(bars,{scaleY:'random(.35,1)',duration:.17,repeat:-1,yoyo:true,repeatRefresh:true,stagger:.04});else gsap.to(bars,{scaleY:.2,duration:.2})}
function tts(v){if(!ttsOn||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(v);u.rate=1;speechSynthesis.speak(u)}
const sayT=v=>{const d=Math.max(.5,v.length*.021);return gsap.fromTo(vo,{n:0},{n:v.length,duration:d,ease:'none',immediateRender:false,onStart:()=>{wv(true);tts(v);sr.textContent=v},onUpdate:()=>{voT.textContent=v.slice(0,Math.round(vo.n))},onComplete:()=>wv(false)})};

/* ---------- step runner ---------- */
let cur={si:-1,k:0},tl=null,busy=false,auto=false;
const lastV=st=>{const tg=st.targets[st.targets.length-1];return typeof tg.v==='function'?tg.v():tg.v};
const val=v=>typeof v==='function'?v():v;
function finish(){if(!busy&&tl&&!tl.isActive())return;if(tl)tl.kill();gsap.killTweensOf([vo,...bars]);const st=SLIDES[cur.si].steps[cur.k];capT.querySelectorAll('.w').forEach(w=>{w.style.opacity=1;w.style.transform=''});
  const tg=st.targets[st.targets.length-1];aim(tgEl(tg),false);voT.textContent=val(tg.v);wv(false);busy=false}
function run(si,k){
  if(tl)tl.kill();if(retTw)retTw.kill();if(autoTw)autoTw.kill();gsap.killTweensOf(vo);wv(false);if(window.speechSynthesis)speechSynthesis.cancel();
  cur={si,k};const sl=SLIDES[si],st=sl.steps[k];st.pre&&st.pre();st.start&&st.start();
  capT.innerHTML=capMarkup(st.cap);voT.textContent='';vis(false);rc.w=0;
  const words=[...capT.querySelectorAll('.w')];gsap.set(words,{opacity:0});
  busy=true;tl=gsap.timeline({onComplete:()=>{busy=false;if(auto)autoNext()}});
  tl.to(words,{opacity:1,duration:.001,stagger:.06});
  tl.fromTo(capT.querySelectorAll('.dx'),{scale:1},{scale:1.12,duration:.16,yoyo:true,repeat:1,ease:'power2.out'},'+=.05');
  st.targets.forEach(tg=>{tl.call(()=>aim(tgEl(tg),true),null,'+=.1');const v=val(tg.v);tl.add(sayT(v),'+=.55');tl.to({},{duration:st.hold??.5})});
  document.querySelectorAll('#seg b').forEach((b,i)=>{b.className=i<si?'on':i===si?'cur':''});
}
function go(si,k=0){
  si=Math.max(0,Math.min(SLIDES.length-1,si));const prev=cur.si;
  if(prev>=0&&SLIDES[prev].diag&&prev!==si)SLIDES[prev].diag.leave();
  frame.querySelectorAll('.sl').forEach((s,i)=>{s.classList.toggle('on',i===si);s.setAttribute('aria-hidden',i===si?'false':'true')});
  const sec=frame.querySelectorAll('.sl')[si];if(prev!==si){if(!Q.has('shot'))gsap.fromTo(sec,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.7,ease:'power3.inOut',clearProps:'clipPath'});$('lt').textContent=SLIDES[si].title;if(SLIDES[si].diag)SLIDES[si].diag.enter();}
  run(si,k);
}
function next(){if(busy){finish();return}const s=SLIDES[cur.si];if(cur.k<s.steps.length-1)run(cur.si,cur.k+1);else if(cur.si<SLIDES.length-1)go(cur.si+1)}
function prevStep(){if(cur.k>0)run(cur.si,cur.k-1);else if(cur.si>0){const p=SLIDES[cur.si-1];go(cur.si-1,p.steps.length-1)}}
function autoNext(){if(autoTw)autoTw.kill();autoTw=gsap.delayedCall(1.8,()=>{if(auto)next()})}
$('seg').innerHTML=SLIDES.map(()=>'<b></b>').join('');

addEventListener('keydown',e=>{
  if(['ArrowRight',' ','PageDown','Enter','ArrowDown'].includes(e.key)){e.preventDefault();next()}
  else if(['ArrowLeft','PageUp','Backspace','ArrowUp'].includes(e.key)){e.preventDefault();prevStep()}
  else if(e.key==='Home')go(0);else if(e.key==='End')go(SLIDES.length-1);
  else if(e.key==='f'||e.key==='F')document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
  else if(e.key==='v'||e.key==='V'){ttsOn=!ttsOn;document.querySelector('.voice .chip').textContent=ttsOn?'Synapse says · audio on':'Synapse says';if(!ttsOn&&window.speechSynthesis)speechSynthesis.cancel()}
  else if(e.key==='p'||e.key==='P'){auto=!auto;if(auto&&!busy)autoNext()}
});
stage.addEventListener('click',e=>{const r=stage.getBoundingClientRect();(e.clientX<r.left+r.width*.25)?prevStep():next()});

addEventListener('resize',()=>{if(curEl&&!busy)aim(curEl,false)});
const [hs,hk]=location.hash.slice(1).split('.');
document.fonts.ready.then(()=>{const si=(parseInt(hs)||1)-1,k=parseInt(hk)||0;go(si,k);if(Q.has('shot'))setTimeout(finish,350)});

