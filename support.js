(() => {
  'use strict';
  const form = document.querySelector('.search');
  const input = document.querySelector('#question-search');
  const groups = [...document.querySelectorAll('.faq-group')];
  const questions = [...document.querySelectorAll('.questions details')];
  const status = document.querySelector('#search-status');
  const empty = document.querySelector('#no-results');
  const normalize = (text) => text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const contents = new Map(questions.map((question) => [question, normalize(`${question.textContent} ${question.dataset.keywords || ''}`)]));
  let previousOpen = null;

  function filter() {
    const terms = normalize(input.value).split(' ').filter(Boolean);
    const searching = terms.length > 0;
    if (searching && previousOpen === null) previousOpen = new Set(questions.filter((question) => question.open));
    let count = 0;
    questions.forEach((question) => {
      const match = terms.every((term) => contents.get(question).includes(term));
      question.hidden = !match;
      if (match) count++;
      if (searching) question.open = match;
      else if (previousOpen !== null) question.open = previousOpen.has(question);
    });
    groups.forEach((group) => { group.hidden = ![...group.querySelectorAll('details')].some((question) => !question.hidden); });
    status.hidden = !searching;
    status.textContent = searching ? `找到 ${count} 个相关问题` : '';
    empty.hidden = !searching || count > 0;
    if (!searching) previousOpen = null;
  }

  form.hidden = false;
  form.addEventListener('submit', (event) => { event.preventDefault(); filter(); });
  input.addEventListener('input', filter);
  document.querySelectorAll('.topics a').forEach((link) => {
    link.addEventListener('click', () => {
      input.value = '';
      filter();
    });
  });
})();
