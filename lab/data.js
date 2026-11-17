/* The same 10 blocks and 16 arrows as the system slide; every arrow is backed by system_architecture.json. */
const LAB = {
  nodes:{
    learner:{l:'Learner',s:'blind or low-vision student',i:'user',c:'user',r:'user'},
    frontend:{l:'Accessible Frontend',s:'React · voice · keyboard',i:'monitor',c:'frontend',r:'ui'},
    backend:{l:'Backend & APIs',s:'FastAPI · accounts',i:'server',c:'backend',r:'api'},
    orchestration:{l:'Processing & Orchestration',s:'jobs · preparation · priority',i:'workflow',c:'backend',r:'jobs'},
    analysis:{l:'Multimodal Analysis',s:'speech · frames · gestures',i:'layers',c:'multimodal',r:'analyse'},
    explain:{l:'Explanation Generation',s:'evidence · text · speech',i:'brain',c:'multimodal',r:'explain'},
    inference:{l:'AI Inference',s:'vision · language models',i:'sparkles',c:'inference',r:'models'},
    storage:{l:'Data Storage',s:'database · artifacts · media',i:'database',c:'storage',r:'store'},
    delivery:{l:'Explanation Delivery',s:'text · audio stream',i:'headphones',c:'frontend',r:'deliver'},
    youtube:{l:'YouTube',s:'lecture video source',i:'tv',c:'external',r:'source'}
  },
  order:['learner','frontend','backend','orchestration','analysis','explain','inference','storage','delivery','youtube'],
  edges:[
    ['h01','learner','frontend','request'],['h02','frontend','learner','listen'],['h03','youtube','frontend','video'],
    ['h04','frontend','backend','api call'],['h05','backend','orchestration','job'],['h06','youtube','analysis','media'],
    ['h07','orchestration','analysis','analyse'],['h08','analysis','orchestration','context'],['h09','orchestration','explain','prepare'],
    ['h10','orchestration','storage','save'],['h11','backend','storage','library'],['h12','explain','storage','audio'],
    ['h13','explain','inference','frames'],['h14','inference','explain','evidence'],['h15','storage','delivery','serve'],['h16','delivery','frontend','text + audio']
  ],
  phases:[
    {t:'Open the lecture',d:'The learner opens the accessible frontend. The lecture streams from YouTube into the embedded player.',steps:[['h01','h03']]},
    {t:'Send the request',d:'The frontend calls the FastAPI backend, which hands the lecture to processing and orchestration as a durable job.',steps:[['h04'],['h05']]},
    {t:'Analyse the lecture',d:'Speech, frames and instructor gestures are analysed in parallel and synchronized. The lecture context is saved.',steps:[['h07','h06'],['h08'],['h10']]},
    {t:'Understand and explain',d:'The explanation pipeline asks the vision model for visual evidence, then the language model for a grounded explanation.',steps:[['h09'],['h13'],['h14']]},
    {t:'Speak and store',d:'Text and speech are generated, then saved as artifacts for delivery and reuse.',steps:[['h12']]},
    {t:'Deliver the explanation',d:'Text and audio are served back through the API and presented to the learner as accessible text and sound.',steps:[['h15'],['h16'],['h02']]},
    {t:'Personal learning data',d:'Accounts keep the learner’s library, bookmarks and saved explanations in the data store.',steps:[['h11']]}
  ],
  copy:{
    title:'Multimodal AI accessibility for online STEM education of blind learners',
    team:['Hafiz Abdullah Saim','Maha Khalid','Memoona Shahid'], sup:'Mr. Amaid Zia',
    uni:'COMSATS University Islamabad, Lahore Campus', session:'Session 2023–2027',
    stats:[['285','million','people worldwide live with a visual impairment'],['39','million','of them are completely blind'],['70','%','of STEM content is inaccessible when visuals are not converted']],
    lead:'STEM lectures are built on what learners can see.'
  }
};
