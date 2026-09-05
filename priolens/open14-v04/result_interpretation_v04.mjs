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
      paragraph:'Šioje sesijoje prasmingumą tame, ką šiuo metu darai, įvertinai kaip nepakankamą. Tai nebūtinai reiškia, kad visa veikla atrodo beprasmė; verta pasižiūrėti, kur prasmės jauti pakankamai, o kur jos trūksta.',
      question:'Kur dabar aiškiai jauti prasmę, o kur darai todėl, kad reikia, nors prasmės jauti mažiau?'
    },
    CONTRIBUTION:{
      paragraph:'Šioje sesijoje galimybes prisidėti prie kažko svarbaus ne tik sau įvertinai kaip nepakankamas. Tai nebūtinai reiškia, kad tavo veikla neturi vertės; labiau verta pasižiūrėti, kur indėlio svorį jauti, o kur jo nepakanka.',
      question:'Kur šiuo metu labiausiai jauti, kad tavo indėlis turi svorį, o kur kaip tik ne?'
    },
    LEARNING_GROWTH:{
      paragraph:'Šioje sesijoje mokymosi, atradimo ir augimo galimybes įvertinai kaip nepakankamas. Tai gali būti konkretus dabartinės situacijos signalas, bet ne išvada, kad apskritai „neaugi“.',
      question:'Kur šiuo metu jauti realų augimą, o kur labiausiai atrodo, kad kartoji tai, ką jau moki?'
    },
    CAPABILITY_MASTERY:{
      paragraph:'Šioje sesijoje galimybes naudoti ir tobulinti savo gebėjimus įvertinai kaip nepakankamas. Verta atskirti, ar riboja pati veikla, aplinka, ar tiesiog nėra pakankamai progų gebėjimus panaudoti.',
      question:'Kur savo gebėjimus gali panaudoti pilnai, o kur jų panaudoji mažiau, negu norėtum?'
    },
    AUTONOMY_AGENCY:{
      paragraph:'Šioje sesijoje laisvę pačiam spręsti ir veikti tau svarbiose srityse įvertinai kaip nepakankamą. Tai gali būti susiję su konkrečiais kontekstais, o ne su visa tavo gyvenimo situacija.',
      question:'Kur dabar sprendimų laisvės turi pakankamai, o kur jos ribos labiausiai jaučiasi?'
    },
    RECOGNITION_ESTEEM:{
      paragraph:'Šioje sesijoje savo pastangų, nuomonės ar indėlio pastebėjimą ir įvertinimą įvertinai kaip nepakankamą. Tai nėra teiginys, kad esi apskritai nevertinamas; svarbu, kur šis jausmas atsiranda.',
      question:'Kur jautiesi pastebėtas ir įvertintas, o kur tavo pastangos dažniau lieka be aiškaus atgarsio?'
    },
    CONNECTION_BELONGING:{
      paragraph:'Šioje sesijoje artimo ryšio ir priklausymo jausmą įvertinai kaip nepakankamą. Tai nebūtinai susiję su žmonių kiekiu aplink; svarbiau, kur ryšys tau realiai jaučiasi artimas.',
      question:'Kur tarp žmonių jautiesi iš tikrųjų savas, o kur labiau tik esi šalia?'
    },
    CARE_SUPPORT_PRESENT:{
      paragraph:'Šioje sesijoje rūpestį, paramą ir žmogišką dėmesį, kurį gauni iš kitų, įvertinai kaip nepakankamą. Tai kalba apie tavo dabartinį paramos patyrimą, ne apie tai, kiek pats duodi kitiems.',
      question:'Kur iš kitų gauni pakankamai paramos, o kur jos labiausiai stinga?'
    },
    SAFETY_STABILITY:{
      paragraph:'Šioje sesijoje saugumo ir stabilumo jausmą įvertinai kaip nepakankamą. Verta tikrinti, ar tai viena konkreti sritis, ar platesnis dabartinės situacijos fonas.',
      question:'Kur dabar jautiesi pakankamai stabiliai, o kur saugumo ar tvirto pagrindo labiausiai trūksta?'
    },
    CLARITY_PREDICTABILITY:{
      paragraph:'Šioje sesijoje kasdienybės aiškumą ir nuspėjamumą įvertinai kaip nepakankamą. Tai gali būti susiję su konkrečiais neaiškiais susitarimais, lūkesčiais ar tuo, kas bus toliau.',
      question:'Kur dabar aiškumo pakanka, o kur vienas aiškesnis susitarimas ar sprendimas pakeistų daugiausia?'
    },
    RESTORATION_ENERGY:{
      paragraph:'Šioje sesijoje poilsį ir energiją kasdienybei įvertinai kaip nepakankamus. Tai nepasako, kodėl taip yra; tik pažymi sritį, kurią pats įvertinai žemai.',
      question:'Kada ir kur dabar pavyksta realiai atsistatyti, o kur poilsio ar energijos vis dar nepakanka?'
    },
    MATERIAL_RESOURCES:{
      paragraph:'Šioje sesijoje kasdienių resursų tam, ko tau realiai reikia, pakankamumą įvertinai žemai. Tai gali būti labai konkretus praktinis apribojimas, kurį verta įvardyti be platesnių psichologinių išvadų.',
      question:'Kurių resursų tau pakanka, o kuris konkretus trūkumas dabar labiausiai riboja?'
    }
  },
  en:{
    MEANING_PURPOSE:{paragraph:'In this session, you rated the meaningfulness of what you are currently doing as insufficient. That rating is limited to this session and should not be generalized to all of your activities.',question:'Where do you clearly feel meaning right now, and where does it feel weaker?'},
    CONTRIBUTION:{paragraph:'In this session, you rated your opportunities to contribute to something important beyond yourself as insufficient. The useful distinction is where your contribution feels significant and where that sense is weaker.',question:'Where do you currently feel most clearly that your contribution carries weight, and where does it not?'},
    LEARNING_GROWTH:{paragraph:'In this session, you rated your opportunities to learn, discover and grow as insufficient. This is a signal about the current situation, not a general conclusion about your development.',question:'Where do you currently feel real growth, and where does it feel most like repeating what you already know?'},
    CAPABILITY_MASTERY:{paragraph:'In this session, you rated your opportunities to use and develop your abilities as insufficient. It is worth separating whether the limitation comes from the activity, the environment, or simply too few chances to use those abilities.',question:'Where can you use your abilities fully, and where are you using less of them than you would like?'},
    AUTONOMY_AGENCY:{paragraph:'In this session, you rated your freedom to decide and act for yourself in important areas as insufficient. This may belong to particular contexts rather than to your whole situation.',question:'Where do you currently have enough room to decide, and where do the limits feel strongest?'},
    RECOGNITION_ESTEEM:{paragraph:'In this session, you rated the extent to which your effort, opinion or contribution is noticed and valued as insufficient. The useful question is where this experience appears and where it does not.',question:'Where do you feel noticed and valued, and where does your effort more often receive little clear response?'},
    CONNECTION_BELONGING:{paragraph:'In this session, you rated close connection and a sense of belonging as insufficient. The useful distinction is where connection actually feels close and where it does not.',question:'Where among other people do you genuinely feel you belong, and where do you feel more like you are only nearby?'},
    CARE_SUPPORT_PRESENT:{paragraph:'In this session, you rated the care, support and human attention you receive from others as insufficient. This describes your current experience of receiving support, not how much you give to others.',question:'Where do you receive enough support from others, and where is it most lacking?'},
    SAFETY_STABILITY:{paragraph:'In this session, you rated your sense of safety and stability as insufficient. It is worth checking whether this belongs to one specific area or forms a broader background to your current situation.',question:'Where do you currently feel sufficiently stable, and where is safety or firm ground most lacking?'},
    CLARITY_PREDICTABILITY:{paragraph:'In this session, you rated clarity and predictability in everyday life as insufficient. This may relate to specific unclear agreements, expectations, or uncertainty about what happens next.',question:'Where is there enough clarity now, and where would one clearer agreement or decision make the biggest difference?'},
    RESTORATION_ENERGY:{paragraph:'In this session, you rated rest and everyday energy as insufficient. This does not explain why; it only marks an area that you yourself rated low.',question:'When and where are you currently able to recover, and where are rest or energy still insufficient?'},
    MATERIAL_RESOURCES:{paragraph:'In this session, you rated the sufficiency of everyday resources for what you realistically need as low. This can be treated as a concrete practical constraint without adding broader interpretations.',question:'Which resources are sufficient, and which specific shortage is limiting you most right now?'}
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
