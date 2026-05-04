// MCCW – app-php.js
// Plain-JS view switcher. Works with PHP-rendered HTML.

// Safely read PHP-injected globals (index.php sets these before this script)
var ALLOWED_VIEWS = (typeof PHP_ALLOWED_VIEWS !== 'undefined')
  ? PHP_ALLOWED_VIEWS
  : ['home', 'join', 'info', 'staff', 'imprint'];

var INITIAL_VIEW = (typeof PHP_INITIAL_VIEW !== 'undefined')
  ? PHP_INITIAL_VIEW
  : 'home';

var staffBooted = false;

// Defined at top level so onclick="setViewPhp(...)" always works.
function setViewPhp(view) {
  if (ALLOWED_VIEWS.indexOf(view) === -1) view = 'home';

  ALLOWED_VIEWS.forEach(function (v) {
    var el = document.getElementById('view-' + v);
    if (el) el.style.display = 'none';
  });

  var target = document.getElementById('view-' + view);
  if (target) target.style.display = '';

  document.querySelectorAll('.nav-link').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  var nextUrl = view === 'home' ? window.location.pathname : '#' + view;
  history.pushState(null, '', nextUrl);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (view === 'staff') queueStaffBoot();
}

window.addEventListener('hashchange', function () {
  var hash = window.location.hash.replace('#', '') || 'home';
  setViewPhp(hash);
});

// ─── Skin viewers ──────────────────────────────────────────────────────────────

function delay(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

async function loadSkinResilient(viewer, username) {
  var embedded = window.MCCW_STAFF_SKINS && window.MCCW_STAFF_SKINS[username];
  if (embedded) {
    try { await viewer.loadSkin(embedded); return true; } catch (_) {}
  }
  var sources = [
    'https://mc-heads.net/skin/' + username,
    'https://minotar.net/skin/' + username,
    'https://mineskin.eu/skin/' + username,
  ];
  for (var i = 0; i < sources.length; i++) {
    for (var attempt = 0; attempt < 2; attempt++) {
      try { await viewer.loadSkin(sources[i]); return true; } catch (_) { await delay(160); }
    }
  }
  try { await viewer.loadSkin((window.MCCW_STAFF_FALLBACK_SKIN) || 'assets/steve_skin.png'); } catch (_) {}
  return false;
}

function getCanvasSize(canvas) {
  var rect = canvas.getBoundingClientRect();
  return {
    width:  Math.max(220, Math.floor(rect.width  || canvas.clientWidth  || canvas.width  || 220)),
    height: Math.max(250, Math.floor(rect.height || canvas.clientHeight || canvas.height || 250)),
  };
}

function attachMouseRotation(canvas, viewer) {
  var dragging = false, lastX = 0, spinVelocity = 0, rafId = null;
  function stopInertia() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }
  function startInertia() {
    stopInertia();
    function tick() {
      if (dragging || Math.abs(spinVelocity) < 0.00045) { spinVelocity = 0; rafId = null; return; }
      viewer.playerObject.rotation.y += spinVelocity;
      spinVelocity *= 0.92;
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }
  canvas.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; spinVelocity = 0; stopInertia(); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', function (e) { if (!dragging) return; var dx = e.clientX - lastX; lastX = e.clientX; spinVelocity = dx * 0.012; viewer.playerObject.rotation.y += spinVelocity; });
  canvas.addEventListener('pointerup', function (e) { dragging = false; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); startInertia(); });
  canvas.addEventListener('pointercancel', function (e) { dragging = false; spinVelocity = 0; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); stopInertia(); });
}

async function initSkinViewers() {
  if (staffBooted || !window.skinview3d || !window.skinview3d.SkinViewer) return;
  var canvases = Array.from(document.querySelectorAll('#view-staff .viewer'));
  if (!canvases.length) return;
  staffBooted = true;
  for (var c = 0; c < canvases.length; c++) {
    var canvas = canvases[c];
    var username = canvas.dataset.skin;
    var size = getCanvasSize(canvas);
    canvas.width = size.width;
    canvas.height = size.height;
    var viewer = new window.skinview3d.SkinViewer({ canvas: canvas, width: size.width, height: size.height });
    await loadSkinResilient(viewer, username);
    viewer.pixelRatio = 1;
    viewer.zoom = 0.88;
    viewer.fov = 50;
    viewer.autoRotate = false;
    viewer.playerObject.rotation.y = 0.3;
    viewer.animation = new window.skinview3d.WalkingAnimation();
    attachMouseRotation(canvas, viewer);
    (function (cv, vw) {
      new ResizeObserver(function () {
        var s = getCanvasSize(cv); vw.width = s.width; vw.height = s.height;
      }).observe(cv);
    })(canvas, viewer);
    await delay(120);
  }
}

function queueStaffBoot() {
  requestAnimationFrame(function () { setTimeout(initSkinViewers, 0); });
}

// ─── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  var hash = window.location.hash.replace('#', '');
  var startView = (hash && ALLOWED_VIEWS.indexOf(hash) !== -1) ? hash : INITIAL_VIEW;
  setViewPhp(startView);
});
