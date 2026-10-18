(function () {
  const menu = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if (menu && links) {
    menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
    document.addEventListener('click', e => { if (!menu.contains(e.target) && !links.contains(e.target)) { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && links.classList.contains('open')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus(); } });
  }
  const current = document.body.dataset.page;
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.toggle('active', a.dataset.page === current));
  document.querySelectorAll('.nav-cta').forEach(btn => btn.classList.toggle('active', current === 'contact'));

  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const params = new URLSearchParams(window.location.search);
  const briefParam = params.get('brief');
  if (briefParam && current === 'contact') {
    const briefArea = document.querySelector('.field textarea');
    if (briefArea) {
      briefArea.value = briefParam;
      briefArea.focus();
    }
  }

  // Interactive Visual Desk Rail (Swipe, Drag, Wheel-Scroll & Controls)
  const railShell = document.querySelector('.rail-shell');
  if (railShell) {
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let isDragged = false;
    let autoPaused = false;
    let pauseTimer = null;

    const pauseAuto = (duration = 3500) => {
      autoPaused = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => { autoPaused = false; }, duration);
    };

    // 1. Mouse Wheel / Trackpad Scroll (Vertical wheel scrolls horizontally)
    railShell.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        railShell.scrollLeft += e.deltaY * 1.2;
        pauseAuto();
      }
    }, { passive: false });

    // 2. Click & Drag to Swipe
    railShell.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      isDown = true;
      isDragged = false;
      startX = e.clientX;
      scrollLeftStart = railShell.scrollLeft;
      railShell.classList.add('is-dragging');
      pauseAuto(5000);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dist = e.clientX - startX;
      if (Math.abs(dist) > 5) isDragged = true;
      railShell.scrollLeft = scrollLeftStart - dist;
      pauseAuto(5000);
    });

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      railShell.classList.remove('is-dragging');
      pauseAuto(3000);
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Prevent click on children if dragging
    railShell.addEventListener('click', (e) => {
      if (isDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // 3. Touch scroll pause
    railShell.addEventListener('touchstart', () => pauseAuto(4000), { passive: true });
    railShell.addEventListener('touchmove', () => pauseAuto(4000), { passive: true });
    railShell.addEventListener('mouseenter', () => { autoPaused = true; });
    railShell.addEventListener('mouseleave', () => pauseAuto(1500));

    // 4. Navigation Buttons (Previous / Next)
    const prevBtn = document.querySelector('.rail-prev');
    const nextBtn = document.querySelector('.rail-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        pauseAuto(4000);
        railShell.scrollBy({ left: -340, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        pauseAuto(4000);
        railShell.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }

    // 5. Gentle Ambient Auto-Glide (infinite drift when user is not interacting)
    let lastTime = performance.now();
    const glide = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      if (!autoPaused && !isDown && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (railShell.scrollLeft + railShell.clientWidth >= railShell.scrollWidth - 4) {
          railShell.scrollLeft = 0;
        } else {
          railShell.scrollLeft += 28 * dt; // gentle luxury drift ~28px/s
        }
      }
      requestAnimationFrame(glide);
    };
    requestAnimationFrame(glide);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.waterfall');
  if (reduce) { targets.forEach(el => el.classList.add('show')); return; }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));

  // Guarantee visibility if an observer is unavailable or a browser blocks it.
  window.addEventListener('load', () => {
    setTimeout(() => document.querySelectorAll('.waterfall,.reveal,.reveal-left,.reveal-right').forEach(el => el.classList.add('show')), 3500);
  });
})();