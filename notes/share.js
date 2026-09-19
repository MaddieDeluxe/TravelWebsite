(() => {
  const button = document.querySelector('.note-share-button');
  if (button) {
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
  }

  document.querySelectorAll('.note-card-share-button').forEach((cardButton) => {
    const status = cardButton.parentElement.querySelector('.note-card-share-status');
    cardButton.addEventListener('click', async () => {
      const url = new URL(cardButton.dataset.shareUrl, window.location.origin).href;
      const title = cardButton.closest('.note-card').querySelector('.note-card-title').textContent;
      cardButton.disabled = true;
      cardButton.classList.remove('is-copied');
      status.textContent = '';
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title, url });
          cardButton.disabled = false;
          return;
        } catch (error) {
          if (error.name === 'AbortError') {
            cardButton.disabled = false;
            return;
          }
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Link copied.';
        cardButton.classList.add('is-copied');
        cardButton.title = 'Link copied';
      } catch {
        status.textContent = 'Could not copy link.';
        cardButton.title = 'Could not copy link';
      }
      cardButton.disabled = false;
    });
  });
})();
