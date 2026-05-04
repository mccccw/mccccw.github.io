// MCCW – app-php.js
// Replaces the Vue app. Works with the PHP-rendered HTML.
// Views are shown/hidden via CSS; PHP sets the initial state server-side.

(function () {
  'use strict';

  const ALLOWED = PHP_ALLOWED_VIEWS || ['home', 'join', 'info', 'staff', 'imprint'];

  // ─── View switching ──────────────────────────────────────────────────────────

  let staffBooted = false;

  function setViewPhp(view) {
    if (!ALLOWED.includes(view)) view = 'home';

    // Hide all views
    ALLOWED.forEach(function (v) {
      const el = document.getElementById('view-' + v);
      if (el) el.style.display = 'none';
    });

    // Show target
    const target = document.getElementById('view-' + view);
    if (target) target.style.display = '';

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Update URL hash (no page reload)
    const nextUrl = view === 'home' ? window.location.pathname : '#' + view;
    history.pushState(null, '', nextUrl);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'staff') queueStaffBoot();
  }

  // Expose globally so onclick attributes work
  window.setViewPhp = setViewPhp;

  // ─── Hash routing ────────────────────────────────────────────────────────────

  window.addEventListener('hashchange', function () {
    const hash = window.location.hash.replace('#', '') || 'home';
    setViewPhp(hash);
  });

  // ─── Skin viewers ────────────────────────────────────────────────────────────

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  async function loadSkinResilient(viewer, username) {
    const embedded = window.MCCW_STAFF_SKINS?.[username];
    if (embedded) {
      try { await viewer.loadSkin(embedded); return true; } catch (_) {}
    }

    const sources = [
      'https://mc-heads.net/skin/' + username,
      'https://minotar.net/skin/' + username,
      'https://mineskin.eu/skin/' + username,
    ];

    for (const source of sources) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try { await viewer.loadSkin(source); return true; } catch (_) {
          await delay(160);
        }
      }
    }

    try { await viewer.loadSkin(window.MCCW_STAFF_FALLBACK_SKIN || 'assets/steve_skin.png'); } catch (_) {}
    return false;
  }

  function getCanvasSize(canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      width:  Math.max(220, Math.floor(rect.width  || canvas.clientWidth  || canvas.width  || 220)),
      height: Math.max(250, Math.floor(rect.height || canvas.clientHeight || canvas.height || 250)),
    };
  }

  function attachMouseRotation(canvas, viewer) {
    let dragging = false, lastX = 0, spinVelocity = 0, rafId = null;

    function stopInertia() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }
    function startInertia() {
      stopInertia();
      const tick = () => {
        if (dragging || Math.abs(spinVelocity) < 0.00045) { spinVelocity = 0; rafId = null; return; }
        viewer.playerObject.rotation.y += spinVelocity;
        spinVelocity *= 0.92;
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; spinVelocity = 0; stopInertia(); canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; spinVelocity = dx * 0.012; viewer.playerObject.rotation.y += spinVelocity; });
    canvas.addEventListener('pointerup', (e) => { dragging = false; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); startInertia(); });
    canvas.addEventListener('pointercancel', (e) => { dragging = false; spinVelocity = 0; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); stopInertia(); });
  }

  async function initSkinViewers() {
    if (staffBooted || !window.skinview3d?.SkinViewer) return;
    const canvases = Array.from(document.querySelectorAll('#view-staff .viewer'));
    if (!canvases.length) return;
    staffBooted = true;

    for (const canvas of canvases) {
      const username = canvas.dataset.skin;
      const size = getCanvasSize(canvas);
      canvas.width = size.width;
      canvas.height = size.height;

      const viewer = new window.skinview3d.SkinViewer({ canvas, width: size.width, height: size.height });
      await loadSkinResilient(viewer, username);

      viewer.pixelRatio = 1;
      viewer.zoom = 0.88;
      viewer.fov = 50;
      viewer.autoRotate = false;
      viewer.playerObject.rotation.y = 0.3;
      viewer.animation = new window.skinview3d.WalkingAnimation();
      attachMouseRotation(canvas, viewer);

      new ResizeObserver(() => {
        const s = getCanvasSize(canvas);
        viewer.width = s.width;
        viewer.height = s.height;
      }).observe(canvas);

      await delay(120);
    }
  }

  function queueStaffBoot() {
    requestAnimationFrame(() => setTimeout(initSkinViewers, 0));
  }

  // ─── Init ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    // PHP already rendered the correct initial view.
    // If JS is enabled and there's a hash, let hash routing take over.
    const hash = window.location.hash.replace('#', '');
    if (hash && ALLOWED.includes(hash) && hash !== PHP_INITIAL_VIEW) {
      setViewPhp(hash);
    }

    if (PHP_INITIAL_VIEW === 'staff') queueStaffBoot();
  });
})();
