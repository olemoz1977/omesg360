export const RESULT_INTERPRETATION_SCHEMA_V04='2rasi.priolens.open14.result-interpretation-v0.1';

const COPY={
  lt:{
    title:'Viena galima interpretacija',
    disclaimer:'Tai bendrinė refleksija pagal šios sesijos pasirinkimus. Ne diagnozė ir ne išvada apie tavo asmenybę.',
    question:'Klausimas sau',
    noRoute:'Šioje sesijoje nė viena sritis neišsiskyrė kaip aiškiai nepakankama. Todėl neverta dirbtinai ieškoti „trūkumo“, kurio pats savo atsakymais neišskyrei.',
    multiRoute:'Kelioms sritims šiuo metu davei vienodai žemą įvertį. Tai gali reikšti, kad viena tema čia nepaaiškina viso vaizdo, todėl verta žiūrėti į jas kaip į kelis lygiagrečius dabartinės situacijos signalus.',
    noRepeats:'Pirmuose pasirinkimuose nė viena vizualinė kryptis nepasikartojo 2 ar 3 kartus. Šį kartą pirmo žvilgsnio dalis nesudaro vienos aiškesnės istorijos.',
    repeatIntro3:'Pirmuose pasirinkimuose nuosekliausiai kartojosi ',
    repeatIntro2:'Šiek tiek silpniau, bet vis dar pakartotinai dėmesį traukė ',
    repeatBoundary:'Tai nereiškia, kad šios temos tau apskritai yra svarbiausios ar kad jų trūksta. Tai tik šios vaizdų imties dėmesio pasikartojimai.',
    genericBridge:'Pirmo žvilgsnio ir pakankamumo rezultatai nebūtinai kalba apie tą patį dalyką. Jei tarp jų atpažįsti ryšį savo gyvenime, tai gali būti naudinga hipotezė savistabai; jei neatpažįsti, jų nereikia sujungti per jėgą.',
    noClearBridge:'Papildomame pirmo žvilgsnio patikslinime nė viena kryptis tau nebuvo aiškiai artimesnė. Todėl pasikartojančius motyvus čia paliekame matomus, bet iš jų nekuriame konkretesnės bendros istorijos su pakankamumo rezultatu.',
    directBridgePrefix:'Čia matyti gana tiesioginis teminis persidengimas: pirmo žvilgsnio pasirinkimuose kartojosi ',
    directBridgeSuffix:'. Tai neįrodo priežasties ir neparodo „tikro poreikio“, bet verta patikrinti, ar abi perspektyvos tavo situacijoje kalba apie panašų dalyką.',
    relatedBridgePrefix:'Galimas ryšys čia silpnesnis: pirmo žvilgsnio pasirinkimuose kartojosi ',
    relatedBridgeSuffix:', tačiau šios kryptys yra artimos, o ne tapačios pakankamumo sričiai. Jei tavo situacijoje ryšio neatpažįsti, jų jungti nereikia.',
    careBridge:'Rūpesčio / pagalbos vaizdai pirmuose pasirinkimuose kartojosi, tačiau vien iš jų negalima spręsti, ar dėmesį traukė paramos gavimas, rūpinimasis kitu, pats santykis ar scena. Todėl tai nėra tiesioginis paramos iš kitų trūkumo patvirtinimas.',
    leastPrefix:'Tuo tarpu ',
    leastSuffix:' šioje vaizdų imtyje dažniau liko antrame plane. Tai nereiškia, kad šios temos tau nesvarbios; jos tiesiog mažiau konkuravo dėl spontaniško dėmesio.',
    and:' ir ',
    comma:', ',
    defaultQuestion:'Kurioje dabartinio gyvenimo vietoje šis rezultatas tau atrodo pažįstamas, o kurioje visai neatpažįstamas?'
  },
  en:{
    title:'One possible interpretation',
    disclaimer:'This is a general reflection based on this session. It is not a diagnosis or a conclusion about your personality.',
    question:'A question for yourself',
    noRoute:'No area clearly stood out as insufficient in this session. There is no reason to manufacture a deficit that you did not identify in your own answers.',
    multiRoute:'Several areas received the same low rating. One theme may not explain the whole picture, so it is better to treat them as parallel signals about your current situation.',
    noRepeats:'No visual direction repeated 2 or 3 times in your first choices. This time, the first-glance part does not form one clearer story.',
    repeatIntro3:'The most consistent first-choice repetitions were ',
    repeatIntro2:'A little less strongly, but still repeatedly, your attention was drawn to ',
    repeatBoundary:'This does not mean these themes are generally the most important to you or that you lack them. They are only repeated attention patterns in this image set.',
    genericBridge:'The first-glance and sufficiency results do not have to describe the same thing. If you recognize a connection between them in your life, it can be a useful hypothesis for reflection; if you do not, there is no need to force one.',
    noClearBridge:'In the additional first-glance clarification, no direction felt clearly closer to you. The repeated motifs therefore remain visible, but we do not use them to build a more specific combined story with the sufficiency result.',
    directBridgePrefix:'There is a fairly direct thematic overlap here: your first-glance choices repeatedly included ',
    directBridgeSuffix:'. This does not prove causality or reveal a “true need”, but it may be worth checking whether the two perspectives describe something similar in your situation.',
    relatedBridgePrefix:'The possible link is weaker here: your first-glance choices repeatedly included ',
    relatedBridgeSuffix:', but these directions are related to, not identical with, the sufficiency area. If you do not recognize the link in your situation, there is no need to connect them.',
    careBridge:'Care / helping scenes repeated in your first choices, but those images alone cannot show whether your attention was drawn to receiving support, caring for someone else, the relationship itself, or the scene. They are therefore not direct evidence of insufficient support from others.',
    leastPrefix:'Meanwhile, ',
    leastSuffix:' more often stayed in the background in this image set. This does not mean these themes are unimportant to you; they simply competed less for spontaneous attention.',
    and:' and ',
    comma:', ',
    defaultQuestion:'Where in your current life does this result feel familiar, and where does it not fit at all?'
  }
};

const B_ANCHORS={
  lt:{
    MEANING_PURPOSE:{
      paragraph:'Gali būti, kad tau šiuo metu neužtenka vien atlikti tai, ką reikia. Svarbiau gali būti jausti, kad tai, ką darai, turi prasmę ir yra verta tavo laiko bei pastangų.',
      question:'Kur dabar daugiausia skiri laiko tam, kas veikia, bet nebūtinai atrodo prasminga?'
    },
    CONTRIBUTION:{
      paragraph:'Gali būti, kad tau neužtenka tiesiog „daryti savo darbą“. Svarbu jausti, kad tai, ką darai, kažkam turi svorį ir prisideda prie kažko didesnio už tave patį.',
      question:'Ar dabar tavo gyvenime yra vieta, kurioje daug darai, bet nebejauti, kad tavo indėlis iš tikrųjų kažkam svarbus?'
    },
    LEARNING_GROWTH:{
      paragraph:'Šiuo metu gali stigti ne informacijos apskritai, o jausmo, kad judi pirmyn: atrandi, mokaisi ir plečiasi tai, ką gali suprasti ar padaryti.',
      question:'Kurioje srityje dabar labiausiai jauti, kad kartoji tai, ką jau moki, vietoje to, kad augtum?'
    },
    CAPABILITY_MASTERY:{
      paragraph:'Gali būti, kad tau šiuo metu trūksta erdvės panaudoti tai, ką iš tikrųjų moki, ir matyti, kad tavo gebėjimai toliau auga, o ne tiesiog yra naudojami rutiniškai.',
      question:'Kur dabar turi gebėjimų daugiau, negu realiai gali panaudoti?'
    },
    AUTONOMY_AGENCY:{
      paragraph:'Šiuo metu gali trūkti ne pasirinkimų skaičiaus, o realios erdvės pačiam spręsti, kaip veikti ten, kur tau svarbu.',
      question:'Kurioje svarbioje srityje dažniausiai darai ne taip, kaip pats rinktumeisi, o taip, kaip leidžia aplinkybės ar kiti žmonės?'
    },
    RECOGNITION_ESTEEM:{
      paragraph:'Gali būti, kad dalis tavo pastangų šiuo metu lieka per mažai pastebėtos. Ne vien pagyrimo prasme, bet kaip signalas, kad tavo nuomonė, darbas ar indėlis iš tikrųjų turi vietą.',
      question:'Kur dabar daug investuoji, bet retai gauni aiškų ženklą, kad tavo indėlis buvo pastebėtas ar turėjo vertę?'
    },
    CONNECTION_BELONGING:{
      paragraph:'Šiuo metu gali trūkti ne žmonių aplink, o artimesnio ryšio ir jausmo, kad kažkur iš tikrųjų esi „savas“, o ne tik dalyvauji šalia kitų.',
      question:'Kur tarp žmonių dabar jautiesi labiau esantis šalia negu iš tikrųjų priklausantis?'
    },
    CARE_SUPPORT_PRESENT:{
      paragraph:'Gali būti, kad šiuo metu daugiau duodi ar laikaisi pats, negu patiri, kad kažkas realiai pastebi ir palaiko tave.',
      question:'Kurioje gyvenimo vietoje tau būtų lengviausia įvardyti, kokios paramos iš kitų dabar iš tikrųjų reikia?'
    },
    SAFETY_STABILITY:{
      paragraph:'Šiuo metu gali trūkti ne absoliutaus saugumo, o pakankamai tvirto pagrindo, kad nereikėtų nuolat laikyti dalies dėmesio pasiruošus nenumatytam pokyčiui.',
      question:'Kas dabar labiausiai verčia laikyti „atsarginį planą“ galvoje net tada, kai norėtum tiesiog veikti?'
    },
    CLARITY_PREDICTABILITY:{
      paragraph:'Gali būti, kad didesnė įtampa kyla ne iš pačių užduočių, o iš neaiškumo: kas bus toliau, ko iš tavęs tikimasi ir nuo ko priklauso rezultatas.',
      question:'Kurioje srityje vienas aiškus susitarimas ar sprendimas dabar sumažintų daugiausia bereikalingo neapibrėžtumo?'
    },
    RESTORATION_ENERGY:{
      paragraph:'Gali būti, kad šiuo metu problema nėra vien „pailsėti daugiau“. Gali trūkti tikro atsistatymo, po kurio grįžta energija, o ne tik trumpam sustoja veikla.',
      question:'Kada paskutinį kartą po poilsio iš tikrųjų jauteisi atsistatęs, o ne tik mažiau pavargęs?'
    },
    MATERIAL_RESOURCES:{
      paragraph:'Šiuo metu gali trūkti labai praktiško dalyko: pakankamų resursų, kad galėtum daryti tai, kas realiai reikalinga, be nuolatinio kompensavimo ar improvizavimo.',
      question:'Kuris konkretus resursas dabar labiausiai riboja tai, ką galėtum padaryti kitaip?'
    }
  },
  en:{
    MEANING_PURPOSE:{paragraph:'Right now, simply getting things done may not feel sufficient. It may matter more that what you do feels meaningful and worth your time and effort.',question:'Where are you currently spending the most time on something that works but does not necessarily feel meaningful?'},
    CONTRIBUTION:{paragraph:'It may not be enough simply to “do your job”. It may matter that what you do carries weight for someone and contributes to something larger than yourself.',question:'Is there a part of your life where you do a lot but no longer feel that your contribution really matters to anyone?'},
    LEARNING_GROWTH:{paragraph:'What may be missing is not information in general, but a sense of moving forward: discovering, learning and expanding what you can understand or do.',question:'Where do you currently feel you are repeating what you already know instead of growing?'},
    CAPABILITY_MASTERY:{paragraph:'You may currently lack room to use what you really know how to do and to see your abilities continue to grow rather than being used only routinely.',question:'Where do you currently have more capability than you are able to use?'},
    AUTONOMY_AGENCY:{paragraph:'What may be missing is not the number of choices, but genuine room to decide for yourself how to act in areas that matter to you.',question:'In which important area are you most often acting as circumstances or others allow, rather than as you would choose?'},
    RECOGNITION_ESTEEM:{paragraph:'Some of your effort may currently be too little noticed, not only in the sense of praise, but as a signal that your opinion, work or contribution genuinely has a place.',question:'Where are you investing a lot while rarely receiving a clear sign that your contribution was noticed or mattered?'},
    CONNECTION_BELONGING:{paragraph:'What may be missing is not people around you, but closer connection and the feeling that somewhere you truly belong rather than simply being present beside others.',question:'Where among other people do you currently feel more adjacent than genuinely belonging?'},
    CARE_SUPPORT_PRESENT:{paragraph:'You may currently be giving or carrying more on your own than you experience others actually noticing and supporting you.',question:'Where would it be easiest to name what kind of support from others you genuinely need right now?'},
    SAFETY_STABILITY:{paragraph:'What may be missing is not absolute safety, but a sufficiently stable base so that part of your attention does not have to stay ready for the next unexpected change.',question:'What currently makes you keep a backup plan in mind even when you would rather just act?'},
    CLARITY_PREDICTABILITY:{paragraph:'The strain may come less from the tasks themselves and more from uncertainty: what happens next, what is expected of you and what the outcome depends on.',question:'Where would one clear agreement or decision remove the most unnecessary uncertainty right now?'},
    RESTORATION_ENERGY:{paragraph:'The issue may not simply be “more rest”. You may be missing real recovery after which energy returns, rather than activity merely stopping for a while.',question:'When did rest last leave you genuinely restored rather than simply less tired?'},
    MATERIAL_RESOURCES:{paragraph:'What may be missing is something very practical: enough resources to do what is actually needed without constant compensation or improvisation.',question:'Which concrete resource is currently limiting what you could do differently?'}
  }
};

function joinNatural(values,lang){
  const C=COPY[lang]||COPY.lt;
  const xs=values.filter(Boolean);
  if(xs.length<=1)return xs[0]||'';
  if(xs.length===2)return xs[0]+C.and+xs[1];
  return xs.slice(0,-1).join(C.comma)+C.and+xs[xs.length-1];
}
function names(rows,familyLabels){
  return rows.map(function(x){return familyLabels[x.familyId]||x.familyId});
}
const BRIDGE_MAP={
  LEARNING_GROWTH:{direct:['KNOWLEDGE'],related:['EXPLORATION','OPPORTUNITY']},
  CAPABILITY_MASTERY:{direct:['MASTERY'],related:['OPPORTUNITY']},
  AUTONOMY_AGENCY:{direct:['AUTONOMY'],related:['CONTROL','OPPORTUNITY']},
  RECOGNITION_ESTEEM:{direct:['RECOGNITION'],related:[]},
  CONNECTION_BELONGING:{direct:['BELONGING'],related:['CONNECTION']},
  SAFETY_STABILITY:{direct:['SAFETY'],related:['CONTROL']},
  CLARITY_PREDICTABILITY:{direct:[],related:['ORDER','CONTROL']},
  RESTORATION_ENERGY:{direct:['REST'],related:[]},
  MATERIAL_RESOURCES:{direct:['RESOURCE'],related:['OPPORTUNITY']}
};
function presentNames(ids,present,familyLabels){return ids.filter(function(id){return present.has(id)}).map(function(id){return familyLabels[id]||id})}
function contributionBridge(repeats,lang,familyLabels){
  const present=new Set(repeats.map(function(x){return x.familyId}));
  const recognition=present.has('RECOGNITION');
  const social=['BELONGING','CONNECTION'].filter(function(id){return present.has(id)});
  const learning=['KNOWLEDGE','EXPLORATION'].filter(function(id){return present.has(id)});
  if(!recognition&&!social.length&&!learning.length)return '';
  if(lang==='en'){
    if(recognition&&social.length){
      let out='One possible reading is that contributing may feel more meaningful when the contribution is not only made, but also visible and connected with having a place among others.';
      if(learning.length)out+=' Because '+joinNatural(learning.map(function(id){return familyLabels[id]||id}),lang)+' also repeated, learning or understanding may be another part of this picture: a possible way to expand what you can contribute.';
      return out;
    }
    if(recognition)return 'One possible reading is that contributing may matter more when you can also see that the contribution was noticed or carried weight.';
    if(social.length)return 'One possible reading is that contributing may feel more meaningful when it is connected with a real place among other people.';
    return 'One possible reading is that learning or understanding may matter here as one way to expand what you are able to contribute.';
  }
  if(recognition&&social.length){
    let out='Viena galima interpretacija: prisidėjimas gali būti patiriamas stipriau tada, kai indėlis ne tik egzistuoja, bet yra matomas ir susijęs su realia vieta tarp kitų.';
    if(learning.length)out+=' Kadangi kartojosi ir '+joinNatural(learning.map(function(id){return familyLabels[id]||id}),lang)+', mokymasis ar supratimas gali būti dar viena šio vaizdo dalis: galimas būdas plėsti tai, kuo gali prisidėti.';
    return out;
  }
  if(recognition)return 'Viena galima interpretacija: prisidėjimas gali būti svarbesnis tada, kai kartu matai, kad indėlis buvo pastebėtas ar turėjo svorį.';
  if(social.length)return 'Viena galima interpretacija: prisidėjimas gali būti prasmingesnis tada, kai jis susijęs su realia vieta tarp kitų žmonių.';
  return 'Viena galima interpretacija: mokymasis ar supratimas čia gali būti svarbus kaip vienas iš būdų plėsti tai, kuo gali prisidėti.';
}
function mappedBridge(routeId,repeats,lang,familyLabels){
  const C=COPY[lang]||COPY.lt;
  const present=new Set(repeats.map(function(x){return x.familyId}));
  if(routeId==='CONTRIBUTION')return contributionBridge(repeats,lang,familyLabels);
  if(routeId==='CARE_SUPPORT_PRESENT'&&present.has('CARE'))return C.careBridge;
  const map=BRIDGE_MAP[routeId];
  if(!map)return '';
  const direct=presentNames(map.direct,present,familyLabels);
  const related=presentNames(map.related,present,familyLabels);
  if(direct.length)return C.directBridgePrefix+'**'+joinNatural(direct,lang)+'**'+C.directBridgeSuffix;
  if(related.length)return C.relatedBridgePrefix+'**'+joinNatural(related,lang)+'**'+C.relatedBridgeSuffix;
  return '';
}

export function buildHumanInterpretationV04(args={}){
  const model=args.model||{};
  const lang=args.lang||'lt';
  const familyLabels=args.familyLabels||{};
  const C=COPY[lang]||COPY.lt;
  const B=B_ANCHORS[lang]||B_ANCHORS.lt;
  const repeats=Array.isArray(model.repeatedMost)?model.repeatedMost:[];
  const high=repeats.filter(function(x){return x.count===3});
  const secondary=repeats.filter(function(x){return x.count===2});
  const routeIds=Array.isArray(model.sufficiencyItemIds)?model.sufficiencyItemIds:[];
  const backgrounds=Array.isArray(model.backgroundFamilyIds)?model.backgroundFamilyIds:[];
  const clarifierNoClear=model.attentionClarifierNoClear===true||(model.focusFamilyId==null&&repeats.length>0);

  const paragraphs=[];
  let question=C.defaultQuestion;

  if(routeIds.length===1&&B[routeIds[0]]){
    paragraphs.push(B[routeIds[0]].paragraph);
    question=B[routeIds[0]].question;
  }else if(routeIds.length>1){
    paragraphs.push(C.multiRoute);
  }else{
    paragraphs.push(C.noRoute);
  }

  if(repeats.length){
    const parts=[];
    if(high.length)parts.push(C.repeatIntro3+'**'+joinNatural(names(high,familyLabels),lang)+'**.');
    if(secondary.length)parts.push(C.repeatIntro2+'**'+joinNatural(names(secondary,familyLabels),lang)+'**.');
    parts.push(C.repeatBoundary);
    paragraphs.push(parts.join(' '));
  }else{
    paragraphs.push(C.noRepeats);
  }

  if(routeIds.length===1&&repeats.length){
    if(clarifierNoClear)paragraphs.push(C.noClearBridge);
    else paragraphs.push(mappedBridge(routeIds[0],repeats,lang,familyLabels)||C.genericBridge);
  }else if(routeIds.length&&repeats.length){
    paragraphs.push(C.genericBridge);
  }

  if(backgrounds.length){
    const bgNames=backgrounds.map(function(id){return familyLabels[id]||id});
    paragraphs.push(C.leastPrefix+'**'+joinNatural(bgNames,lang)+'**'+C.leastSuffix);
  }

  return {
    schema:RESULT_INTERPRETATION_SCHEMA_V04,
    title:C.title,
    disclaimer:C.disclaimer,
    paragraphs:paragraphs,
    questionLabel:C.question,
    question:question
  };
}
