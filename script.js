// ============================================================
//  JOGI SHANVITHA DEVI — PORTFOLIO SCRIPT
//  Sliding Panel Navigation | Typing Effect | Theme Toggle
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. SECTION SLIDER NAVIGATION
  // ============================================================
  const sections = ['home', 'about', 'education', 'skills', 'projects', 'leadership', 'contact'];
  let currentIdx = 0;
  let isTransitioning = false;

  const sectionPanels = sections.map(id => document.getElementById(`section-${id}`));
  const navLinks      = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  /** Apply left / active / right classes to every panel */
  function applyPanelClasses() {
    sectionPanels.forEach((panel, idx) => {
      if (!panel) return;
      panel.classList.remove('section-active', 'section-left', 'section-right');
      if (idx === currentIdx) {
        panel.classList.add('section-active');
      } else if (idx < currentIdx) {
        panel.classList.add('section-left');
      } else {
        panel.classList.add('section-right');
      }
    });
    updateNavActiveState();
    triggerSkillBarsIfNeeded();
  }

  /** Highlight the matching nav link */
  function updateNavActiveState() {
    const activeName = sections[currentIdx];

    navLinks.forEach(link => {
      const target = link.getAttribute('data-target');
      link.classList.toggle('nav-active', target === activeName);
    });

    mobileNavLinks.forEach(link => {
      const target = link.getAttribute('data-target');
      link.classList.toggle('nav-active', target === activeName);
    });
  }

  /** Navigate to a target index */
  function navigateTo(targetIdx) {
    if (
      targetIdx === currentIdx ||
      isTransitioning ||
      targetIdx < 0 ||
      targetIdx >= sections.length
    ) return;

    isTransitioning = true;
    currentIdx = targetIdx;
    applyPanelClasses();

    // Scroll active panel to top
    const activePanel = sectionPanels[currentIdx];
    if (activePanel) activePanel.scrollTop = 0;

    setTimeout(() => { isTransitioning = false; }, 600);
  }

  // Bind every [data-target] element (nav buttons, hero CTAs, about CTAs etc.)
  document.querySelectorAll('[data-target]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const target = trigger.getAttribute('data-target');
      const targetIdx = sections.indexOf(target);
      if (targetIdx !== -1) {
        navigateTo(targetIdx);
        closeMobileDrawer();
      }
    });
  });

  // Keyboard navigation (Arrow keys)
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      navigateTo(currentIdx + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      navigateTo(currentIdx - 1);
    }
  });

  // Arrow buttons
  const prevBtn = document.getElementById('arrow-prev-btn');
  const nextBtn = document.getElementById('arrow-next-btn');
  if (prevBtn) prevBtn.addEventListener('click', () => navigateTo(currentIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateTo(currentIdx + 1));

  // Initialise panels
  applyPanelClasses();

  // ============================================================
  // 2. TYPING EFFECT
  // ============================================================
  const typedEl  = document.getElementById('typedText');
  const cursorEl = document.getElementById('typedCursor');
  const roles    = ['B.Tech Student', 'Front-End Developer', 'Problem Solver'];
  let roleIdx    = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let typingPaused = false;

  function typeLoop() {
    if (!typedEl) return;

    const currentRole = roles[roleIdx];
    const displayText = isDeleting
      ? currentRole.substring(0, charIdx - 1)
      : currentRole.substring(0, charIdx + 1);

    typedEl.textContent = displayText;
    isDeleting ? charIdx-- : charIdx++;

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === currentRole.length) {
      // Full word typed — pause then start deleting
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      // Fully deleted — move to next role
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  setTimeout(typeLoop, 800);

  // ============================================================
  // 3. SKILL BARS — animate when Skills panel is first shown
  // ============================================================
  let skillBarsAnimated = false;

  function triggerSkillBarsIfNeeded() {
    if (sections[currentIdx] !== 'skills' || skillBarsAnimated) return;
    skillBarsAnimated = true;

    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach((fill, i) => {
      const targetWidth = fill.getAttribute('data-width') || '0%';
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, i * 120);
    });
  }

  // ============================================================
  // 4. THEME TOGGLE (Dark / Light)
  // ============================================================
  const themeToggleBtn       = document.getElementById('theme-toggle-btn');
  const themeToggleText      = document.getElementById('theme-toggle-text');
  const themeIconContainer   = document.getElementById('theme-icon-container');
  const profileAvatar        = document.getElementById('profile-avatar');

  const THEME_KEY = 'portfolio-theme-jsd';

  function getSunIcon() {
    return `<svg style="width:18px;height:18px;color:#fb923c" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>`;
  }

  function getMoonIcon() {
    return `<svg style="width:18px;height:18px;color:#60a5fa" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
    </svg>`;
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_KEY, theme);

    if (themeIconContainer) {
      themeIconContainer.innerHTML = isDark ? getSunIcon() : getMoonIcon();
    }
    if (themeToggleText) {
      themeToggleText.textContent = isDark ? 'Sunset Mode' : 'Blue Mode';
    }

    // Switch avatar float animation
    if (profileAvatar) {
      if (isDark) {
        profileAvatar.classList.remove('float-avatar-orange');
        profileAvatar.classList.add('float-avatar-blue');
      } else {
        profileAvatar.classList.remove('float-avatar-blue');
        profileAvatar.classList.add('float-avatar-orange');
      }
    }

    // Update nav state visuals
    updateNavActiveState();
  }

  function getStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    // Prefer system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Initialise theme
  applyTheme(getStoredTheme());

  // ============================================================
  // 5. MOBILE DRAWER
  // ============================================================
  const mobileMenuBtn       = document.getElementById('mobile-menu-btn');
  const closeMobileMenuBtn  = document.getElementById('close-mobile-menu-btn');
  const mobileDrawer        = document.getElementById('mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('translate-x-full');
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
      mobileDrawerOverlay.classList.add('opacity-100');
      mobileDrawerOverlay.style.pointerEvents = 'auto';
    }
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('translate-x-full');
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.add('opacity-0', 'pointer-events-none');
      mobileDrawerOverlay.classList.remove('opacity-100');
      mobileDrawerOverlay.style.pointerEvents = 'none';
    }
  }

  if (mobileMenuBtn)       mobileMenuBtn.addEventListener('click', openMobileDrawer);
  if (closeMobileMenuBtn)  closeMobileMenuBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

  // ============================================================
  // 6. CONTACT FORM
  // ============================================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus  = document.getElementById('form-status');

  function showFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className   = ''; // reset classes
    formStatus.classList.add(`form-status-${type}`);
    formStatus.style.display = 'block';

    if (type !== 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 4500);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name    = document.getElementById('form-name')?.value.trim();
      const email   = document.getElementById('form-email')?.value.trim();
      const subject = document.getElementById('form-subject')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !email || !subject || !message) {
        showFormStatus('Please fill in all fields before submitting.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
      }

      showFormStatus('Sending your message…', 'loading');

      // Simulate an async send
      setTimeout(() => {
        contactForm.reset();
        showFormStatus(
          '✅ Thank you! Your message has been sent. Shanvitha will get back to you soon.',
          'success'
        );
      }, 1600);
    });
  }

  // ============================================================
  // 7. PARTICLE CANVAS (Hero background)
  // ============================================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 100 };

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.8 + 0.5;
        const r = Math.random();
        this.color = r > 0.6
          ? 'rgba(96,165,250,0.2)'
          : r > 0.3
            ? 'rgba(139,92,246,0.15)'
            : 'rgba(99,102,241,0.18)';
      }
      update() {
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2.5;
            this.y -= (dy / dist) * force * 2.5;
          }
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 80);
      particles = Array.from({ length: count }, () => new Particle());
    }

    function connectParticles() {
      const maxDist = 100;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.1;
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  // ============================================================
  // 8. SWIPE SUPPORT (Touch devices)
  // ============================================================
  let touchStartX = 0;
  let touchEndX   = 0;

  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        navigateTo(currentIdx + 1); // swipe left → next
      } else {
        navigateTo(currentIdx - 1); // swipe right → prev
      }
    }
  }, { passive: true });

}); // end DOMContentLoaded
