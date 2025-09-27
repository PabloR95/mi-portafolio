/* =========================================================
   Portafolio — JS
   - Filtros en #proyectos
   - Nav activo por sección visible
   - Año dinámico en el footer
========================================================= */
(() => {
  'use strict';

  /* ===== Año dinámico ===== */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ===== Filtros de proyectos ===== */
  const filterBar = document.querySelector('#proyectos .filters');
  const chips = filterBar ? filterBar.querySelectorAll('.chip') : [];
  const cards = document.querySelectorAll('#proyectos .grid .card');

  function applyFilter(filter) {
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(/\s+/).filter(Boolean);
      const show = filter === 'all' || tags.includes(filter);
      card.style.display = show ? '' : 'none';
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  }

  function setActiveChip(btn) {
    chips.forEach(c => {
      const isActive = c === btn;
      c.classList.toggle('is-active', isActive);
      c.setAttribute('aria-pressed', String(isActive));
    });
  }

  if (chips.length) {
    chips.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter || 'all';
        setActiveChip(btn);
        applyFilter(filter);
      });
      // Soporte teclado (por si en el futuro no es <button>)
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Estado inicial (usa el chip con .is-active si existe)
    const initial = document.querySelector('#proyectos .filters .chip.is-active');
    const initialFilter = initial ? (initial.dataset.filter || 'all') : 'all';
    if (initial) initial.setAttribute('aria-pressed', 'true');
    applyFilter(initialFilter);
  }

  /* ===== Nav activo por sección visible ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const linkById = new Map(
      [...navLinks].map(a => [a.getAttribute('href').slice(1), a])
    );

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = linkById.get(id);
        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach(a => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'page');
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px', // zona dulce alrededor del centro
      threshold: 0.01
    });

    sections.forEach(s => io.observe(s));
  }
})();
