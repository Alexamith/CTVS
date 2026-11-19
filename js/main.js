/* Propuesta a CTVS · Gloz Studio
   Sin librerías. Si este archivo falla, la página se ve completa:
   todo estado oculto depende de la clase .js y de este script. */
(function () {
  'use strict';

  var safe = function (fn) { try { fn(); } catch (e) { /* la página sigue visible */ } };

  /* Aparición de bloques marcados con data-reveal */
  safe(function () {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    els.forEach(function (el) { io.observe(el); });
  });

  /* Línea del plan de estudio: se llena al bajar y enciende las clases del mapa */
  safe(function () {
    var weeks = Array.prototype.slice.call(document.querySelectorAll('.semana'));
    var slots = Array.prototype.slice.call(document.querySelectorAll('[data-mapa-semana]'));
    if (!weeks.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var anchor = window.innerHeight * 0.45;
      var reached = 0;

      weeks.forEach(function (week, i) {
        var r = week.getBoundingClientRect();
        var isReached = r.top <= anchor;
        if (isReached) reached = i + 1;
        week.classList.toggle('is-reached', isReached);

        var p = (anchor - r.top) / Math.max(r.height, 1);
        p = Math.min(1, Math.max(0, p));
        week.style.setProperty('--p', p.toFixed(3));
      });

      slots.forEach(function (slot) {
        slot.classList.toggle('is-on', Number(slot.getAttribute('data-mapa-semana')) <= reached);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  });
})();
