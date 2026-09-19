(function () {
  'use strict';

  const container = document.getElementById('travel-notes-list');
  if (!container || typeof window.List !== 'function') return;

  const controls = container.querySelector('.notes-controls');
  const search = container.querySelector('#notes-search');
  const clear = container.querySelector('.notes-clear');
  const shareSearch = container.querySelector('.notes-search-share');
  const shareSearchStatus = container.querySelector('.notes-search-share-status');
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

  function updateSearchUrl(value) {
    const url = new URL(window.location.href);
    const query = value.trim();
    if (query) {
      url.searchParams.set('search', query);
    } else {
      url.searchParams.delete('search');
    }
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function updateState() {
    const count = notes.matchingItems.length;
    const noun = count === 1 ? 'travel note' : 'travel notes';
    const hasQuery = search.value.trim().length > 0;

    results.textContent = hasQuery ? `${count} matching ${noun}` : `${count} ${noun}`;
    empty.hidden = count !== 0;
    clear.hidden = !hasQuery;
    shareSearch.hidden = !hasQuery;

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
    updateSearchUrl(search.value);
  });

  clear.addEventListener('click', function () {
    search.value = '';
    notes.search();
    updateSearchUrl('');
    search.focus();
  });

  shareSearch.addEventListener('click', async function () {
    shareSearch.disabled = true;
    shareSearchStatus.textContent = '';
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareSearch.textContent = 'Copied';
      shareSearchStatus.textContent = 'Search link copied.';
    } catch {
      shareSearch.textContent = 'Try again';
      shareSearchStatus.textContent = 'Could not copy search link.';
    }
    window.setTimeout(function () {
      shareSearch.textContent = 'Share';
      shareSearch.disabled = false;
    }, 1500);
  });

  notes.sort('published', { order: 'desc' });
  dateSort.classList.add('desc');
  const initialSearch = new URLSearchParams(window.location.search).get('search');
  if (initialSearch) {
    search.value = initialSearch.slice(0, 100);
    notes.search(search.value, ['note-card-title', 'note-card-summary']);
  }
  controls.hidden = false;
  updateState();
}());
