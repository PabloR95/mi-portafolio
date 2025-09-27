/* =========================================================
   Utils
========================================================= */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* Año dinámico */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// /* =========================================================
//    Menú móvil (hamburguesa)
// ========================================================= */
// const toggle = $('.menu-toggle');
// const nav = $('#nav');

// if (toggle && nav){
//   toggle.addEventListener('click', () => {
//     const open = nav.classList.toggle('show');
//     toggle.setAttribute('aria-expanded', String(open));
//   });

//   // cerrar al hacer click fuera
//   document.addEventListener('click', (e) => {
//     if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('show')){
//       nav.classList.remove('show');
//       toggle.setAttribute('aria-expanded','false');
//     }
//   });
// }

/* =========================================================
   Tema claro/oscuro
========================================================= */
const root = document.documentElement;
const themeBtn = $('#themeToggle');

const systemPref = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

const applyTheme = (mode) => {
  const isLight = mode === 'light';
  root.classList.toggle('light', isLight);
  themeBtn?.setAttribute('aria-pressed', String(isLight));
};

const saved = localStorage.getItem('theme');
applyTheme(saved || systemPref());

themeBtn?.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeBtn.setAttribute('aria-pressed', String(isLight));
});

/* =========================================================
   Filtros de proyectos (usa data-tags en cada .card)
========================================================= */
const projectsSection = $('#proyectos');
if (projectsSection){
  const btns = $$('.filters .chip', projectsSection);
  const grid = $('.grid', projectsSection);

  const applyFilter = (tag) => {
    $$('.card', grid).forEach(card => {
      const tags = (card.dataset.tags || '').toLowerCase();
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  };

  const activate = (btn) => {
    btns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyFilter((btn.dataset.filter || 'all').toLowerCase());
  };

  // estado inicial
  const initial = btns.find(b => (b.dataset.filter || '') === 'all') || btns[0];
  if (initial) activate(initial);

  // clicks
  btns.forEach(b => b.addEventListener('click', () => activate(b)));
}


// Selecciona el canvas del hero
const canvas = document.getElementById("hero-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

// Usa el tamaño real del canvas (no toda la ventana)
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Cámara ajustada al tamaño del canvas
camera.aspect = canvas.clientWidth / canvas.clientHeight;
camera.updateProjectionMatrix();

// Ajusta también en el resize
window.addEventListener("resize", () => {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});
