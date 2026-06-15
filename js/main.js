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

  /* ─── CARROSSEL PÓDIO — DEPOIMENTOS ─── */
  (function () {
    const cards    = Array.from(document.querySelectorAll('.podium-card'));
    const dotsWrap = document.getElementById('podium-dots');
    const btnPrev  = document.getElementById('podium-prev');
    const btnNext  = document.getElementById('podium-next');
    const total    = cards.length;
    let   current  = 0;
    let   autoTimer;

    if (!total || !dotsWrap) return;

    /* Cria os dots dinamicamente */
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className    = 'podium-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function renderCards() {
      const prevIdx = (current - 1 + total) % total;
      const nextIdx = (current + 1) % total;

      /* Esconde todos primeiro */
      cards.forEach(card => {
        card.classList.remove('is-active', 'is-side', 'is-hidden');
        card.classList.add('is-hidden');
      });

      /* Posiciona e exibe os 3 visíveis na ordem correta */
      const stage = document.querySelector('.podium-stage');
      if (stage) {
        // Coloca na ordem: [prev][active][next]
        stage.appendChild(cards[prevIdx]);
        stage.appendChild(cards[current]);
        stage.appendChild(cards[nextIdx]);
      }

      cards[prevIdx].classList.remove('is-hidden');
      cards[prevIdx].classList.add('is-side');

      cards[current].classList.remove('is-hidden');
      cards[current].classList.add('is-active');

      cards[nextIdx].classList.remove('is-hidden');
      cards[nextIdx].classList.add('is-side');

      /* Atualiza dots */
      dotsWrap.querySelectorAll('.podium-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      renderCards();
      resetAuto();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (btnNext) btnNext.addEventListener('click', next);
    if (btnPrev) btnPrev.addEventListener('click', prev);

    /* Autoplay a cada 5s */
    function startAuto() { autoTimer = setInterval(next, 5000); }
    function resetAuto()  { clearInterval(autoTimer); startAuto(); }

    /* Swipe touch */
    let touchStartX = 0;
    const stage = document.querySelector('.podium-stage');
    if (stage) {
      stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
      }, { passive: true });
    }

    /* Init */
    renderCards();
    startAuto();
  })();

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
