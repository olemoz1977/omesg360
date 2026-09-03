<?php
// Semantic validator for PrioLens Open14 v0.4 adaptive A+/B+ state.
// This file does not write data. API/progress endpoints call it after their
// existing raw trial and sufficiency validation has passed.

function v04_fail(string $message): void {
    throw new InvalidArgumentException($message);
}

function v04_assert(bool $ok, string $message): void {
    if (!$ok) v04_fail($message);
}

function v04_family_ids(): array {
    return [
        'REST','MASTERY','CONNECTION','EXPLORATION','BELONGING','RESOURCE','AUTONOMY',
        'SAFETY','KNOWLEDGE','CARE','OPPORTUNITY','CONTROL','ORDER','RECOGNITION'
    ];
}

function v04_b_item_ids(): array {
    return [
        'RESTORATION_ENERGY','MATERIAL_RESOURCES','SAFETY_STABILITY','CLARITY_PREDICTABILITY',
        'CONNECTION_BELONGING','CARE_SUPPORT_PRESENT','AUTONOMY_AGENCY','RECOGNITION_ESTEEM',
        'LEARNING_GROWTH','CAPABILITY_MASTERY','MEANING_PURPOSE','CONTRIBUTION'
    ];
}

function v04_sorted_unique_strings($value): array {
    v04_assert(is_array($value), 'Expected array of strings');
    $out=[];
    foreach ($value as $x) {
        v04_assert(is_string($x) && $x !== '', 'Expected non-empty string');
        $out[$x]=true;
    }
    $xs=array_keys($out);
    sort($xs, SORT_STRING);
    return $xs;
}

function v04_same_string_set($left, array $right): bool {
    if (!is_array($left)) return false;
    try { $a=v04_sorted_unique_strings($left); }
    catch (Throwable $e) { return false; }
    $b=array_values(array_unique($right));
    sort($b, SORT_STRING);
    return $a === $b;
}

function v04_nullable_equals($actual, $expected): bool {
    if ($expected === null) return $actual === null;
    return $actual === $expected;
}

function v04_derive_attention(array $choices): array {
    $families=v04_family_ids();
    $familySet=array_fill_keys($families,true);
    $counts=array_fill_keys($families,0);
    $selected=array_fill_keys($families,[]);

    foreach ($choices as $trial) {
        if (!is_array($trial) || !array_key_exists('choice',$trial) || $trial['choice'] === null) continue;
        $choice=$trial['choice'];
        v04_assert(is_array($choice), 'v0.4 attention choice must be object or null');
        $family=$choice['familyId'] ?? null;
        $exemplar=$choice['exemplarId'] ?? null;
        v04_assert(is_string($family) && isset($familySet[$family]), 'v0.4 attention has unknown family');
        v04_assert(is_string($exemplar) && $exemplar !== '', 'v0.4 attention choice missing exemplar');
        $counts[$family]++;
        v04_assert($counts[$family] <= 3, 'v0.4 raw MOST count exceeds 3');
        $selected[$family][$exemplar]=true;
    }

    $at3=[];$at2=[];
    foreach ($families as $family) {
        if ($counts[$family]===3) $at3[]=$family;
        if ($counts[$family]===2) $at2[]=$family;
    }

    $source='A_NO_REPEATED_FOCUS';
    $focus=null;
    $clarifierRequired=false;
    $candidates=[];
    $rawCount=null;

    if (count($at3)===1) {
        $source='A_DIRECT_UNIQUE_3_OF_3';$focus=$at3[0];$rawCount=3;
    } elseif (count($at3)>=2) {
        $source='A_PLUS_RUNOFF_3_OF_3';$clarifierRequired=true;$candidates=$at3;$rawCount=3;
    } elseif (count($at2)===1) {
        $source='A_DIRECT_UNIQUE_2_OF_3';$focus=$at2[0];$rawCount=2;
    } elseif (count($at2)>=2) {
        $source='A_PLUS_RUNOFF_2_OF_3';$clarifierRequired=true;$candidates=$at2;$rawCount=2;
    }

    $candidateExemplars=[];
    foreach ($candidates as $family) {
        $ids=array_keys($selected[$family]);
        sort($ids,SORT_STRING);
        v04_assert(count($ids)===$rawCount, 'v0.4 candidate selected-exemplar coverage invalid');
        $candidateExemplars[$family]=$ids;
    }

    return [
        'counts'=>$counts,
        'source'=>$source,
        'focus'=>$focus,
        'rawCount'=>$rawCount,
        'clarifierRequired'=>$clarifierRequired,
        'candidates'=>$candidates,
        'candidateExemplars'=>$candidateExemplars
    ];
}

function v04_validate_attention_counts(array $resolution, array $expected): void {
    v04_assert(isset($resolution['counts']) && is_array($resolution['counts']), 'v0.4 attentionResolution.counts missing');
    foreach ($expected as $family=>$count) {
        v04_assert(array_key_exists($family,$resolution['counts']) && $resolution['counts'][$family] === $count, 'v0.4 attentionResolution raw count mismatch: '.$family);
    }
}

function v04_validate_candidate_cards($cards, array $expectedCandidates, int $rawCount, array $candidateExemplars): void {
    v04_assert(is_array($cards), 'v0.4 A+ candidate cards missing');
    v04_assert(count($cards)===count($expectedCandidates), 'v0.4 A+ candidate card count mismatch');
    $seen=[];
    foreach ($cards as $card) {
        v04_assert(is_array($card), 'v0.4 A+ candidate card invalid');
        $family=$card['familyId'] ?? null;
        v04_assert(is_string($family) && in_array($family,$expectedCandidates,true), 'v0.4 A+ unexpected candidate family');
        v04_assert(!isset($seen[$family]), 'v0.4 A+ duplicate candidate family');
        $seen[$family]=true;
        v04_assert(($card['rawMostCount'] ?? null)===$rawCount, 'v0.4 A+ candidate raw MOST count mismatch');
        v04_assert(v04_same_string_set($card['exemplarIds'] ?? null,$candidateExemplars[$family]), 'v0.4 A+ candidate exemplars mismatch');
    }
    v04_assert(v04_same_string_set(array_keys($seen),$expectedCandidates), 'v0.4 A+ candidate family set mismatch');
}

function v04_validate_focus($focus, ?string $family, ?int $rawCount, string $source): void {
    if ($family===null) {
        v04_assert($focus===null, 'v0.4 attention focus must be null');
        return;
    }
    v04_assert(is_array($focus), 'v0.4 attention focus missing');
    v04_assert(($focus['familyId'] ?? null)===$family, 'v0.4 attention focus family mismatch');
    v04_assert(($focus['rawMostCount'] ?? null)===$rawCount, 'v0.4 attention focus raw MOST mismatch');
    v04_assert(($focus['source'] ?? null)===$source, 'v0.4 attention focus source mismatch');
}

function v04_validate_attention(array $body, bool $isProgress): void {
    $expected=v04_derive_attention($body['choices']);
    $completedChoices=count($body['choices'])===14;
    $resolution=$body['attentionResolution'] ?? null;
    $topClarifier=$body['attentionClarifier'] ?? null;
    $topFocus=$body['attentionFocus'] ?? null;

    if (!$completedChoices) {
        v04_assert($resolution===null && $topClarifier===null && $topFocus===null, 'v0.4 A+/focus cannot exist before 14 completed Channel-A trials');
        return;
    }

    v04_assert(is_array($resolution), 'v0.4 attentionResolution required after Channel A');
    v04_assert(($resolution['schema'] ?? null)==='2rasi.priolens.open14.attention-resolution-v0.4', 'v0.4 attentionResolution schema mismatch');
    v04_validate_attention_counts($resolution,$expected['counts']);

    if (!$expected['clarifierRequired']) {
        v04_assert(($resolution['clarifierRequired'] ?? null)===false, 'v0.4 unexpected A+ requirement');
        v04_assert(($resolution['source'] ?? null)===$expected['source'], 'v0.4 direct attention source mismatch');
        v04_assert($topClarifier===null, 'v0.4 direct attention cannot contain A+ answer');
        v04_validate_focus($resolution['focus'] ?? null,$expected['focus'],$expected['rawCount'],$expected['source']);
        v04_validate_focus($topFocus,$expected['focus'],$expected['rawCount'],$expected['source']);
        return;
    }

    v04_validate_candidate_cards($resolution['candidates'] ?? null,$expected['candidates'],$expected['rawCount'],$expected['candidateExemplars']);
    $stillOpen=($resolution['clarifierRequired'] ?? null)===true;

    if ($stillOpen) {
        v04_assert($isProgress, 'Completed v0.4 session cannot leave A+ unresolved');
        v04_assert(($resolution['source'] ?? null)===$expected['source'], 'v0.4 unresolved A+ source mismatch');
        v04_assert($topClarifier===null && $topFocus===null, 'v0.4 unresolved A+ cannot contain answer/focus');
        return;
    }

    v04_assert(($resolution['clarifierRequired'] ?? null)===false, 'v0.4 invalid A+ clarifierRequired');
    $clarifier=$resolution['clarifier'] ?? null;
    v04_assert(is_array($clarifier), 'v0.4 resolved A+ clarifier missing');
    v04_assert(is_array($topClarifier), 'v0.4 top attentionClarifier missing');
    $trigger=$clarifier['trigger'] ?? null;
    v04_assert($trigger===$expected['source'] && ($topClarifier['trigger'] ?? null)===$expected['source'], 'v0.4 A+ trigger mismatch');
    v04_assert(v04_same_string_set($clarifier['candidateFamilies'] ?? null,$expected['candidates']), 'v0.4 A+ candidate family list mismatch');
    v04_assert(v04_same_string_set($topClarifier['candidateFamilies'] ?? null,$expected['candidates']), 'v0.4 top A+ candidate family list mismatch');
    v04_validate_candidate_cards($clarifier['candidateCards'] ?? null,$expected['candidates'],$expected['rawCount'],$expected['candidateExemplars']);
    v04_validate_candidate_cards($topClarifier['candidateCards'] ?? null,$expected['candidates'],$expected['rawCount'],$expected['candidateExemplars']);

    $selected=$clarifier['selectedFamilyId'] ?? null;
    $noClear=($clarifier['noClear'] ?? null)===true;
    v04_assert((is_string($selected) && $selected!=='') xor $noClear, 'v0.4 A+ must resolve to one selected family or no-clear');
    v04_assert(($topClarifier['selectedFamilyId'] ?? null)===$selected && (($topClarifier['noClear'] ?? null)===true)===$noClear, 'v0.4 top A+ answer mismatch');

    if ($selected!==null) {
        v04_assert(in_array($selected,$expected['candidates'],true), 'v0.4 A+ selected family not derived candidate');
        v04_assert(($resolution['source'] ?? null)===$expected['source'], 'v0.4 selected A+ source mismatch');
        v04_validate_focus($resolution['focus'] ?? null,$selected,$expected['rawCount'],$expected['source']);
        v04_validate_focus($topFocus,$selected,$expected['rawCount'],$expected['source']);
    } else {
        v04_assert(($resolution['source'] ?? null)==='A_PLUS_NO_CLEAR', 'v0.4 A+ no-clear source mismatch');
        v04_validate_focus($resolution['focus'] ?? null,null,null,'A_PLUS_NO_CLEAR');
        v04_validate_focus($topFocus,null,null,'A_PLUS_NO_CLEAR');
    }
}

function v04_derive_sufficiency(array $sufficiency): array {
    $ids=v04_b_item_ids();
    $numeric=[];
    $complete=true;
    foreach ($ids as $id) {
        if (!array_key_exists($id,$sufficiency)) { $complete=false; continue; }
        $value=$sufficiency[$id];
        if (is_int($value)) $numeric[$id]=$value;
    }
    if (!$complete) return ['complete'=>false];
    if (!$numeric) return ['complete'=>true,'source'=>'B_NO_NUMERIC','minimumValue'=>null,'candidates'=>[],'route'=>[],'clarifierRequired'=>false];
    $min=min($numeric);
    if ($min>=4) return ['complete'=>true,'source'=>'B_NO_LOW_ROUTE','minimumValue'=>$min,'candidates'=>[],'route'=>[],'clarifierRequired'=>false];
    $candidates=[];
    foreach ($ids as $id) if (array_key_exists($id,$numeric) && $numeric[$id]===$min) $candidates[]=$id;
    if (count($candidates)===1) return ['complete'=>true,'source'=>'B_DIRECT_UNIQUE_MIN','minimumValue'=>$min,'candidates'=>$candidates,'route'=>$candidates,'clarifierRequired'=>false];
    return ['complete'=>true,'source'=>'B_PLUS_TIED_MIN','minimumValue'=>$min,'candidates'=>$candidates,'route'=>[],'clarifierRequired'=>true];
}

function v04_validate_route_object($route, array $expectedItems, string $source, $minimumValue): void {
    v04_assert(is_array($route), 'v0.4 sufficiencyRoute missing');
    v04_assert(($route['source'] ?? null)===$source, 'v0.4 sufficiencyRoute source mismatch');
    v04_assert(v04_nullable_equals($route['minimumValue'] ?? null,$minimumValue), 'v0.4 sufficiencyRoute minimum mismatch');
    v04_assert(v04_same_string_set($route['itemIds'] ?? null,$expectedItems), 'v0.4 sufficiencyRoute endpoints mismatch');
}

function v04_validate_sufficiency(array $body, bool $isProgress): void {
    $expected=v04_derive_sufficiency($body['sufficiency']);
    $resolution=$body['sufficiencyResolution'] ?? null;
    $topClarifier=$body['sufficiencyClarifier'] ?? null;
    $topRoute=$body['sufficiencyRoute'] ?? null;

    if (!$expected['complete']) {
        v04_assert($isProgress, 'Completed v0.4 session requires all Channel-B items');
        v04_assert($resolution===null && $topClarifier===null && $topRoute===null, 'v0.4 B+/route cannot exist before Channel B is complete');
        return;
    }

    v04_assert(is_array($resolution), 'v0.4 sufficiencyResolution required after Channel B');
    v04_assert(($resolution['schema'] ?? null)==='2rasi.priolens.open14.sufficiency-resolution-v0.4', 'v0.4 sufficiencyResolution schema mismatch');
    v04_assert(v04_nullable_equals($resolution['minimumValue'] ?? null,$expected['minimumValue']), 'v0.4 sufficiency minimum mismatch');

    if (!$expected['clarifierRequired']) {
        v04_assert(($resolution['clarifierRequired'] ?? null)===false, 'v0.4 unexpected B+ requirement');
        v04_assert(($resolution['source'] ?? null)===$expected['source'], 'v0.4 direct sufficiency source mismatch');
        v04_assert(v04_same_string_set($resolution['routeItemIds'] ?? null,$expected['route']), 'v0.4 direct sufficiency route mismatch');
        v04_assert($topClarifier===null, 'v0.4 direct sufficiency cannot contain B+ answer');
        v04_validate_route_object($topRoute,$expected['route'],$expected['source'],$expected['minimumValue']);
        return;
    }

    v04_assert(v04_same_string_set($resolution['candidates'] ?? null,$expected['candidates']), 'v0.4 B+ candidate minima mismatch');
    $stillOpen=($resolution['clarifierRequired'] ?? null)===true;
    if ($stillOpen) {
        v04_assert($isProgress, 'Completed v0.4 session cannot leave B+ unresolved');
        v04_assert(($resolution['source'] ?? null)==='B_PLUS_TIED_MIN', 'v0.4 unresolved B+ source mismatch');
        v04_assert(v04_same_string_set($resolution['routeItemIds'] ?? null,[]), 'v0.4 unresolved B+ cannot contain route');
        v04_assert($topClarifier===null, 'v0.4 unresolved B+ cannot contain answer');
        v04_validate_route_object($topRoute,[],'B_PLUS_TIED_MIN',$expected['minimumValue']);
        return;
    }

    v04_assert(($resolution['clarifierRequired'] ?? null)===false, 'v0.4 invalid B+ clarifierRequired');
    $clarifier=$resolution['clarifier'] ?? null;
    v04_assert(is_array($clarifier) && is_array($topClarifier), 'v0.4 resolved B+ clarifier missing');
    v04_assert(($clarifier['minimumValue'] ?? null)===$expected['minimumValue'] && ($topClarifier['minimumValue'] ?? null)===$expected['minimumValue'], 'v0.4 B+ minimum mismatch');
    v04_assert(v04_same_string_set($clarifier['candidateItems'] ?? null,$expected['candidates']), 'v0.4 B+ candidate list mismatch');
    v04_assert(v04_same_string_set($topClarifier['candidateItems'] ?? null,$expected['candidates']), 'v0.4 top B+ candidate list mismatch');

    $selected=$clarifier['selectedItemId'] ?? null;
    $similar=($clarifier['similar'] ?? null)===true;
    $hard=($clarifier['hardToSay'] ?? null)===true;
    $modeCount=(($selected!==null)?1:0)+($similar?1:0)+($hard?1:0);
    v04_assert($modeCount===1, 'v0.4 B+ must resolve by selected, similar, or hard-to-say');
    v04_assert(($topClarifier['selectedItemId'] ?? null)===$selected && (($topClarifier['similar'] ?? null)===true)===$similar && (($topClarifier['hardToSay'] ?? null)===true)===$hard, 'v0.4 top B+ answer mismatch');

    if ($selected!==null) {
        v04_assert(is_string($selected) && in_array($selected,$expected['candidates'],true), 'v0.4 B+ selected item not an exact minimum');
        $route=[$selected];$source='B_PLUS_SELECTED';
    } elseif ($similar) {
        $route=$expected['candidates'];$source='B_PLUS_SIMILAR';
    } else {
        $route=[];$source='B_PLUS_HARD_TO_SAY';
    }

    v04_assert(($resolution['source'] ?? null)===$source, 'v0.4 resolved B+ source mismatch');
    v04_assert(v04_same_string_set($resolution['routeItemIds'] ?? null,$route), 'v0.4 resolved B+ route mismatch');
    v04_validate_route_object($topRoute,$route,$source,$expected['minimumValue']);
}

function validate_v04_payload(array $body, bool $isProgress): void {
    v04_assert(($body['schema'] ?? null)==='2rasi.priolens.open14.rank-session-v0.4', 'v0.4 validator called with wrong schema');
    v04_assert(($body['bankSchema'] ?? null)==='2rasi.priolens.open14.bank-v0.3.1', 'v0.4 requires bank-v0.3.1');
    foreach (['attentionResolution','attentionClarifier','attentionFocus','sufficiencyResolution','sufficiencyClarifier','sufficiencyRoute'] as $field) {
        v04_assert(array_key_exists($field,$body), 'v0.4 missing adaptive field: '.$field);
    }
    if (!$isProgress) {
        v04_assert(($body['rankProtocol'] ?? null)==='most+least+a-plus+b-plus-v0.4', 'v0.4 final rankProtocol mismatch');
    }
    v04_validate_attention($body,$isProgress);
    v04_validate_sufficiency($body,$isProgress);
}
