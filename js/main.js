/* ============================================================
   LISI VIEZZER — INSTANTE PERFEITO
   JavaScript principal
   ============================================================ */

(function () {
  'use strict';

  /* ─── PROGRESS BAR ─── */
  const progressBar = document.getElementById('progress-bar');

  function updateProgress() {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress     = (scrollTop / scrollHeight) * 100;
    if (progressBar) progressBar.style.width = progress + '%';
  }

  /* ─── NAV SCROLL ─── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
  }, { passive: true });

  /* ─── HAMBURGER MENU ─── */
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    mobileMenu && mobileMenu.classList.contains('open')
      ? closeMobileMenu()
      : openMobileMenu();
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

  // Fechar ao clicar em um link do menu mobile
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Fechar ao pressionar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ─── REVEAL ON SCROLL ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const steps    = 60;
    const step     = target / steps;
    let   current  = 0;
    let   count    = 0;

    const timer = setInterval(() => {
      count++;
      current += step;

      if (count >= steps) {
        el.textContent = target.toLocaleString('pt-BR') + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('pt-BR') + (el.dataset.suffix || '');
      }
    }, duration / steps);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

  /* ─── ACCORDION — MÓDULOS ─── */
  document.querySelectorAll('.module-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.module-item');
      const isOpen = item.classList.contains('open');

      // Fecha todos
      document.querySelectorAll('.module-item.open').forEach(i => i.classList.remove('open'));

      // Abre o clicado (toggle)
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── ACCORDION — FAQ ─── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── DEPOIMENTOS — DOTS NAV ─── */
  const track = document.querySelector('.testimonials-track');
  const dots  = document.querySelectorAll('.t-dot');

  function updateDots() {
    if (!track || !dots.length) return;
    const cardWidth = 364; // 340px card + 24px gap
    const index     = Math.round(track.scrollLeft / cardWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (!track) return;
      const cardWidth = 364;
      track.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    });
  });

  if (track) track.addEventListener('scroll', updateDots, { passive: true });

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── INIT ─── */
  updateNav();
  updateProgress();

})();
