// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('show');
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Tema oscuro/claro (simple: invierte variables con una clase)
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
});

// Si quieres un tema claro, define overrides:
const style = document.createElement('style');
style.textContent = `
  .light{
    --bg:#f6f7fb; --bg-alt:#eef0f7; --text:#11131b; --muted:#3f4665;
    --brand:#3b63ff; --card:#ffffff; --border:#d8dcf0;
  }
`;
document.head.appendChild(style);

// Scroll suave (mejora UX)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      nav.classList.remove('show'); // cierra menú en móvil
      toggle.setAttribute('aria-expanded','false');
    }
  });
});
