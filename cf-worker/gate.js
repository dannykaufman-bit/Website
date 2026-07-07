// Cloudflare Worker — single shared password gate in front of the Netlify origin.
//
// Required environment variables (set in the Cloudflare dashboard, NOT in code):
//   ORIGIN          The full Netlify URL, e.g. https://peppy-syrniki-xxxxxx.netlify.app
//   PASSWORD_HASH   SHA-256 hex of your password (no salt)
//   COOKIE_SECRET   Random ~64-char string used to sign session cookies
//   ORIGIN_SECRET   Random ~64-char string the Netlify edge function will validate
//
// Bind the Worker to your domain via: Workers Routes → dannyk.work/*

const SESSION_COOKIE = 'dk_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/__auth' && request.method === 'POST') {
      return handleAuth(request, env);
    }

    const cookie = readCookie(request, SESSION_COOKIE);
    if (cookie && await validSession(cookie, env.COOKIE_SECRET)) {
      return proxyToOrigin(request, env);
    }

    return passwordResponse(false);
  }
};

// ── Auth handling ─────────────────────────────────────────────
async function handleAuth(request, env) {
  const form = await request.formData();
  const submitted = (form.get('password') || '').toString();
  const hashed = await sha256(submitted);

  if (!timingSafeEqual(hashed, env.PASSWORD_HASH)) {
    await new Promise(r => setTimeout(r, 500));
    return passwordResponse(true, 401);
  }

  const expiry = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = expiry.toString();
  const sig = await hmacHex(payload, env.COOKIE_SECRET);
  const value = `${payload}.${sig}`;

  return new Response('', {
    status: 303,
    headers: {
      'Location': '/',
      'Set-Cookie': `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`,
      'Cache-Control': 'no-store'
    }
  });
}

async function validSession(value, secret) {
  const parts = value.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = await hmacHex(payload, secret);
  if (!timingSafeEqual(sig, expected)) return false;
  const expiry = parseInt(payload, 10);
  return Number.isFinite(expiry) && expiry > Date.now();
}

// ── Origin proxy ──────────────────────────────────────────────
async function proxyToOrigin(request, env) {
  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, env.ORIGIN);
  const proxied = new Request(target.toString(), request);
  proxied.headers.set('Host', target.host);
  if (env.ORIGIN_SECRET) {
    proxied.headers.set('X-Origin-Secret', env.ORIGIN_SECRET);
  }

  const response = await fetch(proxied);

  // Don't let CDNs cache authenticated content
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// ── Helpers ───────────────────────────────────────────────────
function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacHex(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── Password page ─────────────────────────────────────────────
function passwordResponse(showError, status = 200) {
  return new Response(passwordHTML(showError), {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function passwordHTML(showError) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Danny Kaufman</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  *,*:before,*:after { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; background: #0A0A0A; color: #F0EEE9; font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
  .logo { font-size: 13px; font-weight: 500; letter-spacing: 0.1em; margin: 0 0 32px; }
  canvas { image-rendering: pixelated; image-rendering: crisp-edges; margin-bottom: 40px; }
  .label { font-size: 11px; color: #888; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 24px; }
  form { display: flex; width: 100%; max-width: 320px; }
  input { flex: 1; background: transparent; border: 1px solid ${showError ? 'rgb(220,50,50)' : '#222'}; border-right: none; color: #F0EEE9; font-family: inherit; font-size: 13px; padding: 12px 16px; outline: none; transition: border-color 0.2s; }
  input:focus { border-color: #F0EEE9; }
  button { background: #F0EEE9; color: #0A0A0A; border: none; font-family: inherit; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 12px 20px; cursor: pointer; white-space: nowrap; }
  .err { font-size: 11px; color: rgb(220,50,50); margin-top: 10px; height: 14px; letter-spacing: 0.05em; }
</style>
</head>
<body>
  <p class="logo">DK</p>
  <canvas id="dk-scene" width="192" height="144"></canvas>
  <p class="label">Enter password</p>
  <form method="POST" action="/__auth" autocomplete="off">
    <input type="password" name="password" placeholder="••••••••••" autofocus autocomplete="current-password" />
    <button type="submit">Enter</button>
  </form>
  <p class="err">${showError ? 'Incorrect password' : ''}</p>
  <script>
  (function () {
    var ctx = document.getElementById('dk-scene').getContext('2d');
    var S = 6;
    var PAL = {
      'W': '#F0EEE9', 'D': '#111111', 'h': '#7A4A2A', 'j': '#A07848',
      'N': '#FFEE88', 'P': '#CC6688', 'O': '#DD8844', 'K': '#66AA77',
      ' ': null
    };
    var WB = [
      'hhhhhhhhhhhhhhhh','hjjjjjjjjjjjjjjh',
      'h              h','h              h','h              h',
      'h              h','h              h','h              h',
      'h              h','h              h','h              h',
      'h              h','h              h','h              h',
      'h              h','h              h','h              h',
      'h              h','hhhhhhhhhhhhhhhh','hjjjjjjjjjjjjjhh'
    ];
    var STKY = [['NNN','NNN','NNN'],['PPP','PPP','PPP'],['OOO','OOO','OOO'],['KKK','KKK','KKK']];
    var CH_STAND = [' WWWW ','WDDDDW',' WWWW ','WWWWWW',' WWWW ',' WWWW ',' W  W ',' W  W ','WW  WW'];
    var CH_WRITE = [' WWWW ','WDDDDW',' WWWW ','WWWWWW',' WWWWW',' WWWW ',' W  W ',' W  W ','WW  WW'];
    function P(x, y, c, w, h) { ctx.fillStyle = c; ctx.fillRect(x*S, y*S, (w||1)*S, (h||1)*S); }
    function spr(arr, ox, oy) {
      for (var r=0; r<arr.length; r++) for (var c=0; c<arr[r].length; c++) {
        var col = PAL[arr[r][c]]; if (col) P(ox+c, oy+r, col);
      }
    }
    function sprFlip(arr, ox, oy) {
      for (var r=0; r<arr.length; r++) {
        var row = arr[r].split('').reverse().join('');
        for (var c=0; c<row.length; c++) { var col = PAL[row[c]]; if (col) P(ox+c, oy+r, col); }
      }
    }
    var tick = 0;
    function frame() {
      ctx.clearRect(0, 0, 192, 144);
      spr(WB, 1, 0);
      P(4, 21, '#7A4A2A', 2, 2);
      P(12, 21, '#7A4A2A', 2, 2);
      spr(STKY[0], 3, 4);
      spr(STKY[1], 8, 4);
      spr(STKY[2], 13, 4);
      spr(STKY[3], 3, 9);
      spr(STKY[0], 13, 9);
      spr(STKY[2], 8, 14);
      var bounce = Math.floor(tick/24) % 2;
      var pose = (tick % 60 < 30) ? CH_WRITE : CH_STAND;
      sprFlip(pose, 22, 14 - bounce);
      tick++;
      requestAnimationFrame(frame);
    }
    frame();
  })();
  </script>
</body>
</html>`;
}
