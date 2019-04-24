export const DEFAULT_OPTION = {
  // container: document.querySelector('#feedback'),
  trigger: document.querySelector('#btn'),
  submitCallback: () => {},
  // theme: '#3986FF',
  // license: '',
  title: 'Send feedback',
  placeholder: 'Describe your issue or share your ideas',
  requiredTip: 'description is required',
  editTip: 'Click to highlight or hide info',
  loadingTip: 'loading screenshot...',
  checkboxLabel: 'Include screenshot',
  cancelLabel: 'cancel',
  confirmLabel: 'send',
  highlightTip: 'Highlight issues',
  hideTip: 'Hide sensitive info',
  editDoneLabel: 'Done'
};

export const HIGH_LIGHT_ELEMENTS = [
  'span',
  'em',
  'i',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'strong', 'small', 'sub', 'sup', 'b',
  'time',
  'img', 'video',
  'input', 'textarea', 'label', 'select', 'button', 'a',
  'article',
  'summary',
  'section',
  'div',
  'li'
];
