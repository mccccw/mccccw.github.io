import { createApp, nextTick } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadSkinResilient(viewer, username) {
  const embedded = window.MCCW_STAFF_SKINS?.[username];
  if (embedded) {
    try {
      await viewer.loadSkin(embedded);
      return true;
    } catch (error) {
      console.warn(`Embedded skin failed for ${username}`, error);
    }
  }

  const sources = [
    `https://mc-heads.net/skin/${username}`,
    `https://minotar.net/skin/${username}`,
    `https://mineskin.eu/skin/${username}`,
  ];

  for (const source of sources) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        await viewer.loadSkin(source);
        return true;
      } catch (error) {
        if (attempt === 1) {
          console.warn(`Skin source failed for ${username}: ${source}`, error);
        }
        await delay(160);
      }
    }
  }

  try {
    await viewer.loadSkin(window.MCCW_STAFF_FALLBACK_SKIN || 'assets/steve_skin.png');
  } catch (error) {
    console.error(`Fallback skin failed for ${username}`, error);
  }
  return false;
}

function getCanvasSize(canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    width: Math.max(220, Math.floor(rect.width || canvas.clientWidth || canvas.width || 220)),
    height: Math.max(250, Math.floor(rect.height || canvas.clientHeight || canvas.height || 250)),
  };
}

function attachMouseRotation(canvas, viewer) {
  let dragging = false;
  let lastX = 0;
  let spinVelocity = 0;
  let rafId = null;

  function stopInertia() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startInertia() {
    stopInertia();
    const tick = () => {
      if (dragging || Math.abs(spinVelocity) < 0.00045) {
        spinVelocity = 0;
        rafId = null;
        return;
      }
      viewer.playerObject.rotation.y += spinVelocity;
      spinVelocity *= 0.92;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    spinVelocity = 0;
    stopInertia();
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - lastX;
    lastX = event.clientX;
    spinVelocity = deltaX * 0.012;
    viewer.playerObject.rotation.y += spinVelocity;
  });

  canvas.addEventListener('pointerup', (event) => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    startInertia();
  });

  canvas.addEventListener('pointercancel', (event) => {
    dragging = false;
    spinVelocity = 0;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    stopInertia();
  });
}

createApp({
  data() {
    return {
      activeView: 'home',
      staffBooted: false,
      navItems: [
        { label: 'Home', view: 'home' },
        { label: 'Join', view: 'join' },
        { label: 'Info', view: 'info' },
        { label: 'Staff', view: 'staff' },
      ],
      stats: [
        { value: 'Earth', label: 'SMP Map' },
        { value: 'Seasons', label: 'Fresh Progression' },
        { value: 'Create', label: 'Automation Focus' },
        { value: 'Airships', label: 'Aeronautics' },
      ],
      joinLinks: [
        {
          kicker: 'Modpack',
          label: 'MCCW on Modrinth',
          href: 'https://modrinth.com/modpack/mccw',
        },
        {
          kicker: 'Community',
          label: 'Join the Discord',
          href: 'https://discord.gg/mZgVfvnQ4h',
        },
        {
          kicker: 'Videos',
          label: 'YouTube Channel',
          href: 'https://www.youtube.com/channel/UCbZF-E01LV9OQPvK0t6qqIw',
        },
      ],
      features: [
        {
          kicker: 'Earth SMP',
          title: 'Seasonal World',
          text: 'Each season gives players a fresh Earth map to explore, settle and shape together.',
        },
        {
          kicker: 'Create',
          title: 'Machines & Factories',
          text: 'Build production lines, automatic farms, storage systems and rail networks.',
        },
        {
          kicker: 'Aeronautics',
          title: 'Airships & Space',
          text: 'Conquer the skies with custom airships and reach for the stars with Create Cosmonautics.',
        },
        {
          kicker: 'Community',
          title: 'Shared Projects',
          text: 'Create towns, routes, hubs and large builds with other players across the map.',
        },
      ],
      rules: [
        {
          title: 'Respect',
          text: 'No harassment, hate speech, spam or toxic behavior.',
        },
        {
          title: 'Fair Play',
          text: 'No griefing, cheating, X-ray, bug abuse, scamming or stealing.',
        },
        {
          title: 'Staff',
          text: 'Listen to the team and report issues instead of escalating conflicts.',
        },
      ],
      staff: [
        { name: 'MEOWTROID24', role: 'Owner', skin: 'meowtroid24' },
        { name: 'REDSTONEMUMBO', role: 'Co-Owner', skin: 'Redstonemumbo' },
        { name: 'ONTEY', role: 'Dev', skin: 'derontey' },
        { name: 'ANTONSTIKO', role: 'Dev', skin: 'antonstiko' },
        { name: 'DERVAREX', role: 'Mod', skin: 'dervarex' },
        { name: 'OFFIZERWINKLER', role: 'Mod', skin: 'turbomensch' },
        { name: 'JIMBO', role: 'Mod', skin: 'Yellow_Jimbo' },
        { name: 'IBROKP', role: 'Mod', skin: 'IbrokP' },
        { name: 'LIAM', role: 'Builder', skin: 'liamsadi11' },
      ],
    };
  },
  mounted() {
    const initialView = window.location.hash.replace('#', '');
    if (this.navItems.some((item) => item.view === initialView)) {
      this.activeView = initialView;
    }

    window.addEventListener('hashchange', () => {
      const nextView = window.location.hash.replace('#', '') || 'home';
      if (this.navItems.some((item) => item.view === nextView)) {
        this.activeView = nextView;
        if (nextView === 'staff') this.queueStaffBoot();
      }
    });

    if (this.activeView === 'staff') {
      this.queueStaffBoot();
    }
  },
  methods: {
    setView(view) {
      this.activeView = view;
      const nextUrl = view === 'home' ? window.location.pathname : `#${view}`;
      history.pushState(null, '', nextUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (view === 'staff') {
        this.queueStaffBoot();
      }
    },
    queueStaffBoot() {
      nextTick(() => this.initSkinViewers());
    },
    async initSkinViewers() {
      if (this.staffBooted || !window.skinview3d?.SkinViewer) {
        return;
      }

      const canvases = Array.from(this.$el.querySelectorAll('.viewer'));
      if (!canvases.length) return;

      this.staffBooted = true;

      for (const canvas of canvases) {
        const username = canvas.dataset.skin;
        const size = getCanvasSize(canvas);
        canvas.width = size.width;
        canvas.height = size.height;

        const viewer = new window.skinview3d.SkinViewer({
          canvas,
          width: size.width,
          height: size.height,
        });

        await loadSkinResilient(viewer, username);

        viewer.pixelRatio = 1;
        viewer.zoom = 0.88;
        viewer.fov = 50;
        viewer.autoRotate = false;
        viewer.playerObject.rotation.y = 0.3;
        viewer.animation = new window.skinview3d.WalkingAnimation();
        attachMouseRotation(canvas, viewer);

        const resizeObserver = new ResizeObserver(() => {
          const nextSize = getCanvasSize(canvas);
          viewer.width = nextSize.width;
          viewer.height = nextSize.height;
        });
        resizeObserver.observe(canvas);

        await delay(120);
      }
    },
  },
}).mount('#app');
