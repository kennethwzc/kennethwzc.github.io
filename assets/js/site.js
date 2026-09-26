// Mobile menu toggle, photo carousel controls and the scroll-driven case study diagram.
// The carousel is a CSS scroll-snap strip, so swipe and trackpad scrolling work without this script.

const toggle = document.querySelector('.menu-toggle');
if (toggle) {
  const menu = document.getElementById(toggle.getAttribute('aria-controls'));
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) setOpen(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  matchMedia('(min-width: 900px)').addEventListener('change', () => setOpen(false));
}

document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const count = track.children.length;
  const dots = [...carousel.querySelectorAll('.carousel-dots button')];
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = (i) => track.scrollTo({ left: ((i + count) % count) * track.clientWidth });
  const mark = () => dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current())));

  carousel.querySelector('.prev').addEventListener('click', () => go(current() - 1));
  carousel.querySelector('.next').addEventListener('click', () => go(current() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  track.addEventListener('scroll', mark, { passive: true });
  mark();
});

// Case study diagram: the number of steps above the trigger line decides how much of the diagram is lit.
const scrolly = document.querySelector('.scrolly');
if (scrolly) {
  const steps = [...scrolly.querySelectorAll('.scrolly-step')];
  const parts = [...scrolly.querySelectorAll('svg [data-step]')];
  scrolly.querySelectorAll('.tag').forEach((tag) => {  // size each label pill to its text
    const text = tag.querySelector('text');
    const rect = tag.querySelector('rect');
    const width = text.getComputedTextLength() + 22;
    rect.setAttribute('width', width);
    rect.setAttribute('x', Number(text.getAttribute('x')) - width / 2);
  });
  scrolly.classList.add('is-scrolly');

  let shown = -1;
  const update = () => {
    const line = innerHeight * (innerWidth < 960 ? 0.75 : 0.55);
    const active = steps.filter((step) => step.getBoundingClientRect().top < line).length;
    if (active === shown) return;
    shown = active;
    steps.forEach((step, i) => step.classList.toggle('now', i + 1 === active));
    parts.forEach((el) => {
      const current = (el.dataset.now || el.dataset.step).split(' ').map(Number);
      el.classList.toggle('on', Number(el.dataset.step) <= active);
      el.classList.toggle('now', current.includes(active));
    });
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  addEventListener('resize', update);
  update();
}
