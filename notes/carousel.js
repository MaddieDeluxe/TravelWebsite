(function () {
  document.querySelectorAll('.note-carousel').forEach(function (carousel) {
    var viewport = carousel.querySelector('.note-carousel-viewport');
    var slides = Array.from(carousel.querySelectorAll('.note-carousel-slide'));
    var dots = Array.from(carousel.querySelectorAll('.note-carousel-dot'));
    var status = carousel.querySelector('.note-carousel-status');
    var current = 0;
    var autoplay;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateCurrent(index) {
      current = (index + slides.length) % slides.length;
      dots.forEach(function (dot, dotIndex) { dot.setAttribute('aria-current', String(dotIndex === current)); });
      status.textContent = 'Image ' + (current + 1) + ' of ' + slides.length;
    }

    function show(index) {
      updateCurrent(index);
      viewport.scrollLeft = slides[current].offsetLeft;
    }

    function stopAutoplay() {
      window.clearInterval(autoplay);
      autoplay = undefined;
    }

    function startAutoplay() {
      if (!reducedMotion && !autoplay) {
        autoplay = window.setInterval(function () { show(current + 1); }, 5000);
      }
    }

    carousel.querySelector('.note-carousel-previous').addEventListener('click', function () { show(current - 1); });
    carousel.querySelector('.note-carousel-next').addEventListener('click', function () { show(current + 1); });
    dots.forEach(function (dot, index) { dot.addEventListener('click', function () { show(index); }); });
    viewport.addEventListener('scroll', function () {
      var closest = 0;
      slides.forEach(function (slide, index) {
        if (Math.abs(slide.offsetLeft - viewport.scrollLeft) < Math.abs(slides[closest].offsetLeft - viewport.scrollLeft)) closest = index;
      });
      if (closest !== current) updateCurrent(closest);
    }, { passive: true });
    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (!carousel.contains(document.activeElement)) startAutoplay();
      }, 0);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });
    startAutoplay();
  });
}());
