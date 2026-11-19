/* ===== Synapse diagrams: icon set, orthogonal router, packet engine, data ===== */
const iconSvg = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* layer colours: f = tile fill, k = ink/stroke */
const CAT = {
  user:      {f:'#DDDAFC', k:'#362CAC'},
  frontend:  {f:'#DDDAFC', k:'#362CAC'},
  backend:   {f:'#CDF1DB', k:'#14683F'},
  multimodal:{f:'#C8EEE9', k:'#064E4A'},
  inference: {f:'#FCDBE4', k:'#B0245A'},
  storage:   {f:'#FDE6B2', k:'#8A5A00'},
  external:  {f:'#E3E6F4', k:'#373E5C'},
};
const NS = 'http://www.w3.org/2000/svg';
const el = (t, a={}, p) => { const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e; };

/* ---------- orthogonal router ---------- */
function anchor(n, side, off=0){
  switch(side){
    case 'r': return [n.x+n.w, n.cy+off];
    case 'l': return [n.x, n.cy+off];
    case 't': return [n.x+n.w/2+off, n.cy-n.h/2];
    case 'b': return [n.x+n.w/2+off, n.cy+n.h/2];
  }
}
function buildPoints(e, S, T){
  const so=e.so||0, to=e.to||0;
  let route = e.route;
  if(!route){
    const [a,b]=e.p.split('-');
    const sa=anchor(S,a,so), ta=anchor(T,b,to);
    if(a==='r'||a==='l'){ const m=e.m ?? (sa[0]+ta[0])/2; route=['S:'+a,{x:m},{y:'T'},'T:'+b]; }
    else { const m=e.m ?? (sa[1]+ta[1])/2; route=['S:'+a,{y:m},{x:'T'},'T:'+b]; }
  }
  const pts=[]; let tAnchor=null;
  for(const r of route){
    if(typeof r==='string'){
      const [w,s]=r.split(':'); const n=w==='S'?S:T; const off=w==='S'?so:to; pts.push(anchor(n,s,off)); if(w==='T') tAnchor=pts[pts.length-1];
    } else {
      const last=pts[pts.length-1]; const tgt=anchor(T,(route[route.length-1]).split(':')[1],to);
      if('x' in r) pts.push([r.x==='T'?tgt[0]:r.x, last[1]]);
      else pts.push([last[0], r.y==='T'?tgt[1]:r.y]);
    }
  }
  const out=[]; for(const p of pts){ const l=out[out.length-1]; if(!l||l[0]!==p[0]||l[1]!==p[1]) out.push(p); }
  return out;
}
function roundedPath(pts, r=16){
  let d=`M${pts[0][0]} ${pts[0][1]}`;
  for(let i=1;i<pts.length-1;i++){
    const p0=pts[i-1], p=pts[i], p1=pts[i+1];
    const l0=Math.hypot(p[0]-p0[0],p[1]-p0[1]), l1=Math.hypot(p1[0]-p[0],p1[1]-p[1]);
    const rr=Math.min(r,l0/2,l1/2);
    const a=[p[0]-(p[0]-p0[0])/l0*rr, p[1]-(p[1]-p0[1])/l0*rr];
    const b=[p[0]+(p1[0]-p[0])/l1*rr, p[1]+(p1[1]-p[1])/l1*rr];
    d+=` L${a[0]} ${a[1]} Q${p[0]} ${p[1]} ${b[0]} ${b[1]}`;
  }
  const l=pts[pts.length-1]; return d+` L${l[0]} ${l[1]}`;
}

/* ---------- diagram engine ---------- */
function Diagram(svg, cfg, ui){
  svg.setAttribute('viewBox',`0 0 ${cfg.W} ${cfg.H}`); if(cfg.big) svg.classList.add('big'); if(cfg.mid) svg.classList.add('mid');
  const NW=cfg.nw, NH=cfg.nh;
  const gBands=el('g',{},svg), gEdges=el('g',{},svg), gNodes=el('g',{},svg), gPk=el('g',{},svg);
  (cfg.bands||[]).forEach(b=>{ el('rect',{class:'band',x:b.x,y:b.y,width:b.w,height:b.h,rx:26},gBands); const t=el('text',{class:'bandlbl',x:cfg.lblLeft?b.x+22:b.x+b.w/2,y:b.y+26,'text-anchor':cfg.lblLeft?'start':'middle'},gBands); t.textContent=b.t; });
  const nodes={};
  cfg.nodes.forEach((n,i)=>{
    const c=CAT[n.c]; const o={...n,w:n.w||NW,h:n.h||NH};
    const g=el('g',{class:'node',style:`--k:${c.k};--f:${c.f};--tx:${n.x}px;--ty:${n.cy-o.h/2}px`,transform:`translate(${n.x},${n.cy-o.h/2})`},gNodes);
    const T=cfg.big?64:cfg.mid?44:50, tx=cfg.big?96:cfg.mid?68:72;
    el('rect',{class:'box',width:o.w,height:o.h,rx:cfg.big?14:10},g);
    el('rect',{class:'tile',x:16,y:(o.h-T)/2,width:T,height:T,rx:cfg.big?12:9},g);
    const sc=T*0.56/24; const ig=el('g',{class:'ico',transform:`translate(${16+T/2-12*sc},${(o.h-T)/2+T/2-12*sc}) scale(${sc})`},g); ig.innerHTML=ICONS[n.i]||'';
    const lines=n.l.split('\n'); const two=lines.length>1; const l0=cfg.big?o.h/2-8:cfg.mid?27:30, lh=cfg.big?25:cfg.mid?22:19;
    lines.forEach((ln,k)=>{ const t=el('text',{class:'lb',x:tx,y:two?(l0+k*lh):(o.h/2-(cfg.big?2:3))},g); t.textContent=ln; });
    const s=el('text',{class:'sb',x:tx,y:two?(o.h-(cfg.big?20:cfg.mid?10:12)):o.h/2+(cfg.big?24:17)},g); s.textContent=n.s;
    g.style.opacity=0; setTimeout(()=>{g.style.opacity=1;},0);
    o.g=g; nodes[n.id]=o;
  });
  const edges={}; const defs=el('defs',{},svg);
  cfg.edges.forEach(e=>{
    const S=nodes[e[1]], T=nodes[e[2]]; const o={id:e[0],src:e[1],tgt:e[2],...(e[3]||{})};
    const pts=buildPoints(o,S,T);
    const k=CAT[S.c].k;
    const path=el('path',{class:'edge'+(o.cond?' cond':''),d:roundedPath(pts),style:`--k:${k}`},gEdges);
    const last=pts[pts.length-1], prev=pts[pts.length-2];
    const ang=Math.atan2(last[1]-prev[1],last[0]-prev[0])*180/Math.PI;
    const arrow=el('path',{class:'arrow',d:'M-9 -5.5L1 0L-9 5.5Z',transform:`translate(${last[0]} ${last[1]}) rotate(${ang})`,style:`--k:${k}`},gEdges);
    o.path=path; o.arrow=arrow; o.len=path.getTotalLength(); o.k=k; edges[o.id]=o;
  });

  /* state */
  let cur=0, timers=[], raf=null, active=[], playTimer=null, playing=false;
  const phases=cfg.phases;
  const clearT=()=>{timers.forEach(clearTimeout);timers=[];};
  function setClass(elm,cls,on){elm.classList.toggle(cls,on)}
  function reset(){
    Object.values(nodes).forEach(n=>{n.g.classList.remove('lit','seen','dim')});
    Object.values(edges).forEach(e=>{['on','done'].forEach(c=>{e.path.classList.remove(c);e.arrow.classList.remove(c)})});
    gPk.innerHTML=''; active=[];
  }
  const markDone=(ids)=>ids.forEach(id=>{const e=edges[id]; if(!e)return; e.path.classList.add('done');e.arrow.classList.add('done'); nodes[e.src].g.classList.add('seen'); nodes[e.tgt].g.classList.add('seen');});
  const SPEED=420;
  function fire(id){
    const e=edges[id]; if(!e) return;
    e.path.classList.add('on');e.arrow.classList.add('on');
    nodes[e.src].g.classList.add('lit');
    const n=Math.max(2,Math.round(e.len/170));
    const ps=[];
    for(let i=0;i<n;i++){
      const g=el('g',{class:'pk',style:`--k:${e.k}`},gPk);
      el('circle',{class:'packet',r:6},g);
      ps.push({g,off:i/n});
    }
    active.push({e,ps,t0:performance.now()});
    timers.push(setTimeout(()=>nodes[e.tgt].g.classList.add('lit'), Math.min(e.len/SPEED*1000, 1400)));
  }
  function tick(now){
    active.forEach(a=>{
      const el_=(now-a.t0)/1000;
      a.ps.forEach(p=>{
        const d=((el_*SPEED/a.e.len)+p.off)%1;
        const pt=a.e.path.getPointAtLength(d*a.e.len);
        p.g.setAttribute('transform',`translate(${pt.x} ${pt.y})`);
      });
    });
  }
  function goto(i, instant){
    clearT(); cur=Math.max(0,Math.min(phases.length,i)); reset();
    for(let k=0;k<cur-1;k++){ phases[k].steps.flat().forEach(id=>markDone([id])); }
    const done=new Set(); for(let k=0;k<cur-1;k++) phases[k].steps.flat().forEach(id=>done.add(id));
    if(cur===0){ ui.render(0,null,phases.length); return; }
    const ph=phases[cur-1];
    ui.render(cur,ph,phases.length);
    let delay=0;
    ph.steps.forEach(group=>{
      timers.push(setTimeout(()=>group.forEach(fire),delay));
      const maxLen=Math.max(...group.map(id=>edges[id]?edges[id].len:0));
      delay+=Math.min(maxLen/SPEED*1000,1400)+180;
    });
    return delay;
  }
  gsap.ticker.add(()=>tick(performance.now()));
  const api={ nodes, edges, phases,
    get cur(){return cur}, total:phases.length,
    goto, next(){ if(cur<phases.length){goto(cur+1);return true} return false },
    prev(){ if(cur>0){goto(cur-1);return true} return false },
    play(){ if(playing) return stop(); playing=true; ui.playing(true); const go=()=>{ if(!playing)return; if(cur>=phases.length){goto(1)} else goto(cur+1); const d=(phases[cur-1].steps.length*900)+1800; playTimer=setTimeout(go,Math.max(3200,d)); }; go(); },
    stop(){ stop(); },
    enter(){ Object.values(nodes).forEach((n,i)=>{n.g.style.opacity=0;setTimeout(()=>n.g.style.opacity=1,80+i*35)}); goto(0); },
    leave(){ stop(); clearT(); }
  };
  function stop(){ playing=false; clearTimeout(playTimer); ui.playing(false); }
  return api;
}

/* ---------- control bar ---------- */
const ico=n=>`<i data-ic>${iconSvg(n)}</i>`;
function makeBar(barEl, getD){
  barEl.innerHTML=`<div class="step"><div class="st"></div><div class="sh"></div><div class="sd"></div></div><div class="chips"></div><div class="ctrls"><button class="prev">${ico('chev-l')}Back</button><button class="play">${ico('play-tri')}<span>Auto-play</span></button><button class="next">Next${ico('chev-r')}</button></div>`;
  const st=barEl.querySelector('.st'), sh=barEl.querySelector('.sh'), sd=barEl.querySelector('.sd'), chips=barEl.querySelector('.chips'), play=barEl.querySelector('.play');
  return {
    render(i,ph,total){
      if(!chips.children.length){ for(let k=0;k<=total;k++){ const b=document.createElement('button'); if(k===0){b.innerHTML=ico('home');b.setAttribute('aria-label','Overview')}else{b.textContent=k} b.onclick=()=>getD().goto(k); chips.appendChild(b);} }
      [...chips.children].forEach((b,k)=>{ b.classList.toggle('on',k===i); b.classList.toggle('seen',k<i); });
      if(i===0){ st.textContent='Overview'; sh.textContent=barEl.dataset.title; sd.textContent=barEl.dataset.intro; }
      else { st.textContent=`Step ${i} of ${total}`; sh.textContent=ph.t; sd.textContent=ph.d; }
    },
    playing(on){ play.innerHTML=ico(on?'pause':'play-tri')+'<span>'+(on?'Pause':'Auto-play')+'</span>'; },
    bind(){ barEl.querySelector('.prev').onclick=()=>getD().prev(); barEl.querySelector('.next').onclick=()=>getD().next(); play.onclick=()=>getD().play(); }
  };
}

/* ====================================================================
   SYSTEM ARCHITECTURE (high level). Each block groups components from
   system_architecture.json (members); each arrow is backed by at least
   one JSON edge between the blocks' members (verified by check.js).
   ==================================================================== */
const SYS = (()=>{
  /* five layers: client, gateway, services, intelligence, data. The API gateway is the hub. */
  const W=250, H=80, X=[170,490,810,1130,1450], cx=i=>X[i]+W/2, AW=1530, AC=X[0]+AW/2;
  const Y={A:60,B:168,G:280,S:402,I:540,D:662};
  const N=(id,c,x,cy,i,l,s,m,o)=>({id,c,x,cy,i,l,s,m,...o});
  const nodes=[
    N('browser','storage',X[0],Y.A,'save','Browser\nState','preferences · recovery',['browser_storage']),
    N('desktop','frontend',X[1],Y.A,'monitor','Desktop\nShell','optional Electron host',['desktop_runtime']),
    N('learner','user',X[0],Y.B,'user','Learner','blind or low-vision',['learner']),
    N('frontend','frontend',X[1],Y.B,'keyboard','Accessible\nApp','player · keyboard · UI',['frontend_app','video_player']),
    N('youtube','external',X[4],Y.B,'tv','YouTube','lecture source',['youtube']),
    N('api','backend',X[0],Y.G,'server','FastAPI Gateway','validates requests · routes work · serves text and audio',['api'],{w:AW,h:64}),
    N('qa','backend',X[0],Y.S,'message','Lecture Q&A\n& Quiz','Q&A · quiz when enabled',['ask_quiz']),
    N('ondemand','backend',X[1],Y.S,'target','On-Demand\nRequests','learner priority',['owned_requests']),
    N('jobs','backend',X[2],Y.S,'workflow','Processing\nJobs','durable · resumable',['jobs']),
    N('accounts','backend',X[3],Y.S,'library','Accounts\n& Library','saved learning data',['accounts']),
    N('voice','backend',X[4],Y.S,'mic','Voice\nCommands','listen · interpret · reply',['voice_ui','voice_service']),
    N('models','inference',X[0],Y.I,'sparkles','AI Models','vision · language · text',['vlm_service','explanation_model','qa_model']),
    N('pipeline','multimodal',X[1],Y.I,'brain','Explanation\nPipeline','evidence · text · speech',['preparation','visual_analysis','evidence_context','explanation_generation','speech_generation']),
    N('analysis','multimodal',X[2],Y.I,'layers','Multimodal\nAnalysis','speech · frames · gestures',['ingestion','transcription','frame_analysis','synchronization']),
    N('data','storage',X[0],Y.D,'database','Data Storage','SQL database · artifacts · managed media · checkpoints',['database','artifact_storage'],{w:AW,h:64}),
  ];
  const E=(id,s,t,o)=>[id,s,t,o];
  const ao=i=>cx(i)-AC, my=(Y.S+H/2+Y.I-H/2)/2;
  const edges=[
    E('e01','learner','frontend',{p:'r-l',so:-16,to:-16}),
    E('e02','frontend','learner',{p:'l-r',so:16,to:16}),
    E('e03','desktop','frontend',{p:'b-t',so:30,to:30}),
    E('e04','frontend','browser',{route:['S:t',{y:114},{x:'T'},'T:b'],so:-30}),
    E('e05','youtube','frontend',{p:'l-r'}),
    E('e06','frontend','api',{p:'b-t',so:-20,to:ao(1)-20}),
    E('e07','api','frontend',{p:'t-b',so:ao(1)+20,to:20}),
    E('e08','api','youtube',{p:'t-b',so:ao(4),to:0}),
    E('e09','api','qa',{p:'b-t',so:ao(0)-14,to:-14}),
    E('e10','qa','api',{p:'t-b',so:14,to:ao(0)+14}),
    E('e11','api','ondemand',{p:'b-t',so:ao(1),to:0}),
    E('e12','api','jobs',{p:'b-t',so:0,to:0}),
    E('e13','api','accounts',{p:'b-t',so:ao(3),to:0}),
    E('e14','api','voice',{p:'b-t',so:ao(4)-14,to:-14}),
    E('e15','voice','api',{p:'t-b',so:14,to:ao(4)+14}),
    E('e16','ondemand','jobs',{p:'r-l',so:-16,to:-16}),
    E('e17','jobs','ondemand',{p:'l-r',so:16,to:16}),
    E('e18','ondemand','pipeline',{p:'b-t',so:-20,to:-20}),
    E('e19','jobs','pipeline',{route:['S:b',{y:my},{x:'T'},'T:t'],so:-60,to:40}),
    E('e20','jobs','analysis',{p:'b-t',so:-18,to:-18}),
    E('e21','analysis','jobs',{p:'t-b',so:18,to:18}),
    E('e22','qa','models',{p:'b-t',so:-18,to:-18}),
    E('e23','models','qa',{p:'t-b',so:18,to:18}),
    E('e24','models','pipeline',{p:'r-l',so:-16,to:-16}),
    E('e25','pipeline','models',{p:'l-r',so:16,to:16}),
    E('e26','youtube','analysis',{route:['S:r',{x:1755},{y:'T'},'T:r']}),
    E('e27','pipeline','data',{p:'b-t',so:0,to:ao(1)}),
    E('e28','analysis','data',{p:'b-t',so:0,to:0}),
    E('e29','accounts','data',{p:'b-t',so:0,to:ao(3)}),
    E('e30','data','api',{p:'t-b',so:480,to:480}),
    E('e31','data','qa',{route:['S:l',{x:150},{y:'T'},'T:l']}),
  ];
  const phases=[
    {t:'Open the lecture',d:'The learner opens the accessible app, optionally inside the desktop shell, and the lecture streams in from YouTube.',steps:[['e01','e03','e05']]},
    {t:'Send the request',d:'The app calls the FastAPI gateway, which checks the lecture with YouTube and creates a durable processing job.',steps:[['e06'],['e08','e12']]},
    {t:'Analyse the lecture',d:'Speech, frames and gestures are analysed in parallel and synchronized, and the lecture context is saved.',steps:[['e20','e26'],['e21'],['e28']]},
    {t:'Understand and explain',d:'The explanation pipeline asks the vision and language models for grounded evidence and a clear explanation.',steps:[['e19'],['e25'],['e24']]},
    {t:'Speak and deliver',d:'Text and speech are saved, served back through the gateway and presented to the learner as accessible text and sound.',steps:[['e27'],['e30'],['e07'],['e02']]},
    {t:'Explain on demand',d:'When the learner asks about the current moment, the request jumps the queue and that part is prepared first.',steps:[['e11'],['e16'],['e18']]},
    {t:'Control by voice',d:'A spoken command travels through the gateway to speech recognition, and a spoken reply returns to the app.',steps:[['e06'],['e14'],['e15'],['e07']]},
    {t:'Ask or take a quiz',d:'Questions and quizzes are answered from the lecture transcript by their own model, separate from explanations.',steps:[['e09'],['e31'],['e22'],['e23'],['e10']]},
    {t:'Keep learning data',d:'Accounts store the learner’s library, notes and history, while preferences stay in the browser.',steps:[['e13'],['e29'],['e04']]},
  ];
  const B=(y,h,t)=>({x:0,y,w:1790,h,t});
  const bands=[B(8,212,'CLIENT'),B(234,92,'GATEWAY'),B(340,124,'SERVICES'),B(478,124,'INTELLIGENCE'),B(616,92,'DATA')];
  return {W:1790,H:716,nw:W,nh:H,mid:1,lblLeft:1,nodes,edges,phases,bands};
})();

/* ====================================================================
   PIPELINE ARCHITECTURE  (ids = pipeline_architecture.json)
   ==================================================================== */
const PIPE = (()=>{
  const W=196;
  const N=(id,x,cy,c,i,l,s)=>({id,x,cy,c,i,l,s});
  const nodes=[
    N('api_entry',14,180,'backend','server','Pipeline\nAPI Entry','validated requests'),
    N('video_jobs',252,180,'backend','list','Persistent\nVideo Jobs','durable · resumable'),
    N('ingestion',490,180,'multimodal','video','Video Identity\n& Ingestion','validate · prepare'),
    N('caption_fetch',728,70,'multimodal','captions','Caption\nAcquisition','YouTube transcript'),
    N('whisper',966,70,'inference','audio','Whisper\nTranscription','speech recognition'),
    N('frame_decode',728,180,'multimodal','film','Frame Decode\n& Sampling','FFmpeg · OpenCV'),
    N('frame_features',966,180,'multimodal','cpu','CLIP Features\n& Complexity','visual analysis'),
    N('keyframe_selection',1204,180,'multimodal','image','Pedagogical\nKeyframes','key frames'),
    N('gesture_detection',966,290,'multimodal','hand','Gesture\nDetection','instructor cues'),
    N('synchronization',1442,180,'multimodal','merge','Multimodal Sync\n& Intervention','select key moments'),
    N('context_persistence',1680,180,'backend','save','Persist\nLecture Context','shared job context'),
    N('artifact_store',1204,388,'storage','folder','Pipeline\nArtifacts','frames · text'),
    N('sql_store',1442,388,'storage','database','SQL State\n& Metadata','job status'),
    N('preparation',1680,470,'backend','workflow','Three-Stage\nPreparation','three stages'),
    N('target_resolution',1405,470,'multimodal','target','Resolve Target\n& Cache','reuse valid results'),
    N('image_request',1130,470,'multimodal','crop','Image, Prompt\n& Budget','frame + prompt'),
    N('vlm_inference',855,470,'inference','scan','VLM Inference','Qwen3-VL · vLLM'),
    N('evidence_assembly',580,470,'multimodal','braces','Structured\nVisual Evidence','parse · canonicalize'),
    N('evidence_checkpoint',305,470,'multimodal','shield-check','Evidence\nCheckpoint','usability gate'),
    N('transcript_only',805,570,'multimodal','filetext','Transcript-Only\nTarget','speech-only branch'),
    N('aligned_context',305,665,'multimodal','clock','Context\nAlignment','speech ↔ visual'),
    N('coverage_plan',555,665,'multimodal','layers','Coverage\nPlanning','what to describe'),
    N('synthesis_inputs',805,665,'multimodal','funnel','Explanation\nInputs','evidence + context'),
    N('explanation_llm',1055,665,'inference','brain','LLM Explanation\nSynthesis','grounded text'),
    N('text_checkpoint',1305,665,'multimodal','filecheck','Text & Source\nCheckpoint','saved explanation'),
    N('speech_generation',1555,665,'multimodal','volume','Text-to-Speech','Pocket TTS · Kokoro'),
    N('audio_artifacts',1555,770,'storage','audio','Stream &\nFinal Audio','PCM · MP3'),
    N('publication',1305,770,'multimodal','send','Validate\n& Publish','complete result'),
    N('delivery',1055,770,'frontend','headphones','Accessible\nDelivery','text + audio'),
    N('frontend',805,770,'frontend','monitor','Frontend\nPlayback','learner listens'),
  ];
  const E=(id,s,t,o)=>[id,s,t,o];
  const edges=[
    E('p01','api_entry','video_jobs',{p:'r-l'}),
    E('p02','video_jobs','ingestion',{p:'r-l'}),
    E('p03','ingestion','caption_fetch',{p:'r-l',m:707}),
    E('p04','ingestion','frame_decode',{p:'r-l'}),
    E('p11','ingestion','gesture_detection',{p:'r-l',m:707}),
    E('p05','caption_fetch','whisper',{p:'r-l',cond:1}),
    E('p06','caption_fetch','synchronization',{route:['S:t',{y:22},{x:'T'},'T:t'],cond:1,so:-30,to:-30}),
    E('p07','whisper','synchronization',{route:['S:r',{x:1414},{y:'T'},'T:l'],cond:1,to:-24}),
    E('p08','frame_decode','frame_features',{p:'r-l'}),
    E('p09','frame_features','keyframe_selection',{p:'r-l'}),
    E('p10','keyframe_selection','synchronization',{p:'r-l'}),
    E('p12','gesture_detection','synchronization',{route:['S:r',{x:1428},{y:'T'},'T:l'],to:24}),
    E('p13','synchronization','context_persistence',{p:'r-l'}),
    E('p14','context_persistence','sql_store',{route:['S:b',{y:288},{x:'T'},'T:t'],so:-40}),
    E('p66','context_persistence','artifact_store',{route:['S:b',{y:264},{x:'T'},'T:t'],so:-72}),
    E('p15','context_persistence','preparation',{route:['S:r',{x:1884},{y:'T'},'T:r']}),
    E('p20','preparation','target_resolution',{p:'l-r'}),
    E('p25','target_resolution','image_request',{p:'l-r'}),
    E('p26','image_request','vlm_inference',{p:'l-r'}),
    E('p27','vlm_inference','evidence_assembly',{p:'l-r'}),
    E('p30','evidence_assembly','evidence_checkpoint',{p:'l-r',cond:1}),
    E('p24','target_resolution','transcript_only',{route:['S:b',{y:570},'T:r'],so:30,cond:1}),
    E('p36','transcript_only','synthesis_inputs',{route:['S:l',{x:778},{y:'T'},'T:l'],to:-20,cond:1}),
    E('p32','evidence_checkpoint','aligned_context',{p:'b-t'}),
    E('p34','aligned_context','coverage_plan',{p:'r-l'}),
    E('p35','coverage_plan','synthesis_inputs',{p:'r-l',to:12,so:12}),
    E('p37','synthesis_inputs','explanation_llm',{p:'r-l',cond:1}),
    E('p38','explanation_llm','text_checkpoint',{p:'r-l'}),
    E('p40','text_checkpoint','speech_generation',{p:'r-l'}),
    E('p41','speech_generation','audio_artifacts',{p:'b-t'}),
    E('p42','audio_artifacts','publication',{p:'l-r'}),
    E('p45','publication','delivery',{p:'l-r'}),
    E('p46','audio_artifacts','delivery',{route:['S:b',{y:824},{x:'T'},'T:b'],cond:1}),
    E('p47','delivery','frontend',{p:'l-r'}),
  ];
  const phases=[
    {t:'Admit the lecture job',d:'The API entry creates or joins a durable per-video job. A fresh lecture starts detection-only ingestion; it does not run the full video through a VLM.',steps:[['p01'],['p02']]},
    {t:'Process audio, frames and gestures in parallel',d:'After ingestion, captions (or Whisper), frame decoding with CLIP features, and gesture detection run in parallel branches.',steps:[['p03','p04','p11'],['p05','p08'],['p09']]},
    {t:'Join and select intervention moments',d:'Speech, keyframes and gesture cues converge in multimodal synchronization, which selects where explanations help. Context is persisted and preparation is scheduled.',steps:[['p06','p07','p10','p12'],['p13'],['p14','p66','p15']]},
    {t:'Resolve the evidence target',d:'Three-stage preparation claims an intervention, checks the cache, and builds the image, prompt and context budget for the vision model.',steps:[['p20'],['p25']]},
    {t:'Understand the visual with the VLM',d:'The selected VLM reads the frame; its output is parsed into structured visual evidence and gated for usability.',steps:[['p26'],['p27'],['p30']]},
    {t:'Transcript-only branch',d:'When a requested moment has no usable visual, the target resolves to transcript-only context and rejoins at the explanation inputs.',steps:[['p24'],['p36']]},
    {t:'Align context and plan coverage',d:'Evidence is aligned with the lecturer’s speech, and a coverage plan decides which visual and spoken details the explanation must include.',steps:[['p32'],['p34'],['p35']]},
    {t:'Synthesize the explanation',d:'Bounded inputs go to the explanation LLM; the generated text is saved with its provenance as a checkpoint.',steps:[['p37'],['p38']]},
    {t:'Generate speech',d:'Text-to-speech runs as its own stage, so text is ready while audio is still being produced. Output is streamed and saved.',steps:[['p40'],['p41']]},
    {t:'Publish and deliver accessibly',d:'The result is validated and published; the API delivers text and audio to the frontend for the learner to hear.',steps:[['p42'],['p45','p46'],['p47']]},
  ];
  const bands=[
    {x:6,y:4,w:1878,h:336,t:'1 · Lecture context extraction'},
    {x:6,y:344,w:1878,h:274,t:'2 · Visual evidence'},
    {x:6,y:626,w:1878,h:214,t:'3 · Explanation'},
  ];
  return {lblLeft:1,W:1890,H:846,nw:W,nh:80,nodes,edges,phases,bands};
})();
