from pathlib import Path


def repl(text, old, new, label):
    if old not in text:
        raise SystemExit(f"missing patch anchor: {label}")
    return text.replace(old, new, 1)

p = Path("priolens/open14-v02/index.html")
h = p.read_text()

# General readability and visual-choice fallback discoverability.
h = repl(h,
    ".note{font-size:13px;line-height:1.5;color:var(--muted);max-width:720px}",
    ".note{font-size:15px;line-height:1.55;color:#5f5f5f;max-width:720px}",
    "note readability")
h = repl(h,
    ".q{font-size:14px;font-weight:700}.count{font-size:13px;color:#777}",
    ".q{font-size:16px;font-weight:750}.count{font-size:14px;color:#626262}",
    "trial header readability")
h = repl(h,
    ".stage{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 50px;grid-template-rows:repeat(3,minmax(0,1fr));gap:6px 7px;padding:7px 0 10px}",
    ".stage{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(3,minmax(0,1fr)) auto;gap:6px;padding:7px 0 10px}",
    "trial stage layout")
h = repl(h,
    ".none{grid-column:2;grid-row:1/4;border:1px solid var(--line);background:#fff;color:#666;border-radius:14px;padding:10px 0;font-size:12px;font-weight:650;writing-mode:vertical-rl;transform:rotate(180deg);display:flex;align-items:center;justify-content:center}",
    ".none{grid-column:1;grid-row:4;border:1.5px solid #aaa9a3;background:#fff;color:#303030;border-radius:14px;padding:10px 14px;min-height:48px;font-size:15px;font-weight:760;writing-mode:horizontal-tb;transform:none;display:flex;align-items:center;justify-content:center}",
    "no-clear button")

# Sufficiency readability and explicit unanswered state.
h = repl(h,
    ".domainTitle{font-size:13px;color:#777;margin-bottom:12px;font-weight:700}",
    ".domainTitle{font-size:15px;color:#555;margin-bottom:14px;font-weight:760}",
    "domain title")
h = repl(h,
    ".statement{font-size:16px;line-height:1.35;margin-bottom:10px}",
    ".statement{font-size:18px;line-height:1.45;margin-bottom:12px}",
    "statement readability")
h = repl(h,
    ".rangeBox input[type=range]{width:100%;margin:2px 0 0;accent-color:#1d1d1d}.rangeBox input[type=range].unset{opacity:.48}",
    ".rangeBox input[type=range]{width:100%;margin:4px 0 0;accent-color:#1d1d1d;min-height:34px}.rangeBox input[type=range].unset{opacity:.58;accent-color:#8b8b86}",
    "range state")
h = repl(h,
    ".rangeLabels{display:flex;justify-content:space-between;gap:10px;font-size:11px;color:#777;margin-top:1px}",
    ".rangeLabels{display:flex;justify-content:space-between;gap:10px;font-size:13px;color:#5f5f5f;margin-top:2px}",
    "range labels")
h = repl(h,
    ".scale button.na{border:1px solid var(--line);background:#fff;border-radius:10px;min-height:38px;font-size:11px;color:#666;padding:7px 10px;white-space:nowrap}",
    ".scale button.na{border:1px solid #bbb;background:#fff;border-radius:10px;min-height:44px;font-size:14px;color:#444;padding:9px 12px;white-space:nowrap}",
    "na button readability")
h = repl(h,
    ".autosaveNote{font-size:11px;color:#777;margin-top:6px}.suffNav{display:flex;justify-content:space-between;gap:8px;margin-top:14px}",
    ".autosaveNote{font-size:13px;color:#666;margin-top:10px}.answerState{font-size:13px;font-weight:700;color:#555;margin-top:5px}.answerState.unsetState{color:#735d00}.item.validationError{margin:6px -8px 0;padding:12px 8px;border:2px solid #b54a4a;border-radius:12px;background:#fff8f8}.suffError{margin:10px 0 0;padding:11px 12px;border:2px solid #b54a4a;border-radius:12px;background:#fff4f4;color:#7d2525;font-size:15px;font-weight:750;line-height:1.4}.suffNav{display:flex;justify-content:space-between;gap:8px;margin-top:14px}",
    "sufficiency states")

h = repl(h,
    '<div class="suffHead"><h2>Dabar kita perspektyva.</h2><p class="note">Įvertink ne tai, kiek tau tai svarbu, o kiek šiuo metu tavo gyvenime to pakanka.</p><div id="suffCount" class="count">1 / 6</div></div>',
    '<div class="suffHead"><h2>Dabar kita perspektyva.</h2><p class="note">Įvertink ne tai, kiek tau tai svarbu, o kiek šiuo metu tavo gyvenime to pakanka. Kiekviename teiginyje pasirink skalės vietą arba „Sunku pasakyti“.</p><div id="suffCount" class="count">1 / 6</div></div>',
    "sufficiency instruction")
h = repl(h,
    '    <div id="domainMount"></div>\n    <div class="suffNav">',
    '    <div id="domainMount"></div>\n    <p id="suffError" class="suffError hidden" role="alert">Dar neatsakyta. Pasirink skalės vietą abiem teiginiams arba „Sunku pasakyti“.</p>\n    <div class="suffNav">',
    "inline validation message")

h = repl(h,
    "let bank=null,assignment=null,state=null,t0=0,locked=false,suffIndex=0,lastPointerType=null,progressTimer=null;",
    "let bank=null,assignment=null,state=null,t0=0,locked=false,suffIndex=0,lastPointerType=null,progressTimer=null,suffValidationShown=false;",
    "validation state")

old_render = r'''function renderSuff(){const d=DOMAINS[suffIndex];$('suffCount').textContent=`${suffIndex+1} / 6`;$('suffBack').disabled=suffIndex===0;$('suffNext').textContent=suffIndex===5?'Pamatyti rezultatą':'Toliau';const mount=$('domainMount');mount.innerHTML='';const card=document.createElement('div');card.className='domainCard';card.innerHTML=`<div class="domainTitle">${d.title}</div>`;d.items.forEach(([key,text])=>{const item=document.createElement('div');item.className='item';item.innerHTML=`<div class="statement">${text}</div><div class="scale"><div class="rangeRow"><div class="rangeBox"><input type="range" min="1" max="5" step="1" aria-label="Nuo labai trūksta iki pakanka"><div class="rangeLabels"><span>Labai trūksta</span><span>Pakanka</span></div></div><button type="button" class="na">Sunku pasakyti</button></div></div>`;const current=Object.prototype.hasOwnProperty.call(state.sufficiency,key)?state.sufficiency[key]:undefined;const slider=item.querySelector('input[type=range]'),na=item.querySelector('button.na');slider.value=Number.isFinite(current)?current:3;if(!Number.isFinite(current))slider.classList.add('unset');if(current===null)na.classList.add('on');slider.oninput=()=>{slider.classList.remove('unset');na.classList.remove('on');state.sufficiency[key]=Number(slider.value);saveLocalDraft()};slider.onchange=()=>{state.sufficiency[key]=Number(slider.value);checkpointProgress()};na.onclick=()=>{state.sufficiency[key]=null;checkpointProgress();renderSuff()};card.appendChild(item)});const n=document.createElement('div');n.className='autosaveNote';n.textContent='Progresas saugomas automatiškai. Nutrūkus galėsi tęsti šiame įrenginyje.';card.appendChild(n);mount.appendChild(card)}'''
new_render = r'''function renderSuff(){const d=DOMAINS[suffIndex];$('suffCount').textContent=`${suffIndex+1} / 6`;$('suffBack').disabled=suffIndex===0;$('suffNext').textContent=suffIndex===5?'Pamatyti rezultatą':'Toliau';$('suffError').classList.toggle('hidden',!(suffValidationShown&&!currentDomainComplete()));const mount=$('domainMount');mount.innerHTML='';const card=document.createElement('div');card.className='domainCard';card.innerHTML=`<div class="domainTitle">${d.title}</div>`;d.items.forEach(([key,text])=>{const answered=Object.prototype.hasOwnProperty.call(state.sufficiency,key);const item=document.createElement('div');item.className='item'+(suffValidationShown&&!answered?' validationError':'');item.innerHTML=`<div class="statement">${text}</div><div class="scale"><div class="rangeRow"><div class="rangeBox"><input type="range" min="1" max="5" step="1" aria-label="Nuo labai trūksta iki pakanka"><div class="rangeLabels"><span>Labai trūksta</span><span>Pakanka</span></div><div class="answerState" aria-live="polite"></div></div><button type="button" class="na">Sunku pasakyti</button></div></div>`;const current=answered?state.sufficiency[key]:undefined;const slider=item.querySelector('input[type=range]'),na=item.querySelector('button.na'),answerState=item.querySelector('.answerState');slider.value=Number.isFinite(current)?current:3;if(!answered){slider.classList.add('unset');answerState.textContent='Neatsakyta';answerState.classList.add('unsetState')}else if(current===null){na.classList.add('on');answerState.textContent='Sunku pasakyti'}else{answerState.textContent='Pasirinkta'}slider.oninput=()=>{slider.classList.remove('unset');na.classList.remove('on');answerState.textContent='Pasirinkta';answerState.classList.remove('unsetState');item.classList.remove('validationError');state.sufficiency[key]=Number(slider.value);saveLocalDraft();if(currentDomainComplete()){$('suffError').classList.add('hidden');suffValidationShown=false}};slider.onchange=()=>{state.sufficiency[key]=Number(slider.value);checkpointProgress()};na.onclick=()=>{state.sufficiency[key]=null;checkpointProgress();if(currentDomainComplete())suffValidationShown=false;renderSuff()};card.appendChild(item)});const n=document.createElement('div');n.className='autosaveNote';n.textContent='Progresas saugomas automatiškai. Nutrūkus galėsi tęsti šiame įrenginyje.';card.appendChild(n);mount.appendChild(card)}'''
h = repl(h, old_render, new_render, "sufficiency render")

old_nav = "$('suffBack').onclick=()=>{if(suffIndex>0){suffIndex--;renderSuff()}};$('suffNext').onclick=()=>{if(!currentDomainComplete()){alert('Pažymėk abu teiginius arba pasirink „Sunku pasakyti“.');return}if(suffIndex<5){suffIndex++;renderSuff()}else finish()};"
new_nav = "$('suffBack').onclick=()=>{if(suffIndex>0){suffValidationShown=false;suffIndex--;renderSuff()}};$('suffNext').onclick=()=>{if(!currentDomainComplete()){suffValidationShown=true;renderSuff();$('suffError').scrollIntoView({behavior:'smooth',block:'center'});return}suffValidationShown=false;if(suffIndex<5){suffIndex++;renderSuff()}else finish()};"
h = repl(h, old_nav, new_nav, "sufficiency validation flow")

p.write_text(h)
print("PATCH_MOBILE_ACCESSIBILITY_OK")
