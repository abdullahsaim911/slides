/* concepts 16-20 */
const cols4=(f,k)=>({user:[f,k],frontend:[f,k],backend:[f,k],multimodal:[f,k],inference:[f,k],storage:[f,k],external:[f,k]});

/* 16 PERIODIC TABLE -------------------------------------------- landscape, element tiles in a 5x2 table, thin arcs, electron packets */
CONCEPTS.push({id:'16',name:'Periodic Table',orient:'Landscape 16:9',style:'Element tiles, thin arcs over and under, electrons',root:'From the subject: STEM. Every module is an element.',stage:[1920,1080],anim:'scale',
css:`#stage{background:#F3F2EC;color:#111;font-family:BarlowC}
.logo{position:absolute;right:100px;top:70px;height:54px}
.big{position:absolute;left:100px;top:110px;width:640px;height:760px;background:#C8EEE9;border:5px solid #111;padding:30px 34px}
.big .z{font:600 40px BarlowC}.big .sy{font:700 340px/.9 BarlowC;letter-spacing:-.03em;margin-top:60px}.big .nm{font:700 78px BarlowC;text-transform:uppercase;letter-spacing:.02em}.big .ms{font:400 28px AtkN;margin-top:10px}
.sub{position:absolute;left:830px;top:140px;width:900px;font:700 68px/1.05 BarlowC;text-transform:uppercase}
.tl{position:absolute;left:830px;display:flex;gap:26px}.tl div{width:260px;height:240px;border:5px solid #111;padding:14px 16px;font:400 26px/1.25 AtkN}.tl b{display:block;font:700 54px BarlowC;line-height:1.1;margin-top:34px;text-transform:uppercase}
.sp{position:absolute;left:830px;top:760px;font:400 28px/1.5 AtkN}
h2{position:absolute;left:100px;top:70px;font:700 110px BarlowC;text-transform:uppercase}.lead2{position:absolute;left:104px;top:200px;font:400 32px AtkN}
.et{position:absolute;top:310px;width:540px;height:620px;border:5px solid #111;padding:24px 30px}.et .z{font:600 34px BarlowC}.et .s{font:700 210px/.9 BarlowC;margin-top:40px}.et .nm{font:700 130px/1 BarlowC;letter-spacing:-.02em}.et .nm small{font:700 42px BarlowC;margin-left:8px}.et p{font:400 28px/1.3 AtkN;margin-top:12px}
#dsvg{position:absolute;left:80px;top:50px;width:1760px;height:780px;--pkc:#111;--pkb:#fff}
.cap{position:absolute;left:100px;bottom:48px;width:1700px}#capS{font:600 26px BarlowC;color:#8a2a10;letter-spacing:.1em;text-transform:uppercase}#capT{font:700 76px BarlowC;text-transform:uppercase}#capD{font:400 26px/1.4 AtkN;color:#333;max-width:1300px}
.bx{fill:var(--f);stroke:#111;stroke-width:4}.node.lit .bx{fill:#FFD84A}.sym{font:700 100px BarlowC;fill:#111}.lb{font:600 22px BarlowC;fill:#111;text-transform:uppercase;letter-spacing:.04em}.sb{font:600 20px BarlowC;fill:#111}.edge{stroke:#111;stroke-width:1.8;opacity:.4}.edge.on{opacity:1;stroke-width:3.4;stroke:#8a2a10}.pk.rg2{stroke:#111}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><div class="big" data-a><div class="z">1</div><div class="sy">Sy</div><div class="nm">Synapse</div><div class="ms">Multimodal AI accessibility</div></div><div class="sub" data-a>${c.title}</div>
<div class="tl" style="top:420px" data-a>${c.team.map((t,i)=>`<div style="background:${['#DDDAFC','#FDE6B2','#FCDBE4'][i]}">${i+2}<b>${t.split(' ').slice(0,-1).join(' ')}<br>${t.split(' ').slice(-1)}</b></div>`).join('')}</div><div class="sp" data-a><b>Supervisor:</b> ${c.sup}<br>${c.uni} · ${c.session}<br>Final Year Project</div>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="et" style="left:${100+i*600}px;background:${['#DDDAFC','#C8EEE9','#FCDBE4'][i]}" data-a><div class="z">${['Vi','Bl','Lo'][i]}</div><div class="nm" style="margin-top:50px">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1760,H:780,shape:'element',edge:'arc',packet:'electron',reveal:'pop',fs:22,pk:6,draw:true,arrow:'open',ah:7,sz:[220,250],bi:0,
 col:{user:['#DDDAFC','#111'],frontend:['#DDDAFC','#111'],backend:['#CDF1DB','#111'],multimodal:['#C8EEE9','#111'],inference:['#FCDBE4','#111'],storage:['#FDE6B2','#111'],external:['#e6e3d6','#111']},
 sym:{learner:'Le',frontend:'Fr',backend:'Ba',orchestration:'Or',analysis:'An',explain:'Ex',inference:'In',storage:'St',delivery:'De',youtube:'Yt'},
 pos:{learner:[170,140],frontend:[510,140],backend:[850,140],orchestration:[1190,140],analysis:[1530,140],youtube:[170,520],delivery:[510,520],storage:[850,520],explain:[1190,520],inference:[1530,520]}}});

/* 17 CIRCUIT BOARD --------------------------------------------- landscape green PCB, IC chips, 45-degree traces, pulse packets */
CONCEPTS.push({id:'17',name:'Circuit Board',orient:'Landscape 16:9',style:'IC chips with pins, 45-degree copper traces',root:'From the logo: the hand and its circuit traces.',stage:[1920,1080],anim:'rise',
css:`#stage{background:#0f4d3a;color:#e9f3ea;font-family:ShareT;background-image:radial-gradient(circle,rgba(255,255,255,.05) 1.6px,transparent 2px);background-size:24px 24px}
.hole{position:absolute;width:46px;height:46px;border-radius:50%;background:#0a3427;border:8px solid #e0b44c}
.logo{position:absolute;left:150px;top:90px;height:52px}
h1{position:absolute;left:140px;top:240px;font:400 250px/1 ShareT;letter-spacing:-.05em;color:#e9f3ea}
.sub{position:absolute;left:150px;top:560px;width:1100px;font:400 40px/1.35 ShareT;color:#bfe0c8}
.ic{position:absolute;right:140px;top:170px;width:360px;height:360px;background:#111;border-radius:10px;border:3px solid #333;padding:24px;font:400 20px/1.6 ShareT;color:#9fb;display:flex;flex-direction:column;justify-content:flex-end}
.ic::before{content:"";position:absolute;left:18px;top:18px;width:26px;height:26px;border-radius:50%;background:#333}
.cr{position:absolute;left:150px;bottom:90px;font:400 26px/1.7 ShareT;color:#bfe0c8}.cr b{color:#e0b44c;font-weight:400}
.rev{position:absolute;right:150px;bottom:100px;font:400 30px ShareT;color:#e0b44c;border:3px solid #e0b44c;padding:6px 16px}
h2{position:absolute;left:150px;top:80px;font:400 90px ShareT;letter-spacing:-.04em}.lead2{position:absolute;left:154px;top:200px;font:400 30px ShareT;color:#bfe0c8}
.chp{position:absolute;top:330px;width:460px;height:420px;background:#111;border-radius:10px;border:3px solid #333;padding:30px 34px}.chp::before{content:"";position:absolute;left:18px;top:18px;width:22px;height:22px;border-radius:50%;background:#333}.chp .n{font:400 160px/1 ShareT;color:#e0b44c;margin-top:30px;letter-spacing:-.06em}.chp .n small{font:400 32px ShareT;color:#9fb;margin-left:8px}.chp p{font:400 26px/1.4 ShareT;color:#bfe0c8;margin-top:14px}.chp .pn{position:absolute;left:-18px;right:-18px;top:0;bottom:0;background:repeating-linear-gradient(transparent 0 38px,#c9c9c9 38px 62px);-webkit-mask:linear-gradient(90deg,#000 0 18px,transparent 18px calc(100% - 18px),#000 calc(100% - 18px));mask:linear-gradient(90deg,#000 0 18px,transparent 18px calc(100% - 18px),#000 calc(100% - 18px));z-index:-1;opacity:.8}
#dsvg{position:absolute;left:80px;top:40px;width:1760px;height:780px;--pkc:#ffe27a}
.cap{position:absolute;left:150px;bottom:48px;width:1600px}#capS{font:400 24px ShareT;color:#e0b44c}#capT{font:400 60px ShareT;letter-spacing:-.03em}#capD{font:400 24px/1.5 ShareT;color:#bfe0c8;max-width:1300px}
.bx{fill:#111;stroke:#333;stroke-width:3}.ac{fill:#c9c9c9}.node.lit .bx{stroke:#e0b44c;stroke-width:4}.lb{font:400 21px ShareT;fill:#e9f3ea}.sb{font:400 15px ShareT;fill:#9fb}.edge{stroke:#e0b44c;stroke-width:5;opacity:.35;stroke-linejoin:round}.edge.on{opacity:1;stroke-width:6}.edge.done{opacity:.7}`,
title:c=>`<div class="hole" style="left:50px;top:50px"></div><div class="hole" style="right:50px;top:50px"></div><div class="hole" style="left:50px;bottom:50px"></div><div class="hole" style="right:50px;bottom:50px"></div><img class="logo" data-a src="../Assets/logos/logo-horizontal-white.svg" alt=""><h1 data-a>SYNAPSE</h1><div class="sub" data-a>${c.title}</div><div class="ic" data-a>U1 · SYNAPSE<br>${c.session}</div><div class="cr" data-a><b>DESIGNERS</b> ${c.team.join(' / ')}<br><b>SUPERVISOR</b> ${c.sup}<br>${c.uni}</div><div class="rev" data-a>REV A</div>`,
problem:c=>`<div class="hole" style="left:50px;top:50px"></div><div class="hole" style="right:50px;top:50px"></div><h2 data-a>PROBLEM STATEMENT</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="chp" style="left:${150+i*540}px" data-a><div class="pn"></div><div style="font:400 22px ShareT;color:#9fb">U${i+2}</div><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1760,H:780,shape:'chip',edge:'chamfer',packet:'square',reveal:'rise',fs:20,pk:6,draw:true,arrow:'none',sz:[270,110],rad:22,bi:26,col:cols4('#111','#e0b44c'),
 num:{learner:1,frontend:2,backend:3,orchestration:4,analysis:5,explain:6,inference:7,storage:8,delivery:9,youtube:10},
 pos:{learner:[170,130],frontend:[540,130],backend:[910,210],orchestration:[1250,130],analysis:[1600,230],youtube:[1600,520],explain:[1250,520],inference:[1590,700],storage:[880,560],delivery:[480,540]},
 deco(g,$){[[60,60],[1700,60],[60,720],[1700,720]].forEach(p=>$('circle',{cx:p[0],cy:p[1],r:16,fill:'#0a3427',stroke:'#e0b44c','stroke-width':5},g))}}});

/* 18 ATOM ------------------------------------------------------- square 1:1, nucleus and orbits, electron nodes, orbiting packets */
CONCEPTS.push({id:'18',name:'Atom',orient:'Square 1:1',style:'Nucleus with three orbits, electron nodes',root:'From the subject: STEM physics, the Bohr atom.',stage:[1200,1200],anim:'scale',
css:`#stage{background:#0d1630;color:#eef2ff;font-family:Gloock}
.orb{position:absolute;left:50%;top:50%;border:2px solid rgba(238,242,255,.35);border-radius:50%;transform:translate(-50%,-50%)}
.core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center}
.core h1{font:400 190px/1 Gloock;letter-spacing:-.04em}.core p{font:400 28px/1.35 AtkN;max-width:560px;margin:10px auto 0;color:#c4cbe8}
.el{position:absolute;font:400 24px/1.4 AtkN;color:#c4cbe8}.el b{color:#ffcf6b;font-weight:600}
.logo{position:absolute;left:70px;top:60px;height:50px}
h2{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font:400 78px/1.05 Gloock}
.sx{position:absolute;text-align:center;width:300px;transform:translate(-50%,-50%)}.sx .n{font:400 120px/1 Gloock;color:#ffcf6b;letter-spacing:-.03em}.sx .n small{font:400 28px Gloock;color:#eef2ff;margin-left:6px}.sx p{font:400 22px/1.3 AtkN;color:#c4cbe8;margin-top:4px}
#dsvg{position:absolute;left:50px;top:40px;width:1100px;height:1000px;--pkc:#ffcf6b}
.cap{position:absolute;left:70px;right:70px;bottom:44px;text-align:center}#capS{font:600 22px AtkN;color:#ffcf6b}#capT{font:400 54px Gloock}#capD{font:400 24px/1.4 AtkN;color:#c4cbe8;max-width:900px;margin:0 auto}
.bx{fill:#0d1630;stroke:#eef2ff;stroke-width:3}.ico{stroke:#ffcf6b}.node.lit .bx{fill:#ffcf6b}.node.lit .ico{stroke:#0d1630}.lb{font:600 22px AtkN;fill:#eef2ff}.edge{stroke:#8fa0e0;stroke-width:1.6;opacity:.22}.edge.on{stroke:#ffcf6b;opacity:1;stroke-width:3}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-white.svg" alt="">${[330,520,740].map((r,i)=>`<div class="orb" style="width:${r*1.5}px;height:${r*1.15}px;transform:translate(-50%,-50%) rotate(${[-20,35,-60][i]}deg)" data-a></div>`).join('')}<div class="core" data-a><h1>Synapse</h1><p>${c.title}</p></div>
<div class="el" style="left:70px;bottom:90px" data-a><b>Electrons</b><br>${c.team.join('<br>')}</div><div class="el" style="right:70px;bottom:90px;text-align:right" data-a><b>Nucleus keeper</b><br>${c.sup}<br>${c.uni}<br>${c.session}</div>`,
problem:c=>`<h2 data-a>Problem<br>statement</h2>${[330,520,740].map((r,i)=>`<div class="orb" style="width:${r*1.4}px;height:${r*1.4}px" data-a></div>`).join('')}${c.stats.map((s,i)=>{const p=[[600,190],[960,740],[240,820]][i];return`<div class="sx" style="left:${p[0]}px;top:${p[1]}px" data-a><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`}).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const cx=550,cy=480,pos={orchestration:[cx,cy]},dir={},put=(id,r,a)=>{pos[id]=[cx+Math.cos(a)*r*1.12,cy+Math.sin(a)*r*.92];dir[id]=Math.sin(a)>0?'s':'n'};
 [['backend',0],['analysis',Math.PI/2],['explain',Math.PI],['storage',3*Math.PI/2]].forEach(p=>put(p[0],190,p[1]+.5));[['frontend',.3],['inference',2.35],['delivery',4.35]].forEach(p=>put(p[0],330,p[1]));[['learner',1.5],['youtube',4.9]].forEach(p=>put(p[0],440,p[1]));
 return{W:1100,H:1000,shape:'electron',edge:'curve',curv:.2,packet:'electron',reveal:'pop',fs:22,pk:7,draw:true,arrow:'none',sz:[78,78],size:{orchestration:[130,130]},col:cols4('#0d1630','#eef2ff'),mono:'#8fa0e0',pos,dir,
 deco(g,$){[190,330,440].forEach((r,i)=>$('ellipse',{cx,cy,rx:r*1.12,ry:r*.92,fill:'none',stroke:'#eef2ff','stroke-width':1.6,opacity:.28},g))}};})()});

/* 19 CASSETTE --------------------------------------------------- landscape, racetrack tape loop, tape-head nodes, tape-tick packets, spinning reels */
CONCEPTS.push({id:'19',name:'Cassette',orient:'Landscape 16:9',style:'Racetrack tape loop, tape-head nodes, spinning reels',root:'From history: talking books on cassette tape for blind readers.',stage:[1920,1080],anim:'rise',
css:`#stage{background:#d9ceb4;color:#2a211a;font-family:SpecialE}
.logo{position:absolute;left:100px;top:70px;height:50px}
.cs{position:absolute;left:100px;top:170px;width:1720px;height:740px}
h1{position:absolute;left:230px;top:310px;font:400 230px/1 Bebas;letter-spacing:.03em;color:#2a211a}
.sub{position:absolute;left:236px;top:570px;width:1000px;font:400 38px/1.3 SpecialE}
.lbl{position:absolute;left:230px;bottom:250px;font:400 26px/1.6 SpecialE}
.s{position:absolute;right:240px;top:310px;font:400 160px Bebas;color:#c4402f}
h2{position:absolute;left:100px;top:70px;font:400 110px Bebas;letter-spacing:.03em}.lead2{position:absolute;left:104px;top:190px;font:400 32px SpecialE}
.tp{position:absolute;top:300px;width:540px;height:340px;background:#f4ecd6;border:4px solid #2a211a;border-radius:14px;padding:26px 30px;transform:rotate(var(--r))}.tp .n{font:400 200px/1 Bebas;color:#c4402f}.tp .n small{font:400 46px Bebas;color:#2a211a;margin-left:8px}.tp p{font:400 25px/1.3 SpecialE}.tp .sd{position:absolute;right:20px;top:12px;font:400 22px Bebas;letter-spacing:.1em}
#dsvg{position:absolute;left:90px;top:40px;width:1740px;height:790px;--pkc:#2a211a;--pkb:#f4ecd6}
.cap{position:absolute;left:100px;bottom:48px;width:1700px}#capS{font:400 26px Bebas;letter-spacing:.14em;color:#c4402f}#capT{font:400 78px Bebas;letter-spacing:.03em}#capD{font:400 24px/1.45 SpecialE;max-width:1300px}
.bx{fill:#f4ecd6;stroke:#2a211a;stroke-width:3.5}.ac{fill:#c4402f}.node.lit .bx{fill:#ffd88a}.lb{font:400 26px SpecialE;fill:#2a211a}.edge{stroke:#6b4a2f;stroke-width:6;opacity:.35;stroke-linecap:round}.edge.on{stroke:#2a211a;opacity:1;stroke-width:7}.edge.done{opacity:.7}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><svg class="cs" viewBox="0 0 1720 740" data-a><rect x="2" y="2" width="1716" height="736" rx="40" fill="#f4ecd6" stroke="#2a211a" stroke-width="6"/><rect x="170" y="70" width="1380" height="470" rx="18" fill="#fff9e8" stroke="#2a211a" stroke-width="4"/><path d="M170 120H1550" stroke="#c4402f" stroke-width="10"/><rect x="560" y="570" width="600" height="150" rx="20" fill="#2a211a"/><circle cx="660" cy="645" r="46" fill="#d9ceb4"/><circle cx="1060" cy="645" r="46" fill="#d9ceb4"/>${[[660,645],[1060,645]].map(p=>`<g stroke="#2a211a" stroke-width="7">${[0,60,120].map(a=>`<line x1="${p[0]-Math.cos(a*Math.PI/180)*34}" y1="${p[1]-Math.sin(a*Math.PI/180)*34}" x2="${p[0]+Math.cos(a*Math.PI/180)*34}" y2="${p[1]+Math.sin(a*Math.PI/180)*34}"/>`).join('')}</g>`).join('')}<circle cx="70" cy="70" r="16" fill="#d9ceb4" stroke="#2a211a" stroke-width="4"/><circle cx="1650" cy="70" r="16" fill="#d9ceb4" stroke="#2a211a" stroke-width="4"/></svg><h1 data-a>SYNAPSE</h1><div class="sub" data-a>${c.title}</div><div class="lbl" data-a>${c.team.join(' / ')}<br>SUPERVISOR: ${c.sup}<br>${c.uni} · ${c.session}</div><div class="s" data-a>A</div>`,
problem:c=>`<h2 data-a>PROBLEM STATEMENT</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="tp" style="left:${100+i*590}px;--r:${[-1.5,1,-.8][i]}deg" data-a><div class="sd">SIDE ${['A','B','C'][i]}</div><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const top=['learner','frontend','backend','orchestration','analysis'],bot=['explain','inference','storage','delivery','youtube'],pos={};top.forEach((id,i)=>pos[id]=[190+i*340,130]);bot.forEach((id,i)=>pos[id]=[1550-i*340,640]);
 return{W:1740,H:790,shape:'head',edge:'curve',curv:.12,packet:'bar',reveal:'rise',fs:26,pk:6,draw:true,arrow:'none',sz:[250,96],col:cols4('#f4ecd6','#2a211a'),mono:'#6b4a2f',pos,
 deco(g,$){$('rect',{x:80,y:70,width:1580,height:630,rx:300,fill:'none',stroke:'#6b4a2f','stroke-width':16,opacity:.35},g);[[600,385],[1140,385]].forEach((p,i)=>{const r=$('g',{transform:`translate(${p[0]} ${p[1]})`},g);const sp=$('g',{},r);$('circle',{r:110,fill:'#f4ecd6',stroke:'#2a211a','stroke-width':6},sp);$('circle',{r:44,fill:'#2a211a'},sp);[0,60,120,180,240,300].forEach(a=>$('line',{x1:0,y1:0,x2:Math.cos(a*Math.PI/180)*92,y2:Math.sin(a*Math.PI/180)*92,stroke:'#2a211a','stroke-width':7},sp));if(window.gsap)gsap.to(sp,{rotation:360*(i?1:-1),duration:6,repeat:-1,ease:'none',svgOrigin:'0 0'})})}};})()});

/* 20 WAYFINDING ------------------------------------------------- portrait 9:16, stacked signage panels, alternating arrows, side brackets */
CONCEPTS.push({id:'20',name:'Wayfinding Signs',orient:'Portrait 9:16',style:'Stacked sign panels with arrows, side brackets',root:'From the audience: wayfinding. Following signs, not sight.',stage:[1080,1920],anim:'drop',
css:`#stage{background:#12202c;color:#fff;font-family:AtkN}
.sg{position:absolute;left:70px;right:70px;border-radius:14px;padding:0 54px;display:flex;align-items:center;justify-content:space-between}
.yl{background:#FFC72C;color:#111}.gn{background:#0b8f5a;color:#fff}.wh{background:#fff;color:#111}
.logo{position:absolute;left:80px;top:80px;height:56px}
.t1{top:220px;height:430px;font:700 250px/1 BarlowC;text-transform:uppercase;letter-spacing:-.02em}
.t2{top:690px;height:300px;font:700 62px/1.15 BarlowC;text-transform:uppercase;display:block;padding-top:44px}
.ar{width:110px;height:110px;flex:none}
.tm{font:600 52px BarlowC;text-transform:uppercase;height:120px}
h2{position:absolute;left:80px;top:90px;font:700 130px/1 BarlowC;text-transform:uppercase}.lead2{position:absolute;left:84px;top:250px;width:900px;font:400 40px/1.35 AtkN;color:#cdd9e3}
.st{height:420px;font:700 250px/1 BarlowC}.st small{font:700 56px BarlowC;margin-left:12px}.st p{font:600 44px/1.2 BarlowC;max-width:420px;text-transform:uppercase}
#dsvg{position:absolute;left:40px;top:60px;width:1000px;height:1500px}
.cap{position:absolute;left:80px;right:80px;bottom:70px;border-top:6px solid #FFC72C;padding-top:20px}#capS{font:600 30px BarlowC;color:#FFC72C;letter-spacing:.1em;text-transform:uppercase}#capT{font:700 82px/1 BarlowC;text-transform:uppercase}#capD{font:400 32px/1.4 AtkN;color:#cdd9e3;margin-top:8px}
.bx{fill:#FFC72C;stroke:none}.num{font:700 52px BarlowC;fill:#111}.ac{stroke:#111;stroke-width:12;stroke-linecap:round;stroke-linejoin:round}.node.lit .bx{fill:#fff}.lb{font:700 46px BarlowC;fill:#111;text-transform:uppercase}.edge{stroke:#FFC72C;stroke-width:5;opacity:.4}.edge.on{stroke:#fff;opacity:1;stroke-width:8}.edge.done{opacity:.7}.pks{stroke:#fff;stroke-width:6}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-white.svg" alt=""><div class="sg yl t1" data-a>Synapse<svg class="ar" viewBox="0 0 110 110"><path d="M20 55H88M58 22L90 55L58 88" stroke="#111" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="sg gn t2" data-a>${c.title}</div>
${c.team.map((t,i)=>`<div class="sg wh tm" style="top:${1030+i*150}px" data-a><span>${t}</span><span>${['Leader','Member','Member'][i]}</span></div>`).join('')}<div class="sg yl tm" style="top:1500px;height:150px" data-a><span>Supervisor</span><span>${c.sup}</span></div><div class="sg gn tm" style="top:1690px;height:110px;font-size:36px" data-a><span>${c.uni}</span><span>${c.session}</span></div>`,
problem:c=>`<h2 data-a>Problem<br>statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="sg ${['yl','gn','wh'][i]} st" style="top:${470+i*470}px" data-a><div>${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const ord=['youtube','learner','frontend','backend','orchestration','analysis','explain','inference','storage','delivery'],pos={},dir={};ord.forEach((id,i)=>{pos[id]=[500,70+i*150];dir[id]=i%2?'l':'r'});
 return{W:1000,H:1500,shape:'sign',edge:'elbow',packet:'chevron',reveal:'drop',fs:46,pk:12,draw:true,arrow:'tri',ah:7,sz:[680,112],dir,col:cols4('#FFC72C','#FFC72C'),mono:'#FFC72C',pos,
 route(id,S,T,sg,nodes,anchor,poly){const ia=ord.indexOf(S.id),ib=ord.indexOf(T.id),span=Math.abs(ia-ib);if(span===1){const down=ib>ia,o=sg*22;return`M${S.p[0]+o} ${S.p[1]+(down?56:-56)} L${T.p[0]+o} ${T.p[1]+(down?-56:56)}`}
  const left=ia%2===0,x=left?S.p[0]-340:S.p[0]+340,off=(left?-1:1)*(34+span*9);return poly([[x,S.p[1]],[x+off,S.p[1]],[x+off,T.p[1]],[x,T.p[1]]],16,false);}};})()});
