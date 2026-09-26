// Mobile menu toggle and photo carousel controls.
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
