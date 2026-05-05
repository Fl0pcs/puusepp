/* ===== PUUSEPP 369 — script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVIGATION ────────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scroll: add .scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      if (isOpen) {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── FADE-IN ON SCROLL ─────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  // ─── STAT COUNTER ANIMATION ────────────────────────────────────
  const statEls = document.querySelectorAll('.stat-num[data-count]');

  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => statObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current) + suffix;
    }, step);
  }

  // ─── CONTACT FORM ──────────────────────────────────────────────
  const form = document.getElementById('contactForm');
  const successMsg = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#c0392b';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) return;

      const btn = form.querySelector('.btn');
      btn.textContent = 'Saatmine...';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.textContent = 'Saada sõnum';
        btn.disabled = false;
        if (successMsg) {
          successMsg.style.display = 'flex';
          setTimeout(() => successMsg.style.display = 'none', 5000);
        }
      }, 1200);
    });
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── GALLERY LIGHTBOX (simple) ─────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const label = item.querySelector('.gallery-item-label')?.textContent || 'Galerii';
        const emoji = item.querySelector('.gallery-item-placeholder')?.textContent?.trim()?.charAt(0) || '🪵';

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position:fixed;inset:0;background:rgba(15,30,20,0.92);z-index:9999;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          backdrop-filter:blur(6px);animation:fadeInOverlay 0.25s ease;
        `;

        const inner = document.createElement('div');
        inner.style.cssText = `
          background:var(--white);border-radius:16px;padding:3rem 4rem;
          text-align:center;max-width:480px;width:90%;
          box-shadow:0 30px 80px rgba(0,0,0,0.5);
          animation:scaleInCard 0.3s cubic-bezier(0.34,1.56,0.64,1);
        `;
        inner.innerHTML = `
          <div style="font-size:5rem;margin-bottom:1rem;">${emoji}</div>
          <h3 style="font-family:'Playfair Display',serif;color:var(--green-dark);font-size:1.5rem;margin-bottom:0.5rem;">${label}</h3>
          <p style="color:var(--gray-mid);font-size:0.9rem;">Päriselt foto tuleks siia — hetkel kohaomanik.</p>
          <button onclick="this.closest('[data-overlay]').remove()" style="
            margin-top:1.5rem;padding:0.6rem 1.5rem;background:var(--green-mid);
            color:white;border:none;border-radius:30px;cursor:pointer;
            font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;
          ">Sulge ✕</button>
        `;
        overlay.dataset.overlay = '1';
        overlay.appendChild(inner);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) overlay.remove();
        });
      });
    });
  }

  // Inject keyframes for lightbox
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }
    @keyframes scaleInCard { from { transform:scale(0.85); opacity:0 } to { transform:scale(1); opacity:1 } }
  `;
  document.head.appendChild(style);

});
