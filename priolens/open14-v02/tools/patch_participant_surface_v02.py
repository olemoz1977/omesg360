from pathlib import Path

p=Path('priolens/open14-v02/index.html')
s=p.read_text()

def one(old,new,label):
    global s
    n=s.count(old)
    if n!=1: raise SystemExit(f'{label}: expected 1 match, got {n}')
    s=s.replace(old,new,1)

one(
"noCompare:'Aiškaus sugretinimo šį kartą nėra',noCompareCue:'Abi perspektyvos neprivalo parodyti to paties. Tai irgi galimas rezultatas.',noCompareNoRepeat:'Pirmame žvilgsnyje nebuvo pakankamo pasikartojimo, todėl dviejų perspektyvų šį kartą nesugretiname.',noCompareNoSuff:'Antram atsakymui nepakako aiškių įverčių, todėl dviejų perspektyvų šį kartą nesugretiname.',",
"noCompare:'Aiškaus sugretinimo šį kartą nėra',noCompareCue:'Abi perspektyvos neprivalo parodyti to paties. Tai irgi galimas rezultatas.',noCompareNoBoth:'Ši sesija nesukūrė aiškaus dviejų perspektyvų sugretinimo: pirmame žvilgsnyje nebuvo pasikartojimo, o antram atsakymui nepakako aiškių įverčių.',noCompareNoRepeat:'Pirmame žvilgsnyje nebuvo pakankamo pasikartojimo, todėl dviejų perspektyvų šį kartą nesugretiname.',noCompareNoSuff:'Antram atsakymui nepakako aiškių įverčių, todėl dviejų perspektyvų šį kartą nesugretiname.',",
'lt combined edge copy')

one(
"noCompare:'No clear comparison this time',noCompareCue:'The two perspectives do not have to point to the same thing. That is also a possible result.',noCompareNoRepeat:'There was not enough repetition in the first glance to compare the two perspectives this time.',noCompareNoSuff:'The second answer did not contain enough clear ratings to compare the two perspectives this time.',",
"noCompare:'No clear comparison this time',noCompareCue:'The two perspectives do not have to point to the same thing. That is also a possible result.',noCompareNoBoth:'This session did not produce a clear comparison between the two perspectives: there was no repeated theme in the first glance, and the second answer did not contain enough clear ratings.',noCompareNoRepeat:'There was not enough repetition in the first glance to compare the two perspectives this time.',noCompareNoSuff:'The second answer did not contain enough clear ratings to compare the two perspectives this time.',",
'en combined edge copy')

one(
"const cue=!repeated.length?T.noCompareNoRepeat:!completeDomains.length?T.noCompareNoSuff:T.noCompareCue;",
"const cue=!repeated.length&&!completeDomains.length?T.noCompareNoBoth:!repeated.length?T.noCompareNoRepeat:!completeDomains.length?T.noCompareNoSuff:T.noCompareCue;",
'combined edge selection')

p.write_text(s)
print('PASS: combined no-comparison edge patched')
