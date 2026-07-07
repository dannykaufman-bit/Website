(function () {
  'use strict';

  // SHA-256 hash of the required password.
  // To change: run `echo -n "yourpassword" | shasum -a 256` and paste the hash below.
  var PASSWORD_HASH = '0a9ccc93a4d4fd4357ba5a7020a6c81a689de49e786039fdbf0d59741a95e628';
  var AUTH_KEY = 'sn-auth';

  if (sessionStorage.getItem(AUTH_KEY) === '1') return;

  document.documentElement.style.visibility = 'hidden';

  function hashInput(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
      .then(function (buf) {
        return Array.from(new Uint8Array(buf))
          .map(function (b) { return b.toString(16).padStart(2, '0'); })
          .join('');
      });
  }

  function build() {
    document.documentElement.style.visibility = '';

    var overlay = document.createElement('div');
    overlay.id = 'sn-gate';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'background:#0A0A0A',
      'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center',
      'padding:24px'
    ].join(';');

    overlay.innerHTML = [
      '<p style="font-family:\'JetBrains Mono\',monospace;font-size:13px;',
        'font-weight:500;color:#F0EEE9;letter-spacing:0.1em;margin-bottom:12px;">DK</p>',
      '<p style="font-family:\'JetBrains Mono\',monospace;font-size:11px;',
        'color:#888;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;">',
        'ServiceNow project — restricted',
      '</p>',
      '<div style="display:flex;width:100%;max-width:320px;">',
        '<input id="sn-pw-input" type="password" placeholder="••••••••••" autocomplete="current-password"',
          ' style="flex:1;background:transparent;border:1px solid #222;border-right:none;',
          'color:#F0EEE9;font-family:\'JetBrains Mono\',monospace;font-size:13px;',
          'padding:12px 16px;outline:none;transition:border-color 0.2s;">',
        '<button id="sn-pw-btn"',
          ' style="background:#F0EEE9;color:#0A0A0A;border:none;',
          'font-family:\'JetBrains Mono\',monospace;font-size:11px;font-weight:500;',
          'letter-spacing:0.12em;text-transform:uppercase;',
          'padding:12px 20px;cursor:pointer;white-space:nowrap;">',
          'Enter',
        '</button>',
      '</div>',
      '<p id="sn-pw-err" style="font-family:\'JetBrains Mono\',monospace;',
        'font-size:11px;color:rgb(220,50,50);margin-top:10px;',
        'height:14px;letter-spacing:0.05em;"></p>'
    ].join('');

    document.body.appendChild(overlay);

    var input = document.getElementById('sn-pw-input');
    var btn = document.getElementById('sn-pw-btn');
    var err = document.getElementById('sn-pw-err');

    input.addEventListener('focus', function () { input.style.borderColor = '#F0EEE9'; });
    input.addEventListener('blur', function () { input.style.borderColor = '#222'; });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });
    btn.addEventListener('click', attempt);
    setTimeout(function () { input.focus(); }, 100);

    function attempt() {
      hashInput(input.value).then(function (hash) {
        if (hash === PASSWORD_HASH) {
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
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
