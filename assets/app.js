const body = document.body;

function setupLangSwitcher(scope = document) {
  scope.querySelectorAll('.lang-switcher').forEach((wrap) => {
    const btn = wrap.querySelector('.lang-current');
    const menu = wrap.querySelector('.lang-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', wrap.classList.contains('open'));
    });
  });
}

function closeLangMenus() {
  document.querySelectorAll('.lang-switcher.open').forEach((w) => {
    w.classList.remove('open');
    const btn = w.querySelector('.lang-current');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

document.addEventListener('click', closeLangMenus);

document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  q?.addEventListener('click', () => {
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) openItem.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

const privacyTriggers = document.querySelectorAll('[data-open-privacy]');
const modalBackdrop = document.getElementById('privacyModal');
const modal = modalBackdrop?.querySelector('.modal');
let lastFocus = null;

function trapFocus(e) {
  if (!modalBackdrop?.classList.contains('open') || e.key !== 'Tab') return;
  const focusables = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openModal() {
  if (!modalBackdrop) return;
  lastFocus = document.activeElement;
  modalBackdrop.classList.add('open');
  body.classList.add('no-scroll');
  const closeX = modalBackdrop.querySelector('[data-close-modal]');
  closeX?.focus();
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  body.classList.remove('no-scroll');
  lastFocus?.focus();
}

privacyTriggers.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
modalBackdrop?.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});
modalBackdrop?.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));

const drawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerBtn = document.getElementById('mobileMenuBtn');

function toggleDrawer(open) {
  const isOpen = open ?? !drawer.classList.contains('open');
  drawer.classList.toggle('open', isOpen);
  drawerOverlay.classList.toggle('open', isOpen);
  body.classList.toggle('no-scroll', isOpen || modalBackdrop?.classList.contains('open'));
  drawer.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) {
    drawer.querySelector('button, a')?.focus();
  } else {
    drawerBtn?.focus();
  }
}

drawerBtn?.addEventListener('click', () => toggleDrawer(true));
drawerOverlay?.addEventListener('click', () => toggleDrawer(false));
drawer?.querySelectorAll('[data-close-drawer]').forEach((el) => el.addEventListener('click', () => toggleDrawer(false)));

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLangMenus();
    if (modalBackdrop?.classList.contains('open')) closeModal();
    if (drawer?.classList.contains('open')) toggleDrawer(false);
  }
  trapFocus(e);
});

setupLangSwitcher(document);
setupLangSwitcher(drawer || document);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.14 });

document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
