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
assert.ok(x.paragraphs.some(p=>p.includes('neužtenka tiesiog „daryti savo darbą“')));
assert.ok(x.paragraphs.some(p=>p.includes('indėlis matomas bei turi vietą tarp kitų')));
assert.ok(x.paragraphs.some(p=>p.includes('Mokymasis ir supratimas')));
assert.ok(x.paragraphs.some(p=>p.includes('Tvarka / struktūra')&&p.includes('Poilsis / atsigavimas')));
assert.match(x.question,/daug darai/);

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

console.log('result_interpretation_v04: PASS');
