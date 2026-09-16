(() => {
  const button = document.querySelector('.note-share-button');
  if (!button) return;
  const status = document.querySelector('.note-share-status');
  const fallback = document.querySelector('.note-share-fallback');
  const input = document.querySelector('#article-share-url');
  const url = document.querySelector('link[rel="canonical"]').href;
  const title = document.querySelector('.note-title').textContent;
  button.hidden = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = '';
    fallback.hidden = true;
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title, url });
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Link copied!';
      } catch {
        fallback.hidden = false;
        input.value = url;
        input.focus();
        input.select();
        status.textContent = 'Select and copy the link below.';
      }
    } finally {
      button.disabled = false;
    }
  });
})();
