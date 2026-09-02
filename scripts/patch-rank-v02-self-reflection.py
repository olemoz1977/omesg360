from pathlib import Path

p=Path('priolens/open14-rank-v02/index.html')
s=p.read_text()

old=".heroQuestion{font-size:clamp(22px,5vw,30px);font-weight:850;line-height:1.2;margin-top:18px}.linkNote{font-size:13px;color:#bdbdb7;margin-top:12px}"
new=".heroImages{display:grid;grid-template-columns:repeat(2,minmax(0,120px));gap:8px;margin:4px 0 16px}.heroImages img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px;border:1px solid #454545}.heroQuestion{font-size:clamp(22px,5vw,30px);font-weight:850;line-height:1.2;margin-top:18px}.reasonOptions{display:grid;gap:8px;margin-top:16px}.reasonOption{width:100%;text-align:left;border:1px solid #555;background:#242424;color:#fff;border-radius:12px;padding:11px 12px;min-height:44px;font-size:15px;line-height:1.35}.reasonOption.on{background:#fff;color:#181818;border-color:#fff;font-weight:760}.reasonFeedback{margin-top:16px;padding-top:14px;border-top:1px solid #444;font-size:15px;line-height:1.5;color:#fff}.reasonSave{margin-top:8px;font-size:12px;color:#aaa}.linkNote{font-size:13px;color:#bdbdb7;margin-top:12px}"
assert old in s
s=s.replace(old,new,1)

old='''  <div class="hero"><div class="label">KĄ VERTA PASTEBĖTI</div><h2 id="heroTitle"></h2><p id="heroText"></p><div id="heroQuestion" class="heroQuestion"></div><div id="heroLinkNote" class="linkNote"></div></div>'''
new='''  <div class="hero"><div class="label">KĄ VERTA PASTEBĖTI</div><div id="heroImages" class="heroImages hidden"></div><h2 id="heroTitle"></h2><p id="heroText"></p><div id="heroQuestion" class="heroQuestion"></div><div id="reasonOptions" class="reasonOptions hidden"></div><div id="reasonFeedback" class="reasonFeedback hidden"></div><div id="reasonSave" class="reasonSave hidden"></div><div id="heroLinkNote" class="linkNote"></div></div>'''
assert old in s
s=s.replace(old,new,1)

old="const ANSWER_LABEL={1:'Visai nepakanka',2:'Greičiau nepakanka',3:'Per vidurį',4:'Greičiau pakanka',5:'Visiškai pakanka'};\nconst LINK={"
new="""const ANSWER_LABEL={1:'Visai nepakanka',2:'Greičiau nepakanka',3:'Per vidurį',4:'Greičiau pakanka',5:'Visiškai pakanka'};
const MOST_REASON_OPTIONS=[
 ['WANT_MORE','Norėčiau daugiau to savo gyvenime'],
 ['IMPORTANT_NOW','Man tai dabar svarbu'],
 ['REMINDS_ME','Primena žmogų ar situaciją'],
 ['LIKE_SCENE','Patinka tai, ką matau'],
 ['JUST_IMAGE','Tiesiog patraukė pats vaizdas'],
 ['DONT_KNOW','Nežinau']
];
const LEAST_REASON_OPTIONS=[
 ['LESS_RELEVANT_NOW','Man tai dabar mažiau aktualu'],
 ['ENOUGH_NOW','Jaučiu, kad šito man pakanka'],
 ['REMINDS_ME','Primena žmogų ar situaciją'],
 ['DISLIKE_SCENE','Nepatinka tai, ką matau'],
 ['JUST_IMAGE','Tiesiog pats vaizdas traukė mažiau'],
 ['DONT_KNOW','Nežinau']
];
const SIMPLE_REASON_OPTIONS=[['YES_RECOGNIZE','Taip, atpažįstu'],['NOT_REALLY','Nelabai'],['DONT_KNOW','Nežinau']];
const LINK={"""
assert old in s
s=s.replace(old,new,1)

old="state={schema:'2rasi.priolens.open14.rank-session-v0.2',seed,startedAt:new Date().toISOString(),trials:[],pendingMost:null,sufficiency:{},suffIndex:0,completedAt:null};"
new="state={schema:'2rasi.priolens.open14.rank-session-v0.2',seed,startedAt:new Date().toISOString(),trials:[],pendingMost:null,sufficiency:{},suffIndex:0,selfExplanation:null,completedAt:null};"
assert old in s
s=s.replace(old,new,1)

start=s.index("function chooseHero(S){")
end=s.index("\nfunction finish(){",start)
block=r'''function mostReasonFeedback(code,h){
 const v=h.v;
 if(code==='WANT_MORE'){
  if(Number.isFinite(v)&&v<=2)return 'Tai dera su tuo, ką jau sakei: šioje vietoje dabar nepakanka.';
  if(Number.isFinite(v)&&v>=4)return 'Čia atsiranda skirtumas: prieš tai sakei, kad tau pakanka, o dabar sakai, kad vis tiek norėtum daugiau. „Pakanka“ ir „norėčiau daugiau“ nėra tas pats.';
  return 'Gali būti, kad šie vaizdai priminė tai, ko norėtųsi daugiau.';
 }
 if(code==='IMPORTANT_NOW'){
  if(Number.isFinite(v)&&v<=2)return 'Gali būti, kad ši tema tau ir svarbi, ir šioje vietoje dabar ne visai pakanka.';
  if(Number.isFinite(v)&&v>=4)return 'Svarbu nebūtinai reiškia, kad trūksta. Gal ši tema tau tiesiog dabar rūpi.';
  return 'Svarbu nebūtinai reiškia, kad trūksta. Gal ši tema tau tiesiog dabar rūpi.';
 }
 if(code==='REMINDS_ME')return 'Tuomet vaizdai galėjo suveikti kaip priminimas apie konkretų žmogų ar situaciją.';
 if(code==='LIKE_SCENE')return 'Tuomet tave galėjo patraukti pats veiksmas, jausmas ar situacija vaizde.';
 if(code==='JUST_IMAGE')return 'Tai irgi galimas atsakymas. Kartais vaizdas pagauna akį anksčiau, nei žinome kodėl.';
 return 'Nežinoti irgi galima. PrioLens čia nebandys atsakyti už tave.';
}
function leastReasonFeedback(code,h){
 const v=h.v;
 if(code==='LESS_RELEVANT_NOW'){
  if(Number.isFinite(v)&&v<=2)return 'Čia ir yra įdomus skirtumas: pats sakei, kad šioje vietoje dabar nepakanka, bet jos vaizdai tau liko mažiau aktualūs. Trūkumas ir dėmesys nebūtinai juda kartu.';
  if(Number.isFinite(v)&&v>=4)return 'Tai gali derėti su tavo ankstesniu atsakymu, kad šioje vietoje tau dabar pakanka. Vis dėlto tai nepasako, kodėl būtent šie vaizdai traukė mažiau.';
  return 'Gali būti, kad ši tema šiuo metu tiesiog nėra tavo dėmesio centre.';
 }
 if(code==='ENOUGH_NOW'){
  if(Number.isFinite(v)&&v<=2)return 'Čia atsiranda skirtumas: ankstesniame klausime sakei, kad šioje vietoje nepakanka, o dabar šie vaizdai tau siejasi su jausmu „man pakanka“. Gal vaizdas ir klausimas tau reiškė ne visai tą patį.';
  if(Number.isFinite(v)&&v>=4)return 'Tai dera su tuo, ką jau sakei: šioje vietoje tau dabar pakanka.';
  return 'Gali būti, kad šie vaizdai tau siejasi su tuo, ko šiuo metu ir taip pakanka.';
 }
 if(code==='REMINDS_ME')return 'Tuomet mažesnį patrauklumą galėjo paveikti konkretus žmogus, situacija ar prisiminimas.';
 if(code==='DISLIKE_SCENE')return 'Tuomet rezultatą galėjo lemti pati scena, o ne platesnė tema, kurią bandome stebėti.';
 if(code==='JUST_IMAGE')return 'Tai irgi galimas atsakymas. Kartais skirtumą sukuria pats vaizdas, o ne jo tema.';
 return 'Nežinoti irgi galima. PrioLens čia nebandys atsakyti už tave.';
}
function simpleReasonFeedback(code){
 if(code==='YES_RECOGNIZE')return 'Tuomet verta ties tuo ir sustoti. Tai tavo paties atpažintas ryšys, ne PrioLens išvada.';
 if(code==='NOT_REALLY')return 'Tuomet šio sugretinimo neverta spausti. Rezultatas gali likti tik šios sesijos pasirinkimų aprašymu.';
 return 'Nežinoti irgi galima. Nebūtina iš šios sesijos išspausti vieną paaiškinimą.';
}
function renderReflection(h){
 const images=$('heroImages'),options=$('reasonOptions'),feedback=$('reasonFeedback'),saved=$('reasonSave');
 images.innerHTML='';feedback.textContent='';saved.textContent='';feedback.classList.add('hidden');saved.classList.add('hidden');
 if(h.focusFamily&&(h.reflection==='most'||h.reflection==='least')){
  const ps=paths(h.focusFamily,h.reflection).slice(0,2);
  if(ps.length){images.innerHTML=ps.map(src=>`<img src="${src}" alt="">`).join('');images.classList.remove('hidden')}else images.classList.add('hidden');
 }else images.classList.add('hidden');
 const opts=h.reflection==='most'?MOST_REASON_OPTIONS:h.reflection==='least'?LEAST_REASON_OPTIONS:SIMPLE_REASON_OPTIONS;
 $('heroQuestion').textContent=h.reflection==='most'?'Kaip tau atrodo, kodėl būtent šie vaizdai tave traukė?':h.reflection==='least'?'Kaip tau atrodo, kodėl būtent šie vaizdai traukė mažiau?':h.q;
 options.innerHTML=opts.map(([code,label])=>`<button type="button" class="reasonOption" data-reason="${code}">${label}</button>`).join('');
 options.classList.remove('hidden');
 options.querySelectorAll('.reasonOption').forEach(btn=>btn.onclick=()=>{
  options.querySelectorAll('.reasonOption').forEach(x=>x.classList.toggle('on',x===btn));
  const code=btn.dataset.reason;
  state.selfExplanation={schema:'2rasi.priolens.rank-self-explanation-v0.1',direction:h.reflection,familyId:h.focusFamily||null,scenario:h.scenario||'GENERAL',reasonCode:code,answeredAt:new Date().toISOString()};
  save();
  feedback.textContent=h.reflection==='most'?mostReasonFeedback(code,h):h.reflection==='least'?leastReasonFeedback(code,h):simpleReasonFeedback(code);
  feedback.classList.remove('hidden');saved.textContent='Tavo atsakymas išsaugotas šiame įrenginyje.';saved.classList.remove('hidden');
 });
}
function chooseHero(S){const most=pairCandidates(S,'most'),least=pairCandidates(S,'least');
 const lowLeast=best(least.filter(z=>z.state==='low'));if(lowLeast)return{title:'Sakai, kad šito dabar trūksta. Bet vaizdai liko antrame plane.',text:`${softPrefix(lowLeast)}Apie „${ITEM_LABEL[lowLeast.link.item]}“ pažymėjai „${ANSWER_LABEL[lowLeast.v]}“. O „${LABEL[lowLeast.f]}“ ${lowLeast.count} iš 3 kartų pateko tarp mažiausiai traukusių.`,q:'Ar tau pačiam šis skirtumas atrodo netikėtas?',note:lowLeast.link.kind==='RELATED'?'Sugretinimas pažymėtas kaip susijęs, bet ne tiesioginis.':'',reflection:'least',focusFamily:lowLeast.f,v:lowLeast.v,scenario:'LOW_LEAST'};
 const lowMost=best(most.filter(z=>z.state==='low'));if(lowMost)return{title:'Čia abi pusės rodo į panašią vietą.',text:`${softPrefix(lowMost)}„${LABEL[lowMost.f]}“ traukė ${lowMost.count} iš 3 kartų. Apie „${ITEM_LABEL[lowMost.link.item]}“ pažymėjai „${ANSWER_LABEL[lowMost.v]}“.`,q:'Ar tau šie du dalykai atrodo susiję?',note:lowMost.link.kind==='RELATED'?'Sugretinimas pažymėtas kaip susijęs, bet ne tiesioginis.':'',reflection:'most',focusFamily:lowMost.f,v:lowMost.v,scenario:'LOW_MOST'};
 const highMost=best(most.filter(z=>z.state==='high'));if(highMost)return{title:'Traukė tai, ko, tavo žodžiais, pakanka.',text:`${softPrefix(highMost)}„${LABEL[highMost.f]}“ traukė ${highMost.count} iš 3 kartų. Apie „${ITEM_LABEL[highMost.link.item]}“ pažymėjai „${ANSWER_LABEL[highMost.v]}“.`,q:'Kas tuose vaizduose vis tiek tave užkabino?',note:highMost.link.kind==='RELATED'?'Sugretinimas pažymėtas kaip susijęs, bet ne tiesioginis.':'',reflection:'most',focusFamily:highMost.f,v:highMost.v,scenario:'HIGH_MOST'};
 const highLeast=best(least.filter(z=>z.state==='high'));if(highLeast)return{title:'Ši vieta tau atrodo pakankama ir kartu liko antrame plane.',text:`${softPrefix(highLeast)}„${LABEL[highLeast.f]}“ ${highLeast.count} iš 3 kartų pateko tarp mažiausiai traukusių. Apie „${ITEM_LABEL[highLeast.link.item]}“ pažymėjai „${ANSWER_LABEL[highLeast.v]}“.`,q:'Ar tau tai atrodo natūralu šiuo metu?',note:highLeast.link.kind==='RELATED'?'Sugretinimas pažymėtas kaip susijęs, bet ne tiesioginis.':'',reflection:'least',focusFamily:highLeast.f,v:highLeast.v,scenario:'HIGH_LEAST'};
 const strongMost=Object.entries(S).filter(([,x])=>x.strongMost).sort((a,b)=>b[1].most-a[1].most),strongLeast=Object.entries(S).filter(([,x])=>x.strongLeast).sort((a,b)=>b[1].least-a[1].least);
 if(strongMost.length&&strongLeast.length)return{title:'Tavo dėmesys turėjo dvi aiškias kryptis.',text:`Dažniausiai traukė „${LABEL[strongMost[0][0]]}“, o dažniausiai antrame plane liko „${LABEL[strongLeast[0][0]]}“.`,q:'Ar toks skirtumas panašus į tai, kuo dabar iš tikrųjų gyveni?',note:'Čia nejungiame antros dalies atsakymų, nes neradome pakankamai aiškios palyginamos poros.',reflection:'simple',focusFamily:null,v:null,scenario:'MIXED_VISUAL'};
 if(strongMost.length)return{title:'Viena tema vis grįžo į pirmą vietą.',text:`„${LABEL[strongMost[0][0]]}“ traukė ${strongMost[0][1].most} iš 3 kartų.`,q:'Kas šioje temoje tau dabar gali būti gyva ar svarbu?',note:'Antros dalies atsakymų čia nejungiame be aiškios poros.',reflection:'most',focusFamily:strongMost[0][0],v:null,scenario:'MOST_ONLY'};
 if(strongLeast.length)return{title:'Viena tema dažniau liko antrame plane.',text:`„${LABEL[strongLeast[0][0]]}“ ${strongLeast[0][1].least} iš 3 kartų pateko tarp mažiausiai traukusių.`,q:'Ar tau pačiam tai ką nors sako apie dabartinę situaciją?',note:'Antros dalies atsakymų čia nejungiame be aiškios poros.',reflection:'least',focusFamily:strongLeast[0][0],v:null,scenario:'LEAST_ONLY'};
 return{title:'Šį kartą viena kryptis aiškiai neišsiskyrė.',text:'Pasirinkimai nesusidarė į aiškų 2/3 ar 3/3 pasikartojimą.',q:'Ar tai atitinka tavo jausmą atliekant testą?',note:'',reflection:'simple',focusFamily:null,v:null,scenario:'QUIET'};
}'''
s=s[:start]+block+s[end:]

start=s.index("function finish(){")
end=s.index("\n$('start').onclick",start)
block=r'''function finish(){
 state.completedAt=state.completedAt||new Date().toISOString();save();
 const S=stats(),most=Object.entries(S).filter(([,x])=>x.strongMost).sort((a,b)=>b[1].most-a[1].most),least=Object.entries(S).filter(([,x])=>x.strongLeast).sort((a,b)=>b[1].least-a[1].least);
 show('result');renderSignals('mostGrid',most,'most');renderSignals('leastGrid',least,'least');
 const h=chooseHero(S);$('heroTitle').textContent=h.title;$('heroText').textContent=h.text;renderReflection(h);
 const extra=unmatchedLowContext();$('heroLinkNote').textContent=[h.note||'',extra].filter(Boolean).join(' ');
 const ordered=Object.entries(S).sort((a,b)=>b[1].balance-a[1].balance||b[1].most-a[1].most);
 $('mapBody').innerHTML=ordered.map(([f,x])=>`<tr><td>${LABEL[f]}</td><td class="num">${x.most}</td><td class="num">${x.least}</td><td class="num ${x.balance>0?'pos':x.balance<0?'neg':''}">${x.balance>0?'+':''}${x.balance}</td></tr>`).join('')
}'''
s=s[:start]+block+s[end:]

for needle in [
 '2rasi.priolens.rank-self-explanation-v0.1',
 'Norėčiau daugiau to savo gyvenime',
 'Man tai dabar mažiau aktualu',
 'Kaip tau atrodo, kodėl būtent šie vaizdai traukė mažiau?',
 'renderReflection(h)'
]:
 assert needle in s, needle

a=s.index('<script type="module">')+len('<script type="module">')
b=s.index('</script>',a)
Path('/tmp/rank-v02.mjs').write_text(s[a:b])
p.write_text(s)

w=Path('.github/workflows/deploy-priolens-open14-rank-v02.yml')
x=w.read_text()
marker="              'unmatchedLowContext',\n"
assert marker in x
x=x.replace(marker,marker+"              '2rasi.priolens.rank-self-explanation-v0.1',\n              'Norėčiau daugiau to savo gyvenime',\n              'Man tai dabar mažiau aktualu',\n",1)
smoke="          grep -Fq 'unmatchedLowContext' /tmp/live\n"
assert smoke in x
x=x.replace(smoke,smoke+"          grep -Fq '2rasi.priolens.rank-self-explanation-v0.1' /tmp/live\n          grep -Fq 'Kaip tau atrodo, kodėl būtent šie vaizdai traukė mažiau?' /tmp/live\n",1)
w.write_text(x)
