/* concepts 11-15 */
const cols3=(f,k)=>({user:[f,k],frontend:[f,k],backend:[f,k],multimodal:[f,k],inference:[f,k],storage:[f,k],external:[f,k]});

/* 11 RADIO DIAL ------------------------------------------------ landscape, semicircular scale, tick labels, sweeping needle */
CONCEPTS.push({id:'11',name:'Radio Dial',orient:'Landscape 16:9',style:'Semicircular dial, tick labels, needle sweeps',root:'From the product: audio. Tuning in to a lecture like a radio station.',stage:[1920,1080],anim:'scale',
css:`#stage{background:radial-gradient(1200px 800px at 50% 100%,#3a2a1e,#241810);color:#f0e2bd;font-family:Bebas}
.dial{position:absolute;left:210px;top:160px;width:1500px;height:900px}
.logo{position:absolute;left:100px;top:70px;height:54px}
h1{position:absolute;left:0;right:0;top:470px;text-align:center;font:400 260px/1 Bebas;letter-spacing:.04em;color:#f0e2bd}
.sub{position:absolute;left:0;right:0;top:760px;text-align:center;font:400 40px/1.3 AtkN;color:#d8c9a0}
.cr{position:absolute;left:0;right:0;bottom:60px;text-align:center;font:400 28px/1.6 AtkN;color:#d8c9a0}.cr b{font:400 34px Bebas;letter-spacing:.14em;color:#e84c3d}
h2{position:absolute;left:100px;top:70px;font:400 110px Bebas;letter-spacing:.03em}.lead2{position:absolute;left:104px;top:190px;font:400 32px AtkN;color:#d8c9a0}
.ga{position:absolute;top:330px;width:520px;text-align:center}.ga .ring{width:520px;height:520px;border-radius:50%;border:8px solid #f0e2bd;background:repeating-conic-gradient(from -135deg,#f0e2bd 0 1deg,transparent 1deg 9deg);-webkit-mask:radial-gradient(circle,transparent 0 78%,#000 78%);mask:radial-gradient(circle,transparent 0 78%,#000 78%)}
.ga .n{position:absolute;left:0;right:0;top:130px;font:400 200px/1 Bebas;color:#f0e2bd}.ga .n small{font:400 48px Bebas;margin-left:8px;color:#e84c3d}.ga p{position:absolute;left:30px;right:30px;top:340px;font:400 27px/1.3 AtkN;color:#d8c9a0}
.nd{position:absolute;left:259px;top:20px;width:6px;height:250px;background:#e84c3d;transform-origin:50% 100%;border-radius:3px}
#dsvg{position:absolute;left:20px;top:40px;width:1880px;height:800px;--pkc:#e84c3d}
.cap{position:absolute;left:100px;bottom:44px;width:1700px;text-align:center}#capS{font:400 30px Bebas;letter-spacing:.14em;color:#e84c3d}#capT{font:400 84px Bebas;letter-spacing:.03em}#capD{font:400 26px/1.4 AtkN;color:#d8c9a0;max-width:1300px;margin:0 auto}
.bx{fill:#f0e2bd;stroke:none}.node.lit .bx{fill:#e84c3d}.ul{stroke:#f0e2bd;stroke-width:2}.lb{font:400 30px Bebas;letter-spacing:.06em;fill:#f0e2bd}.edge{stroke:#d8c9a0;stroke-width:1.8;opacity:.3}.edge.on{stroke:#e84c3d;opacity:1;stroke-width:3}.pks{stroke:#e84c3d;stroke-width:3}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-white.svg" alt=""><svg class="dial" viewBox="0 0 1500 900" data-a><path d="M60 880A690 690 0 0 1 1440 880" fill="none" stroke="#f0e2bd" stroke-width="8"/><path d="M130 880A620 620 0 0 1 1370 880" fill="none" stroke="#f0e2bd" stroke-width="2"/>${[...Array(61)].map((_,i)=>{const a=Math.PI+i/60*Math.PI,r1=620,r2=i%5?650:690;return`<line x1="${750+Math.cos(a)*r1}" y1="${880+Math.sin(a)*r1}" x2="${750+Math.cos(a)*r2}" y2="${880+Math.sin(a)*r2}" stroke="#f0e2bd" stroke-width="${i%5?2:4}"/>`}).join('')}<line x1="750" y1="880" x2="${750+Math.cos(Math.PI*1.34)*640}" y2="${880+Math.sin(Math.PI*1.34)*640}" stroke="#e84c3d" stroke-width="7" stroke-linecap="round"/></svg><h1 data-a>Synapse</h1><div class="sub" data-a>${c.title}</div><div class="cr" data-a><b>TUNED BY</b> ${c.team.join(' · ')}<br><b>SUPERVISOR</b> ${c.sup} · ${c.uni} · ${c.session}</div>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="ga" style="left:${100+i*600}px" data-a><div class="ring"></div><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const ord=['youtube','learner','frontend','backend','orchestration','analysis','explain','inference','storage','delivery'],cx=940,cy=700,R=560,pos={},ang={};ord.forEach((id,i)=>{const a=Math.PI*1.04+Math.PI*0.92*(i/9);pos[id]=[cx+Math.cos(a)*R,cy+Math.sin(a)*R];ang[id]=a;});
 return{W:1880,H:800,shape:'tick',edge:'curve',curv:.4,packet:'needle',reveal:'scale',fs:30,pk:6,draw:true,arrow:'none',sz:[14,14],col:cols3('#f0e2bd','#f0e2bd'),mono:'#d8c9a0',pos,ang,tickR:46,pivot:[cx,cy],
 deco(g,$){$('path',{d:`M${cx-R-60} ${cy}A${R+60} ${R+60} 0 0 1 ${cx+R+60} ${cy}`,fill:'none',stroke:'#f0e2bd','stroke-width':3,opacity:.5},g);$('circle',{cx,cy,r:16,fill:'#e84c3d'},g)}};})()});

/* 12 COCHLEA --------------------------------------------------- portrait 4:5, spiral layout, numbered stops, ripple packets */
CONCEPTS.push({id:'12',name:'Cochlea',orient:'Portrait 4:5',style:'Spiral layout, numbered stops, ripples',root:'From the audience: hearing. Sound travels the spiral of the inner ear.',stage:[1200,1500],anim:'fade',
css:`#stage{background:#0f2b33;color:#f1e8d8;font-family:AtkN}
.sp{position:absolute;left:50px;top:90px;width:1100px;height:1100px}
.logo{position:absolute;left:80px;top:70px;height:54px}
h1{position:absolute;left:0;right:0;top:560px;text-align:center;font:400 190px/1 Gloock;letter-spacing:-.03em;color:#f1e8d8}
.sub{position:absolute;left:100px;right:100px;top:1090px;text-align:center;font:400 40px/1.3 AtkN;color:#cdbfa6}
.cr{position:absolute;left:0;right:0;bottom:70px;text-align:center;font:400 28px/1.6 AtkN;color:#cdbfa6}.cr b{color:#ff8f6b;font-weight:700}
h2{position:absolute;left:80px;top:80px;font:400 90px Gloock}.lead2{position:absolute;left:84px;top:200px;width:700px;font:400 34px/1.35 AtkN;color:#cdbfa6}
.sq{position:absolute;left:80px;right:80px}.sq .n{font:400 220px/1 Gloock;color:#ff8f6b;letter-spacing:-.03em}.sq .n small{font:400 46px Gloock;color:#f1e8d8;margin-left:12px;letter-spacing:0}.sq p{font:400 32px/1.35 AtkN;color:#f1e8d8;max-width:620px;margin-top:-6px}
.sc{position:absolute;right:-120px;top:380px;width:700px;height:700px;opacity:.9}
#dsvg{position:absolute;left:50px;top:70px;width:1100px;height:1000px;--pkc:#ff8f6b}
.cap{position:absolute;left:80px;right:80px;bottom:60px;border-top:2px solid #ff8f6b;padding-top:18px}#capS{font:700 24px AtkN;color:#ff8f6b}#capT{font:400 60px Gloock}#capD{font:400 26px/1.4 AtkN;color:#cdbfa6}
.bx{fill:#0f2b33;stroke:#ff8f6b;stroke-width:3}.node.lit .bx{fill:#ff8f6b}.num{font:700 20px AtkN;fill:#f1e8d8}.node.lit .num{fill:#0f2b33}.lb{font:600 24px AtkN;fill:#f1e8d8}.edge{stroke:#f1e8d8;stroke-width:2;opacity:.25}.edge.on{stroke:#ff8f6b;opacity:1;stroke-width:3.4}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-white.svg" alt=""><svg class="sp" viewBox="0 0 1100 1100" data-a fill="none" stroke="#ff8f6b" stroke-width="3" opacity=".85">${(function(){let d='M',pts=[];for(let t=0;t<=4.6*Math.PI;t+=.05){const r=520*Math.exp(-0.205*t);pts.push((550+Math.cos(t-1.2)*r).toFixed(1)+' '+(550+Math.sin(t-1.2)*r).toFixed(1))}return `<path d="M${pts.join(' L')}"/>`})()}</svg><h1 data-a>Synapse</h1><div class="sub" data-a>${c.title}</div><div class="cr" data-a><b>${c.team.join(' · ')}</b><br>Supervisor: ${c.sup}<br>${c.uni} · ${c.session}</div>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div><svg class="sc" viewBox="0 0 700 700" data-a fill="none" stroke="#ff8f6b" stroke-width="3" opacity=".45">${(function(){let pts=[];for(let t=0;t<=4.6*Math.PI;t+=.05){const r=340*Math.exp(-0.205*t);pts.push((350+Math.cos(t)*r).toFixed(1)+' '+(350+Math.sin(t)*r).toFixed(1))}return `<path d="M${pts.join(' L')}"/>`})()}</svg>${c.stats.map((s,i)=>`<div class="sq" style="top:${380+i*350}px" data-a><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const ord=['learner','frontend','backend','orchestration','analysis','explain','inference','storage','delivery'],cx=520,cy=500,pos={youtube:[990,70]},dir={youtube:'w'},num={youtube:'▶'};ord.forEach((id,i)=>{const t=i*0.78+0.2,r=430*Math.exp(-0.205*t);const a=t-1.2;pos[id]=[cx+Math.cos(a)*r,cy+Math.sin(a)*r];dir[id]=Math.cos(a)>0?'e':'w';num[id]=i+1;});
 return{W:1100,H:1000,shape:'dotlabel',edge:'curve',curv:.25,packet:'ring',reveal:'fade',fs:24,pk:7,draw:true,arrow:'open',ah:7,sz:[46,46],col:cols3('#0f2b33','#ff8f6b'),mono:'#f1e8d8',pos,dir,num,
 deco(g,$){let pts=[];for(let t=0;t<=4.6*Math.PI;t+=.05){const r=430*Math.exp(-0.205*(t));pts.push((cx+Math.cos(t-1.2)*r).toFixed(1)+' '+(cy+Math.sin(t-1.2)*r).toFixed(1))}$('path',{d:'M'+pts.join(' L'),fill:'none',stroke:'#ff8f6b','stroke-width':2,opacity:.22},g)}};})()});

/* 13 SIGHT TO SOUND -------------------------------------------- landscape, diagonal split, descending staircase, pixel-to-bar nodes */
CONCEPTS.push({id:'13',name:'Sight to Sound',orient:'Landscape 16:9',style:'Descending staircase, pixel nodes, elbow steps',root:'From the mechanism: sight translated to sound.',stage:[1920,1080],anim:'left',
css:`#stage{background:#12141c;color:#fff;font-family:AtkN}
.l{position:absolute;inset:0;clip-path:polygon(0 0,62% 0,38% 100%,0 100%);background:#12141c;background-image:linear-gradient(#262a38 1px,transparent 1px),linear-gradient(90deg,#262a38 1px,transparent 1px);background-size:40px 40px}
.r{position:absolute;inset:0;clip-path:polygon(62% 0,100% 0,100% 100%,38% 100%);background:#ffd84a}
.bars{position:absolute;right:0;bottom:0;width:62%;height:100%;display:flex;align-items:flex-end;gap:10px;padding:0 60px 0 0;opacity:.18}.bars i{flex:1;background:#12141c}
.logo{position:absolute;left:90px;top:70px;height:56px}
h1{position:absolute;left:84px;top:230px;font:400 250px/.9 Archivo;letter-spacing:-.04em;mix-blend-mode:normal}
.sub{position:absolute;left:90px;top:640px;width:900px;font:400 40px/1.3 AtkN}
.cr{position:absolute;right:90px;bottom:70px;text-align:right;font:700 28px/1.5 AtkN;color:#12141c}
h2{position:absolute;left:90px;top:70px;font:400 84px Archivo}.lead2{position:absolute;left:94px;top:190px;font:400 32px AtkN;width:800px}
.px{position:absolute;display:grid;grid-template-columns:repeat(5,26px);gap:4px}.px i{height:26px;background:#ffd84a}.px i.o{background:transparent;outline:2px solid #3a3f55}
.sn{position:absolute;top:330px;width:540px}.sn .n{font:400 190px/1 Archivo;letter-spacing:-.03em}.sn .n small{font:700 34px AtkN;margin-left:10px;letter-spacing:0}.sn p{font:400 30px/1.35 AtkN;margin-top:10px}
#dsvg{position:absolute;left:60px;top:40px;width:1800px;height:800px;--pkc:#ffd84a}
.cap{position:absolute;left:90px;bottom:48px;width:1100px}#capS{font:700 24px AtkN;color:#ffd84a}#capT{font:400 60px Archivo}#capD{font:400 26px/1.4 AtkN;color:#c7c9d6}
.bx{fill:#1b1f2c;stroke:#3a3f55;stroke-width:2}.px{fill:#ffd84a}rect.px{fill:#ffd84a}.ac{fill:#7fe3d2}.node.lit .bx{stroke:#ffd84a;stroke-width:3}.lb{font:700 20px AtkN;fill:#fff}.edge{stroke:#6a6f88;stroke-width:2}.edge.on{stroke:#ffd84a;stroke-width:3.4}`,
title:c=>`<div class="l"></div><div class="r"><div class="bars">${[...Array(40)].map((_,i)=>`<i style="height:${15+Math.abs(Math.sin(i*.7))*70}%"></i>`).join('')}</div></div><img class="logo" data-a src="../Assets/logos/symbol-white.svg" alt=""><h1 data-a>Synapse</h1><div class="sub" data-a>${c.title}</div><div class="cr" data-a>${c.team.join(' · ')}<br>Supervisor: ${c.sup}<br>${c.uni} · ${c.session}</div>`,
problem:c=>`<div class="l" style="clip-path:polygon(0 0,40% 0,22% 100%,0 100%)"></div><h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="sn" style="left:${90+i*620}px" data-a><div class="px">${[...Array(15)].map((_,k)=>`<i class="${(k*7+i*3)%4?'':'o'}"></i>`).join('')}</div><div class="n" style="margin-top:20px">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const ord=['learner','frontend','backend','orchestration','analysis','explain','inference','storage','delivery'],pos={youtube:[1650,70]};ord.forEach((id,i)=>pos[id]=[110+i*178,60+i*84]);
 return{W:1800,H:800,shape:'pixbar',edge:'elbow',packet:'pixbar',reveal:'slide',fs:20,pk:6,draw:true,arrow:'tri',ah:6,sz:[206,70],rad:14,bi:14,col:cols3('#1b1f2c','#ffd84a'),pos};})()});

/* 14 TEXTBOOK PLATE -------------------------------------------- portrait A4, framed enclosures, numbered callouts, thin lines */
CONCEPTS.push({id:'14',name:'Textbook Plate',orient:'Portrait A4',style:'Enclosure boxes, numbered callouts, thin elbows',root:'From the setting: the STEM textbook, Figure 1.',stage:[1240,1754],anim:'rise',
css:`#stage{background:#FDFCF7;color:#1a1a1a;font-family:Caslon}
.rl{position:absolute;left:90px;right:90px;border-top:3px solid #1a1a1a;border-bottom:1px solid #1a1a1a;height:9px}
.logo{position:absolute;left:90px;top:130px;height:50px}
.no{position:absolute;right:90px;top:134px;font:400 22px Plex;color:#555}
h1{position:absolute;left:84px;top:430px;font:400 250px/.95 Caslon;letter-spacing:-.04em}
.sub{position:absolute;left:90px;top:750px;width:900px;font:italic 400 52px/1.3 Caslon;color:#333}
.pub{position:absolute;left:90px;right:90px;bottom:170px;border-top:1px solid #1a1a1a;padding-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:30px;font:400 28px/1.6 Caslon}.pub b{display:block;font:700 18px Plex;letter-spacing:.12em;color:#8a2a10}
h2{position:absolute;left:90px;top:150px;font:700 76px Caslon}.lead2{position:absolute;left:94px;top:260px;width:900px;font:italic 400 38px/1.4 Caslon}
.tbl{position:absolute;left:90px;right:90px;top:520px;border-top:3px solid #1a1a1a;border-bottom:3px solid #1a1a1a}
.tbl .row{display:grid;grid-template-columns:330px 1fr;align-items:center;border-top:1px solid #aaa;padding:34px 0}.tbl .row:first-child{border-top:0}.tbl .n{font:700 150px/1 Caslon;letter-spacing:-.03em}.tbl .n small{font:italic 400 40px Caslon;margin-left:8px}.tbl p{font:400 38px/1.4 Caslon}
.capt{position:absolute;left:90px;right:90px;top:1220px;font:italic 400 30px/1.4 Caslon;color:#444}.capt b{font-style:normal}
#dsvg{position:absolute;left:70px;top:110px;width:1100px;height:1180px}
.cap{position:absolute;left:90px;right:90px;top:1330px;border-top:1px solid #1a1a1a;padding-top:16px}#capS{font:700 20px Plex;letter-spacing:.1em;color:#8a2a10}#capT{font:700 54px Caslon;margin-top:2px}#capD{font:400 30px/1.45 Caslon;color:#333;margin-top:6px}
.bx{fill:#fff;stroke:#1a1a1a;stroke-width:1.8}.ac{fill:#1a1a1a}.node.lit .bx{fill:#f7e6c2;stroke-width:3}.num{font:700 17px Plex;fill:#fff}.lb{font:700 23px Caslon;fill:#1a1a1a}.edge{stroke:#1a1a1a;stroke-width:1.5;opacity:.45}.edge.on{stroke:#8a2a10;stroke-width:3;opacity:1}`,
title:c=>`<div class="rl" style="top:90px"></div><img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><div class="no" data-a>FINAL YEAR PROJECT</div><h1 data-a>Synapse</h1><div class="sub" data-a>${c.title}</div><div class="pub" data-a><div><b>AUTHORS</b>${c.team.join('<br>')}</div><div><b>SUPERVISOR</b>${c.sup}<br>${c.uni}<br>${c.session}</div></div><div class="rl" style="bottom:110px"></div>`,
problem:c=>`<div class="rl" style="top:90px"></div><h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead} For blind and low-vision students, much of it never arrives.</div><div class="tbl" data-a>${c.stats.map((s,i)=>`<div class="row"><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}.</p></div>`).join('')}</div><div class="capt" data-a><b>Table 1.</b> Scale of the problem. Sources: WHO estimates (Pascolini &amp; Mariotti, 2012); Human-AI Systems for Video Accessibility.</div>`,
arch:c=>`<div class="rl" style="top:90px"></div><svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1100,H:1180,shape:'callout',edge:'elbow',packet:'square',reveal:'rise',fs:21,pk:5,draw:true,arrow:'open',ah:7,sz:[190,86],rad:10,bi:12,col:cols3('#fff','#1a1a1a'),mono:'#1a1a1a',
 pos:{youtube:[130,170],learner:[380,170],frontend:[640,170],delivery:[920,170],backend:[170,560],orchestration:[550,560],storage:[920,560],analysis:[170,960],explain:[550,960],inference:[920,960]},
 deco(g,$){[['EXTERNAL / CLIENT',30,50,1040,260],['SERVER',30,420,1040,260],['MODELS & ANALYSIS',30,820,1040,260]].forEach(b=>{$('rect',{x:b[1],y:b[2],width:b[3],height:b[4],fill:'none',stroke:'#1a1a1a','stroke-width':1.6,'stroke-dasharray':'8 6'},g);const t=$('text',{x:b[1]+14,y:b[2]+26,fill:'#8a2a10'},g);t.textContent=b[0];t.setAttribute('style','font:700 17px Plex;letter-spacing:.12em')})}}});

/* 15 LAB NOTEBOOK ---------------------------------------------- landscape, graph paper, wave path, circled labels, pencil sketch */
CONCEPTS.push({id:'15',name:'Lab Notebook',orient:'Landscape 16:9',style:'Wavy path, circled labels, pencil sketch lines',root:'From the setting: the student lab notebook.',stage:[1920,1080],anim:'clip',
css:`#stage{background:#F6F4EA;color:#23314a;font-family:Caveat;background-image:linear-gradient(#cfdcec 1px,transparent 1px),linear-gradient(90deg,#cfdcec 1px,transparent 1px);background-size:40px 40px}
#stage::before{content:"";position:absolute;left:150px;top:0;bottom:0;width:3px;background:#e9a0a0}
.logo{position:absolute;right:100px;top:60px;height:52px}
h1{position:absolute;left:200px;top:160px;font:700 300px/.95 Caveat;color:#23314a;transform:rotate(-2deg)}
.ul{position:absolute;left:200px;top:520px;width:1000px}
.sub{position:absolute;left:210px;top:570px;width:1100px;font:400 62px/1.15 Caveat;color:#3b4f73}
.cr{position:absolute;left:210px;bottom:90px;font:400 46px/1.2 Caveat}.cr span{color:#b3382e}
.eq{position:absolute;right:120px;top:300px;width:520px;transform:rotate(3deg)}
h2{position:absolute;left:200px;top:70px;font:700 120px/1 Caveat}.lead2{position:absolute;left:210px;top:210px;font:400 56px Caveat;color:#3b4f73}
.nt{position:absolute;top:360px;width:500px;text-align:center}.nt .n{font:700 280px/.9 Caveat;color:#b3382e;transform:rotate(-3deg)}.nt .n small{font:700 64px Caveat;color:#23314a}.nt p{font:400 52px/1.15 Caveat;margin-top:10px}
#dsvg{position:absolute;left:90px;top:40px;width:1740px;height:760px;--pkc:#b3382e}
.cap{position:absolute;left:210px;bottom:50px;width:1500px}#capS{font:400 42px Caveat;color:#b3382e}#capT{font:700 92px/1 Caveat}#capD{font:400 44px/1.15 Caveat;color:#3b4f73;max-width:1300px}
.bx{fill:rgba(255,255,255,.6);stroke:#23314a;stroke-width:3}.node.lit .bx{fill:#ffe9a8;stroke:#b3382e;stroke-width:4}.lb{font:700 34px Caveat;fill:#23314a}.edge{stroke:#6a7690;stroke-width:3;filter:url(#rough);opacity:.5}.edge.on{stroke:#b3382e;opacity:1;stroke-width:4.5}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><h1 data-a>Synapse</h1><svg class="ul" viewBox="0 0 1000 40" data-a><path d="M4 22C150 6 340 36 500 18S820 10 996 24" stroke="#b3382e" stroke-width="7" fill="none" stroke-linecap="round"/></svg><div class="sub" data-a>${c.title}</div><div class="cr" data-a>by <span>${c.team.join(', ')}</span><br>supervised by ${c.sup}<br>${c.uni} · ${c.session}</div>
<svg class="eq" viewBox="0 0 520 380" data-a fill="none" stroke="#23314a" stroke-width="5" stroke-linecap="round"><circle cx="110" cy="190" r="46"/><path d="M156 190H350"/><circle cx="370" cy="190" r="16" fill="#b3382e" stroke="none"/><path d="M400 190l-26 -26M400 190l-26 26M400 190H470" stroke="#b3382e"/><path d="M80 150l-44 -50M78 226l-44 60M112 144l-8 -70"/></svg>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="nt" style="left:${200+i*560}px" data-a><div class="n">${s[0]}<small> ${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const ord=['learner','frontend','backend','orchestration','analysis','explain','inference','storage','delivery'],pos={youtube:[880,70]};ord.forEach((id,i)=>pos[id]=[150+i*184,400+Math.sin(i*0.95)*200]);
 return{W:1740,H:760,shape:'circled',edge:'curve',curv:.3,packet:'pencil',reveal:'fade',fs:34,pk:7,draw:true,arrow:'open',ah:9,roughScale:6,sz:[190,92],bi:12,col:cols3('#fff','#23314a'),mono:'#6a7690',pos};})()});
