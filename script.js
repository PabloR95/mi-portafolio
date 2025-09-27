/* =========================================================
   Utils
========================================================= */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* Año dinámico */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   Tema claro/oscuro
========================================================= */
const root = document.documentElement;
const themeBtn = $('#themeToggle');

const systemPref = () =>
  (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';

const applyTheme = (mode) => {
  const isLight = mode === 'light';
  root.classList.toggle('light', isLight);
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(isLight));
};

applyTheme(localStorage.getItem('theme') || systemPref());

themeBtn?.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeBtn.setAttribute('aria-pressed', String(isLight));
});

/* =========================================================
   Nav: aria-current según sección visible
========================================================= */
(() => {
  const nav = $('#nav');
  if (!nav) return;

  const links = $$('#nav a');
  const sections = [...document.querySelectorAll('main section[id]')];

  const io = new IntersectionObserver((entries) => {
    // La sección con mayor intersección “gana”
    const vis = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!vis) return;

    links.forEach(a => a.removeAttribute('aria-current'));
    const hit = nav.querySelector(`a[href="#${vis.target.id}"]`);
    if (hit) hit.setAttribute('aria-current', 'page');
  }, { rootMargin: '-50% 0px -40% 0px', threshold: [0, .25, .5, .75, 1] });

  sections.forEach(s => io.observe(s));
})();

/* =========================================================
   Filtros de proyectos (usa data-tags en cada .card)
   - Accesibilidad: aria-pressed + navegación teclado
   - Persistencia: sessionStorage
   - Deep-link: #proyectos?f=web
========================================================= */
(() => {
  const section = $('#proyectos');
  if (!section) return;

  const btns = $$('.filters .chip', section);
  const grid = $('.grid', section);
  const cards = $$('.card', grid);

  if (!btns.length || !cards.length) return;

  const getFilterFromURL = () => {
    const hash = location.hash || '';
    const [, query] = hash.split('?');
    if (!query) return null;
    const params = new URLSearchParams(query);
    return (params.get('f') || params.get('filter') || '').toLowerCase() || null;
  };

  const setFilterInURL = (tag) => {
    const base = '#proyectos';
    const qs = tag && tag !== 'all' ? `?f=${encodeURIComponent(tag)}` : '';
    const newHash = `${base}${qs}`;
    if (location.hash !== newHash) history.replaceState(null, '', newHash);
  };

  const showCard = (card, tag) => {
    const tags = (card.dataset.tags || '').toLowerCase().split(/\s+/);
    const visible = (tag === 'all') || tags.includes(tag);
    card.style.display = visible ? '' : 'none';
    card.setAttribute('aria-hidden', visible ? 'false' : 'true');
  };

  const setPressed = (activeBtn) => {
    btns.forEach(b => {
      const on = b === activeBtn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
      b.tabIndex = on ? 0 : -1; // roving tabindex
    });
  };

  const applyFilter = (tag) => {
    const safe = tag || 'all';
    cards.forEach(c => showCard(c, safe));
    sessionStorage.setItem('projectFilter', safe);
    setFilterInURL(safe);
  };

  const activate = (btn, {focus=true} = {}) => {
    if (!btn) return;
    setPressed(btn);
    const tag = (btn.dataset.filter || 'all').toLowerCase();
    applyFilter(tag);
    if (focus) btn.focus();
  };

  // Estado inicial: URL -> session -> 'all'
  const urlFilter = getFilterFromURL();
  const saved = sessionStorage.getItem('projectFilter');
  const initialTag = (urlFilter || saved || 'all').toLowerCase();
  const initialBtn = btns.find(b => (b.dataset.filter || '').toLowerCase() === initialTag) || btns[0];
  activate(initialBtn, {focus:false});

  // Clicks
  btns.forEach(b => {
    b.addEventListener('click', () => activate(b));
  });

  // Teclado (← → Home End, Enter/Espacio)
  const moveFocus = (dir) => {
    const idx = btns.findIndex(b => b.classList.contains('is-active'));
    const next = (idx + dir + btns.length) % btns.length;
    btns[next].focus();
  };

  btns.forEach(b => {
    b.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); moveFocus(+1); break;
        case 'ArrowLeft':  e.preventDefault(); moveFocus(-1); break;
        case 'Home':       e.preventDefault(); btns[0].focus(); break;
        case 'End':        e.preventDefault(); btns[btns.length-1].focus(); break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          activate(document.activeElement);
          break;
      }
    });
  });

  // Si el usuario cambia manualmente el hash (deep-linking)
  window.addEventListener('hashchange', () => {
    const f = getFilterFromURL();
    if (!f) { activate(btns.find(b => (b.dataset.filter||'').toLowerCase()==='all') || btns[0], {focus:false}); return; }
    const match = btns.find(b => (b.dataset.filter||'').toLowerCase() === f);
    if (match) activate(match, {focus:false});
  });
})();
