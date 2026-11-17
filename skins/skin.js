/* Design worlds for the Synapse deck. Select with ?skin=signal | sound | tactile.
   Each world is rooted in the project and adds one signature device to every slide. */
(function(){
  const skin=new URLSearchParams(location.search).get('skin');
  if(!skin||!/^(signal|sound|tactile)$/.test(skin)) return;
  document.documentElement.dataset.skin=skin;
  ['common',skin].forEach(n=>{const l=document.createElement('link');l.rel='stylesheet';l.href='skins/'+n+'.css';document.head.appendChild(l);});

  /* diagram colours per world */
  const PAL={
    signal:{user:['#DDDAFC','#362CAC'],frontend:['#DDDAFC','#362CAC'],backend:['#CDF1DB','#14683F'],multimodal:['#C8EEE9','#064E4A'],inference:['#FCDBE4','#B0245A'],storage:['#FDE6B2','#8A5A00'],external:['#E3E6F4','#373E5C']},
    sound:{user:['#FFE9A8','#14172B'],frontend:['#FFE9A8','#14172B'],backend:['#EFE8D4','#14172B'],multimodal:['#EFE8D4','#14172B'],inference:['#FFD3C2','#8a2a10'],storage:['#E4EBD6','#2f4a12'],external:['#E7E0CB','#4a4636']},
    tactile:{user:['#3a3480','#C9C2FF'],frontend:['#3a3480','#C9C2FF'],backend:['#164a49','#7FE3D2'],multimodal:['#164a49','#7FE3D2'],inference:['#5a2447','#FFA9CF'],storage:['#5c4617','#FFD27A'],external:['#2c2a52','#B9B7DD']}
  }[skin];
  for(const k in PAL){ CAT[k]={f:PAL[k][0],k:PAL[k][1]}; }

  const stage=document.getElementById('stage');
  const mk=(t,c,p)=>{const e=document.createElement(t); if(c) e.className=c; (p||stage).appendChild(e); return e;};
  const NS='http://www.w3.org/2000/svg';
  const sv=(t,a,p)=>{const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e;};

  const TITLES=['synapse','project team','problem statement','proposed solution','what is synapse','complete system architecture','detailed pipeline architecture','core modules','what is done','challenges','future work'];
  const SAYS=[
   'Title card. Synapse: multimodal AI accessibility for online STEM education of blind learners. COMSATS Lahore.',
   'Three team members: Hafiz Abdullah Saim, Maha Khalid and Memoona Shahid. Supervisor: Mr. Amaid Zia.',
   'Three figures: 285 million with a visual impairment, 39 million blind, and 70 percent of STEM content inaccessible.',
   'Five steps from lecture video to spoken explanation, then four capabilities: voice, keyboard, detail levels, library.',
   'Six capabilities beside a sample explanation: a graph of velocity over time, described in words.',
   'Ten blocks. Data flows from the learner through frontend and backend, into analysis and explanation, and back as audio.',
   'A detailed pipeline in three bands: lecture extraction, visual evidence, and explanation, speech and delivery.',
   'Twelve core modules in a grid, each with an icon, a short description and its technology.',
   'A checklist of ten completed parts of the system.',
   'A table of six challenges, each paired with how Synapse addresses it.',
   'Six areas of future work, and a thank you to the team and supervisor.'];
  const BR={a:'⠁',b:'⠃',c:'⠉',d:'⠙',e:'⠑',f:'⠋',g:'⠛',h:'⠓',i:'⠊',j:'⠚',k:'⠅',l:'⠇',m:'⠍',n:'⠝',o:'⠕',p:'⠏',q:'⠟',r:'⠗',s:'⠎',t:'⠞',u:'⠥',v:'⠧',w:'⠺',x:'⠭',y:'⠽',z:'⠵',' ':'⠀'};
  const braille=s=>[...s].map(c=>BR[c]||'').join('');

  /* ===== SIGNAL: the deck is one axon; each slide is a synapse the impulse crosses ===== */
  function signal(){
    const w=1680, N=11, step=(w-40)/(N-1);
    const box=mk('div','chain'); const svg=sv('svg',{viewBox:`0 0 ${w} 44`,width:w,height:44},box);
    const xs=[...Array(N)].map((_,i)=>20+i*step);
    const segs=[],somas=[];
    for(let i=0;i<N-1;i++){
      const x1=xs[i]+11,x2=xs[i+1]-11,m=(x1+x2)/2;
      const a=sv('path',{d:`M${x1} 22H${m-9}`,class:'ax'},svg), b=sv('path',{d:`M${m+9} 22H${x2}`,class:'ax'},svg);
      const t=sv('circle',{cx:m-9,cy:22,r:4,class:'bt'},svg), sp=sv('path',{d:`M${m+9} 22l-3 -6M${m+9} 22l-3 6`,class:'ax sp'},svg);
      segs.push([a,b,t,sp]);
    }
    xs.forEach(x=>{ const g=sv('circle',{cx:x,cy:22,r:9,class:'soma'},svg); somas.push(g); });
    const imp=sv('circle',{r:6,cy:22,cx:0,class:'imp'},svg); imp.style.opacity=0;
    window.__onSlide=(i,p)=>{
      somas.forEach((s,k)=>{s.classList.toggle('on',k<=i);s.classList.toggle('cur',k===i);});
      segs.forEach((g,k)=>g.forEach(e=>e.classList.toggle('lit',k<i)));
      if(p>=0&&p!==i){ imp.animate([{transform:`translateX(${xs[p]}px)`,opacity:1},{transform:`translateX(${xs[i]}px)`,opacity:1}],{duration:520,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish=()=>{imp.style.opacity=0}; imp.style.opacity=1; }
    };
  }

  /* ===== SOUND: every slide is described aloud, as in an audio description track ===== */
  function sound(){
    const r=mk('div','ad'); r.innerHTML='<span class="tag">Audio description</span><span class="tc" id="adTc">00:00:00</span><span class="tx" id="adTx"></span><span class="wv" id="adWv"></span>';
    const wv=r.querySelector('#adWv'); for(let i=0;i<26;i++){const b=document.createElement('i');b.style.animationDelay=(i*-.07)+'s';b.style.animationDuration=(.6+(i%6)*.13)+'s';wv.appendChild(b);}
    let typ=null,tick=null;
    window.__onSlide=(i)=>{
      clearInterval(typ);clearInterval(tick);
      const tx=r.querySelector('#adTx'),tc=r.querySelector('#adTc'),s=SAYS[i]||'',base=i*14;
      let n=0; tx.textContent=''; typ=setInterval(()=>{n+=2;tx.textContent=s.slice(0,n);if(n>=s.length)clearInterval(typ);},26);
      let sec=0; const fmt=v=>{const t=base+v;return '00:'+String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');};
      tc.textContent=fmt(0); tick=setInterval(()=>{sec++;tc.textContent=fmt(sec);},1000);
    };
  }

  /* ===== TACTILE: braille. Titles echo in real braille; progress is a row of braille cells ===== */
  function tactile(){
    const f=mk('div','bfoot'); const echo=mk('div','becho',f); const cells=mk('div','bcells',f);
    const DOTS=[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]];
    const items=[...Array(11)].map(()=>{const c=mk('span','bc',cells); c.innerHTML=DOTS.map(()=>'<i></i>').join(''); return c;});
    /* each cell shows its slide number as dots: slide n lights the dots of braille letter n (a..k) */
    const L=['a','b','c','d','e','f','g','h','i','j','k'], pat={a:[0],b:[0,1],c:[0,3],d:[0,3,4],e:[0,4],f:[0,1,3],g:[0,1,3,4],h:[0,1,4],i:[1,3],j:[1,3,4],k:[0,2]};
    items.forEach((c,k)=>[...c.children].forEach((d,j)=>d.classList.toggle('r',pat[L[k]].includes(j))));
    window.__onSlide=(i)=>{ items.forEach((c,k)=>{c.classList.toggle('cur',k===i);c.classList.toggle('past',k<i);}); echo.textContent=braille(TITLES[i]||''); echo.setAttribute('aria-hidden','true'); };
  }
  ({signal,sound,tactile})[skin]();
})();
