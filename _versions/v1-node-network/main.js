/* ============================================================
   DANNY KAUFMAN — PORTFOLIO
   main.js — Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
     ---------------------------------------------------------- */
  function initCursor() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    const hero = document.querySelector('.hero');

    function isInHero() {
      if (!hero) return true;  // no hero = show cursor everywhere
      return window.scrollY < hero.offsetTop + hero.offsetHeight;
    }

    function updateCursorMode() {
      if (isInHero()) {
        document.body.style.cursor = 'none';
        cursor.style.opacity = '1';
      } else {
        document.body.style.cursor = '';
        cursor.style.opacity = '0';
      }
    }

    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    window.addEventListener('scroll', updateCursorMode, { passive: true });

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, [role="button"]')) {
        cursor.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, [role="button"]')) {
        cursor.classList.remove('cursor-hover');
      }
    });

    document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { updateCursorMode(); });

    updateCursorMode();
  }

  /* ----------------------------------------------------------
     2. FLOATING NODE NETWORK
     ---------------------------------------------------------- */
  function initNodes() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    hero.insertBefore(canvas, hero.firstChild);
    var ctx = canvas.getContext('2d');

    var W = 0, H = 0;
    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var mouse = { x: -9999, y: -9999, inside: false };
    document.addEventListener('mousemove', function(e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = (mouse.x >= 0 && mouse.x <= W && mouse.y >= 0 && mouse.y <= H);
    });
    document.addEventListener('mouseleave', function() { mouse.inside = false; mouse.x = -9999; mouse.y = -9999; });

    // ── Config ─────────────────────────────────────────────────
    var COUNT      = 260;
    var NODE_DIST  = 140;   // node-to-node connection threshold
    var MOUSE_DIST = 220;   // mouse connection threshold (larger)
    var MAX_SPD    = 0.55;

    // ── Build nodes ────────────────────────────────────────────
    var nodes = [];
    for (var i = 0; i < COUNT; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = 0.1 + Math.random() * MAX_SPD;
      nodes.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r:  1.2 + Math.random() * 1.4,
        a:  0.35 + Math.random() * 0.45,
      });
    }

    // ── Loop ───────────────────────────────────────────────────
    var NODE_SQ  = NODE_DIST  * NODE_DIST;
    var MOUSE_SQ = MOUSE_DIST * MOUSE_DIST;

    function loop() {
      requestAnimationFrame(loop);

      // Update
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];

        // Gentle attraction toward mouse
        if (mouse.inside) {
          var dx   = mouse.x - n.x;
          var dy   = mouse.y - n.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST && dist > 0) {
            var pull = (1 - dist / MOUSE_DIST) * 0.012;
            n.vx += (dx / dist) * pull;
            n.vy += (dy / dist) * pull;
          }
        }

        // Soft speed cap so attraction doesn't run away
        var spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd > MAX_SPD * 2.5) {
          n.vx = (n.vx / spd) * MAX_SPD * 2.5;
          n.vy = (n.vy / spd) * MAX_SPD * 2.5;
        }

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20)    { n.x = W + 20; }
        if (n.x > W + 20) { n.x = -20; }
        if (n.y < -20)    { n.y = H + 20; }
        if (n.y > H + 20) { n.y = -20; }
      }

      ctx.clearRect(0, 0, W, H);

      // Node-to-node lines
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b   = nodes[j];
          var dx  = a.x - b.x;
          var dy  = a.y - b.y;
          var dsq = dx * dx + dy * dy;
          if (dsq > NODE_SQ) continue;
          var alpha = (1 - Math.sqrt(dsq) / NODE_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse-to-node lines (brighter, wider radius)
      if (mouse.inside) {
        for (var i = 0; i < nodes.length; i++) {
          var n   = nodes[i];
          var dx  = n.x - mouse.x;
          var dy  = n.y - mouse.y;
          var dsq = dx * dx + dy * dy;
          if (dsq > MOUSE_SQ) continue;
          var t     = 1 - Math.sqrt(dsq) / MOUSE_DIST;
          var alpha = t * t * 0.65;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = 'rgba(220,50,50,' + alpha + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // Nodes — brighten those near the mouse
      for (var i = 0; i < nodes.length; i++) {
        var n    = nodes[i];
        var a    = n.a;
        var r    = n.r;
        if (mouse.inside) {
          var dx   = n.x - mouse.x;
          var dy   = n.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_DIST) {
            var boost = (1 - dist / MOUSE_DIST) * 0.6;
            a = Math.min(0.75, a + boost);
            r = n.r * (1 + boost * 0.5);
          }
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
        ctx.fill();
      }

      // Mouse dot (red)
      if (mouse.inside) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220,50,50,0.95)';
        ctx.fill();
      }
    }

    loop();
  }

  /* ----------------------------------------------------------
     3. PAGE TRANSITIONS
     ---------------------------------------------------------- */
  function initPageTransitions() {
    // Fade in on load
    window.addEventListener('load', function () {
      document.body.classList.add('loaded');
    });

    // Fallback: if load already fired
    if (document.readyState === 'complete') {
      document.body.classList.add('loaded');
    }

    // Fade out on internal link click
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Skip external links, anchors, mailto, tel
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        link.target === '_blank'
      ) {
        return;
      }

      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';

      setTimeout(function () {
        window.location.href = href;
      }, 300);
    });
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL
     ---------------------------------------------------------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     4. MARQUEE — duplicate content so it loops seamlessly
     ---------------------------------------------------------- */
  function initMarquee() {
    const inner = document.querySelector('.marquee-inner');
    if (!inner) return;

    // Content is already duplicated in HTML; CSS animation handles it.
    // Nothing extra needed here unless we want JS-driven duplication.
    // The HTML template already duplicates the span twice for seamless loop.
  }

  /* ----------------------------------------------------------
     5. SWISS GRID DRAW ANIMATION
     ---------------------------------------------------------- */
  function initGridDraw() {
    const overlay = document.querySelector('.grid-overlay');
    if (!overlay) return;

    // Create 12 child divs if not already present
    if (!overlay.children.length) {
      for (let i = 0; i < 12; i++) {
        overlay.appendChild(document.createElement('div'));
      }
    }

    const lines = overlay.querySelectorAll('div');

    lines.forEach(function (line, i) {
      // Use CSS transition with a staggered delay
      line.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      line.style.transitionDelay = i * 50 + 'ms';
    });

    // Trigger after a brief tick so transition fires
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lines.forEach(function (line) {
          line.style.transform = 'scaleY(1)';
        });
      });
    });
  }

  /* ----------------------------------------------------------
     6. TYPEWRITER EFFECT ON NAV CENTER
     ---------------------------------------------------------- */
  function initTypewriter() {
    const navTitle = document.querySelector('.nav-title');
    if (!navTitle) return;

    const text = navTitle.getAttribute('data-text') || navTitle.textContent.trim();
    navTitle.textContent = '';

    let i = 0;
    const speed = 40; // ms per character

    function type() {
      if (i < text.length) {
        navTitle.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    // Start typing after grid animation begins
    setTimeout(type, 200);
  }

  /* ----------------------------------------------------------
     7. PROJECT CARD HOVER (clip-path is CSS)
        JS is not needed — handled purely via CSS ::before + clip-path
        This function is a no-op kept for documentation purposes.
     ---------------------------------------------------------- */
  function initCardHover() {
    // Clip-path animation is handled entirely in CSS.
    // The ::before pseudo-element on .project-card transitions
    // from clip-path: inset(0 100% 0 0) to clip-path: inset(0 0% 0 0).
    // Text color transitions to --white on hover via .project-card:hover selectors.
  }

  /* ----------------------------------------------------------
     8. MOBILE NAV HAMBURGER
     ---------------------------------------------------------- */
  function initMobileNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    if (!hamburger) return;

    // Create mobile menu if not already in DOM
    let mobileMenu = document.querySelector('.nav-mobile-menu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('nav');
      mobileMenu.classList.add('nav-mobile-menu');

      // Clone nav links
      const navLinks = document.querySelectorAll('.nav-links a');
      navLinks.forEach(function (link) {
        const clone = link.cloneNode(true);
        mobileMenu.appendChild(clone);
      });

      document.body.insertBefore(mobileMenu, document.body.firstChild.nextSibling);
    }

    let isOpen = false;

    hamburger.addEventListener('click', function () {
      isOpen = !isOpen;
      mobileMenu.classList.toggle('open', isOpen);

      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        if (spans[0]) spans[0].style.transform = 'translateY(6px) rotate(45deg)';
        if (spans[1]) spans[1].style.opacity = '0';
        if (spans[2]) spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        if (spans[0]) spans[0].style.transform = '';
        if (spans[1]) spans[1].style.opacity = '';
        if (spans[2]) spans[2].style.transform = '';
      }
    });
  }

  /* ----------------------------------------------------------
     INIT — Run everything on DOMContentLoaded
     ---------------------------------------------------------- */
  function initScrollNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    function check() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  function init() {
    initCursor();
    initNodes();
    initPageTransitions();
    initScrollReveal();
    initScrollNav();
    initMarquee();
    initGridDraw();
    initTypewriter();
    initCardHover();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
