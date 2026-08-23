import { createReflectionController } from './reflection_model.mjs';

const COPY = {
  lt: {
    title: 'Trumpa refleksija',
    prompt: 'Pasirinkai šį vaizdą. Kas labiausiai atitiko tavo pasirinkimą?',
    localOnly: 'Jei parašysi savo priežastį, šis tekstas liks tik šiame įrenginyje.',
    placeholder: 'Trumpai įrašyk savo priežastį',
    back: 'Atgal',
    next: 'Toliau',
    finish: 'Baigti',
  },
  en: {
    title: 'Quick reflection',
    prompt: 'You chose this image. What best matched your reason for choosing it?',
    localOnly: 'If you write your own reason, this text stays only on this device.',
    placeholder: 'Briefly write your reason',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
  },
};

function el(documentRef, tag, className, text = null) {
  const node = documentRef.createElement(tag);
  if (className) node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

export function mountReflectionUI({
  root,
  items,
  locale = 'lt',
  assetUrlResolver = path => path,
  onComplete = () => {},
  documentRef = globalThis.document,
} = {}) {
  if (!root || typeof root.replaceChildren !== 'function') {
    throw new Error('root DOM element is required');
  }
  if (!documentRef?.createElement) throw new Error('documentRef is required');
  if (!COPY[locale]) throw new Error('locale must be lt or en');
  if (typeof assetUrlResolver !== 'function') throw new Error('assetUrlResolver must be a function');
  if (typeof onComplete !== 'function') throw new Error('onComplete must be a function');

  const copy = COPY[locale];
  const controller = createReflectionController(items);

  root.classList.add('cl-reflection-root');

  function render() {
    const item = controller.current();
    const existing = controller.currentSelection();

    const shell = el(documentRef, 'section', 'cl-reflection');
    shell.setAttribute('aria-labelledby', 'cl-reflection-title');

    const progress = el(
      documentRef,
      'div',
      'cl-reflection__progress',
      `${controller.index + 1} / ${controller.total}`
    );

    const title = el(documentRef, 'h2', 'cl-reflection__title', copy.title);
    title.id = 'cl-reflection-title';

    const prompt = el(documentRef, 'p', 'cl-reflection__prompt', copy.prompt);

    const image = el(documentRef, 'img', 'cl-reflection__image');
    image.src = assetUrlResolver(item.assetPath, item);
    image.alt = '';
    image.decoding = 'async';

    const form = el(documentRef, 'form', 'cl-reflection__form');
    const group = el(documentRef, 'fieldset', 'cl-reflection__options');
    const legend = el(documentRef, 'legend', 'cl-reflection__sr-only', copy.prompt);
    group.appendChild(legend);

    let selectedReasonId = existing?.reasonId || null;
    let freeText = existing?.localFreeText || '';
    let freeTextWrap = null;
    let freeTextArea = null;

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
      input.checked = option.reasonId === selectedReasonId;

      const text = el(documentRef, 'span', 'cl-reflection__option-text', option.text);

      input.addEventListener('change', () => {
        selectedReasonId = option.reasonId;
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
    freeTextArea.value = freeText;
    freeTextArea.addEventListener('input', () => {
      freeText = freeTextArea.value;
    });
    freeTextWrap.append(note, freeTextArea);
    updateFreeTextVisibility();

    const actions = el(documentRef, 'div', 'cl-reflection__actions');
    const back = el(documentRef, 'button', 'cl-reflection__back', copy.back);
    back.type = 'button';
    back.disabled = controller.index === 0;
    back.addEventListener('click', () => {
      if (controller.previous()) render();
    });

    const forward = el(
      documentRef,
      'button',
      'cl-reflection__next',
      controller.index === controller.total - 1 ? copy.finish : copy.next
    );
    forward.type = 'submit';

    actions.append(back, forward);
    form.append(group, freeTextWrap, actions);

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!selectedReasonId) return;

      controller.select(selectedReasonId, freeText);

      if (controller.index === controller.total - 1) {
        const selections = controller.complete();
        onComplete(selections);
        return;
      }

      controller.next();
      render();
    });

    shell.append(progress, title, prompt, image, form);
    root.replaceChildren(shell);
  }

  render();

  return {
    controller,
    destroy() {
      root.replaceChildren();
      root.classList.remove('cl-reflection-root');
    },
  };
}
