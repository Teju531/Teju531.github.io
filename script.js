const links = document.querySelectorAll("a[href^='#']");
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

links.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetSelector = anchor.getAttribute('href');
    const target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    menu?.classList.remove('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const canUseDynamicHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUseDynamicHover) {
  const root = document.documentElement;
  const interactiveTargets = new Set([
    ...document.querySelectorAll('.card'),
    ...document.querySelectorAll('.btn'),
    ...document.querySelectorAll('.chips span'),
    ...document.querySelectorAll('.menu a')
  ]);

  interactiveTargets.forEach((element) => element.classList.add('interactive-hover'));

  window.addEventListener('pointermove', (event) => {
    root.style.setProperty('--pointer-x', `${event.clientX}px`);
    root.style.setProperty('--pointer-y', `${event.clientY}px`);
  });

  interactiveTargets.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      const rotateY = ((x - halfW) / halfW) * 4;
      const rotateX = ((halfH - y) / halfH) * 4;

      element.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      element.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
    });

    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--rx', '0deg');
      element.style.setProperty('--ry', '0deg');
    });
  });
}
