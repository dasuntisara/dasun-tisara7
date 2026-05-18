/* ═══════════════════════════════════════════════════════
   DASUN TISARA — Premium JS Animations
   canvas particles · custom cursor · 3D tilt · 
   scroll reveal · text scramble · magnetic buttons
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ───────────────────────────────────────────────────
     1. CANVAS PARTICLE NETWORK
  ─────────────────────────────────────────────────── */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;
    const COUNT   = 90;
    const CONNECT = 140;  // max distance to draw line
    const COLORS  = ['rgba(0,255,136,', 'rgba(68,136,255,', 'rgba(204,68,255,'];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x  = Math.random() * W;
        this.y  = init ? Math.random() * H : H + 10;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.3 + 0.1);
        this.r  = Math.random() * 1.8 + 0.5;
        this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 400 + 200;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life++;
        if (this.life > this.maxLife || this.y < -10) this.reset(false);
        // slight drift
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vx = Math.max(-0.6, Math.min(0.6, this.vx));
      }
      draw() {
        const progress = this.life / this.maxLife;
        const a = this.alpha * Math.sin(progress * Math.PI);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.col + a + ')';
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT) {
            const alpha = (1 - dist / CONNECT) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      animId = requestAnimationFrame(loop);
    }
    loop();
  }


  /* ───────────────────────────────────────────────────
     2. CUSTOM CURSOR — simple smooth follow
  ─────────────────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    document.querySelectorAll('a, button, input, textarea, .project-icon, .about, .Portfolio, .contac')
      .forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

    // dot snaps, ring lags slightly
    function animCursor() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();
  }


  /* ───────────────────────────────────────────────────
     3. SCROLL REVEAL  (IntersectionObserver)
  ─────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger for groups
          setTimeout(() => entry.target.classList.add('in-view'), i * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }


  /* ───────────────────────────────────────────────────
     4. 3D CARD TILT
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.project-icon, .about, .Portfolio, .contac, .frist-l').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const MAX = 8;
      card.style.transform = `perspective(900px) rotateY(${dx*MAX}deg) rotateX(${-dy*MAX}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ───────────────────────────────────────────────────
     5. MAGNETIC BUTTONS
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.tab, .H-button button, input[type=submit]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width  / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ───────────────────────────────────────────────────
     6. TEXT SCRAMBLE on hero name hover
  ─────────────────────────────────────────────────── */
  const CHARS = '!<>-_\\/[]{}—=+*^?#░▒▓█▄▀01';

  function scrambleText(el, finalText, duration = 800) {
    let frame = 0;
    const totalFrames = Math.ceil(duration / 16);
    const orig = el.getAttribute('data-original') || finalText;
    el.setAttribute('data-original', orig);

    clearInterval(el._scrambleInterval);
    el._scrambleInterval = setInterval(() => {
      let output = '';
      const progress = frame / totalFrames;
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ') { output += ' '; continue; }
        if (i < finalText.length * progress) {
          output += finalText[i];
        } else {
          output += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      el.textContent = output;
      frame++;
      if (frame > totalFrames) {
        el.textContent = finalText;
        clearInterval(el._scrambleInterval);
      }
    }, 16);
  }

  document.querySelectorAll('.hero-name .line').forEach(line => {
    const fill = line.querySelector('.name-fill');
    const text = fill ? fill.textContent : line.textContent.trim();

    line.addEventListener('mouseenter', () => {
      if (fill) scrambleText(fill, text, 600);
    });
  });

  // also scramble nav tabs
  document.querySelectorAll('.tab-text').forEach(el => {
    const orig = el.textContent;
    el.closest('.tab').addEventListener('mouseenter', () => {
      scrambleText(el, orig, 400);
    });
  });


  /* ───────────────────────────────────────────────────
     7. NUMBER COUNTER ANIMATION
  ─────────────────────────────────────────────────── */
  function animateCount(el, target, duration = 1200) {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('[data-count]').forEach(el => {
    const io2 = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCount(el, parseInt(el.dataset.count), 1400);
        io2.unobserve(el);
      }
    });
    io2.observe(el);
  });


  /* ───────────────────────────────────────────────────
     8. GLITCH hover on page titles
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.about-me, .contact, .port h1').forEach(el => {
    const txt = el.textContent;
    el.setAttribute('data-text', txt);
    let glitchTimer;

    el.addEventListener('mouseenter', () => {
      el.classList.add('glitching');
      clearTimeout(glitchTimer);
      glitchTimer = setTimeout(() => el.classList.remove('glitching'), 500);
    });
  });


  /* ───────────────────────────────────────────────────
     9. NAV shrink on scroll
  ─────────────────────────────────────────────────── */
  const nav = document.querySelector('.f_tabs');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.style.padding = '6px 24px';
        nav.style.background = 'rgba(0,0,5,0.92)';
      } else {
        nav.style.padding = '';
        nav.style.background = '';
      }
    }, { passive: true });
  }


  /* ───────────────────────────────────────────────────
     10. SKILL TABLE ROW stagger on scroll
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.table tbody tr').forEach((tr, i) => {
    tr.style.opacity = '0';
    tr.style.transform = 'translateX(-20px)';
    tr.style.transition = `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`;

    const io3 = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        tr.style.opacity = '1';
        tr.style.transform = 'translateX(0)';
        io3.unobserve(tr);
      }
    }, { threshold: 0.3 });
    io3.observe(tr);
  });


  /* ───────────────────────────────────────────────────
     11. SOFT SKILL LIST stagger
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.s-skills li').forEach((li, i) => {
    li.style.opacity = '0';
    li.style.transform = 'translateX(-16px)';
    li.style.transition = `opacity 0.35s ease ${i * 60}ms, transform 0.35s ease ${i * 60}ms`;

    const io4 = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
        io4.unobserve(li);
      }
    }, { threshold: 0.3 });
    io4.observe(li);
  });


  /* ───────────────────────────────────────────────────
     12. PROJECT CARD entrance
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.project-icon').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.96)';
    card.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`;

    const io5 = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        io5.unobserve(card);
      }
    }, { threshold: 0.1 });
    io5.observe(card);
  });


  /* ───────────────────────────────────────────────────
     13. PROFILE PHOTO parallax on mouse
  ─────────────────────────────────────────────────── */
  const photo = document.querySelector('.pro-photo');
  if (photo) {
    document.addEventListener('mousemove', e => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * 8;
      const dy = (e.clientY / window.innerHeight - 0.5) * 8;
      photo.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;
    });
  }


  /* ───────────────────────────────────────────────────
     14. FORM input floating label feel
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.from input, .from textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement?.classList.remove('focused');
    });
  });


  /* ───────────────────────────────────────────────────
     15. HOME CARDS stagger entrance
  ─────────────────────────────────────────────────── */
  document.querySelectorAll('.about, .Portfolio, .contac').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 100 + 200}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 100 + 200}ms, border-color 0.2s, box-shadow 0.2s, background 0.2s`;

    const io6 = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        io6.unobserve(card);
      }
    }, { threshold: 0.15 });
    io6.observe(card);
  });

}); // end DOMContentLoaded
