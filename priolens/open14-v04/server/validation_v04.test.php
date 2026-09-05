<?php
require_once __DIR__.'/validation_v04.php';

function t_assert($cond,string $message): void { if(!$cond) throw new RuntimeException($message); }
function t_throws(callable $fn,string $contains): void {
    try { $fn(); }
    catch (InvalidArgumentException $e) { t_assert(str_contains($e->getMessage(),$contains),'Unexpected error: '.$e->getMessage()); return; }
    throw new RuntimeException('Expected InvalidArgumentException containing: '.$contains);
}

function choices_from_counts(array $counts): array {
    $out=[];
    foreach ($counts as $family=>$n) {
        for($i=1;$i<=$n;$i++) $out[]=['choice'=>['familyId'=>$family,'exemplarId'=>$family.'-'.str_pad((string)$i,2,'0',STR_PAD_LEFT)]];
    }
    return $out;
}

function attention_counts(array $choices): array {
    $out=array_fill_keys(v04_family_ids(),0);
    foreach($choices as $x) if(isset($x['choice']['familyId'])) $out[$x['choice']['familyId']]++;
    return $out;
}

function cards(array $families,int $count): array {
    $out=[];
    foreach($families as $family){
        $ids=[];for($i=1;$i<=$count;$i++)$ids[]=$family.'-'.str_pad((string)$i,2,'0',STR_PAD_LEFT);
        $out[]=['familyId'=>$family,'rawMostCount'=>$count,'exemplarIds'=>$ids];
    }
    return $out;
}

function direct_attention(array $choices,string $family,int $count,string $source): array {
    $focus=['familyId'=>$family,'source'=>$source,'rawMostCount'=>$count];
    return [
        'attentionResolution'=>[
            'schema'=>'2rasi.priolens.open14.attention-resolution-v0.4','counts'=>attention_counts($choices),
            'source'=>$source,'focus'=>$focus,'clarifierRequired'=>false,'candidates'=>[]
        ],
        'attentionClarifier'=>null,'attentionFocus'=>$focus
    ];
}

function unresolved_aplus(array $choices,array $families,int $count,string $source): array {
    return [
        'attentionResolution'=>[
            'schema'=>'2rasi.priolens.open14.attention-resolution-v0.4','counts'=>attention_counts($choices),
            'source'=>$source,'focus'=>null,'clarifierRequired'=>true,'candidates'=>cards($families,$count)
        ],
        'attentionClarifier'=>null,'attentionFocus'=>null
    ];
}

function selected_aplus(array $choices,array $families,int $count,string $source,string $selected): array {
    $candidateCards=cards($families,$count);
    $clarifier=[
        'schema'=>'2rasi.priolens.open14.attention-clarifier-v0.4','trigger'=>$source,
        'candidateFamilies'=>$families,'candidateCards'=>$candidateCards,
        'selectedFamilyId'=>$selected,'noClear'=>false,'rtMs'=>321,'answeredAt'=>'2026-09-04T00:00:00Z'
    ];
    $focus=['familyId'=>$selected,'source'=>$source,'rawMostCount'=>$count];
    return [
        'attentionResolution'=>[
            'schema'=>'2rasi.priolens.open14.attention-resolution-v0.4','counts'=>attention_counts($choices),
            'source'=>$source,'focus'=>$focus,'clarifierRequired'=>false,'candidates'=>$candidateCards,'clarifier'=>$clarifier
        ],
        'attentionClarifier'=>$clarifier,'attentionFocus'=>$focus
    ];
}

function suff(array $overrides=[]): array {
    $out=[];foreach(v04_b_item_ids() as $id)$out[$id]=$overrides[$id]??5;
    foreach($overrides as $id=>$v)$out[$id]=$v;
    return $out;
}

function b_direct(string $item,int $min): array {
    $r=['schema'=>'2rasi.priolens.open14.sufficiency-resolution-v0.4','source'=>'B_DIRECT_UNIQUE_MIN','minimumValue'=>$min,'clarifierRequired'=>false,'candidates'=>[$item],'routeItemIds'=>[$item]];
    return ['sufficiencyResolution'=>$r,'sufficiencyClarifier'=>null,'sufficiencyRoute'=>['itemIds'=>[$item],'source'=>'B_DIRECT_UNIQUE_MIN','minimumValue'=>$min]];
}

function b_no_low(int $min=5): array {
    $r=['schema'=>'2rasi.priolens.open14.sufficiency-resolution-v0.4','source'=>'B_NO_LOW_ROUTE','minimumValue'=>$min,'clarifierRequired'=>false,'candidates'=>[],'routeItemIds'=>[]];
    return ['sufficiencyResolution'=>$r,'sufficiencyClarifier'=>null,'sufficiencyRoute'=>['itemIds'=>[],'source'=>'B_NO_LOW_ROUTE','minimumValue'=>$min]];
}

function b_unresolved(array $items,int $min): array {
    $r=['schema'=>'2rasi.priolens.open14.sufficiency-resolution-v0.4','source'=>'B_PLUS_TIED_MIN','minimumValue'=>$min,'clarifierRequired'=>true,'candidates'=>$items,'routeItemIds'=>[]];
    return ['sufficiencyResolution'=>$r,'sufficiencyClarifier'=>null,'sufficiencyRoute'=>['itemIds'=>[],'source'=>'B_PLUS_TIED_MIN','minimumValue'=>$min]];
}

function b_selected(array $items,int $min,string $selected): array {
    $clarifier=['schema'=>'2rasi.priolens.open14.sufficiency-clarifier-v0.4','minimumValue'=>$min,'candidateItems'=>$items,'selectedItemId'=>$selected,'similar'=>false,'hardToSay'=>false,'answeredAt'=>'2026-09-04T00:00:00Z'];
    $r=['schema'=>'2rasi.priolens.open14.sufficiency-resolution-v0.4','source'=>'B_PLUS_SELECTED','minimumValue'=>$min,'clarifierRequired'=>false,'candidates'=>$items,'routeItemIds'=>[$selected],'clarifier'=>$clarifier];
    return ['sufficiencyResolution'=>$r,'sufficiencyClarifier'=>$clarifier,'sufficiencyRoute'=>['itemIds'=>[$selected],'source'=>'B_PLUS_SELECTED','minimumValue'=>$min]];
}

function base_body(array $choices,array $sufficiency): array {
    return [
        'schema'=>'2rasi.priolens.open14.rank-session-v0.4','bankSchema'=>'2rasi.priolens.open14.bank-v0.3.1','sufficiencySchema'=>'2rasi.priolens.sufficiency-v0.3',
        'choices'=>$choices,'sufficiency'=>$sufficiency,'rankProtocol'=>'most+least+a-plus+b-plus-v0.4',
        'attentionResolution'=>null,'attentionClarifier'=>null,'attentionFocus'=>null,
        'sufficiencyResolution'=>null,'sufficiencyClarifier'=>null,'sufficiencyRoute'=>null
    ];
}

$directChoices=choices_from_counts(['REST'=>3,'SAFETY'=>2,'ORDER'=>2,'CARE'=>2,'AUTONOMY'=>2,'MASTERY'=>2,'CONNECTION'=>1]);
t_assert(count($directChoices)===14,'direct choice fixture must have 14 choices');
$body=base_body($directChoices,suff(['RESTORATION_ENERGY'=>2]));
$body=array_merge($body,direct_attention($directChoices,'REST',3,'A_DIRECT_UNIQUE_3_OF_3'),b_direct('RESTORATION_ENERGY',2));
validate_v04_payload($body,false);

$two3Choices=choices_from_counts(['REST'=>3,'SAFETY'=>3,'ORDER'=>2,'CARE'=>2,'AUTONOMY'=>2,'MASTERY'=>2]);
t_assert(count($two3Choices)===14,'A+ fixture must have 14 choices');
$body=base_body($two3Choices,[]);
$body=array_merge($body,unresolved_aplus($two3Choices,['REST','SAFETY'],3,'A_PLUS_RUNOFF_3_OF_3'));
validate_v04_payload($body,true);
t_throws(fn()=>validate_v04_payload($body,false),'cannot leave A+ unresolved');

$body=base_body($two3Choices,suff(['RESTORATION_ENERGY'=>2,'MATERIAL_RESOURCES'=>2]));
$body=array_merge($body,selected_aplus($two3Choices,['REST','SAFETY'],3,'A_PLUS_RUNOFF_3_OF_3','SAFETY'),b_unresolved(['RESTORATION_ENERGY','MATERIAL_RESOURCES'],2));
validate_v04_payload($body,true);
t_throws(fn()=>validate_v04_payload($body,false),'cannot leave B+ unresolved');

$body=array_merge($body,b_selected(['RESTORATION_ENERGY','MATERIAL_RESOURCES'],2,'MATERIAL_RESOURCES'));
validate_v04_payload($body,false);

$forged=$body;
$forged['attentionClarifier']['candidateFamilies']=['REST','CARE'];
t_throws(fn()=>validate_v04_payload($forged,false),'candidate family list mismatch');

$forged=$body;
$forged['attentionFocus']['rawMostCount']=2;
t_throws(fn()=>validate_v04_payload($forged,false),'raw MOST mismatch');

$forged=$body;
$forged['sufficiencyClarifier']['selectedItemId']='SAFETY_STABILITY';
t_throws(fn()=>validate_v04_payload($forged,false),'top B+ answer mismatch');

$bodyNoLow=base_body($directChoices,suff());
$bodyNoLow=array_merge($bodyNoLow,direct_attention($directChoices,'REST',3,'A_DIRECT_UNIQUE_3_OF_3'),b_no_low(5));
validate_v04_payload($bodyNoLow,false);

$partial=base_body(array_slice($directChoices,0,7),['RESTORATION_ENERGY'=>2]);
validate_v04_payload($partial,true);

$badBank=$bodyNoLow;$badBank['bankSchema']='2rasi.priolens.open14.bank-v0.3';
t_throws(fn()=>validate_v04_payload($badBank,false),'requires bank-v0.3.1');

$badProtocol=$bodyNoLow;$badProtocol['rankProtocol']='most+least-v0.3';
t_throws(fn()=>validate_v04_payload($badProtocol,false),'rankProtocol mismatch');

fwrite(STDOUT,"validation_v04: PASS\n");
