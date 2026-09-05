import assert from 'node:assert/strict';
import { buildHumanInterpretationV04, RESULT_INTERPRETATION_SCHEMA_V04 } from './result_interpretation_v04.mjs';

const familyLabels={
  RECOGNITION:'Pripažinimas',
  BELONGING:'Priklausymas',
  CONNECTION:'Ryšys',
  KNOWLEDGE:'Mokymasis / supratimas',
  EXPLORATION:'Tyrinėjimas',
  AUTONOMY:'Autonomija',
  MASTERY:'Meistriškumas',
  CARE:'Rūpestis / pagalba',
  SAFETY:'Saugumas',
  CONTROL:'Tiesioginis valdymas',
  RESOURCE:'Resursų prieinamumas',
  OPPORTUNITY:'Galimybė',
  ORDER:'Tvarka / struktūra',
  REST:'Poilsis / atsigavimas'
};

const model={
  repeatedMost:[
    {familyId:'BELONGING',count:3},
    {familyId:'RECOGNITION',count:3},
    {familyId:'KNOWLEDGE',count:2}
  ],
  backgroundFamilyIds:['ORDER','REST'],
  sufficiencyItemIds:['CONTRIBUTION'],
  focusFamilyId:'RECOGNITION',
  attentionClarifierNoClear:false
};

const x=buildHumanInterpretationV04({model,lang:'lt',familyLabels});
assert.equal(x.schema,RESULT_INTERPRETATION_SCHEMA_V04);
assert.equal(x.title,'Viena galima interpretacija');
assert.match(x.disclaimer,/Ne diagnozė/);
assert.ok(x.paragraphs.some(p=>p.includes('galimybes prisidėti prie kažko svarbaus')));
assert.ok(x.paragraphs.some(p=>p.includes('indėlis ne tik egzistuoja, bet yra matomas')));
assert.ok(x.paragraphs.some(p=>p.includes('Mokymasis / supratimas')));
assert.ok(x.paragraphs.some(p=>p.includes('Tvarka / struktūra')&&p.includes('Poilsis / atsigavimas')));
assert.match(x.question,/Kur šiuo metu labiausiai jauti/);

const noStory=buildHumanInterpretationV04({
  model:{repeatedMost:[],backgroundFamilyIds:[],sufficiencyItemIds:[]},
  lang:'lt',
  familyLabels:{}
});
assert.ok(noStory.paragraphs.some(p=>p.includes('neverta dirbtinai ieškoti')));
assert.ok(noStory.paragraphs.some(p=>p.includes('nė viena vizualinė kryptis')));

const multi=buildHumanInterpretationV04({
  model:{
    repeatedMost:[{familyId:'RECOGNITION',count:2}],
    backgroundFamilyIds:[],
    sufficiencyItemIds:['CONTRIBUTION','RECOGNITION_ESTEEM']
  },
  lang:'lt',
  familyLabels
});
assert.ok(multi.paragraphs.some(p=>p.includes('Kelioms sritims')));
assert.ok(multi.paragraphs.some(p=>p.includes('nereikia sujungti per jėgą')));


function body(v){return v.paragraphs.join(' ')}

const noClear=buildHumanInterpretationV04({
  model:{repeatedMost:[{familyId:'RECOGNITION',count:3}],backgroundFamilyIds:[],sufficiencyItemIds:['RECOGNITION_ESTEEM'],focusFamilyId:null,attentionClarifierNoClear:true},
  lang:'lt',familyLabels
});
assert.ok(body(noClear).includes('nė viena kryptis tau nebuvo aiškiai artimesnė'));
assert.ok(!body(noClear).includes('gana tiesioginis teminis persidengimas'));


const weak=buildHumanInterpretationV04({
  model:{repeatedMost:[{familyId:'AUTONOMY',count:2}],backgroundFamilyIds:[],sufficiencyItemIds:['MEANING_PURPOSE'],focusFamilyId:'AUTONOMY',attentionClarifierNoClear:false},
  lang:'lt',familyLabels
});
assert.ok(body(weak).includes('nereikia sujungti per jėgą'));
assert.ok(!body(weak).includes('Meistriškumas'));
assert.ok(!body(weak).includes('Pripažinimas'));


const noParallel=buildHumanInterpretationV04({
  model:{repeatedMost:[{familyId:'BELONGING',count:3},{familyId:'RECOGNITION',count:2}],backgroundFamilyIds:[],sufficiencyItemIds:['MATERIAL_RESOURCES'],focusFamilyId:'BELONGING',attentionClarifierNoClear:false},
  lang:'lt',familyLabels
});
assert.ok(body(noParallel).includes('nereikia sujungti per jėgą'));


const noLowRoute=buildHumanInterpretationV04({
  model:{repeatedMost:[{familyId:'RECOGNITION',count:2}],backgroundFamilyIds:[],sufficiencyItemIds:[],focusFamilyId:'RECOGNITION',attentionClarifierNoClear:false},
  lang:'lt',familyLabels
});
assert.equal(noLowRoute.paragraphs.length,2);


const careRole=buildHumanInterpretationV04({
  model:{repeatedMost:[{familyId:'CARE',count:3}],backgroundFamilyIds:[],sufficiencyItemIds:['CARE_SUPPORT_PRESENT'],focusFamilyId:'CARE',attentionClarifierNoClear:false},
  lang:'lt',familyLabels
});
assert.ok(body(careRole).includes('vien iš jų negalima spręsti'));
assert.ok(body(careRole).includes('rūpinimasis kitu'));


const safetyRest=buildHumanInterpretationV04({
  model:{repeatedMost:[{familyId:'REST',count:2}],backgroundFamilyIds:[],sufficiencyItemIds:['SAFETY_STABILITY'],focusFamilyId:'REST',attentionClarifierNoClear:false},
  lang:'lt',familyLabels
});
assert.ok(body(safetyRest).includes('nereikia sujungti per jėgą'));

console.log('result_interpretation_v04: PASS');
