from pathlib import Path

p = Path('priolens/open14-v02/index.html')
h = p.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str) -> None:
    global h
    if old not in h:
        raise SystemExit(f'missing expected source for {label}')
    if h.count(old) != 1:
        raise SystemExit(f'expected one source match for {label}, got {h.count(old)}')
    h = h.replace(old, new, 1)


replace_once(
    '.top{height:48px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:800}.pill{font-size:12px;color:var(--muted);border:1px solid var(--line);padding:6px 9px;border-radius:99px;background:#fff}',
    '.top{height:48px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:800}.topRight{display:flex;align-items:center;gap:8px}.exitLink{display:inline-flex;align-items:center;min-height:44px;font-size:13px;color:#555;text-decoration:none;padding:0 4px}.exitLink:hover{text-decoration:underline}.pill{font-size:12px;color:var(--muted);border:1px solid var(--line);padding:6px 9px;border-radius:99px;background:#fff}',
    'persistent exit styling',
)

replace_once(
    '.rangeBox input[type=range].unset{opacity:.58;accent-color:#8b8b86}',
    '.rangeBox input[type=range].noValue{accent-color:#8b8b86}.rangeBox input[type=range].noValue::-webkit-slider-thumb{opacity:0}.rangeBox input[type=range].noValue::-moz-range-thumb{opacity:0}',
    'no-value slider styling',
)

replace_once(
    '<div class="top"><div class="brand">PrioLens</div><div class="pill">Open14 · v0.2 research</div></div>',
    '<div class="top"><div class="brand">PrioLens</div><div class="topRight"><a id="exit2rasi" class="exitLink" href="https://2rasi.lt/#experiments">Išeiti</a><div class="pill">Open14 · v0.2 research</div></div></div>',
    'persistent exit link',
)

replace_once(
    "bankChecking:'Tikrinamas tyrimo bankas…',bankCheckingStatus:'Open14 paleidžiamas tik tada, kai visi reikalingi vaizdai turi realius runtime adresus.',start:'Pradėti',trialQuestion:'Kuris pirmas patraukia?',none:'Nė vienas aiškiai',",
    "bankChecking:'Tikrinamas tyrimo bankas…',bankCheckingStatus:'Open14 paleidžiamas tik tada, kai visi reikalingi vaizdai turi realius runtime adresus.',start:'Pradėti',exit:'Išeiti',trialQuestion:'Kuris pirmas patraukia?',none:'Nė vienas aiškiai',",
    'LT exit copy',
)

replace_once(
    "bankChecking:'Checking the research image set…',bankCheckingStatus:'Open14 starts only when every required image has a valid runtime address.',start:'Start',trialQuestion:'Which pulls you first?',none:'None clearly',",
    "bankChecking:'Checking the research image set…',bankCheckingStatus:'Open14 starts only when every required image has a valid runtime address.',start:'Start',exit:'Exit',trialQuestion:'Which pulls you first?',none:'None clearly',",
    'EN exit copy',
)

replace_once(
    "$('bankTitle').textContent=T.bankChecking;$('bankStatus').textContent=T.bankCheckingStatus;$('start').textContent=T.start;",
    "$('bankTitle').textContent=T.bankChecking;$('bankStatus').textContent=T.bankCheckingStatus;$('start').textContent=T.start;$('exit2rasi').textContent=T.exit;",
    'exit language application',
)

replace_once(
    "const target=(FROM_2RASI==='com'||(FROM_2RASI!=='lt'&&LANG==='en'))?'https://2rasi.com/#experiments':'https://2rasi.lt/#experiments';$('back2rasi').href=target;",
    "const target=(FROM_2RASI==='com'||(FROM_2RASI!=='lt'&&LANG==='en'))?'https://2rasi.com/#experiments':'https://2rasi.lt/#experiments';$('back2rasi').href=target;$('exit2rasi').href=target;",
    'exit routing',
)

replace_once(
    "slider.value=Number.isFinite(current)?current:3;if(!answered){slider.classList.add('unset');answerState.textContent=T.unanswered;answerState.classList.add('unsetState')}else if(current===null){na.classList.add('on');answerState.textContent=T.hardToSay}else{answerState.textContent=T.selected}slider.oninput=()=>{slider.classList.remove('unset');na.classList.remove('on');answerState.textContent=T.selected;answerState.classList.remove('unsetState');item.classList.remove('validationError');state.sufficiency[key]=Number(slider.value);saveLocalDraft();if(currentDomainComplete()){$('suffError').classList.add('hidden');suffValidationShown=false}};",
    "slider.value=Number.isFinite(current)?current:3;if(!answered){slider.classList.add('noValue');slider.setAttribute('aria-valuetext',T.unanswered);answerState.textContent=T.unanswered;answerState.classList.add('unsetState')}else if(current===null){slider.classList.add('noValue');slider.setAttribute('aria-valuetext',T.hardToSay);na.classList.add('on');answerState.textContent=T.hardToSay}else{slider.removeAttribute('aria-valuetext');answerState.textContent=T.selected}slider.oninput=()=>{slider.classList.remove('noValue');slider.removeAttribute('aria-valuetext');na.classList.remove('on');answerState.textContent=T.selected;answerState.classList.remove('unsetState');item.classList.remove('validationError');state.sufficiency[key]=Number(slider.value);saveLocalDraft();if(currentDomainComplete()){$('suffError').classList.add('hidden');suffValidationShown=false}};",
    'slider unanswered and hard-to-say state',
)

p.write_text(h, encoding='utf-8')
print('PATCH_PREPILOT_SMOKE_FINDINGS_V01_OK')
