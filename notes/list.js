(function () {
  'use strict';

  const container = document.getElementById('travel-notes-list');
  if (!container || typeof window.List !== 'function') return;

  const controls = container.querySelector('.notes-controls');
  const search = container.querySelector('#notes-search');
  const clear = container.querySelector('.notes-clear');
  const results = container.querySelector('.notes-results');
  const empty = container.querySelector('.notes-empty');
  const sortButtons = container.querySelectorAll('.sort');
  const dateSort = container.querySelector('[data-sort="published"]');

  const notes = new window.List(container, {
    valueNames: [
      'note-card-title',
      'note-card-summary',
      { data: ['published'] }
    ],
    searchColumns: ['note-card-title', 'note-card-summary']
  });

  function updateState() {
    const count = notes.matchingItems.length;
    const noun = count === 1 ? 'travel note' : 'travel notes';
    const hasQuery = search.value.trim().length > 0;

    results.textContent = hasQuery ? `${count} matching ${noun}` : `${count} ${noun}`;
    empty.hidden = count !== 0;
    clear.hidden = !hasQuery;

    sortButtons.forEach(function (button) {
      const direction = button.classList.contains('asc')
        ? 'ascending'
        : button.classList.contains('desc')
          ? 'descending'
          : null;
      button.setAttribute('aria-label', direction ? `Sort by date, currently ${direction}` : 'Sort by date');
    });
  }

  notes.on('updated', updateState);
  notes.on('sortComplete', updateState);

  search.addEventListener('input', function () {
    notes.search(search.value, ['note-card-title', 'note-card-summary']);
  });

  clear.addEventListener('click', function () {
    search.value = '';
    notes.search();
    search.focus();
  });

  notes.sort('published', { order: 'desc' });
  dateSort.classList.add('desc');
  controls.hidden = false;
  updateState();
}());
