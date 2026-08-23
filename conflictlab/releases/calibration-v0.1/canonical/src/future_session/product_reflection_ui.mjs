import { createProductReflectionController } from './product_reflection_flow.mjs';

const COPY = {
  lt: {
    reasonTitle: 'Trumpa refleksija',
    reasonPrompt: 'Pasirinkai šį vaizdą. Kas labiausiai atitiko tavo pasirinkimą?',
    intensityTitle: 'Reakcijos stiprumas',
    intensityPrompt: 'Kiek stipri buvo tavo reakcija į pasirinktą vaizdą?',
    localOnly: 'Jei parašysi savo priežastį, šis tekstas liks tik šiame įrenginyje.',
    placeholder: 'Trumpai įrašyk savo priežastį',
    next: 'Toliau',
    skip: 'Praleisti',
    low: 'Silpna',
    high: 'Stipri',
  },
  en: {
    reasonTitle: 'Quick reflection',
    reasonPrompt: 'You chose this image. What best matched your reason for choosing it?',
    intensityTitle: 'Reaction intensity',
    intensityPrompt: 'How strong was your reaction to the image you chose?',
    localOnly: 'If you write your own reason, this text stays only on this device.',
    placeholder: 'Briefly write your reason',
    next: 'Continue',
    skip: 'Skip',
    low: 'Low',
    high: 'Strong',
  },
};

function el(documentRef, tag, className, text = null) {
  const node = documentRef.createElement(tag);
  if (className) node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

function defaultFrame(callback) {
  if (typeof globalThis.requestAnimationFrame === 'function') {
    return globalThis.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 0);
}

export function mountProductReflectionUI({
  root,
  items,
  locale = 'lt',
  assetUrlResolver = path => path,
  onComplete = () => {},
  onSnapshot = () => {},
  now = () => performance.now(),
  requestFrame = defaultFrame,
  documentRef = globalThis.document,
} = {}) {
  if (!root || typeof root.replaceChildren !== 'function') throw new Error('root DOM element is required');
  if (!documentRef?.createElement) throw new Error('documentRef is required');
  if (!COPY[locale]) throw new Error('locale must be lt or en');
  if (typeof assetUrlResolver !== 'function') throw new Error('assetUrlResolver must be a function');
  if (typeof onComplete !== 'function' || typeof onSnapshot !== 'function') throw new Error('callbacks must be functions');
  if (typeof now !== 'function' || typeof requestFrame !== 'function') throw new Error('timing functions are required');

  const copy = COPY[locale];
  const controller = createProductReflectionController(items, { now });
  root.classList.add('cl-reflection-root');

  function report() {
    onSnapshot(controller.snapshot());
  }

  function finishOrRender() {
    report();
    if (controller.isComplete()) {
      onComplete(controller.complete());
      return;
    }
    render();
  }

  function markReadyAfterImage(image, onReady = () => {}) {
    const ready = () => requestFrame(() => {
      controller.markStageReady(now());
      onReady();
    });
    if (typeof image.decode === 'function') {
      Promise.resolve(image.decode()).catch(() => {}).then(ready);
    } else {
      ready();
    }
  }

  function baseShell(item, titleText, promptText) {
    const shell = el(documentRef, 'section', 'cl-reflection');
    const progress = el(documentRef, 'div', 'cl-reflection__progress', `${controller.index + 1} / ${controller.total}`);
    const title = el(documentRef, 'h2', 'cl-reflection__title', titleText);
    const prompt = el(documentRef, 'p', 'cl-reflection__prompt', promptText);
    const image = el(documentRef, 'img', 'cl-reflection__image');
    image.src = assetUrlResolver(item.assetPath, item);
    image.alt = '';
    image.decoding = 'async';
    shell.append(progress, title, prompt, image);
    return { shell, image };
  }

  function renderReason(item) {
    const { shell, image } = baseShell(item, copy.reasonTitle, copy.reasonPrompt);
    const form = el(documentRef, 'form', 'cl-reflection__form');
    const group = el(documentRef, 'fieldset', 'cl-reflection__options');
    const legend = el(documentRef, 'legend', 'cl-reflection__sr-only', copy.reasonPrompt);
    group.appendChild(legend);

    let selectedReasonId = null;
    let selectedAt = null;
    let freeText = '';
    let freeTextWrap = null;
    let freeTextArea = null;
    const reasonInputs = [];

    function updateFreeTextVisibility() {
      const selected = item.options.find(option => option.reasonId === selectedReasonId);
      const open = selected?.allowsLocalFreeText === true;
      if (freeTextWrap) freeTextWrap.hidden = !open;
      if (!open) freeText = '';
    }

    for (const option of item.options) {
      const label = el(documentRef, 'label', 'cl-reflection__option');
      const input = el(documentRef, 'input', 'cl-reflection__radio');
      input.type = 'radio';
      input.name = `reason-${item.pairId}`;
      input.value = option.reasonId;
      input.disabled = true;
      reasonInputs.push(input);
      const text = el(documentRef, 'span', 'cl-reflection__option-text', option.text);

      input.addEventListener('change', () => {
        selectedReasonId = option.reasonId;
        selectedAt = now();
        next.disabled = false;
        updateFreeTextVisibility();
      });
      label.append(input, text);
      group.appendChild(label);
    }

    freeTextWrap = el(documentRef, 'div', 'cl-reflection__other');
    const note = el(documentRef, 'p', 'cl-reflection__local-note', copy.localOnly);
    freeTextArea = el(documentRef, 'textarea', 'cl-reflection__textarea');
    freeTextArea.maxLength = 500;
    freeTextArea.rows = 3;
    freeTextArea.placeholder = copy.placeholder;
    freeTextArea.disabled = true;
    freeTextArea.addEventListener('input', () => { freeText = freeTextArea.value; });
    freeTextWrap.append(note, freeTextArea);
    updateFreeTextVisibility();

    const actions = el(documentRef, 'div', 'cl-reflection__actions');
    const skip = el(documentRef, 'button', 'cl-reflection__back', copy.skip);
    skip.type = 'button';
    skip.disabled = true;
    skip.addEventListener('click', () => {
      controller.skipReason(now());
      finishOrRender();
    });
    const next = el(documentRef, 'button', 'cl-reflection__next', copy.next);
    next.type = 'submit';
    next.disabled = true;
    actions.append(skip, next);
    form.append(group, freeTextWrap, actions);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!selectedReasonId || selectedAt === null) return;
      controller.selectReason(selectedReasonId, freeText, selectedAt);
      report();
      render();
    });

    shell.append(form);
    root.replaceChildren(shell);
    markReadyAfterImage(image, () => {
      for (const input of reasonInputs) input.disabled = false;
      freeTextArea.disabled = false;
      skip.disabled = false;
    });
  }

  function renderIntensity(item) {
    const { shell, image } = baseShell(item, copy.intensityTitle, copy.intensityPrompt);
    const scale = el(documentRef, 'div', 'cl-reflection__intensity');
    const intensityButtons = [];
    for (let value = 1; value <= 5; value += 1) {
      const button = el(documentRef, 'button', 'cl-reflection__intensity-button', String(value));
      button.type = 'button';
      button.disabled = true;
      button.setAttribute('aria-label', `${copy.intensityTitle}: ${value}`);
      button.addEventListener('click', () => {
        for (const candidate of intensityButtons) candidate.disabled = true;
        skip.disabled = true;
        controller.selectIntensity(value, now());
        finishOrRender();
      });
      intensityButtons.push(button);
      scale.appendChild(button);
    }
    const labels = el(documentRef, 'div', 'cl-reflection__intensity-labels');
    labels.append(el(documentRef, 'span', '', copy.low), el(documentRef, 'span', '', copy.high));
    const actions = el(documentRef, 'div', 'cl-reflection__actions');
    const skip = el(documentRef, 'button', 'cl-reflection__back', copy.skip);
    skip.type = 'button';
    skip.disabled = true;
    skip.addEventListener('click', () => {
      for (const candidate of intensityButtons) candidate.disabled = true;
      skip.disabled = true;
      controller.skipIntensity(now());
      finishOrRender();
    });
    actions.append(skip);
    shell.append(scale, labels, actions);
    root.replaceChildren(shell);
    markReadyAfterImage(image, () => {
      for (const button of intensityButtons) button.disabled = false;
      skip.disabled = false;
    });
  }

  function render() {
    const item = controller.current();
    if (!item) return;
    if (controller.stage === 'REASON') renderReason(item);
    else if (controller.stage === 'INTENSITY') renderIntensity(item);
    else throw new Error(`unsupported reflection stage: ${controller.stage}`);
  }

  render();

  return {
    controller,
    snapshot: () => controller.snapshot(),
    destroy() {
      root.replaceChildren();
      root.classList.remove('cl-reflection-root');
    },
  };
}
