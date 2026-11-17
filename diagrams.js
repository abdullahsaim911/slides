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
  svg.setAttribute('viewBox',`0 0 ${cfg.W} ${cfg.H}`); if(cfg.big) svg.classList.add('big');
  const NW=cfg.nw, NH=cfg.nh;
  const gBands=el('g',{},svg), gEdges=el('g',{},svg), gNodes=el('g',{},svg), gPk=el('g',{},svg);
  (cfg.bands||[]).forEach(b=>{ el('rect',{class:'band',x:b.x,y:b.y,width:b.w,height:b.h,rx:26},gBands); const t=el('text',{class:'bandlbl',x:cfg.lblLeft?b.x+22:b.x+b.w/2,y:b.y+26,'text-anchor':cfg.lblLeft?'start':'middle'},gBands); t.textContent=b.t; });
  const nodes={};
  cfg.nodes.forEach((n,i)=>{
    const c=CAT[n.c]; const o={...n,w:NW,h:NH};
    const g=el('g',{class:'node',style:`--k:${c.k};--f:${c.f};--tx:${n.x}px;--ty:${n.cy-NH/2}px`,transform:`translate(${n.x},${n.cy-NH/2})`},gNodes);
    const T=cfg.big?64:50, tx=cfg.big?96:72;
    el('rect',{class:'box',width:NW,height:NH,rx:cfg.big?14:10},g);
    el('rect',{class:'tile',x:16,y:(NH-T)/2,width:T,height:T,rx:cfg.big?12:9},g);
    const sc=T*0.56/24; const ig=el('g',{class:'ico',transform:`translate(${16+T/2-12*sc},${(NH-T)/2+T/2-12*sc}) scale(${sc})`},g); ig.innerHTML=ICONS[n.i]||'';
    const lines=n.l.split('\n'); const two=lines.length>1; const l0=cfg.big?NH/2-8:30, lh=cfg.big?25:19;
    lines.forEach((ln,k)=>{ const t=el('text',{class:'lb',x:tx,y:two?(l0+k*lh):(NH/2-(cfg.big?2:3))},g); t.textContent=ln; });
    const s=el('text',{class:'sb',x:tx,y:two?(NH-(cfg.big?20:12)):NH/2+(cfg.big?24:17)},g); s.textContent=n.s;
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
    raf=requestAnimationFrame(tick);
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
  raf=requestAnimationFrame(tick);
  const api={
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
  const W=300, X=[20,382,744,1106,1468], R=[100,340,600];
  const N=(id,c,x,cy,i,l,s,m)=>({id,c,x,cy,i,l,s,m});
  const nodes=[
    N('youtube','external',X[4],R[0],'tv','YouTube','lecture video source',['youtube']),
    N('learner','user',X[0],R[1],'user','Learner','blind or low-vision student',['learner']),
    N('frontend','frontend',X[1],R[1],'monitor','Accessible\nFrontend','React · voice · keyboard',['frontend_app','video_player','voice_ui']),
    N('backend','backend',X[2],R[1],'server','Backend\n& APIs','FastAPI · accounts',['api','accounts']),
    N('orchestration','backend',X[3],R[1],'workflow','Processing &\nOrchestration','jobs · preparation · priority',['jobs','preparation','owned_requests']),
    N('analysis','multimodal',X[4],R[1],'layers','Multimodal\nAnalysis','speech · frames · gestures',['ingestion','transcription','frame_analysis','synchronization']),
    N('delivery','frontend',X[1],R[2],'headphones','Explanation\nDelivery','text · audio stream',['api']),
    N('storage','storage',X[2],R[2],'database','Data\nStorage','database · artifacts · media',['database','artifact_storage']),
    N('explain','multimodal',X[3],R[2],'brain','Explanation\nGeneration','evidence · text · speech',['visual_analysis','evidence_context','explanation_generation','speech_generation']),
    N('inference','inference',X[4],R[2],'sparkles','AI\nInference','vision · language models',['vlm_service','explanation_model','voice_service']),
  ];
  const E=(id,s,t,o)=>[id,s,t,o];
  const edges=[
    E('h01','learner','frontend',{p:'r-l',so:-18,to:-18}),
    E('h02','frontend','learner',{p:'l-r',so:18,to:18}),
    E('h03','youtube','frontend',{route:['S:l',{x:'T'},'T:t']}),
    E('h04','frontend','backend',{p:'r-l'}),
    E('h05','backend','orchestration',{p:'r-l'}),
    E('h06','youtube','analysis',{p:'b-t'}),
    E('h07','orchestration','analysis',{p:'r-l',so:-18,to:-18}),
    E('h08','analysis','orchestration',{p:'l-r',so:18,to:18}),
    E('h09','orchestration','explain',{p:'b-t'}),
    E('h10','orchestration','storage',{route:['S:b',{y:470},{x:'T'},'T:t'],so:-80,to:50}),
    E('h11','backend','storage',{p:'b-t',so:-30,to:-30}),
    E('h12','explain','storage',{p:'l-r'}),
    E('h13','explain','inference',{p:'r-l',so:-18,to:-18}),
    E('h14','inference','explain',{p:'l-r',so:18,to:18}),
    E('h15','storage','delivery',{p:'l-r'}),
    E('h16','delivery','frontend',{p:'t-b'}),
  ];
  const phases=[
    {t:'Open the lecture',d:'The learner opens the accessible frontend. The lecture streams from YouTube into the embedded player.',steps:[['h01','h03']]},
    {t:'Send the request',d:'The frontend calls the FastAPI backend, which hands the lecture to processing and orchestration as a durable job.',steps:[['h04'],['h05']]},
    {t:'Analyse the lecture',d:'Speech, frames and instructor gestures are analysed in parallel and synchronized. The lecture context is saved.',steps:[['h07','h06'],['h08'],['h10']]},
    {t:'Understand and explain',d:'The explanation pipeline asks the vision model for visual evidence, then the language model for a grounded explanation.',steps:[['h09'],['h13'],['h14']]},
    {t:'Speak and store',d:'Text and speech are generated, then saved as artifacts for delivery and reuse.',steps:[['h12']]},
    {t:'Deliver the explanation',d:'Text and audio are served back through the API and presented to the learner as accessible text and sound.',steps:[['h15'],['h16'],['h02']]},
    {t:'Personal learning data',d:'Accounts keep the learner’s library, bookmarks and saved explanations in the data store.',steps:[['h11']]},
  ];
  return {W:1790,H:700,nw:W,nh:120,big:1,nodes,edges,phases,bands:[]};
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
