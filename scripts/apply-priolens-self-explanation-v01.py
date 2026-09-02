from pathlib import Path

p=Path('priolens/open14-v02/index.html')
s=p.read_text()

# 1) Styles for participant self-explanation choices inside the final hero.
old='.reflectionQuestion{font-size:clamp(22px,5vw,29px);font-weight:820;letter-spacing:-.02em;line-height:1.2;margin-top:16px;color:#fff}.resultNote'
new='.reflectionQuestion{font-size:clamp(22px,5vw,29px);font-weight:820;letter-spacing:-.02em;line-height:1.2;margin-top:16px;color:#fff}.reasonOptions{display:grid;gap:8px;margin-top:16px}.reasonOption{width:100%;text-align:left;border:1px solid #555;background:#242424;color:#fff;border-radius:12px;padding:11px 12px;min-height:44px;font-size:14px;line-height:1.35}.reasonOption:hover{background:#303030}.reasonOption.on{background:#fff;color:#181818;border-color:#fff;font-weight:760}.reasonFeedback{margin-top:16px;padding-top:14px;border-top:1px solid #444;font-size:15px;line-height:1.5;color:#fff}.reasonSave{margin-top:8px;font-size:12px;color:#aaa}.resultNote'
assert old in s
s=s.replace(old,new,1)

# 2) State supports a post-result self-explanation and waits for the initial final submission.
old="let bank=null,assignment=null,state=null,t0=0,locked=false,suffIndex=0,lastPointerType=null,progressTimer=null,suffValidationShown=false;"
new=old+"\nlet finalSubmitPromise=Promise.resolve();"
assert old in s
s=s.replace(old,new,1)
old="sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},completedAt:null}"
new="sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},selfExplanation:null,completedAt:null}"
assert old in s
s=s.replace(old,new,1)
old="show('result');renderResult();submitSession()}"
new="show('result');renderResult();finalSubmitPromise=submitSession()}"
assert old in s
s=s.replace(old,new,1)

# 3) Human self-explanation options and feedback.
anchor='// CARE intentionally has no direct Channel B pair in v0.2.\n'
assert anchor in s
insert=r'''const SELF_REASON_OPTIONS={
  lt:[
    ['WANT_MORE','Norėčiau daugiau to savo gyvenime'],
    ['IMPORTANT_NOW','Man tai dabar svarbu'],
    ['REMINDS_ME','Primena žmogų ar situaciją'],
    ['LIKE_SCENE','Patinka tai, ką matau'],
    ['JUST_IMAGE','Tiesiog patraukė pats vaizdas'],
    ['DONT_KNOW','Nežinau']
  ],
  en:[
    ['WANT_MORE','I would like more of this in my life'],
    ['IMPORTANT_NOW','This matters to me right now'],
    ['REMINDS_ME','It reminds me of a person or situation'],
    ['LIKE_SCENE','I like what I see'],
    ['JUST_IMAGE','The image itself just caught my eye'],
    ['DONT_KNOW','I do not know']
  ]
};
const SELF_REASON_COPY={
  lt:{
    question:'Kaip tau atrodo, kodėl būtent šie vaizdai tave traukė?',
    saved:'Tavo atsakymas išsaugotas.',
    failed:'Nepavyko išsaugoti. Atsakymas lieka šiame ekrane.',
    feedback:(code,value)=>{
      if(code==='WANT_MORE'){
        if(Number.isFinite(value)&&value<=3)return 'Tai sutampa su tuo, ką jau sakei: šioje vietoje tau norėtųsi daugiau.';
        if(Number.isFinite(value)&&value>=4)return 'Čia atsiranda skirtumas: prieš tai sakei, kad tau pakanka, o dabar sakai, kad vis tiek norėtum daugiau. „Pakanka“ ir „norėčiau daugiau“ nėra tas pats.';
        return 'Gali būti, kad šie vaizdai priminė tai, ko norėtųsi daugiau.';
      }
      if(code==='IMPORTANT_NOW'){
        if(Number.isFinite(value)&&value<=3)return 'Gali būti, kad ši tema tau ir svarbi, ir jos dabar norėtųsi daugiau.';
        if(Number.isFinite(value)&&value>=4)return 'Svarbu nebūtinai reiškia, kad trūksta. Gal ši tema tau tiesiog dabar rūpi.';
        return 'Svarbu nebūtinai reiškia, kad trūksta. Gal ši tema tau tiesiog dabar rūpi.';
      }
      if(code==='REMINDS_ME')return 'Tuomet vaizdai galėjo suveikti kaip priminimas apie konkretų žmogų ar situaciją.';
      if(code==='LIKE_SCENE')return 'Tuomet tave galėjo patraukti pats veiksmas, jausmas ar situacija vaizde.';
      if(code==='JUST_IMAGE')return 'Tai irgi galimas atsakymas. Kartais vaizdas pagauna akį anksčiau, nei žinome kodėl.';
      return 'Nežinoti irgi galima. PrioLens čia nebandys atsakyti už tave.';
    }
  },
  en:{
    question:'Why do you think these particular images pulled you?',
    saved:'Your answer was saved.',
    failed:'Could not save it. Your answer remains on this screen.',
    feedback:(code,value)=>{
      if(code==='WANT_MORE'){
        if(Number.isFinite(value)&&value<=3)return 'That matches what you already said: this is something you would like more of right now.';
        if(Number.isFinite(value)&&value>=4)return 'Here there is a difference: earlier you said you have enough, but now you still say you would like more. “Enough” and “I would like more” are not the same thing.';
        return 'These images may have reminded you of something you would like more of.';
      }
      if(code==='IMPORTANT_NOW'){
        if(Number.isFinite(value)&&value<=3)return 'This may be both important to you and something you would like more of right now.';
        if(Number.isFinite(value)&&value>=4)return 'Important does not have to mean lacking. This may simply be something that matters to you right now.';
        return 'Important does not have to mean lacking. This may simply be something that matters to you right now.';
      }
      if(code==='REMINDS_ME')return 'Then the images may have worked as a reminder of a particular person or situation.';
      if(code==='LIKE_SCENE')return 'Then the action, feeling or situation in the image may have been what pulled you.';
      if(code==='JUST_IMAGE')return 'That is also a possible answer. Sometimes an image catches the eye before we know why.';
      return 'Not knowing is also fine. PrioLens will not answer for you.';
    }
  }
};
const SELF_REASON=SELF_REASON_COPY[LANG];
'''
if 'const SELF_REASON_OPTIONS=' not in s:
    s=s.replace(anchor,anchor+insert,1)

# 4) Simpler final comparison copy: B is context, not an explanation of A.
s=s.replace("alignedCue:(f,n,item,related)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Atsakyme apie ${item} pažymėjai, kad dabar norėtųsi daugiau.${related?' Tai nėra tas pats dalykas, bet jie gali būti susiję.':''}`",
            "alignedCue:(f,n,item,related)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Apie ${item} sakei: dabar norėtųsi daugiau.${related?' Tai nėra tas pats dalykas, bet jie gali būti susiję.':''}`")
s=s.replace("highCue:(f,n,item,related)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Atsakyme apie ${item} pažymėjai, kad tau dabar pakanka.${related?' Tai nėra visai tas pats dalykas.':''}`",
            "highCue:(f,n,item,related)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Apie ${item} sakei: man dabar pakanka.${related?' Tai nėra visai tas pats dalykas.':''}`")
s=s.replace("differentCue:(need,f,n)=>`Savo atsakymuose aiškiausiai parodei, kad norėtųsi daugiau ${need}. O vaizduose dažniausiai rinkaisi „${f}“ (${n}/3). Šie du dalykai nesutapo.`",
            "differentCue:(need,f,n)=>`Sakei, kad dabar labiausiai norėtųsi daugiau ${need}. O vaizduose dažniausiai rinkaisi „${f}“ (${n}/3). Šie du dalykai nesutapo.`")
s=s.replace("visualOnlyCue:(f,n)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Antroje dalyje nėra tiesiogiai atitinkančio klausimo, su kuriuo PrioLens galėtų tai sąžiningai palyginti.`",
            "visualOnlyCue:(f,n)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Antroje dalyje neturime klausimo, kuris tiksliai atitiktų šią temą.`")
s=s.replace("alignedCue:(f,n,item,related)=>`In the images, you chose “${f}” ${countPhrase(n)}. In your answer about ${item}, you marked that you would like more.${related?' These are not the same thing, but they may be related.':''}`",
            "alignedCue:(f,n,item,related)=>`In the images, you chose “${f}” ${countPhrase(n)}. About ${item}, you said: I would like more right now.${related?' These are not the same thing, but they may be related.':''}`")
s=s.replace("highCue:(f,n,item,related)=>`In the images, you chose “${f}” ${countPhrase(n)}. In your answer about ${item}, you marked that you have enough right now.${related?' These are not exactly the same thing.':''}`",
            "highCue:(f,n,item,related)=>`In the images, you chose “${f}” ${countPhrase(n)}. About ${item}, you said: I have enough right now.${related?' These are not exactly the same thing.':''}`")
s=s.replace("differentCue:(need,f,n)=>`In your own answers, the clearest place where you wanted more was ${need}. In the images, the theme you chose most often was “${f}” (${n}/3). These did not point to the same place.`",
            "differentCue:(need,f,n)=>`You said you would most like more ${need}. In the images, you most often chose “${f}” (${n}/3). These did not point to the same place.`")
s=s.replace("visualOnlyCue:(f,n)=>`In the images, you chose “${f}” ${countPhrase(n)}. There is no direct matching question in the second part that PrioLens can safely compare it with.`",
            "visualOnlyCue:(f,n)=>`In the images, you chose “${f}” ${countPhrase(n)}. The second part has no question that exactly matches this theme.`")

# Add the shared visual self-explanation question to both language C objects.
s=s.replace("alignedQuestion:'Do these two things feel connected to you?',", "alignedQuestion:'Do these two things feel connected to you?',reasonQuestion:SELF_REASON_COPY.en.question,")
s=s.replace("alignedQuestion:'Ar tau šie du dalykai atrodo susiję?',", "alignedQuestion:'Ar tau šie du dalykai atrodo susiję?',reasonQuestion:SELF_REASON_COPY.lt.question,")

# 5) Add self-explanation persistence and interactive buttons.
old="function addReflection(mount,cue,question,images=[]){const r=document.createElement('div');r.className='reflectionHero';const pics=images.slice(0,2).map(src=>`<img src=\"${src}\" alt=\"\">`).join('');r.innerHTML=`${pics?`<div class=\"reflectionImages\">${pics}</div>`:''}${cue?`<div class=\"insightCue\">${cue}</div>`:''}<div class=\"reflectionQuestion\">${question}</div>`;mount.appendChild(r)}"
new=r'''async function persistSelfExplanation(statusEl){
  try{
    if(statusEl){statusEl.textContent=LANG==='en'?'Saving…':'Išsaugoma…';statusEl.classList.remove('hidden')}
    await finalSubmitPromise;
    const payload={...state};delete payload.submission;delete payload.selfExplanationSave;
    const r=await fetch(API_PATH,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json().catch(()=>({}));
    if(!r.ok||!data.ok)throw new Error(data.message||`HTTP ${r.status}`);
    state.selfExplanationSave={ok:true,at:new Date().toISOString()};
    if(statusEl)statusEl.textContent=SELF_REASON.saved;
    $('debug').textContent=JSON.stringify(state,null,2)
  }catch(err){
    state.selfExplanationSave={ok:false,error:String(err)};
    if(statusEl)statusEl.textContent=SELF_REASON.failed;
    console.error(err)
  }
}
function selfReasonFeedback(code,family){
  const link=FAMILY_ITEM_LINKS[family];
  const value=link?state.sufficiency[link.item]:null;
  return SELF_REASON.feedback(code,value)
}
function addReflection(mount,cue,question,images=[],focusFamily=null,scenario=null){
  const r=document.createElement('div');r.className='reflectionHero';
  const pics=images.slice(0,2).map(src=>`<img src="${src}" alt="">`).join('');
  const options=focusFamily?SELF_REASON_OPTIONS[LANG].map(([code,label])=>`<button type="button" class="reasonOption" data-reason="${code}">${label}</button>`).join(''):'';
  r.innerHTML=`${pics?`<div class="reflectionImages">${pics}</div>`:''}${cue?`<div class="insightCue">${cue}</div>`:''}<div class="reflectionQuestion">${question}</div>${options?`<div class="reasonOptions">${options}</div><div class="reasonFeedback hidden"></div><div class="reasonSave hidden"></div>`:''}`;
  mount.appendChild(r);
  if(focusFamily){
    const feedback=r.querySelector('.reasonFeedback'),save=r.querySelector('.reasonSave');
    r.querySelectorAll('.reasonOption').forEach(btn=>btn.onclick=()=>{
      r.querySelectorAll('.reasonOption').forEach(x=>x.classList.toggle('on',x===btn));
      const code=btn.dataset.reason;
      state.selfExplanation={schema:'2rasi.priolens.self-explanation-v0.1',familyId:focusFamily,scenario:scenario||'VISUAL_FOCUS',reasonCode:code,answeredAt:new Date().toISOString()};
      feedback.textContent=selfReasonFeedback(code,focusFamily);feedback.classList.remove('hidden');
      persistSelfExplanation(save)
    })
  }
}'''
assert old in s
s=s.replace(old,new,1)

# 6) Visual scenarios now lead to C: the participant's own explanation.
s=s.replace("addReflection(cr,C.alignedCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.alignedQuestion,chosenImagePaths(m.family));",
            "addReflection(cr,C.alignedCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.reasonQuestion,chosenImagePaths(m.family),m.family,'MATCH_LOW');")
s=s.replace("addReflection(cr,C.highCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.highQuestion,chosenImagePaths(m.family));",
            "addReflection(cr,C.highCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.reasonQuestion,chosenImagePaths(m.family),m.family,'MATCH_HIGH');")
s=s.replace("addReflection(cr,C.differentCue(ITEM_RESULT_LABEL[need.key],FAMILY_LABEL[family],stat.chosen),C.differentQuestion,chosenImagePaths(family));",
            "addReflection(cr,C.differentCue(ITEM_RESULT_LABEL[need.key],FAMILY_LABEL[family],stat.chosen),C.reasonQuestion,chosenImagePaths(family),family,'DIFFERENT');")
s=s.replace("addReflection(cr,C.visualOnlyCue(FAMILY_LABEL[family],stat.chosen),C.visualOnlyQuestion,chosenImagePaths(family));",
            "addReflection(cr,C.visualOnlyCue(FAMILY_LABEL[family],stat.chosen),C.reasonQuestion,chosenImagePaths(family),family,'VISUAL_ONLY');")

# Ensure every required concept is present.
for needle in [
  'SELF_REASON_OPTIONS','selfExplanation','2rasi.priolens.self-explanation-v0.1',
  'Kaip tau atrodo, kodėl būtent šie vaizdai tave traukė?',
  'Norėčiau daugiau to savo gyvenime','Man tai dabar svarbu','Primena žmogų ar situaciją',
  'Tiesiog patraukė pats vaizdas','PrioLens čia nebandys atsakyti už tave.',
  "m.family,'MATCH_LOW'","m.family,'MATCH_HIGH'","family,'DIFFERENT'"
]:
    assert needle in s, needle

p.write_text(s)
