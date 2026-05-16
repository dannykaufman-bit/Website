(function () {
  'use strict';

  var PASSWORD = 'yaydesign'; // ← update to change the password
  var AUTH_KEY = 'dk-auth';

  // Already authenticated this session — do nothing
  if (sessionStorage.getItem(AUTH_KEY) === '1') return;

  document.addEventListener('DOMContentLoaded', function () {
    var heroHome = document.querySelector('.hero--home');

    if (heroHome) {
      // ── INDEX PAGE: embed password form inside the hero ──────
      gateHero(heroHome);
    } else {
      // ── OTHER PAGES: simple full-screen overlay ──────────────
      gateOverlay();
    }
  });

  // ── Hero-mode gate (index page) ──────────────────────────────
  function gateHero(hero) {
    var heroLeft  = document.querySelector('.hero-left');
    var afterHero = Array.prototype.slice.call(
      document.querySelectorAll('.marquee, .work-section, .about-snippet, .footer')
    );

    // Expand hero to fill full viewport while gate is active
    hero.style.minHeight = '100vh';

    // Hide hero text and everything below
    if (heroLeft) heroLeft.style.visibility = 'hidden';
    afterHero.forEach(function (el) { el.style.visibility = 'hidden'; });

    // Build the form, positioned like the hero-left content
    var gate = document.createElement('div');
    gate.id = 'dk-gate';
    gate.style.cssText = [
      'position:absolute',
      'top:0', 'left:0', 'right:0', 'bottom:0',
      'display:flex',
      'flex-direction:column',
      'justify-content:flex-start',
      'padding:calc(var(--nav-height,52px) + 64px) 48px 80px',
      'z-index:2',
      'pointer-events:none',
    ].join(';');

    gate.innerHTML = [
      '<p style="font-family:\'JetBrains Mono\',monospace;font-size:11px;',
        'color:rgba(240,238,233,0.45);letter-spacing:0.14em;',
        'text-transform:uppercase;margin-bottom:28px;pointer-events:auto;">',
        'Enter password',
      '</p>',
      '<div style="display:flex;width:100%;max-width:380px;pointer-events:auto;">',
        '<input id="dk-pw-input" type="password" placeholder="••••••••••" autocomplete="current-password"',
          ' style="flex:1;background:transparent;border:1px solid rgba(240,238,233,0.2);',
          'border-right:none;color:#F0EEE9;',
          'font-family:\'JetBrains Mono\',monospace;font-size:13px;',
          'padding:12px 16px;outline:none;transition:border-color 0.2s;">',
        '<button id="dk-pw-btn"',
          ' style="background:#F0EEE9;color:#0A0A0A;border:none;',
          'font-family:\'JetBrains Mono\',monospace;font-size:11px;font-weight:500;',
          'letter-spacing:0.12em;text-transform:uppercase;',
          'padding:12px 20px;cursor:pointer;white-space:nowrap;">',
          'Enter',
        '</button>',
      '</div>',
      '<p id="dk-pw-err" style="font-family:\'JetBrains Mono\',monospace;',
        'font-size:11px;color:rgb(220,50,50);margin-top:10px;',
        'height:14px;letter-spacing:0.05em;pointer-events:none;"></p>',
    ].join('');

    hero.appendChild(gate);

    var input = document.getElementById('dk-pw-input');
    var btn   = document.getElementById('dk-pw-btn');
    var err   = document.getElementById('dk-pw-err');

    input.addEventListener('focus', function () { input.style.borderColor = 'rgba(240,238,233,0.6)'; });
    input.addEventListener('blur',  function () { input.style.borderColor = 'rgba(240,238,233,0.2)'; });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });
    btn.addEventListener('click', attempt);
    setTimeout(function () { input.focus(); }, 200);

    function attempt() {
      if (input.value === PASSWORD) {
        err.textContent = '';
        sessionStorage.setItem(AUTH_KEY, '1');

        // Fade out gate
        gate.style.transition = 'opacity 0.35s ease';
        gate.style.opacity = '0';

        setTimeout(function () {
          gate.parentNode && gate.parentNode.removeChild(gate);

          // Restore hero height
          hero.style.minHeight = '';

          // Reveal hero text
          if (heroLeft) {
            heroLeft.style.visibility = '';
            heroLeft.style.opacity = '0';
            heroLeft.style.transition = 'opacity 0.5s ease';
            setTimeout(function () { heroLeft.style.opacity = '1'; }, 20);
          }

          // Reveal everything below, staggered
          afterHero.forEach(function (el, i) {
            el.style.visibility = '';
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.6s ease';
            setTimeout(function () { el.style.opacity = '1'; }, 100 + i * 80);
          });
        }, 350);
      } else {
        err.textContent = 'Incorrect password';
        input.value = '';
        input.style.borderColor = 'rgb(220,50,50)';
        setTimeout(function () {
          input.style.borderColor = 'rgba(240,238,233,0.2)';
        }, 1200);
      }
    }
  }

  // ── Overlay-mode gate (all other pages) ─────────────────────
  function gateOverlay() {
    var overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:99999',
      'background:#0A0A0A',
      'display:flex;flex-direction:column;align-items:center;justify-content:center',
      'padding:24px',
    ].join(';');

    overlay.innerHTML = [
      '<p style="font-family:\'JetBrains Mono\',monospace;font-size:13px;',
        'font-weight:500;color:#F0EEE9;letter-spacing:0.1em;margin-bottom:40px;">DK</p>',
      '<p style="font-family:\'JetBrains Mono\',monospace;font-size:11px;',
        'color:#888;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;">',
        'Enter password',
      '</p>',
      '<div style="display:flex;width:100%;max-width:320px;">',
        '<input id="dk-pw-input" type="password" placeholder="••••••••••" autocomplete="current-password"',
          ' style="flex:1;background:transparent;border:1px solid #222;border-right:none;',
          'color:#F0EEE9;font-family:\'JetBrains Mono\',monospace;font-size:13px;',
          'padding:12px 16px;outline:none;transition:border-color 0.2s;">',
        '<button id="dk-pw-btn"',
          ' style="background:#F0EEE9;color:#0A0A0A;border:none;',
          'font-family:\'JetBrains Mono\',monospace;font-size:11px;font-weight:500;',
          'letter-spacing:0.12em;text-transform:uppercase;',
          'padding:12px 20px;cursor:pointer;white-space:nowrap;">',
          'Enter',
        '</button>',
      '</div>',
      '<p id="dk-pw-err" style="font-family:\'JetBrains Mono\',monospace;',
        'font-size:11px;color:rgb(220,50,50);margin-top:10px;',
        'height:14px;letter-spacing:0.05em;"></p>',
    ].join('');

    document.body.appendChild(overlay);

    var input = document.getElementById('dk-pw-input');
    var btn   = document.getElementById('dk-pw-btn');
    var err   = document.getElementById('dk-pw-err');

    input.addEventListener('focus', function () { input.style.borderColor = '#F0EEE9'; });
    input.addEventListener('blur',  function () { input.style.borderColor = '#222'; });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });
    btn.addEventListener('click', attempt);
    setTimeout(function () { input.focus(); }, 100);

    function attempt() {
      if (input.value === PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, '1');
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';
        setTimeout(function () { overlay.parentNode.removeChild(overlay); }, 400);
      } else {
        err.textContent = 'Incorrect password';
        input.value = '';
        input.style.borderColor = 'rgb(220,50,50)';
        setTimeout(function () { input.style.borderColor = '#222'; }, 1200);
      }
    }
  }

})();
