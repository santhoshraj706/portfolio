document.addEventListener('DOMContentLoaded', () => {
  // --- CUSTOM CURSOR ---
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  let isMoving = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    isMoving = true;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor interactions
  const activeElements = document.querySelectorAll('a, button, .skill-tag, .project-card, .achievement-card, .about-card, .timeline-content, .cert-card, .edu-card, .hero-image-frame');
  activeElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.border = '1px solid var(--accent)';
      ring.style.width = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'rgba(16, 185, 129, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'var(--accent)';
      cursor.style.border = 'none';
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    });
  });

  // --- SCROLL REVEAL ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  // --- STATS COUNTER ANIMATION ---
  const stats = document.querySelectorAll('.hero-stat-num');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        animateCount(entry.target, target, suffix);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => statsObserver.observe(s));

  function animateCount(el, target, suffix) {
    let current = 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      current = easeProgress * target;
      
      if (Number.isInteger(target)) {
        el.textContent = Math.floor(current) + suffix;
      } else {
        el.textContent = current.toFixed(2) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // --- NAV SHOCK / BLUR ON SCROLL ---
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '1rem 6%';
      nav.style.backgroundColor = 'rgba(5, 5, 8, 0.9)';
    } else {
      nav.style.padding = '1.5rem 6%';
      nav.style.backgroundColor = 'rgba(5, 5, 8, 0.7)';
    }
  });

  // --- ACTIVE NAV LINK HIGHLIGHT ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      // Remove inline styles if they were previously set
      link.style.color = '';
      
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });


  // --- CONTACT FORM HANDLING ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // UI Loading state
      contactForm.classList.add('loading');
      formStatus.textContent = 'Sending message...';
      formStatus.className = 'form-status';

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      try {
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          formStatus.textContent = 'Message sent successfully!';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      } catch (error) {
        formStatus.textContent = error.message;
        formStatus.className = 'form-status error';
      } finally {
        contactForm.classList.remove('loading');
      }
    });
  }
  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById('mobile-menu');
  const navLinksList = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinksList.classList.toggle('active');
      document.body.style.overflow = navLinksList.classList.contains('active') ? 'hidden' : 'auto';
    });
  }

  // Close menu when link is clicked
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinksList.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

});
