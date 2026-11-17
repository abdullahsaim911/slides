/* concepts 01-05 */
window.H={
  stats(cls){return LAB.copy.stats.map((s,i)=>`<div class="${cls}" data-a><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')},
  team(sep){return LAB.copy.team.join(sep||' · ')},
  cap(){return `<div id="capS"></div><div id="capT"></div><div id="capD"></div>`}
};
const cols=(f,k)=>({user:[f,k],frontend:[f,k],backend:[f,k],multimodal:[f,k],inference:[f,k],storage:[f,k],external:[f,k]});

/* 01 AXON ------------------------------------------------------------ landscape, hub layout, curved edges, circle nodes, ring pulses */
CONCEPTS.push({id:'01',name:'Axon',orient:'Landscape 16:9',style:'Hub neuron, curved dendrites, ring pulses',root:'From the name: a synapse. The deck is one neuron.',stage:[1920,1080],anim:'rise',
css:`#stage{background:#E2E6F8;color:#14172B;font-family:AtkN}
.slide{padding:0}
.logo{position:absolute;left:110px;top:70px;height:64px}
h1{position:absolute;left:104px;top:210px;font:700 250px/.9 AtkN;letter-spacing:-.05em;color:#362CAC}
.axon{position:absolute;left:0;top:560px;width:1920px;height:120px}
.sub{position:absolute;left:112px;top:700px;width:760px;font:400 38px/1.3 AtkN;color:#373E5C}
.post{position:absolute;left:1150px;top:700px;width:640px;font:400 29px/1.5 AtkN;color:#14172B}
.post b{display:block;font:700 22px AtkM;color:#064E4A;margin-bottom:6px;letter-spacing:.04em}
h2{position:absolute;left:110px;top:80px;font:700 64px AtkN;color:#362CAC;letter-spacing:-.02em}
.lead2{position:absolute;left:112px;top:166px;font:400 32px AtkN;color:#373E5C;width:1100px}
.nrow{position:absolute;left:100px;right:100px;top:300px;display:flex;justify-content:space-between;align-items:center}
.st{width:410px;height:410px;border-radius:50%;border:5px solid #362CAC;display:grid;place-content:center;text-align:center;background:#EEF0FD}
.st .n{font:700 128px/1 AtkN;color:#362CAC;letter-spacing:-.04em}.st .n small{display:block;font:600 30px AtkN;color:#064E4A;letter-spacing:0;margin-top:6px}
.sg{width:120px;height:6px;background:repeating-linear-gradient(90deg,#9aa3d4 0 14px,transparent 14px 22px)}
.pd{position:absolute;top:760px;font:400 30px/1.4 AtkN;width:410px;text-align:center;color:#14172B}
#dsvg{position:absolute;left:80px;top:60px;width:1760px;height:760px}
.cap{position:absolute;left:110px;bottom:52px;width:1700px}
#capS{font:600 22px AtkM;color:#064E4A}#capT{font:700 50px AtkN;color:#362CAC;margin-top:2px}#capD{font:400 26px/1.4 AtkN;color:#373E5C;max-width:1250px;margin-top:6px}
.bx{fill:#fff;stroke:var(--k);stroke-width:3}.node.lit .bx{fill:var(--f);stroke-width:5}.node.seen .bx{fill:#f4f5fe}
.lb{font:700 21px AtkN;fill:#14172B}.edge{stroke:#362CAC}.edge.on{stroke:#064E4A}
.dt{}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><h1 data-a>Synapse</h1>
<svg class="axon" viewBox="0 0 1920 120"><circle cx="150" cy="60" r="46" fill="#362CAC"/><path d="M196 60H1060" stroke="#362CAC" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="1070" cy="60" r="16" fill="#362CAC"/><path d="M1130 60l-40 -28M1130 60l-40 28M1130 60H1190" stroke="#064E4A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M1190 60H1920" stroke="#064E4A" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/><text x="1110" y="22" font-family="AtkM" font-size="20" fill="#373E5C" text-anchor="middle">synaptic cleft</text></svg>
<div class="sub" data-a>${c.title}</div><div class="post" data-a><b>TEAM</b>${H.team('<br>')}<br><br><b>SUPERVISOR</b>${c.sup}<br>${c.uni}<br>Final Year Project · ${c.session}</div>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead} For blind and low-vision students, much of it never arrives.</div>
<div class="nrow">${c.stats.map((s,i)=>`<div class="st" data-a><div class="n">${s[0]}<small>${s[1]}</small></div></div>${i<2?'<div class="sg" data-a></div>':''}`).join('')}</div>
<div class="pd" style="left:100px" data-a>${c.stats[0][2]}</div><div class="pd" style="left:755px" data-a>${c.stats[1][2]}</div><div class="pd" style="left:1410px" data-a>${c.stats[2][2]}</div>`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1760,H:760,shape:'circle',edge:'curve',curv:.2,packet:'ring',reveal:'pop',fs:21,pk:7,sz:[104,104],draw:true,
 col:cols('#DDDAFC','#362CAC'),pos:{learner:[110,400],frontend:[350,250],backend:[600,400],orchestration:[880,390],analysis:[1180,170],explain:[1180,590],inference:[1520,590],storage:[860,650],delivery:[540,640],youtube:[1560,150]},
 size:{orchestration:[150,150]},css:''}});

/* 02 CUE SHEET --------------------------------------------------- portrait 3:4, vertical list, right-margin brackets, typed chips */
CONCEPTS.push({id:'02',name:'Cue Sheet',orient:'Portrait 3:4',style:'Vertical timecoded list, margin brackets, typed chips',root:'From the product: an audio description script for a blind listener.',stage:[1200,1600],anim:'left',
css:`#stage{background:#FBF8F0;color:#14172B;font-family:CourierP}
.slide{padding:0}
.pg{position:absolute;inset:50px 60px;border-left:2px solid #14172B}
.hd{position:absolute;left:110px;right:70px;top:60px;display:flex;justify-content:space-between;font:400 22px CourierP;color:#5a5d78;border-bottom:2px solid #14172B;padding-bottom:12px}
.tc{font:400 22px CourierP;color:#0a5a55}
h1{position:absolute;left:104px;top:300px;font:400 300px/.85 Gloock;color:#362CAC;letter-spacing:-.04em}
mark{background:linear-gradient(transparent 52%,#FFE49A 52% 94%,transparent 94%);color:inherit;padding:0 4px}
.t1{position:absolute;left:110px;top:760px;width:960px;font:400 40px/1.45 CourierP}
.cr{position:absolute;left:110px;top:1060px;font:400 29px/1.7 CourierP}
.fi{position:absolute;right:80px;bottom:90px;font:700 30px CourierP;text-transform:uppercase;letter-spacing:.08em}
.logo{position:absolute;right:80px;top:130px;height:56px}
.slug{position:absolute;left:110px;top:160px;font:700 34px CourierP;text-transform:uppercase}
.act{position:absolute;left:110px;top:230px;width:980px;font:400 34px/1.5 CourierP}
.row{position:absolute;left:110px;right:90px;display:grid;grid-template-columns:150px 1fr;gap:0 30px;border-top:2px solid #14172B;padding-top:24px}
.row .n{font:400 190px/.9 Gloock;color:#362CAC;letter-spacing:-.04em}.row .n small{font:700 30px CourierP;color:#0a5a55;margin-left:14px;letter-spacing:0}
.row p{font:400 34px/1.45 CourierP;margin-top:10px;max-width:820px}
#dsvg{position:absolute;left:60px;top:150px;width:1080px;height:1200px}
.cap{position:absolute;left:110px;right:90px;bottom:70px;border-top:2px solid #14172B;padding-top:14px}
#capS{font:400 24px CourierP;color:#0a5a55}#capT{font:400 54px Gloock;color:#362CAC}#capD{font:400 26px/1.45 CourierP;margin-top:4px}
.bx{fill:transparent}.ul{stroke:#14172B;stroke-width:2.4}.lb{font:700 27px CourierP;fill:#14172B;text-transform:uppercase}.sb{font:400 19px CourierP;fill:#5a5d78}
.node.lit .bx{fill:#FFE49A}.edge{stroke:#14172B;stroke-width:2}.edge.on{stroke:#362CAC;stroke-width:3.4}`,
title:c=>`<div class="pg"></div><div class="hd"><span><b>SYNAPSE</b> — AUDIO DESCRIPTION SCRIPT</span><span>DRAFT 3 · p. 1</span></div><img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt="">
<div class="tc" style="position:absolute;left:110px;top:250px" data-a>00:00:00:00</div><h1 data-a>Synapse</h1><div class="t1" data-a><mark>${c.title}.</mark></div>
<div class="cr" data-a>Written by <b>${c.team.join(', ')}</b><br>Supervised by ${c.sup}<br>${c.uni}<br>Final Year Project · ${c.session}</div><div class="fi" data-a>Fade in:</div>`,
problem:c=>`<div class="pg"></div><div class="hd"><span><b>SYNAPSE</b> — AUDIO DESCRIPTION SCRIPT</span><span>DRAFT 3 · p. 2</span></div>
<div class="slug" data-a>INT. THE LECTURE — EVERY STEM CLASS</div><div class="act" data-a>The instructor says “as you can see here.” <mark>Nothing else in the soundtrack says what is there.</mark></div>
${c.stats.map((s,i)=>`<div class="row" style="top:${480+i*310}px" data-a><div class="tc" style="padding-top:60px">SUPER 0${i+1}</div><div><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}.</p></div></div>`).join('')}`,
arch:c=>`<div class="pg"></div><div class="hd"><span><b>SYNAPSE</b> — HOW IT WORKS, AT A GLANCE</span><span>DRAFT 3 · p. 3</span></div><svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const ord=['youtube','learner','frontend','backend','orchestration','analysis','explain','inference','storage','delivery'],pos={},sy=116;ord.forEach((id,i)=>pos[id]=[420,70+i*sy]);
 return{W:1080,H:1200,shape:'label',edge:'elbow',packet:'chip',reveal:'slide',fs:27,pk:6,sz:[560,84],draw:true,arrow:'open',ah:9,
 col:cols('#fff','#14172B'),pos,mono:'#14172B',
 deco(g,$){ord.forEach((id,i)=>{const t=$('text',{x:20,y:78+i*sy,class:'tcl'},g);t.textContent='00:00:'+String(i*7).padStart(2,'0');t.setAttribute('style','font:400 21px CourierP;fill:#0a5a55')})},
 route(id,S,T,sg,nodes,anchor,poly){const a=S.i,b=T.i,ia=ord.indexOf(S.id),ib=ord.indexOf(T.id),span=Math.abs(ia-ib),xr=S.p[0]+280;
  if(span===1){const down=ib>ia,o=sg*14,ya=S.p[1]+(down?42:-42),yb=T.p[1]+(down?-42:42);return`M${S.p[0]+o} ${ya} L${T.p[0]+o} ${yb}`;}
  const off=30+span*13;return poly([[xr,S.p[1]],[xr+off,S.p[1]],[xr+off,T.p[1]],[xr,T.p[1]]],14,false);}};})()});

/* 03 BRAILLE ---------------------------------------------------- landscape dark, dot-cell grid, dotted straight links, raised dots */
CONCEPTS.push({id:'03',name:'Braille Cell',orient:'Landscape 16:9',style:'Cell grid, dotted straight links, raised-dot packets',root:'From the audience: braille. Everything snaps to a dot cell.',stage:[1920,1080],anim:'scale',
css:`#stage{background:#15123D;color:#F3F0FF;font-family:AtkN;background-image:radial-gradient(circle,rgba(201,194,255,.16) 3px,transparent 3.4px);background-size:36px 36px}
.logo{position:absolute;left:100px;top:70px;height:60px}
.bt{position:absolute;left:100px;top:230px;display:flex;gap:46px}
.bt i{display:grid;grid-template-columns:repeat(2,26px);grid-template-rows:repeat(3,26px);gap:10px;grid-auto-flow:column}
.bt i b{border-radius:50%;border:3px solid rgba(201,194,255,.35)}.bt i b.o{background:#7FE3D2;border-color:#7FE3D2}
h1{position:absolute;left:96px;top:560px;font:700 170px/1 AtkN;letter-spacing:-.04em;color:#F3F0FF}
.sub{position:absolute;left:104px;top:770px;width:1000px;font:400 38px/1.3 AtkN;color:#BDB8E6}
.cr{position:absolute;left:104px;bottom:70px;display:flex;gap:70px;font:400 26px/1.5 AtkN;color:#F3F0FF}.cr b{display:block;font:600 19px AtkM;color:#7FE3D2;letter-spacing:.06em;margin-bottom:6px}
h2{position:absolute;left:100px;top:76px;font:700 64px AtkN;color:#F3F0FF}
.cols{position:absolute;left:100px;right:100px;top:270px;display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.stc{padding:0 50px 0 50px;border-left:3px dotted rgba(201,194,255,.45)}.stc:first-child{border-left:0;padding-left:0}
.stc .n{font:700 190px/1 AtkN;letter-spacing:-.05em;color:#fff}.stc .n small{font:600 36px AtkN;color:#7FE3D2;margin-left:10px;letter-spacing:0}.stc p{font:400 34px/1.4 AtkN;color:#BDB8E6;margin-top:16px;max-width:500px}
.cells{display:flex;gap:16px;margin-bottom:26px}.cells i{display:grid;grid-template-columns:repeat(2,14px);grid-template-rows:repeat(3,14px);gap:6px;grid-auto-flow:column}.cells i b{border-radius:50%;border:2px solid rgba(201,194,255,.35)}.cells i b.o{background:#C9C2FF;border-color:#C9C2FF}
#dsvg{position:absolute;left:80px;top:50px;width:1760px;height:760px}
.cap{position:absolute;left:100px;bottom:50px;width:1700px}
#capS{font:600 22px AtkM;color:#7FE3D2}#capT{font:700 50px AtkN}#capD{font:400 26px/1.4 AtkN;color:#BDB8E6;max-width:1250px;margin-top:6px}
.bx{fill:#201C55;stroke:rgba(201,194,255,.4);stroke-width:2}.node.lit .bx{stroke:#7FE3D2;stroke-width:3.5;fill:#2a2570}.dt{fill:none;stroke:rgba(201,194,255,.4);stroke-width:2.5}.dt.on{fill:#C9C2FF;stroke:#C9C2FF}.node.lit .dt.on{fill:#7FE3D2;stroke:#7FE3D2}
.lb{font:600 20px AtkN;fill:#F3F0FF}.edge{stroke:#C9C2FF}.edge.on{stroke:#7FE3D2}.edge.done{opacity:.55}
#dsvg{--pkc:#7FE3D2}`,
title:c=>{const w='synapse',P={s:[1,2,3,4],y:[0,1,3,4,5],n:[0,2,3,4],a:[0],p:[0,1,2,3],e:[0,4]};const cell=l=>`<i>${[0,1,2,3,4,5].map(d=>`<b class="${({s:[1,2,3],y:[0,3,4,5],n:[0,3,4,5],a:[0],p:[0,1,2,3],e:[0,4]}[l]||[]).includes(d)?'o':''}"></b>`).join('')}</i>`;
 return `<img class="logo" data-a src="../Assets/logos/symbol-white.svg" alt=""><div class="bt" data-a>${[...w].map(cell).join('')}</div><h1 data-a>Synapse</h1><div class="sub" data-a>${c.title}</div>
 <div class="cr" data-a><div><b>TEAM</b>${c.team.join('<br>')}</div><div><b>SUPERVISOR</b>${c.sup}</div><div><b>FINAL YEAR PROJECT</b>${c.uni}<br>${c.session}</div></div>`},
problem:c=>`<h2 data-a>Problem statement</h2><div class="cols">${c.stats.map((s,i)=>`<div class="stc" data-a><div class="cells">${[...Array(4)].map((_,k)=>`<i>${[0,1,2,3,4,5].map(d=>`<b class="${(k+d*i)%3===0?'o':''}"></b>`).join('')}</i>`).join('')}</div><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}</div>`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1760,H:760,shape:'bcell',edge:'dots',packet:'knob',reveal:'pop',fs:20,pk:7,draw:false,arrow:'none',sz:[110,140],
 col:cols('#201C55','#C9C2FF'),pos:{youtube:[160,570],delivery:[500,570],storage:[840,570],explain:[1180,570],inference:[1560,570],learner:[160,200],frontend:[500,200],backend:[840,200],orchestration:[1180,200],analysis:[1560,200]}}});

/* 04 BLACKBOARD ------------------------------------------------- landscape slate, hand-drawn mind map, chalk sketch edges */
CONCEPTS.push({id:'04',name:'Blackboard',orient:'Landscape 16:9',style:'Mind map, hand-drawn boxes, chalk curves',root:'From the setting: the STEM lecture hall and its blackboard.',stage:[1920,1080],anim:'clip',
css:`#stage{background:radial-gradient(1400px 800px at 40% 20%,#2a3b39,#1d2b2a);color:#f1efe6;font-family:Caveat}
#stage::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.012) 0 3px,transparent 3px 11px);pointer-events:none}
.logo{position:absolute;right:110px;top:70px;height:60px;filter:none}
h1{position:absolute;left:130px;top:190px;font:700 270px/.95 Caveat;color:#f1efe6;letter-spacing:-.01em}
.ul{position:absolute;left:130px;top:500px;width:900px}
.sub{position:absolute;left:140px;top:560px;width:1050px;font:400 56px/1.2 Caveat;color:#f4d35e}
.cr{position:absolute;left:140px;bottom:90px;font:400 44px/1.25 Caveat;color:#f1efe6}.cr span{color:#f48fb1}
.doodle{position:absolute;right:110px;top:300px;width:520px}
h2{position:absolute;left:130px;top:70px;font:700 110px/1 Caveat;color:#f1efe6}
.lead2{position:absolute;left:140px;top:200px;font:400 56px Caveat;color:#f4d35e}
.nr{position:absolute;top:330px;width:520px;text-align:center}.nr .n{font:700 300px/.9 Caveat;color:#f1efe6}.nr .n small{font:700 70px Caveat;color:#7fe3d2}.nr p{font:400 52px/1.15 Caveat;color:#f1efe6;margin-top:18px}
.ar{position:absolute;top:290px;width:200px}
#dsvg{position:absolute;left:80px;top:40px;width:1760px;height:760px;--pkc:#f4d35e}
.cap{position:absolute;left:130px;bottom:50px;width:1650px}#capS{font:400 38px Caveat;color:#7fe3d2}#capT{font:700 90px/1 Caveat}#capD{font:400 42px/1.15 Caveat;color:#d8d4c4;max-width:1300px}
.bx{fill:rgba(255,255,255,.03);stroke:#f1efe6;stroke-width:3}.node.lit .bx{stroke:#f4d35e;fill:rgba(244,211,94,.12);stroke-width:4}.lb{font:700 36px Caveat;fill:#f1efe6}.ico{stroke:#f4d35e}.edge{stroke:#d8d4c4;stroke-width:3;filter:url(#rough)}.edge.on{stroke:#f4d35e;stroke-width:4.5}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/symbol-white.svg" alt=""><h1 data-a>Synapse</h1><svg class="ul" viewBox="0 0 900 40" data-a><path d="M4 22C150 6 320 34 470 18S760 8 896 22" stroke="#f4d35e" stroke-width="7" fill="none" stroke-linecap="round"/></svg>
<div class="sub" data-a>${c.title}</div><div class="cr" data-a>by <span>${c.team.join(', ')}</span><br>supervisor: ${c.sup}<br>${c.uni} · ${c.session}</div>
<svg class="doodle" viewBox="0 0 520 380" data-a fill="none" stroke="#f1efe6" stroke-width="5" stroke-linecap="round"><circle cx="120" cy="190" r="48"/><path d="M168 190H380M380 190l60 -60M380 190l60 40M440 130l40 -20M440 230l44 10"/><circle cx="440" cy="130" r="9"/><circle cx="446" cy="230" r="9"/><path d="M92 150l-50 -60M90 224l-50 70M120 142l-6 -78" stroke="#7fe3d2"/></svg>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="nr" style="left:${110+i*600}px" data-a><div class="n">${s[0]}<small> ${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1760,H:760,shape:'rough',edge:'curve',curv:.28,packet:'dot',reveal:'fade',fs:36,pk:7,draw:true,arrow:'open',ah:9,roughScale:6,sz:[290,96],bi:12,
 col:cols('#fff','#f1efe6'),mono:'#d8d4c4',pos:{learner:[190,380],frontend:[330,170],backend:[640,300],orchestration:[940,400],analysis:[1250,180],youtube:[1560,100],explain:[1230,590],inference:[1580,470],storage:[860,660],delivery:[430,640]},size:{orchestration:[340,110]}}});

/* 05 MULTITRACK ------------------------------------------------- ultrawide 21:9, swimlane tracks, elbow routing, bar packets */
CONCEPTS.push({id:'05',name:'Multitrack',orient:'Ultrawide 21:9',style:'Swimlane tracks by layer, clips, orthogonal routing',root:'From the product: audio. The system as a multitrack session.',stage:[2520,1080],anim:'left',
css:`#stage{background:#14141c;color:#e9e9f4;font-family:AtkN}
.rl{position:absolute;left:0;right:0;top:0;height:54px;background:#1c1c28;border-bottom:1px solid #34344a;display:flex;font:400 17px Plex;color:#8a8aa6}.rl span{flex:1;padding:18px 0 0 10px;border-left:1px solid #34344a}
.logo{position:absolute;left:80px;top:110px;height:58px}
h1{position:absolute;left:74px;top:250px;font:700 330px/.9 AtkN;letter-spacing:-.05em;color:#fff}
.clip{position:absolute;left:80px;top:700px;width:1260px;height:190px;background:#2b2a63;border:2px solid #6f66ff;border-radius:8px;overflow:hidden}
.clip svg{position:absolute;inset:0}.clip span{position:absolute;left:18px;top:12px;font:600 24px AtkN;color:#fff}
.sub{position:absolute;left:1420px;top:300px;width:880px;font:400 46px/1.3 AtkN;color:#b9b9d8}
.mk{position:absolute;left:1420px;top:640px;font:400 30px/1.55 AtkN;color:#e9e9f4}.mk b{display:inline-block;background:#FFD84A;color:#14141c;font:600 16px Plex;padding:3px 9px;border-radius:3px;margin-right:12px;letter-spacing:.06em}
.mk div{margin-bottom:10px}
h2{position:absolute;left:80px;top:100px;font:700 70px AtkN;color:#fff}
.tr{position:absolute;left:80px;right:80px;height:220px;background:#1c1c28;border:1px solid #34344a;border-radius:8px}
.tr .cp{position:absolute;left:30px;top:26px;bottom:26px;right:30px;display:grid;grid-template-columns:420px 1fr;align-items:center;border-radius:6px;background:var(--c);padding:0 40px}
.tr .n{font:700 150px/1 AtkN;color:#fff;letter-spacing:-.04em}.tr .n small{font:600 30px AtkN;margin-left:10px;letter-spacing:0;color:#14141c}.tr p{font:600 44px/1.25 AtkN;color:#14141c;max-width:1500px}
#dsvg{position:absolute;left:60px;top:90px;width:2400px;height:760px;--pkc:#FFD84A}
.cap{position:absolute;left:80px;bottom:46px;width:2300px;display:grid;grid-template-columns:260px 1fr;gap:0 30px}
#capS{font:600 22px Plex;color:#FFD84A;grid-row:1/3;padding-top:14px}#capT{font:700 54px AtkN}#capD{font:400 28px/1.4 AtkN;color:#b9b9d8;max-width:1500px}
.bx{fill:var(--f);stroke:var(--k);stroke-width:2}.ac{fill:rgba(255,255,255,.55)}.node.lit .bx{stroke:#fff;stroke-width:3.5}.lb{font:600 22px AtkN;fill:#14141c}.edge{stroke:#8a8aa6;stroke-width:1.8}.edge.on{stroke:#FFD84A;stroke-width:3}.edge.done{stroke:#b9b9d8}`,
title:c=>`<div class="rl">${[...Array(21)].map((_,i)=>`<span>00:${String(i*10).padStart(2,'0')}</span>`).join('')}</div><img class="logo" data-a src="../Assets/logos/logo-horizontal-white.svg" alt=""><h1 data-a>Synapse</h1>
<div class="clip" data-a><svg viewBox="0 0 1260 190" preserveAspectRatio="none">${[...Array(120)].map((_,i)=>`<rect x="${10+i*10.4}" y="${190-18-Math.abs(Math.sin(i*.9)*Math.cos(i*.21))*120}" width="5" height="${18+Math.abs(Math.sin(i*.9)*Math.cos(i*.21))*120}" fill="#8f87ff"/>`).join('')}</svg><span>Synapse_final_year_project.wav</span></div>
<div class="sub" data-a>${c.title}</div><div class="mk" data-a><div><b>TEAM</b>${c.team.join(' · ')}</div><div><b>SUPERVISOR</b>${c.sup}</div><div><b>PROJECT</b>${c.uni} · ${c.session}</div></div>`,
problem:c=>`<div class="rl">${[...Array(21)].map((_,i)=>`<span>00:${String(i*10).padStart(2,'0')}</span>`).join('')}</div><h2 data-a>Problem statement</h2>
${c.stats.map((s,i)=>`<div class="tr" style="top:${250+i*250}px" data-a><div class="cp" style="--c:${['#9f98ff','#7fe3d2','#ffb3cf'][i]}"><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div></div>`).join('')}`,
arch:c=>`<div class="rl">${[...Array(21)].map((_,i)=>`<span>00:${String(i*10).padStart(2,'0')}</span>`).join('')}</div><svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const lane={youtube:0,learner:0,frontend:1,delivery:1,backend:2,orchestration:2,analysis:3,explain:3,inference:4,storage:5},xs={learner:200,youtube:560,frontend:430,backend:760,orchestration:1090,analysis:1420,explain:1750,inference:1900,storage:1560,delivery:2160},pos={};Object.keys(lane).forEach(k=>pos[k]=[xs[k],70+lane[k]*125]);
 return{W:2400,H:760,shape:'clip',edge:'elbow',packet:'bar',reveal:'slide',fs:22,pk:6,draw:true,arrow:'tri',ah:6,sz:[250,96],rad:14,bi:16,
 col:{user:['#9f98ff','#9f98ff'],frontend:['#9f98ff','#9f98ff'],backend:['#7fe3d2','#7fe3d2'],multimodal:['#ffd84a','#ffd84a'],inference:['#ffb3cf','#ffb3cf'],storage:['#ffc98a','#ffc98a'],external:['#c9c9de','#c9c9de']},pos,
 deco(g,$){[0,1,2,3,4,5].forEach(i=>{$('rect',{x:0,y:70+i*125-58,width:2400,height:116,fill:i%2?'#181824':'#1a1a26',stroke:'#2c2c40'},g);const t=$('text',{x:12,y:70+i*125-38,fill:'#6a6a88'},g);t.textContent=['EXTERNAL','FRONTEND','BACKEND','ANALYSIS','AI MODELS','STORAGE'][i];t.setAttribute('style','font:600 14px Plex;letter-spacing:.14em')})}};})()});
