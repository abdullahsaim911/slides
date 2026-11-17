/* concepts 06-10 */
const cols2=(f,k)=>({user:[f,k],frontend:[f,k],backend:[f,k],multimodal:[f,k],inference:[f,k],storage:[f,k],external:[f,k]});

/* 06 A11Y TREE ------------------------------------------------- landscape light, indented tree rows, right-side arc links, square focus packets */
CONCEPTS.push({id:'06',name:'Accessibility Tree',orient:'Landscape 16:9',style:'Indented tree rows, role chips, arc links',root:'From the audience tools: the accessibility tree a screen reader walks.',stage:[1920,1080],anim:'left',
css:`#stage{background:#F3F5FA;color:#101828;font-family:AtkN}
.top{position:absolute;left:0;right:0;top:0;height:64px;background:#fff;border-bottom:1px solid #d0d5dd;display:flex;align-items:center;gap:14px;padding:0 40px;font:400 20px Plex;color:#475467}.top i{width:14px;height:14px;border-radius:50%;background:#d0d5dd}
.logo{position:absolute;left:100px;top:130px;height:56px}
h1{position:absolute;left:94px;top:230px;font:700 230px/.95 AtkN;letter-spacing:-.05em;color:#0b57d0}
.sub{position:absolute;left:100px;top:540px;width:880px;font:400 40px/1.3 AtkN;color:#344054}
.tree{position:absolute;left:1040px;top:130px;width:780px;background:#fff;border:1px solid #d0d5dd;border-radius:10px;padding:26px 30px;font:400 22px/1.75 Plex;color:#101828}
.tree .k{color:#0b57d0}.tree .s{color:#067647}.tree .d{color:#667085}.tree div{white-space:nowrap}
.foc{outline:3px solid #0b57d0;outline-offset:3px;border-radius:4px}
h2{position:absolute;left:100px;top:110px;font:700 64px AtkN;color:#101828}.lead2{position:absolute;left:104px;top:196px;font:400 32px AtkN;color:#475467}
.tb{position:absolute;left:100px;right:100px;top:300px;background:#fff;border:1px solid #d0d5dd;border-radius:10px;overflow:hidden}
.tr{display:grid;grid-template-columns:230px 1fr 520px;align-items:center;border-top:1px solid #d0d5dd;padding:30px 36px;font:400 24px Plex}.tr:first-child{border-top:0;background:#F9FAFB;font-size:19px;color:#667085;padding:16px 36px}
.tr .v{font:700 130px/1 AtkN;color:#0b57d0;letter-spacing:-.04em}.tr .v small{font:600 30px AtkN;color:#067647;margin-left:8px}.tr p{font:400 30px/1.35 AtkN;color:#101828}.tr .r{color:#067647}
#dsvg{position:absolute;left:60px;top:90px;width:1000px;height:740px;--pkc:#0b57d0}
.cap{position:absolute;left:1120px;top:120px;width:700px;background:#fff;border:1px solid #d0d5dd;border-radius:10px;padding:34px 36px}#capS{font:400 22px Plex;color:#067647}#capT{font:700 46px/1.1 AtkN;color:#101828;margin-top:8px}#capD{font:400 27px/1.45 AtkN;color:#475467;margin-top:14px}
.bx{fill:#fff;stroke:#d0d5dd;stroke-width:1.6}.ac{fill:#0b57d0}.node.lit .bx{stroke:#0b57d0;stroke-width:3.5;fill:#EEF4FF}.lb{font:600 24px AtkN;fill:#101828}.sb{font:400 17px Plex;fill:#067647}.edge{stroke:#98a2b3;stroke-width:2}.edge.on{stroke:#0b57d0;stroke-width:3.4}`,
title:c=>`<div class="top"><i></i><i></i><i></i>&nbsp; accessibility inspector — synapse</div><img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><h1 data-a>Synapse</h1><div class="sub" data-a>${c.title}</div>
<div class="tree" data-a><div><span class="d">▾</span> <span class="k">document</span> <span class="s">"Synapse"</span></div><div>&nbsp;&nbsp;<span class="d">▾</span> <span class="k">main</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">heading</span> <span class="s">"${c.title}"</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="d">▾</span> <span class="k">group</span> <span class="s">"Team"</span></div>${c.team.map(t=>`<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">listitem</span> <span class="s foc">"${t}"</span></div>`).join('')}<div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">group</span> <span class="s">"Supervisor: ${c.sup}"</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">contentinfo</span> <span class="s">"${c.uni}, ${c.session}"</span></div></div>`,
problem:c=>`<div class="top"><i></i><i></i><i></i>&nbsp; accessibility inspector — problem</div><h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>
<div class="tb" data-a><div class="tr"><span>role</span><span>value</span><span>name</span></div>${c.stats.map((s,i)=>`<div class="tr"><span class="r">${['statistic','statistic','meter'][i]}</span><span class="v">${s[0]}<small>${s[1]}</small></span><p>${s[2]}</p></div>`).join('')}</div>`,
arch:c=>`<div class="top"><i></i><i></i><i></i>&nbsp; accessibility inspector — architecture</div><svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const ord=['learner','frontend','youtube','backend','delivery','orchestration','storage','analysis','explain','inference'],dep={learner:0,frontend:1,youtube:2,backend:1,delivery:2,orchestration:2,storage:3,analysis:3,explain:3,inference:4},pos={};ord.forEach((id,i)=>pos[id]=[330+dep[id]*30,34+i*68]);
 return{W:1000,H:740,shape:'row',edge:'arc',packet:'square',reveal:'slide',fs:24,pk:6,draw:true,arrow:'open',ah:8,sz:[560,54],col:cols2('#0b57d0','#98a2b3'),mono:'#98a2b3',pos,
 deco(g,$){ord.forEach((id,i)=>{$('line',{x1:30+dep[id]*30,x2:30+dep[id]*30,y1:34+i*68-34,y2:34+i*68,stroke:'#d0d5dd','stroke-width':2},g)})},
 route(id,S,T,sg,nodes){const xr=Math.max(S.p[0],T.p[0])+320,ya=S.p[1],yb=T.p[1],R=Math.max(40,Math.abs(yb-ya)*.6),o=sg*8;return`M${S.p[0]+280} ${ya+o} A${R} ${R} 0 0 ${yb>ya?1:0} ${T.p[0]+280} ${yb+o}`;}};})()});

/* 07 TACTILE GRAPHIC ------------------------------------------- square 1:1, cross layout, textured shapes, thick ribbons, knob packets */
CONCEPTS.push({id:'07',name:'Tactile Graphic',orient:'Square 1:1',style:'Textured raised shapes, thick ribbon lines',root:'From the audience: tactile graphics, diagrams made to be felt.',stage:[1200,1200],anim:'scale',
css:`#stage{background:#fff;color:#000;font-family:AtkN}
svg.dg{--pkc:#000;--pkb:#fff}
.frame{position:absolute;inset:36px;border:8px solid #000;pointer-events:none}
.ring{position:absolute;left:170px;top:170px;width:860px;height:860px;border-radius:50%;border:10px solid #000;background:repeating-radial-gradient(circle at 50% 50%,#000 0 2.5px,transparent 2.5px 24px);opacity:.9}
.core{position:absolute;left:260px;top:430px;width:680px;height:340px;background:#fff;border:8px solid #000;display:grid;place-content:center;text-align:center}
.core h1{font:400 150px/1 Archivo;letter-spacing:-.03em}.core p{font:700 24px AtkN;margin-top:10px;max-width:600px}
.logo{position:absolute;left:80px;top:80px;height:60px}
.cr{position:absolute;right:80px;bottom:76px;text-align:right;font:700 26px/1.5 AtkN}
.sub{position:absolute;left:80px;top:150px;width:300px;font:700 22px/1.35 AtkN}
h2{position:absolute;left:80px;top:80px;font:400 84px Archivo}.lead2{position:absolute;left:84px;top:190px;width:800px;font:700 30px/1.3 AtkN}
.blk{position:absolute;width:320px}.sq{height:320px;border:8px solid #000;margin-bottom:0}
.pl{background:#fff;border:6px solid #000;border-top:0;padding:14px 16px;font:700 28px/1.2 AtkN;min-height:140px}.pl b{display:block;font:400 76px Archivo;line-height:1}.pl b small{font:700 28px AtkN;margin-left:6px}
#dsvg{position:absolute;left:60px;top:90px;width:1080px;height:880px}
.cap{position:absolute;left:80px;bottom:44px;width:1040px;border-top:8px solid #000;padding-top:12px}#capS{font:700 22px AtkN}#capT{font:400 46px Archivo}#capD{font:700 22px/1.3 AtkN;max-width:960px}
.bx{stroke:#000;stroke-width:6}.plate{fill:#fff;stroke:#000;stroke-width:4}.lb{font:700 22px AtkN;fill:#000}.node.lit .bx{stroke-width:10}.edge{stroke:#000;stroke-width:9;stroke-linecap:round;opacity:.28}.edge.on{opacity:1;stroke-width:13}.edge.done{opacity:.6}`,
title:c=>`<div class="frame"></div><img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><div class="ring" data-a></div><div class="core" data-a><h1>Synapse</h1><p>${c.title}</p></div><div class="cr" data-a>${c.team.join('<br>')}<br>Supervisor: ${c.sup}<br>${c.session}</div>`,
problem:c=>`<div class="frame"></div><h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="blk" style="left:${[70,440,810][i]}px;top:${[330,450,330][i]}px" data-a><div class="sq" style="background:${['repeating-linear-gradient(45deg,#000 0 3px,#fff 3px 14px)','radial-gradient(#000 3.5px,transparent 4px) 0 0/20px 20px','repeating-linear-gradient(0deg,#000 0 4px,#fff 4px 16px)'][i]}"></div><div class="pl"><b>${s[0]}<small>${s[1]}</small></b>${s[2]}</div></div>`).join('')}`,
arch:c=>`<div class="frame"></div><svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1080,H:880,shape:'texture',edge:'ribbon',packet:'knob',reveal:'pop',fs:22,pk:7,draw:true,arrow:'none',sz:[190,120],pats:['p-dots','p-hatch','p-cross','p-wave','p-vert'],col:cols2('#000','#000'),mono:'#000',
 pos:{learner:[130,80],frontend:[130,290],backend:[360,430],orchestration:[590,350],analysis:[880,320],youtube:[930,60],explain:[800,570],inference:[940,760],storage:[470,730],delivery:[150,640]},size:{orchestration:[220,140]},
 defs(d,$){const P=(id,w,h,inner)=>{const p=$('pattern',{id,width:w,height:h,patternUnits:'userSpaceOnUse'},d);p.innerHTML=inner};P('p-dots',18,18,'<rect width="18" height="18" fill="#fff"/><circle cx="9" cy="9" r="3.4" fill="#000"/>');P('p-hatch',14,14,'<rect width="14" height="14" fill="#fff"/><path d="M-2 16L16 -2" stroke="#000" stroke-width="3"/>');P('p-cross',16,16,'<rect width="16" height="16" fill="#fff"/><path d="M0 8H16M8 0V16" stroke="#000" stroke-width="2.6"/>');P('p-wave',24,14,'<rect width="24" height="14" fill="#fff"/><path d="M0 7Q6 0 12 7T24 7" stroke="#000" stroke-width="2.6" fill="none"/>');P('p-vert',12,12,'<rect width="12" height="12" fill="#fff"/><path d="M6 0V12" stroke="#000" stroke-width="4"/>');}}});

/* 08 METRO MAP ------------------------------------------------- landscape, octilinear lines, station dots, train packets */
CONCEPTS.push({id:'08',name:'Metro Map',orient:'Landscape 16:9',style:'Octilinear transit lines, stations, trains',root:'From the audience: wayfinding. The learner navigates by route, not by sight.',stage:[1920,1080],anim:'left',
css:`#stage{background:#F4F1E8;color:#161616;font-family:AtkN}
.logo{position:absolute;left:100px;top:70px;height:58px}
.rt{position:absolute;left:0;top:560px;width:1920px;height:260px}
h1{position:absolute;left:96px;top:150px;font:700 210px/.95 BarlowC;text-transform:uppercase;letter-spacing:-.01em}
.sign{position:absolute;left:100px;top:420px;background:#362CAC;color:#fff;font:700 54px BarlowC;padding:6px 30px;border-radius:10px;text-transform:uppercase;letter-spacing:.04em}
.sub{position:absolute;left:100px;top:880px;width:900px;font:400 34px/1.3 AtkN}
.stops{position:absolute;left:1180px;top:100px;font:600 30px/1.2 BarlowC;width:640px;text-transform:uppercase}.stops li{list-style:none;padding:0 0 22px 56px;position:relative;letter-spacing:.04em}.stops li::before{content:"";position:absolute;left:14px;top:2px;width:22px;height:22px;border:6px solid #161616;border-radius:50%;background:#fff}.stops li::after{content:"";position:absolute;left:23px;top:26px;width:6px;height:44px;background:#362CAC}.stops li:last-child::after{display:none}.stops small{display:block;font:400 22px AtkN;text-transform:none;color:#444;letter-spacing:0;margin-top:4px}
h2{position:absolute;left:100px;top:76px;font:700 88px BarlowC;text-transform:uppercase}.lead2{position:absolute;left:104px;top:190px;font:400 32px AtkN;color:#444}
.ln{position:absolute;left:0;right:0;top:420px;height:14px}
.stn{position:absolute;top:350px;width:520px}.stn .n{font:700 210px/1 BarlowC;letter-spacing:-.02em}.stn .n small{font:700 52px BarlowC;margin-left:10px}.stn p{font:400 32px/1.35 AtkN;margin-top:12px;max-width:440px}.dot{position:absolute;top:410px;width:44px;height:44px;border:10px solid #161616;border-radius:50%;background:#fff}
#dsvg{position:absolute;left:80px;top:60px;width:1760px;height:760px;--pkc:#161616;--pkb:#fff}
.cap{position:absolute;left:100px;bottom:48px;width:1700px}#capS{font:600 24px BarlowC;color:#D4366F;text-transform:uppercase;letter-spacing:.08em}#capT{font:700 64px BarlowC;text-transform:uppercase}#capD{font:400 26px/1.4 AtkN;color:#444;max-width:1250px}
.bx{fill:#fff;stroke:#161616;stroke-width:7}.node.lit .bx{fill:#FFD84A}.lb{font:600 26px BarlowC;fill:#161616;text-transform:uppercase;letter-spacing:.03em}.edge{stroke-width:11;stroke-linecap:round;stroke-linejoin:round;opacity:.3}.edge.on{opacity:1;stroke-width:13}.edge.done{opacity:.7}.pk{stroke:#fff;stroke-width:2}`,
title:c=>`<img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><h1 data-a>Synapse</h1><div class="sign" data-a>Line 1 · Final Year Project</div>
<svg class="rt" viewBox="0 0 1920 260" data-a><path d="M0 130H620L760 40H1240L1380 130H1920" stroke="#362CAC" stroke-width="22" fill="none" stroke-linejoin="round"/><path d="M200 130L330 230H900L1030 130" stroke="#D4366F" stroke-width="22" fill="none" stroke-linejoin="round"/>${[[120,130],[620,130],[1000,40],[1380,130],[1760,130],[330,230],[900,230]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="22" fill="#fff" stroke="#161616" stroke-width="10"/>`).join('')}</svg>
<div class="sub" data-a>${c.title}</div><ul class="stops" data-a>${c.team.map((t,i)=>`<li>${t}<small>${['Group leader','Team member','Team member'][i]}</small></li>`).join('')}<li>${c.sup}<small>Supervisor · ${c.uni} · ${c.session}</small></li></ul>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div><svg class="ln" viewBox="0 0 1920 14" data-a><rect y="0" width="1920" height="14" fill="#D4366F"/></svg>${c.stats.map((s,i)=>`<div class="dot" style="left:${[130,770,1410][i]}px" data-a></div><div class="stn" style="left:${[100,740,1380][i]}px;top:490px" data-a><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1760,H:760,shape:'station',edge:'metro',packet:'train',reveal:'slide',fs:26,pk:7,draw:true,arrow:'none',sz:[30,30],
 col:{user:['#362CAC','#362CAC'],frontend:['#362CAC','#362CAC'],backend:['#362CAC','#362CAC'],multimodal:['#D4366F','#D4366F'],inference:['#E0A100','#E0A100'],storage:['#0aa595','#0aa595'],external:['#666','#666']},
 pos:{learner:[110,280],frontend:[420,280],backend:[730,280],orchestration:[1040,280],analysis:[1340,280],youtube:[1620,120],explain:[1270,560],inference:[1600,640],storage:[900,640],delivery:[560,640]},
 dir:{learner:'n',frontend:'n',backend:'n',orchestration:'n',analysis:'n',youtube:'s',explain:'n',inference:'n',storage:'s',delivery:'s'}}});

/* 09 PATCH BAY ------------------------------------------------- landscape dark rack, two rows of panels, sagging coloured cables */
CONCEPTS.push({id:'09',name:'Patch Bay',orient:'Landscape 16:9',style:'Rack panels with jacks, sagging cables',root:'From the product: audio routing, the studio patch bay.',stage:[1920,1080],anim:'drop',
css:`#stage{background:#1d1f24;color:#e8e6df;font-family:BarlowC;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.015) 0 2px,transparent 2px 6px)}
.rk{position:absolute;left:0;top:0;width:96px;height:100%;background:#15161a;border-right:2px solid #34363e}.rk2{left:auto;right:0;border-left:2px solid #34363e;border-right:0}
.rk i{position:absolute;left:40px;width:16px;height:16px;border-radius:50%;background:#34363e;box-shadow:inset 0 2px 3px #000}
.pn{position:absolute;left:140px;right:140px;background:#2a2c33;border:2px solid #3b3e48;border-radius:4px}
.pn h1{position:absolute;left:50px;top:30px;font:400 250px/.9 Bebas;letter-spacing:.02em;color:#f3efe2}
.jk{position:absolute;display:flex;gap:26px}.jk i{width:46px;height:46px;border-radius:50%;background:#101114;border:5px solid #888;box-shadow:inset 0 0 0 6px #000}
.lbl{position:absolute;background:#e9e2c9;color:#1d1f24;font:600 24px BarlowC;padding:4px 14px;text-transform:uppercase;letter-spacing:.08em}
.logo{position:absolute;left:190px;top:60px;height:52px}
.sub{position:absolute;left:190px;top:700px;width:1000px;font:400 36px/1.3 AtkN;color:#cfcdc4}
.cr{position:absolute;left:190px;bottom:60px;display:flex;gap:30px}
h2{position:absolute;left:190px;top:60px;font:400 100px Bebas;letter-spacing:.03em}.lead2{position:absolute;left:194px;top:170px;font:400 30px AtkN;color:#cfcdc4}
.mt{position:absolute;top:290px;width:480px;background:#0e0f12;border:2px solid #444;border-radius:4px;padding:26px 30px}.mt .n{font:400 150px/1 ShareT;color:#7DF3A2;letter-spacing:-.02em}.mt .n small{font:400 30px ShareT;margin-left:6px;color:#7DF3A2}.mt .bar{height:16px;background:repeating-linear-gradient(90deg,#7DF3A2 0 10px,transparent 10px 14px);margin:14px 0}.mt p{font:400 28px/1.3 AtkN;color:#cfcdc4}
#dsvg{position:absolute;left:150px;top:50px;width:1620px;height:760px;--pkc:#fff}
.cap{position:absolute;left:190px;bottom:48px;width:1500px}#capS{font:600 26px BarlowC;color:#F5A524;letter-spacing:.1em;text-transform:uppercase}#capT{font:400 78px Bebas;letter-spacing:.03em}#capD{font:400 26px/1.4 AtkN;color:#cfcdc4;max-width:1250px}
.bx{fill:#2a2c33;stroke:#555a66;stroke-width:2}.ac{fill:#888}.jack{fill:#0b0c0e;stroke:#999;stroke-width:5}.node.lit .bx{stroke:#F5A524;stroke-width:3.5}.node.lit .jack{stroke:#F5A524}.lb{font:600 24px BarlowC;fill:#f3efe2;letter-spacing:.06em}.sb{font:400 15px AtkN;fill:#a8a69c}.edge{stroke-width:7;stroke-linecap:round;opacity:.5}.edge.on{opacity:1;stroke-width:8}.edge.done{opacity:.8}`,
title:c=>`<div class="rk"><i style="top:60px"></i><i style="top:520px"></i><i style="top:980px"></i></div><div class="rk rk2"><i style="top:60px"></i><i style="top:520px"></i><i style="top:980px"></i></div><img class="logo" data-a src="../Assets/logos/logo-horizontal-white.svg" alt=""><div class="pn" style="top:150px;height:520px" data-a><h1>Synapse</h1><div class="jk" style="left:50px;bottom:40px">${[...Array(8)].map(()=>'<i></i>').join('')}</div><div class="lbl" style="right:50px;top:40px">IN</div><div class="lbl" style="right:50px;bottom:40px">OUT</div></div><div class="sub" data-a>${c.title}</div><div class="cr" data-a>${c.team.map(t=>`<span class="lbl">${t}</span>`).join('')}<span class="lbl" style="background:#F5A524">SUPERVISOR · ${c.sup}</span></div>`,
problem:c=>`<div class="rk"></div><div class="rk rk2"></div><h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div>${c.stats.map((s,i)=>`<div class="mt" style="left:${190+i*520}px" data-a><div class="lbl" style="position:static;display:inline-block;margin-bottom:14px">CH ${i+1}</div><div class="n">${s[0]}<small>${s[1]}</small></div><div class="bar"></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<div class="rk"></div><div class="rk rk2"></div><svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:{W:1620,H:760,shape:'panel',edge:'sag',sag:120,packet:'ring',reveal:'drop',fs:24,pk:7,draw:true,arrow:'none',sz:[260,120],
 col:{user:['#fff','#ff5d5d'],frontend:['#fff','#ff5d5d'],backend:['#fff','#F5A524'],multimodal:['#fff','#7DF3A2'],inference:['#fff','#6fb6ff'],storage:['#fff','#d78bff'],external:['#fff','#e8e6df']},
 pos:{learner:[200,150],frontend:[500,150],backend:[800,150],orchestration:[1100,150],analysis:[1420,150],delivery:[200,580],storage:[500,580],explain:[800,580],inference:[1100,580],youtube:[1420,580]}}});

/* 10 SCORE ------------------------------------------------------ landscape, five staves by layer, noteheads, slur arcs, note packets */
CONCEPTS.push({id:'10',name:'Score',orient:'Landscape 16:9',style:'Staves by layer, noteheads, slurs',root:'From the product: spoken sound. The system as a score.',stage:[1920,1080],anim:'rise',
css:`#stage{background:#F7F2E4;color:#1b1a17;font-family:Caslon}
.st{position:absolute;left:0;right:0;height:60px;background:repeating-linear-gradient(transparent 0 14px,#1b1a17 14px 15px)}
.logo{position:absolute;right:110px;top:70px;height:56px}
h1{position:absolute;left:100px;top:210px;font:400 230px/1 Caslon;letter-spacing:-.04em;font-style:italic;color:#1b1a17}
.sub{position:absolute;left:110px;top:520px;font:400 44px/1.3 Caslon;font-style:italic;color:#4a4638;width:1100px}
.cm{position:absolute;right:110px;top:640px;text-align:right;font:400 30px/1.6 Caslon}.cm b{font:700 20px AtkN;letter-spacing:.1em;color:#8a2a10;display:block}
.ts{position:absolute;left:100px;top:760px;font:700 100px/.85 Caslon}
h2{position:absolute;left:100px;top:76px;font:400 84px Caslon;font-style:italic}.lead2{position:absolute;left:106px;top:184px;font:400 32px Caslon;color:#4a4638}
.ms{position:absolute;top:330px;width:560px}.ms .n{font:700 200px/1 Caslon;letter-spacing:-.03em}.ms .n small{font:italic 400 48px Caslon;margin-left:10px}.ms p{font:400 30px/1.4 Caslon;margin-top:14px}.dyn{font:italic 700 56px Caslon;color:#8a2a10}
.bar{position:absolute;top:296px;width:3px;height:560px;background:#1b1a17}
#dsvg{position:absolute;left:80px;top:50px;width:1760px;height:780px;--pkc:#1b1a17}
.cap{position:absolute;left:110px;bottom:48px;width:1700px}#capS{font:italic 400 26px Caslon;color:#8a2a10}#capT{font:700 56px Caslon}#capD{font:400 26px/1.4 Caslon;color:#4a4638;max-width:1250px}
.bx{fill:#1b1a17;stroke:none}.node.lit .bx{fill:#8a2a10}.stem{stroke:#1b1a17;stroke-width:3}.node.lit .stem{stroke:#8a2a10}.lb{font:700 21px Caslon;fill:#1b1a17}.edge{stroke:#1b1a17;stroke-width:2.2}.edge.on{stroke:#8a2a10;stroke-width:3.4}.pks{stroke:#8a2a10}`,
title:c=>`<div class="st" style="top:170px"></div><div class="st" style="top:830px"></div><img class="logo" data-a src="../Assets/logos/logo-horizontal-black.svg" alt=""><h1 data-a>Synapse</h1><div class="sub" data-a>${c.title}</div><div class="cm" data-a><b>COMPOSED BY</b>${c.team.join('<br>')}<br><b style="margin-top:14px">SUPERVISOR</b>${c.sup}<br>${c.uni} · ${c.session}</div><div class="ts" data-a>4<br>4</div>`,
problem:c=>`<h2 data-a>Problem statement</h2><div class="lead2" data-a>${c.lead}</div><div class="st" style="top:540px;height:60px"></div>${c.stats.map((s,i)=>`<div class="bar" style="left:${100+i*600}px" data-a></div><div class="ms" style="left:${130+i*600}px" data-a><div class="dyn">${['ff','f','mf'][i]}</div><div class="n">${s[0]}<small>${s[1]}</small></div><p>${s[2]}</p></div>`).join('')}`,
arch:c=>`<svg class="dg" id="dsvg"></svg><div class="cap">${H.cap()}</div>`,
diagram:(function(){const lane={learner:0,frontend:0,youtube:0,delivery:0,backend:1,orchestration:1,analysis:2,explain:2,inference:3,storage:4},xs={learner:140,youtube:520,frontend:380,backend:640,orchestration:900,analysis:1140,explain:1380,inference:1560,storage:1250,delivery:1620},pos={},ly=k=>120+k*150;Object.keys(lane).forEach(k=>pos[k]=[xs[k],ly(lane[k])+(['learner','backend','analysis','inference','storage','frontend','youtube','delivery','orchestration','explain'].indexOf(k)%3)*10-10]);
 return{W:1760,H:780,shape:'note',edge:'arc',packet:'note',reveal:'rise',fs:21,pk:7,draw:true,arrow:'none',sz:[30,22],col:cols2('#1b1a17','#1b1a17'),mono:'#1b1a17',pos,up:{learner:1,youtube:1,frontend:1,delivery:1,backend:1,orchestration:1,analysis:1,explain:1,inference:1,storage:1},
 deco(g,$){[0,1,2,3,4].forEach(k=>{for(let i=0;i<5;i++)$('line',{x1:40,x2:1700,y1:ly(k)-20+i*10,y2:ly(k)-20+i*10,stroke:'#1b1a17','stroke-width':1.4,opacity:.55},g);const t=$('text',{x:10,y:ly(k)+4,'font-size':18,'font-style':'italic','font-family':'Caslon',fill:'#6a655a'},g);t.textContent=['Frontend','Backend','Analysis','AI','Store'][k]})}};})()});
