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
function hasAny(set,ids){return ids.some(function(id){return set.has(id)})}

function specificBridgeLt(routeId,repeats){
  const ids=new Set(repeats.map(function(x){return x.familyId}));
  if(routeId==='CONTRIBUTION'){
    const social=hasAny(ids,['BELONGING','CONNECTION']);
    const recognition=ids.has('RECOGNITION');
    const learning=hasAny(ids,['KNOWLEDGE','EXPLORATION']);
    const mastery=ids.has('MASTERY');
    if(recognition&&social){
      let s='Viena galima interpretacija: tau gali būti svarbus ne pats pripažinimas ar priklausymas atskirai, o situacija, kurioje gali prasmingai prisidėti ir kartu jausti, kad tavo indėlis matomas bei turi vietą tarp kitų.';
      if(learning)s+=' Mokymasis ir supratimas tada gali būti ne atskiras tikslas, o būdas daugiau suprasti, daugiau gebėti ir turėti daugiau galimybių prisidėti.';
      else if(mastery)s+=' Gebėjimų panaudojimas tada gali būti ne tik meistriškumo klausimas, o būdas turėti didesnį realų poveikį.';
      return s;
    }
    if(recognition)return 'Viena galima interpretacija: tau gali būti svarbu ne vien prisidėti, bet ir matyti, kad tas indėlis buvo pastebėtas ir turėjo realų svorį.';
    if(social)return 'Viena galima interpretacija: prasmingas indėlis tau gali būti stipriau susijęs su vieta tarp kitų žmonių nei su individualiu pasiekimu.';
    if(learning||mastery)return 'Viena galima interpretacija: noras daugiau mokėti ar suprasti gali būti susijęs ne vien su augimu pačiu savaime, o su noru turėti daugiau kuo prasmingai prisidėti.';
  }
  if(routeId==='MEANING_PURPOSE'){
    if(hasAny(ids,['AUTONOMY','MASTERY','RECOGNITION']))return 'Viena galima interpretacija: prasmingumas tau gali atsirasti ne iš abstraktaus „tikslo“, o tada, kai gali veikti savaip, panaudoti gebėjimus ir matyti savo darbo svorį.';
    if(hasAny(ids,['BELONGING','CONNECTION','CARE']))return 'Viena galima interpretacija: prasmė tau gali būti labiau susijusi su santykiu ir poveikiu žmonėms nei su pačia veikla atskirai.';
  }
  if(routeId==='LEARNING_GROWTH'&&hasAny(ids,['KNOWLEDGE','EXPLORATION','MASTERY','OPPORTUNITY'])){
    return 'Viena galima interpretacija: čia pirmas žvilgsnis ir tavo dabartinis įvertinimas priartėja prie tos pačios temos. Tai ne patvirtinimas, kad viena sukėlė kitą, bet gali būti ženklas pasižiūrėti, ar šiuo metu turi pakankamai erdvės smalsumui, mokymuisi ir realiam gebėjimų augimui.';
  }
  if(routeId==='CAPABILITY_MASTERY'&&hasAny(ids,['MASTERY','KNOWLEDGE','AUTONOMY'])){
    return 'Viena galima interpretacija: tau gali būti svarbu ne tik turėti gebėjimų, bet turėti progą juos realiai panaudoti, tobulinti ir veikti ne vien pagal jau išmoktą rutiną.';
  }
  if(routeId==='AUTONOMY_AGENCY'&&hasAny(ids,['AUTONOMY','CONTROL','OPPORTUNITY'])){
    return 'Viena galima interpretacija: čia gali būti svarbi ne „laisvė apskritai“, o labai konkreti patirtis, kad tavo sprendimas iš tikrųjų keičia tai, kas vyksta.';
  }
  if(routeId==='RECOGNITION_ESTEEM'){
    if(hasAny(ids,['RECOGNITION']))return 'Viena galima interpretacija: tai, kas spontaniškai traukė dėmesį, ir tai, ko šiuo metu nepakanka, priartėja prie tos pačios temos: būti pastebėtam ne dėl statuso, o dėl realaus indėlio.';
    if(hasAny(ids,['MASTERY','KNOWLEDGE']))return 'Viena galima interpretacija: gali būti svarbu ne tik gerai padaryti ar daug žinoti, bet jausti, kad tai yra matoma ir turi vertę kitiems.';
  }
  if(routeId==='CONNECTION_BELONGING'&&hasAny(ids,['BELONGING','CONNECTION','CARE','RECOGNITION'])){
    return 'Viena galima interpretacija: tau gali būti svarbus ne tiesiog kontaktų kiekis, o patirtis, kad esi matomas, priimtas ir turi tikrą vietą tarp kitų.';
  }
  if(routeId==='CARE_SUPPORT_PRESENT'&&hasAny(ids,['CARE','CONNECTION','BELONGING','SAFETY'])){
    return 'Viena galima interpretacija: šiuo metu gali būti svarbu ne vien būti tarp žmonių, o patirti, kad ryšys veikia ir į tavo pusę: kad paramą galima ne tik duoti, bet ir gauti.';
  }
  if(routeId==='SAFETY_STABILITY'&&hasAny(ids,['SAFETY','ORDER','CONTROL','REST'])){
    return 'Viena galima interpretacija: saugumo jausmas tau gali būti susijęs ne tik su apsauga nuo grėsmės, bet ir su aiškesniu pagrindu, nuspėjamumu bei galimybe bent dalį situacijos valdyti.';
  }
  if(routeId==='CLARITY_PREDICTABILITY'&&hasAny(ids,['ORDER','CONTROL','SAFETY'])){
    return 'Viena galima interpretacija: neaiškumas gali varginti ne todėl, kad tau reikia viską kontroliuoti, o todėl, kad aiškesnis veiksmo ir pasekmės ryšys leidžia ramiau veikti.';
  }
  if(routeId==='RESTORATION_ENERGY'&&hasAny(ids,['REST','RESOURCE'])){
    return 'Viena galima interpretacija: poilsio klausimas gali būti ne apie pasyvumą, o apie realų resurso atstatymą, kad vėl turėtum iš ko veikti.';
  }
  if(routeId==='MATERIAL_RESOURCES'&&hasAny(ids,['RESOURCE','OPPORTUNITY','CONTROL'])){
    return 'Viena galima interpretacija: šiuo metu galimybės gali būti ribojamos ne motyvacijos, o labai praktiško prieinamumo: ar turi tai, ko reikia, kad galėtum veikti.';
  }
  return '';
}
function specificBridgeEn(routeId,repeats){
  const ids=new Set(repeats.map(function(x){return x.familyId}));
  if(routeId==='CONTRIBUTION'){
    const social=hasAny(ids,['BELONGING','CONNECTION']);
    const recognition=ids.has('RECOGNITION');
    const learning=hasAny(ids,['KNOWLEDGE','EXPLORATION']);
    const mastery=ids.has('MASTERY');
    if(recognition&&social){
      let s='One possible reading is that recognition or belonging may not matter separately as much as being able to contribute meaningfully while feeling that your contribution is visible and has a place among others.';
      if(learning)s+=' Learning and understanding may then matter not as an isolated goal, but as a way to understand more, be able to do more and have more to contribute.';
      else if(mastery)s+=' Using your abilities may then matter not only as mastery, but as a way to have more real impact.';
      return s;
    }
    if(recognition)return 'One possible reading is that it may matter not only to contribute, but to see that the contribution was noticed and carried real weight.';
    if(social)return 'One possible reading is that meaningful contribution may be tied more strongly to having a place among other people than to individual achievement.';
    if(learning||mastery)return 'One possible reading is that wanting to know or do more may connect not only to growth itself, but to having more with which to contribute meaningfully.';
  }
  if(routeId==='LEARNING_GROWTH'&&hasAny(ids,['KNOWLEDGE','EXPLORATION','MASTERY','OPPORTUNITY']))return 'The first-glance and current sufficiency views come close to the same theme here. That does not prove one caused the other, but it may be useful to ask whether you currently have enough room for curiosity, learning and real growth in capability.';
  if(routeId==='AUTONOMY_AGENCY'&&hasAny(ids,['AUTONOMY','CONTROL','OPPORTUNITY']))return 'One possible reading is that what matters may not be “freedom” in the abstract, but the concrete experience that your own decision actually changes what happens.';
  if(routeId==='CONNECTION_BELONGING'&&hasAny(ids,['BELONGING','CONNECTION','CARE','RECOGNITION']))return 'One possible reading is that what matters may not be the number of contacts, but the experience of being seen, accepted and having a real place among others.';
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
    const bridge=lang==='en'?specificBridgeEn(routeIds[0],repeats):specificBridgeLt(routeIds[0],repeats);
    paragraphs.push(bridge||C.genericBridge);
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
