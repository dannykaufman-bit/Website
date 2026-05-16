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
     2. DESIGNER TAMAGOTCHI — LINEWORK SCENE
     ---------------------------------------------------------- */
  function initNodes() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    hero.insertBefore(canvas, hero.firstChild);
    var ctx = canvas.getContext('2d');

    var W = 0, H = 0;
    var S = 4;  // canvas pixels per sprite pixel

    var BREAKPOINT = 720;  // below this: stack scene under title

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Palette key (used in sprite strings) ──────────────────
    var PAL = {
      'W': '#F0EEE9',   // white
      'G': '#777777',   // mid gray
      'g': '#BBBBBB',   // light gray
      'D': '#111111',   // dark (glasses / cat detail)
      'B': '#2A4A6A',   // window sky blue
      'b': '#3D6A8A',   // lighter sky
      'Y': '#C8A850',   // rug warm yellow
      'y': '#DDC070',   // rug lighter
      'P': '#CC6688',   // curtain / pink sticky (slightly deeper)
      'p': '#EE99BB',   // curtain highlight (lighter pink)
      'O': '#DD8844',   // orange sticky
      'K': '#66AA77',   // green sticky
      'C': '#22BB44',   // sofa bright green
      'c': '#44DD66',   // sofa lighter green (cushion)
      'h': '#7A4A2A',   // whiteboard dark brown frame
      'j': '#A07848',   // whiteboard lighter brown trim
      'N': '#FFEE88',   // yellow sticky
      'F': '#DD5533',   // food
      'f': '#FFAA33',   // food light
      ' ': null,
    };

    // ── Pixel helper ──────────────────────────────────────────
    function P(gx, gy, col, gw, gh) {
      ctx.fillStyle = col;
      ctx.fillRect(Math.round(gx)*S, Math.round(gy)*S, (gw||1)*S, (gh||1)*S);
    }

    function spr(arr, ox, oy) {
      for (var r=0; r<arr.length; r++) {
        var row = arr[r];
        for (var c=0; c<row.length; c++) {
          var col = PAL[row[c]];
          if (col) P(ox+c, oy+r, col);
        }
      }
    }

    function sprFlip(arr, ox, oy) {
      for (var r=0; r<arr.length; r++) {
        var rev = arr[r].split('').reverse().join('');
        for (var c=0; c<rev.length; c++) {
          var col = PAL[rev[c]];
          if (col) P(ox+c, oy+r, col);
        }
      }
    }

    // ── Character sprites (6 wide, thick D glasses) ───────────
    var CH_STAND = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      ' WWWW ',
      ' WWWW ',
      ' W  W ',
      ' W  W ',
      'WW  WW',
    ];
    var CH_WALK_A = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      ' WWWW ',
      ' WWWW ',
      'WW  W ',
      ' W  WW',
      'W    W',
    ];
    var CH_WALK_B = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      ' WWWW ',
      ' WWWW ',
      ' W  WW',
      'WW  W ',
      'W    W',
    ];
    var CH_WRITE = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      'WWWWW ',
      ' WWWW ',
      ' W  W ',
      ' W  W ',
      'WW  WW',
    ];
    var CH_SIT = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      'WWWWWW',
      ' WWWW ',
      'WWWWWW',
      ' WWWWW',
    ];
    var CH_SIT_B = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      'WWWWWW',
      'WWWWWW',
      'WWWWWW',
      ' WWWWW',
    ];
    var CH_HAPPY = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      'W WWWW',
      'WWWWWW',
      ' W  W ',
      ' W  W ',
      'WW  WW',
    ];
    var CH_RELAX = [
      ' WWWW ',
      'WDDDDW',
      ' WWWW ',
      'WWWWWW',
      'WWWWWW',
      'WWWWWW',
      'WWWWWW',
      ' WWWWW',
    ];

    // ── Room sprites ──────────────────────────────────────────

    // Window 20×15 (frame + panes)
    var WIN = [
      'GGGGGGGGGGGGGGGGGGGG',
      'GBBBBBBBBGBBBBBBBBGG',
      'GBBbBBbBBGBBbBBbBBGG',
      'GBBBBBBBBGBBBBBBBBGG',
      'GBBbBBbBBGBBbBBbBBGG',
      'GBBBBBBBBGBBBBBBBBGG',
      'GBBbBBbBBGBBbBBbBBGG',
      'GGGGGGGGGGGGGGGGGGGG',
      'GBBBBBBBBGBBBBBBBBGG',
      'GBBbBBbBBGBBbBBbBBGG',
      'GBBBBBBBBGBBBBBBBBGG',
      'GBBbBBbBBGBBbBBbBBGG',
      'GBBBBBBBBGBBBBBBBBGG',
      'GGGGGGGGGGGGGGGGGGGG',
      'ggggggggggggggggggggg',  // sill
    ];

    // Curtains — tied-back style, 4 wide × 13 tall
    var CURTAIN_L = [
      'PPPP',   // hanging full at top
      'PPPP',
      'PPPp',   // slight gather (p reused as lighter — just lighter P)
      'PPP ',
      'PP  ',   // pulled in — tie point
      'PP  ',
      'PP  ',
      'PPP ',   // drapes back out below tie
      'PPPP',
      'PPP ',
      'PP  ',
      'PP  ',
      ' P  ',   // trailing hem
    ];
    var CURTAIN_R = [
      'PPPP',
      'PPPP',
      'pPPP',
      ' PPP',
      '  PP',
      '  PP',
      '  PP',
      ' PPP',
      'PPPP',
      ' PPP',
      '  PP',
      '  PP',
      '  P ',
    ];

    // Whiteboard 16×20
    var WB_FRAME = [
      'hhhhhhhhhhhhhhhh',
      'hjjjjjjjjjjjjjjh',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'h              h',
      'hhhhhhhhhhhhhhhh',
      'hjjjjjjjjjjjjjhh',  // marker tray
    ];

    // Sticky note 3×3
    var STKY = [['NNN','NNN','NNN'],['PPP','PPP','PPP'],['OOO','OOO','OOO'],['KKK','KKK','KKK']];

    // Monitor 14×10
    var MON = [
      'GGGGGGGGGGGGGG',
      'GggggggggggggG',
      'G            G',
      'G            G',
      'G            G',
      'G            G',
      'G            G',
      'GggggggggggggG',
      '     GGGGG    ',
      '   GgGGGGGgG  ',
    ];

    // Desk 22×4
    var DESK = [
      'GGGGGGGGGGGGGGGGGGgGGG',
      'GgGGGGGGGGGGGGGGGGGGGG',
      'G                     G',
      'GGGGGGGGGGGGGGGGGGGGGGG',
    ];

    // Chair 7×7
    var CHAIR = [
      'GGGGGGG',
      'GgggggG',
      'G     G',
      'GGGGGGG',
      ' G   G ',
      ' G   G ',
      'GG   GG',
    ];

    // Sofa 24×11
    var SOFA = [
      'CC                    CC',
      'CC CCCCCCCCCCCCCCCC CC  ',
      'CC C                C CC',
      'CC C                C CC',
      'CC CCCCCCCCCCCCCCCC CC  ',
      'CCCCCCCCCCCCCCCCCCCCCCCC',
      'CcccccccccccCcccccccccccC',
      'C           C           C',
      'CCCCCCCCCCCCCCCCCCCCCCCC',
      '   GG              GG   ',
      '   GG              GG   ',
    ];

    // Cat 9×7 — pointy ears, sleeping eyes, curled tail
    var CAT = [
      ' GW   WG ',   // pointy ears (W = bright inner ear)
      'GGGGGGGGG',   // head
      'GGDgggDGG',   // face: D=closed-eye slits, g=lighter muzzle
      'GGGGgGGGG',   // neck / upper body
      'GGGGGGGGG',   // body
      'GgGgGgGGG',   // belly stripes
      '  GGGGG  ',   // tail curl (shorter = tucked under)
    ];

    // Oriental rug 24×8
    var RUG = [
      'GGGGGGGGGGGGGGGGGGGGGGGG',
      'GYyYyYyYyYyYyYyYyYyYyYyG',
      'GFyFyFyFyFyFyFyFyFyFyFyG',
      'GFYFyFyFyFyFyFyFyFyFyYFG',
      'GFFyFyFYFyFyFyFYFyFyFyFG',
      'GFyFyFyFyFyFyFyFyFyFyFyG',
      'GYyYyYyYyYyYyYyYyYyYyYyG',
      'GGGGGGGGGGGGGGGGGGGGGGGG',
    ];

    // Cup 3×4
    var CUP = [
      'GGG',
      'GgG',
      'GgG',
      'GGG',
    ];

    // ── Scene layout ──────────────────────────────────────────
    var sc = {};

    function layout() {
      var isNarrow = W < BREAKPOINT;
      var sx = isNarrow
        ? Math.floor(W * 0.04 / S)          // full width on mobile
        : Math.floor(W * 0.50 / S);         // right half on desktop
      var fy = isNarrow
        ? 122                                // fixed — scene sits ~45px below title end
        : Math.floor(H * 0.70 / S);

      sc.floorY  = fy;
      sc.sx      = sx;

      // Tightened layout — everything closer together
      sc.wbX     = sx + 1;
      sc.wbY     = fy - 21;

      sc.sofaX   = sx + 26;
      sc.sofaY   = fy - 10;

      sc.catX    = sc.sofaX + 2;
      sc.catY    = sc.sofaY - 7;

      sc.rugX    = sc.sofaX - 1;
      sc.rugY    = fy + 3;
      sc.posJuggle = sc.deskX + 26;

      sc.deskX   = sx + 58;
      sc.deskY   = fy - 3;

      sc.chairX  = sc.deskX + 3;
      sc.chairY  = fy - 6;

      sc.monX    = sc.deskX + 3;
      sc.monY    = fy - 14;

      sc.cupX    = sc.deskX + 17;
      sc.cupY    = fy - 6;

      sc.winX    = sc.sofaX + 2;       // centered over sofa
      sc.winY    = fy - 36;            // always relative to floor — stays near scene

      // Character waypoints
      sc.posDesk  = sc.deskX + 2;
      sc.posBoard = sc.wbX + 17;
      sc.posSofa  = sc.sofaX + 9;
      sc.charY    = fy - 9;

      // Dynamic hero height + button placement
      var sceneBottomPx = (fy + 11) * S;   // bottom of rug

      if (isNarrow) {
        var heroH = sceneBottomPx + 96;
        hero.style.minHeight = heroH + 'px';
        if (typeof btnRow !== 'undefined' && btnRow) {
          btnRow.style.bottom    = 'auto';
          btnRow.style.top       = (sceneBottomPx + 20) + 'px';
          btnRow.style.right     = 'auto';
          btnRow.style.left      = '50%';
          btnRow.style.transform = 'translateX(-50%)';
        }
      } else {
        hero.style.minHeight = '';
        if (typeof btnRow !== 'undefined' && btnRow) {
          btnRow.style.bottom    = '36px';
          btnRow.style.top       = 'auto';
          btnRow.style.right     = '48px';
          btnRow.style.left      = 'auto';
          btnRow.style.transform = '';
        }
      }
    }

    layout();

    // ── Whiteboard diagram lines & stickies ───────────────────
    var stickies = [];
    var STICKY_SLOTS = [
      {x:1,y:2},{x:5,y:2},{x:9,y:2},{x:12,y:2},
      {x:1,y:6},{x:5,y:6},{x:9,y:6},{x:12,y:6},
      {x:1,y:10},{x:5,y:10},{x:9,y:10},
    ];

    // ── Game state ────────────────────────────────────────────
    var ideas        = 80;
    var happy        = 80;
    var fun          = 80;
    var productivity = 80;

    // ── Weather ───────────────────────────────────────────────
    var WEATHERS     = ['rain', 'sun', 'snow'];
    var weatherIdx   = 0;
    var weatherTimer = 0;
    var WEATHER_DUR  = 2200 + Math.floor(Math.random() * 800);
    var tick      = 0;
    var charX     = 0;
    var charInit  = false;
    var bounceY   = 0;
    var STATE     = 'typing';
    var prevState = 'typing';
    var stateTimer = 0;
    var facing    = -1;
    var screenPhase = 0;

    var parts = [];
    function addParts(type, x, y, n) {
      for (var i=0;i<n;i++) parts.push({type:type,x:x+(Math.random()-0.5)*20,y:y,vy:-(2+Math.random()*2),life:1});
    }
    var food = null;
    var ball = null;

    // ── State machine ─────────────────────────────────────────
    function updateState() {
      stateTimer++;
      if (!charInit) { charX = sc.posDesk; charInit = true; }

      switch (STATE) {
        case 'typing':
          facing = -1;
          if (stateTimer > 300) { STATE='riseDesk'; stateTimer=0; }
          break;
        case 'riseDesk':
          if (stateTimer > 25) { STATE='walkBoard'; stateTimer=0; }
          break;
        case 'walkBoard':
          facing = -1;
          charX += (sc.posBoard - charX) * 0.05;
          if (Math.abs(charX - sc.posBoard) < 2) { charX=sc.posBoard; STATE='writing'; stateTimer=0; }
          break;
        case 'writing':
          facing = 1;
          if (sc._ideateMode) {
            // Quick single-sticky ideate action
            if (stateTimer === 40) {
              if (sc._ideateAction === 'add' && stickies.length < STICKY_SLOTS.length) {
                stickies.push(stickies.length);
              } else if (sc._ideateAction === 'remove' && stickies.length > 0) {
                stickies.pop();
              }
              ideas = Math.min(100, ideas + 20);
              addParts('star', sc.wbX*S + 30, sc.wbY*S, 3);
            }
            if (stateTimer > 90) { sc._ideateMode = false; STATE='walkDesk'; stateTimer=0; }
          } else {
            if (stateTimer%55===30 && stickies.length<STICKY_SLOTS.length) stickies.push(stickies.length);
            if (stateTimer > 220) {
              STATE = Math.random()<0.45 ? 'walkSofa' : 'walkDesk';
              stateTimer=0;
            }
          }
          break;
        case 'walkSofa':
          facing = 1;
          charX += (sc.posSofa - charX) * 0.05;
          if (Math.abs(charX - sc.posSofa) < 2) {
            charX=sc.posSofa;
            if (sc._sleepNext)  { sc._sleepNext=false;  STATE='sleeping';    }
            else if (sc._petNext) { sc._petNext=false;  STATE='pettingCat';  }
            else                { STATE='relaxing'; }
            stateTimer=0;
          }
          break;
        case 'relaxing':
          facing = -1;
          if (stateTimer > 200) { STATE='walkDesk'; stateTimer=0; }
          break;
        case 'pettingCat':
          facing = -1;
          happy = Math.min(100, happy + 0.04);
          if (stateTimer > 180) { STATE='walkDesk'; stateTimer=0; }
          break;
        case 'walkJuggle':
          facing = 1;
          charX += (sc.posJuggle - charX) * 0.05;
          if (Math.abs(charX - sc.posJuggle) < 2) { charX=sc.posJuggle; STATE='juggling'; stateTimer=0; }
          break;
        case 'juggling':
          facing = -1;
          fun = Math.min(100, fun + 0.10);
          if (stateTimer > 220) { STATE='walkDesk'; stateTimer=0; }
          break;
        case 'working':
          facing = -1;
          productivity = Math.min(100, productivity + 0.05);
          if (stateTimer > 280) { STATE='typing'; stateTimer=0; }
          break;
        case 'walkWork':
          facing = 1;
          charX += (sc.posDesk - charX) * 0.05;
          if (Math.abs(charX - sc.posDesk) < 2) { charX=sc.posDesk; STATE='working'; stateTimer=0; }
          break;
        case 'walkDesk':
          facing = 1;
          charX += (sc.posDesk - charX) * 0.05;
          if (Math.abs(charX - sc.posDesk) < 2) { charX=sc.posDesk; STATE='sitDesk'; stateTimer=0; screenPhase=(screenPhase+1)%4; }
          break;
        case 'sitDesk':
          if (stateTimer > 20) { STATE='typing'; stateTimer=0; }
          break;
        case 'bounce':
          bounceY = Math.abs(Math.sin(stateTimer*0.18)) * 2;
          if (stateTimer>65) { STATE=prevState; stateTimer=0; bounceY=0; }
          break;
        case 'dance':
          bounceY = Math.abs(Math.sin(stateTimer*0.22)) * 1.5;
          facing  = stateTimer%24<12 ? 1 : -1;
          if (stateTimer>90) { STATE=prevState; stateTimer=0; bounceY=0; }
          break;
      }

      if (food) { food.y+=food.vy; if(food.y>sc.charY) food=null; }
      if (ball) {
        ball.x+=ball.vx; ball.y+=ball.vy; ball.vy+=0.15;
        if (ball.y>sc.floorY*S) { ball.vy*=-0.6; ball.y=sc.floorY*S; }
        ball.life-=0.012; if(ball.life<=0) ball=null;
      }
      for (var i=parts.length-1;i>=0;i--) { parts[i].y+=parts[i].vy; parts[i].life-=0.025; if(parts[i].life<=0) parts.splice(i,1); }

      ideas        = Math.max(0, ideas        - 0.004);
      happy        = Math.max(0, happy        - 0.003);
      fun          = Math.max(0, fun          - 0.004);
      productivity = Math.max(0, productivity - 0.002);

      weatherTimer++;
      if (weatherTimer > WEATHER_DUR) {
        weatherTimer = 0;
        WEATHER_DUR  = 2200 + Math.floor(Math.random() * 800);
        weatherIdx   = (weatherIdx + 1) % WEATHERS.length;
      }

      if (tick%6===0) updateUI();
    }

    // ── Interactions ──────────────────────────────────────────
    function ideateChar() {
      ideas = Math.min(100, ideas + 35);
      if (stickies.length === 0) sc._ideateAction = 'add';
      else if (stickies.length >= STICKY_SLOTS.length) sc._ideateAction = 'remove';
      else sc._ideateAction = Math.random() < 0.6 ? 'add' : 'remove';
      sc._ideateMode = true;
      STATE = 'walkBoard'; stateTimer = 0;
    }
    function petCat() {
      happy = Math.min(100, happy + 35);
      addParts('heart', sc.catX*S, sc.catY*S, 4);
      sc._petNext = true;
      STATE='walkSofa'; stateTimer=0;
    }
    function juggleChar() {
      fun = Math.min(100, fun + 30);
      addParts('star', charX*S, sc.charY*S-20, 4);
      STATE='walkJuggle'; stateTimer=0;
    }
    function workChar() {
      productivity = Math.min(100, productivity + 30);
      addParts('star', charX*S, sc.charY*S-20, 3);
      STATE='walkWork'; stateTimer=0;
    }

    // ── HTML UI — meters top-right, buttons bottom-right ─────
    var meterDiv = document.createElement('div');
    meterDiv.style.cssText = 'position:absolute;top:calc(var(--nav-height,52px) + 14px);right:48px;z-index:3;pointer-events:none;display:flex;flex-direction:column;gap:3px;align-items:flex-end;';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'position:absolute;bottom:36px;right:48px;z-index:3;pointer-events:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end;max-width:calc(100vw - 96px);';

    var btnDiv = document.createElement('div');
    btnDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;max-width:420px;align-items:center;';

    function mkBtn(icon, iconColor, label, fn) {
      var b = document.createElement('button');
      b.innerHTML = '<span style="color:' + iconColor + ';margin-right:5px;">' + icon + '</span>' + label;
      b.style.cssText = 'background:transparent;border:1px solid rgba(240,238,233,0.55);color:rgba(240,238,233,0.88);font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;padding:5px 13px;cursor:none;transition:border-color 0.15s,color 0.15s,background 0.15s;';
      b.addEventListener('mouseenter',function(){b.style.borderColor='rgba(240,238,233,1)';b.style.color='#F0EEE9';b.style.background='rgba(240,238,233,0.08)';});
      b.addEventListener('mouseleave',function(){b.style.borderColor='rgba(240,238,233,0.55)';b.style.color='rgba(240,238,233,0.88)';b.style.background='transparent';});
      b.addEventListener('click', fn);
      return b;
    }
    btnDiv.appendChild(mkBtn('★', '#FFE033', 'IDEATE',  ideateChar));
    btnDiv.appendChild(mkBtn('▣', '#44CC66', 'DESIGN',  workChar));
    btnDiv.appendChild(mkBtn('♥', '#FF3333', 'PET CAT', petCat));
    btnDiv.appendChild(mkBtn('●', '#4488FF', 'JUGGLE',  juggleChar));
    btnRow.appendChild(btnDiv);
    hero.appendChild(meterDiv);
    hero.appendChild(btnRow);

    function updateUI() {
      function bar(v,lbl) {
        var n=8,f=Math.round(v/100*n),s='';
        for(var i=0;i<n;i++) s+=i<f?'█':'░';
        return '<div style="font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:0.08em;color:#F0EEE9;">'+lbl+' '+s+'</div>';
      }
      meterDiv.innerHTML =
        bar(ideas,       'IDEAS  ') +
        bar(happy,       'HAPPY  ') +
        bar(fun,         'FUN    ') +
        bar(productivity,'DESIGN ');
    }

    // ── Screen content ────────────────────────────────────────
    function drawScreen() {
      var x = sc.monX+1, y = sc.monY+2;
      var W2 = 12, blink = tick%60<30;
      if (screenPhase===0) {
        if(blink) P(x,y,'#F0EEE9',1,1);
      } else if (screenPhase===1) {
        P(x,y,'#F0EEE9',W2-2,1); P(x,y+2,'#F0EEE9',W2-2,1);
        P(x,y,'#F0EEE9',1,3); P(x+W2-3,y,'#F0EEE9',1,3);
        if(blink) P(x+W2-1,y+1,'#F0EEE9',1,1);
      } else if (screenPhase===2) {
        P(x,y,'#F0EEE9',W2-2,1);
        P(x,y+2,'#F0EEE9',5,2); P(x+6,y+2,'#F0EEE9',5,2);
        if(blink) P(x+W2-1,y+4,'#F0EEE9',1,1);
      } else {
        P(x,y,'#F0EEE9',W2-2,1); P(x,y+2,'#F0EEE9',W2-2,1);
        P(x,y+3,'#F0EEE9',7,1); P(x,y+4,'#F0EEE9',4,1);
        P(x+5,y+4,'#F0EEE9',5,1);
        if(blink) P(x+W2-1,y+5,'#F0EEE9',1,1);
      }
    }

    // ── Rain in window ────────────────────────────────────────
    function drawWeather() {
      var wx = sc.winX, wy = sc.winY;
      var weather = WEATHERS[weatherIdx];

      // Pane regions
      var panes = [
        {x:wx+1, y:wy+1,  w:8, h:6},
        {x:wx+10,y:wy+1,  w:8, h:6},
        {x:wx+1, y:wy+8,  w:8, h:5},
        {x:wx+10,y:wy+8,  w:8, h:5},
      ];

      // Override sky colour based on weather
      var skyCol = weather==='sun'  ? '#3A6888' :
                   weather==='snow' ? '#4A5E6E' : '#2A4A6A';
      for (var p=0; p<panes.length; p++) {
        var pn = panes[p];
        ctx.fillStyle = skyCol;
        ctx.fillRect(pn.x*S, pn.y*S, pn.w*S, pn.h*S);
      }

      if (weather === 'rain') {
        // Diagonal rain streaks
        for (var p=0; p<panes.length; p++) {
          var pn = panes[p];
          for (var i=0; i<3; i++) {
            var rx = pn.x + ((i*31 + Math.floor(tick*0.35)) % pn.w);
            var ry = pn.y + ((i*23 + Math.floor(tick*0.55)) % pn.h);
            P(rx, ry, 'rgba(240,238,233,0.22)', 1, 2);
          }
        }

      } else if (weather === 'sun') {
        // Bright sky + pixel sun in upper-right pane
        // Sun disc (2×2) in upper area of top-right pane
        var sx = wx + 13, sy = wy + 2;
        // Rounded 3×3 disc
        P(sx,   sy,   '#FFDD44', 3, 1);   // top bar
        P(sx-1, sy+1, '#FFDD44', 5, 1);   // middle (widest row)
        P(sx,   sy+2, '#FFDD44', 3, 1);   // bottom bar — rounded
        // Rays
        P(sx+1, sy-1, '#FFDD44', 1, 1);   // up
        P(sx+1, sy+3, '#FFDD44', 1, 1);   // down
        // Warm light bloom in lower panes
        ctx.fillStyle = 'rgba(255,220,80,0.06)';
        ctx.fillRect((wx+1)*S, (wy+8)*S, 17*S, 5*S);

      } else if (weather === 'snow') {
        // Slowly drifting snowflake dots
        for (var p=0; p<panes.length; p++) {
          var pn = panes[p];
          for (var i=0; i<5; i++) {
            var drift = Math.sin(tick*0.04 + i*1.3) * 1.5;
            var fx = pn.x + ((i*19 + Math.floor(drift) + Math.floor(tick*0.18)) % pn.w);
            var fy = pn.y + ((i*13 +                      Math.floor(tick*0.25)) % pn.h);
            P(fx, fy, 'rgba(240,238,233,0.55)', 1, 1);
          }
        }
      }
    }

    // ── Whiteboard diagram content ────────────────────────────
    function drawWBContent() {
      var x=sc.wbX+1, y=sc.wbY+2;
      var n = Math.min(stickies.length, 11);
      // Sticky notes
      for (var i=0; i<n; i++) {
        var sl = STICKY_SLOTS[i];
        spr(STKY[i%4], x+sl.x, y+sl.y);
      }
      // Diagram lines that accumulate
      var lc = Math.min(Math.floor(n*0.6)+1, 5);
      if(lc>0) P(x+1,y+0,'#AAAAAA',10,1);
      if(lc>1) { P(x+1,y+13,'#AAAAAA',1,4); P(x+1,y+13,'#AAAAAA',6,1); P(x+1,y+16,'#AAAAAA',6,1); P(x+6,y+13,'#AAAAAA',1,4); }
      if(lc>2) { P(x+8,y+13,'#AAAAAA',1,4); P(x+8,y+13,'#AAAAAA',5,1); P(x+8,y+16,'#AAAAAA',5,1); P(x+12,y+13,'#AAAAAA',1,4); }
      if(lc>3) P(x+3,y+17,'#AAAAAA',1,2); P(x+10,y+17,'#AAAAAA',1,2);
      if(lc>4) P(x+1,y+17,'#AAAAAA',13,1);
    }

    // ── Character draw ────────────────────────────────────────
    function drawChar() {
      var cx = Math.round(charX);
      var cy = Math.round(sc.charY - bounceY);
      var wf = Math.floor(tick/10)%2;
      var pose;

      var isTyping   = STATE==='typing'||STATE==='sitDesk'||STATE==='working';
      var isRelaxing = STATE==='relaxing';
      var isWalking   = STATE==='walkBoard'||STATE==='walkDesk'||STATE==='walkSofa'||STATE==='walkJuggle'||STATE==='walkWork';
      var isWriting   = STATE==='writing';
      var isBounce    = STATE==='bounce';
      var isDance     = STATE==='dance';
      var isPetting   = STATE==='pettingCat';
      var isJuggling  = STATE==='juggling';

      if      (isTyping)   pose = tick%20<10 ? CH_SIT   : CH_SIT_B;
      else if (isRelaxing) pose = CH_RELAX;
      else if (isPetting)  pose = tick%16<8  ? CH_WRITE : CH_STAND;
      else if (isJuggling) pose = tick%8<4   ? CH_HAPPY : CH_WRITE;
      else if (isBounce)   pose = tick%14<7  ? CH_HAPPY : CH_STAND;
      else if (isDance)    pose = tick%12<6  ? CH_HAPPY : CH_WALK_A;
      else if (isWalking)  pose = wf ? CH_WALK_A : CH_WALK_B;
      else if (isWriting)  pose = tick%20<10 ? CH_WRITE : CH_STAND;
      else pose = CH_STAND;

      var yo = (isRelaxing || isPetting) ? 2 : 0;

      if (facing===1) spr(pose, cx, cy+yo);
      else sprFlip(pose, cx, cy+yo);

      // Juggling balls — 5 coloured balls in cascade arc
      if (isJuggling) {
        var ballCols = ['#FF4444','#FFAA33','#FFEE44','#44CC55','#4488FF'];
        for (var bi=0; bi<5; bi++) {
          var phase = (bi/5) * Math.PI * 2;
          var bx = (cx + 2) + Math.round(Math.sin(tick*0.15 + phase) * 5);
          var by = (cy - 4) - Math.round(Math.abs(Math.sin(tick*0.18 + phase)) * 9);
          P(bx, by, ballCols[bi], 2, 2);
        }
      }
    }

    // ── Main draw ─────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (W < 400) return;

      // Floor pixel line
      P(sc.sx, sc.floorY, '#2A2A2A', Math.floor(W/S) - sc.sx, 1);

      // Curtain rod (spans both curtains + window)
      P(sc.winX - 4, sc.winY - 3, '#BBBBBB', 28, 1);
      // Curtains (drawn before window so window frame sits on top)
      spr(CURTAIN_L, sc.winX - 4, sc.winY - 2);
      spr(CURTAIN_R, sc.winX + 20, sc.winY - 2);

      // Window + rain
      spr(WIN, sc.winX, sc.winY);
      drawWeather();

      // Rug
      spr(RUG, sc.rugX, sc.rugY);

      // Sofa + cat
      spr(SOFA, sc.sofaX, sc.sofaY);
      spr(CAT,  sc.catX,  sc.catY);

      // Whiteboard
      spr(WB_FRAME, sc.wbX, sc.wbY);
      drawWBContent();

      // Legs for whiteboard
      P(sc.wbX+3, sc.wbY+21, '#7A4A2A', 2, 2);
      P(sc.wbX+11,sc.wbY+21, '#7A4A2A', 2, 2);

      // Desk + chair + monitor + cup
      spr(DESK,  sc.deskX,  sc.deskY);
      spr(CHAIR, sc.chairX, sc.chairY);
      spr(MON,   sc.monX,   sc.monY);
      drawScreen();
      spr(CUP,   sc.cupX,   sc.cupY);

      // Character
      drawChar();

      // Food
      if (food) {
        ctx.font = '14px sans-serif';
        ctx.fillText('🍕', food.x-6, food.y);
      }

      // Ball
      if (ball) {
        ctx.fillStyle = '#F0EEE9';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 5, 0, Math.PI*2);
        ctx.fill();
      }

      // Particles
      for (var i=0; i<parts.length; i++) {
        ctx.globalAlpha = Math.max(0, parts[i].life);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = parts[i].type === 'heart' ? '#FF2222' : '#FFE566';
        ctx.fillText(parts[i].type==='heart'?'♥':'✦', parts[i].x, parts[i].y);
      }
      ctx.globalAlpha = 1;

      // Cat Zzz
      if (tick%180 < 120) {
        var zOff = (tick%60) * 0.2;
        ctx.font = 'bold 8px JetBrains Mono';
        ctx.fillStyle = 'rgba(240,238,233,0.4)';
        ctx.fillText('z', (sc.catX+9)*S, (sc.catY)*S - zOff);
        ctx.fillText('Z', (sc.catX+10)*S + 4, (sc.catY-1)*S - zOff*1.5);
      }
    }

    function loop() {
      requestAnimationFrame(loop);
      tick++;
      layout();
      // Sync canvas if hero height changed (e.g. layout() just set minHeight)
      var liveW = hero.offsetWidth, liveH = hero.offsetHeight;
      if (liveW !== W || liveH !== H) {
        W = canvas.width  = liveW;
        H = canvas.height = liveH;
      }
      updateState();
      draw();
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
