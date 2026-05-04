<?php
// MCCW – Earth SMP Create Server
// PHP entry point – handles routing and renders the page.

$allowed_views = ['home', 'join', 'info', 'staff', 'imprint'];
$view = isset($_GET['view']) && in_array($_GET['view'], $allowed_views, true)
    ? $_GET['view']
    : 'home';

// Staff data
$staff = [
    ['name' => 'MEOWTROID24',    'role' => 'Owner',    'skin' => 'meowtroid24'],
    ['name' => 'REDSTONEMUMBO',  'role' => 'Co-Owner', 'skin' => 'Redstonemumbo'],
    ['name' => 'ONTEY',          'role' => 'Dev',      'skin' => 'derontey'],
    ['name' => 'ANTONSTIKO',     'role' => 'Dev',      'skin' => 'antonstiko'],
    ['name' => 'KIRIGAYA28',     'role' => 'Dev',      'skin' => 'Kirigaya28'],
    ['name' => 'DERVAREX',       'role' => 'Mod',      'skin' => 'dervarex'],
    ['name' => 'OFFIZERWINKLER', 'role' => 'Mod',      'skin' => 'turbomensch'],
    ['name' => 'JIMBO',          'role' => 'Mod',      'skin' => 'Yellow_Jimbo'],
    ['name' => 'IBROKP',         'role' => 'Mod',      'skin' => 'IbrokP'],
    ['name' => 'LIAM',           'role' => 'Builder',  'skin' => 'liamsadi11'],
];

$stats = [
    ['value' => 'Earth',    'label' => 'SMP Map'],
    ['value' => 'Seasons',  'label' => 'Fresh Progression'],
    ['value' => 'Create',   'label' => 'Automation Focus'],
    ['value' => 'Airships', 'label' => 'Aeronautics'],
];

$join_links = [
    ['kicker' => 'Modpack',   'label' => 'MCCW on Modrinth',  'href' => 'https://modrinth.com/modpack/mccw'],
    ['kicker' => 'Community', 'label' => 'Join the Discord',   'href' => 'https://discord.gg/mZgVfvnQ4h'],
    ['kicker' => 'Videos',    'label' => 'YouTube Channel',    'href' => 'https://www.youtube.com/channel/UCbZF-E01LV9OQPvK0t6qqIw'],
];

$features = [
    ['kicker' => 'Earth SMP',   'title' => 'Seasonal World',      'text' => 'Each season gives players a fresh Earth map to explore, settle and shape together.'],
    ['kicker' => 'Create',      'title' => 'Machines & Factories', 'text' => 'Build production lines, automatic farms, storage systems and rail networks.'],
    ['kicker' => 'Aeronautics', 'title' => 'Airships & Space',     'text' => 'Conquer the skies with custom airships and reach for the stars with Create Cosmonautics.'],
    ['kicker' => 'Community',   'title' => 'Shared Projects',      'text' => 'Create towns, routes, hubs and large builds with other players across the map.'],
];

$rules = [
    ['title' => 'Respect',    'text' => 'No harassment, hate speech, spam or toxic behavior.'],
    ['title' => 'Fair Play',  'text' => 'No griefing, cheating, X-ray, bug abuse, scamming or stealing.'],
    ['title' => 'Staff',      'text' => 'Listen to the team and report issues instead of escalating conflicts.'],
];

$nav_items = [
    ['view' => 'home',    'label' => 'Home'],
    ['view' => 'join',    'label' => 'Join'],
    ['view' => 'info',    'label' => 'Info'],
    ['view' => 'staff',   'label' => 'Staff'],
    ['view' => 'imprint', 'label' => 'Imprint'],
];

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MCCW | Earth SMP Create Server</title>
  <meta name="description" content="MCCW is a seasonal Earth SMP with Create, automation, builds, nations and community projects." />
  <meta name="keywords" content="MCCW, Minecraft Server, Earth SMP, Create Mod, modded Minecraft, SMP server, seasonal Minecraft server" />
  <meta name="author" content="meowtroid24" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#111111" />
  <link rel="canonical" href="https://mccccw.github.io/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="MCCW" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="MCCW | Earth SMP Create Server" />
  <meta property="og:description" content="A seasonal Earth SMP with Create automation, nations, builds and community projects." />
  <meta property="og:image" content="https://mccccw.github.io/assets/minecraft_title_2.png" />
  <meta property="og:image:width" content="2006" />
  <meta property="og:image:height" content="560" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="MCCW | Earth SMP Create Server" />
  <meta name="twitter:description" content="MCCW is a seasonal Earth SMP for Create, automation and community builds." />
  <meta name="twitter:image" content="https://mccccw.github.io/assets/minecraft_title_2.png" />

  <link rel="icon" type="image/x-icon" href="favicon_io/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="favicon_io/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="favicon_io/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="favicon_io/apple-touch-icon.png" />
  <link rel="manifest" href="favicon_io/site.webmanifest" />
  <link rel="stylesheet" media="screen" href="https://fontlibrary.org/face/minecraftia" type="text/css" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="canvas-container" aria-hidden="true"></div>
  <div id="panorama-fallback" class="panorama-fallback" aria-hidden="true">
    <div class="fallback-strip">
      <div class="fallback-tile p0"></div>
      <div class="fallback-tile p1"></div>
      <div class="fallback-tile p2"></div>
      <div class="fallback-tile p3"></div>
      <div class="fallback-tile p0"></div>
      <div class="fallback-tile p1"></div>
      <div class="fallback-tile p2"></div>
      <div class="fallback-tile p3"></div>
    </div>
  </div>
  <div class="panorama-preload" aria-hidden="true">
    <img id="pano-0" src="assets/panorama_0.png" alt="" />
    <img id="pano-1" src="assets/panorama_1.png" alt="" />
    <img id="pano-2" src="assets/panorama_2.png" alt="" />
    <img id="pano-3" src="assets/panorama_3.png" alt="" />
    <img id="pano-4" src="assets/panorama_4.png" alt="" />
    <img id="pano-5" src="assets/panorama_5.png" alt="" />
  </div>
  <div class="panorama-overlay" aria-hidden="true"></div>

  <div id="app" v-cloak>
    <div class="app-shell">
      <nav class="topbar" aria-label="Main navigation">
        <button class="brand-button" type="button" @click="setView('home')" aria-label="Go to home">
          <img src="favicon_io/android-chrome-192x192.png" alt="" />
          <span>MCCW</span>
        </button>

        <div class="nav-links">
          <?php foreach ($nav_items as $item): ?>
          <button
            class="nav-link<?php echo $view === $item['view'] ? ' active' : ''; ?>"
            type="button"
            data-view="<?php echo h($item['view']); ?>"
            onclick="setViewPhp(this.dataset.view)"
          ><?php echo h($item['label']); ?></button>
          <?php endforeach; ?>
        </div>

        <a class="top-cta" href="https://modrinth.com/modpack/mccw" target="_blank" rel="noopener noreferrer">
          Modpack
        </a>
      </nav>

      <main>

        <!-- HOME -->
        <section class="view home-view" id="view-home" <?php echo $view !== 'home' ? 'style="display:none"' : ''; ?>>
          <div class="hero-card">
            <div class="card-header">
              <img class="title-image" src="assets/minecraft_title_2.png" alt="MCCW" />
              <span class="status-pill">Earth SMP</span>
            </div>
            <div class="accent-line" aria-hidden="true"></div>
            <div class="hero-grid">
              <div class="hero-copy">
                <p class="eyebrow">Seasonal Minecraft Earth SMP</p>
                <h1>Build nations, factories and rail networks across a modded Earth map.</h1>
                <p class="lead">
                  MCCW combines Create engineering, seasonal progression and community projects
                  on an Earth SMP built for players who like big plans.
                </p>
                <div class="hero-actions">
                  <a class="join-button" href="https://modrinth.com/modpack/mccw" target="_blank" rel="noopener noreferrer">Install</a>
                  <button class="ghost-button" type="button" onclick="setViewPhp('join')">Join Info</button>
                </div>
              </div>
              <div class="world-preview" aria-label="MCCW Create preview">
                <div class="preview-glass">
                  <span>Automation</span>
                  <strong>Create</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="quick-strip" aria-label="Server highlights">
            <?php foreach ($stats as $stat): ?>
            <article class="stat-tile">
              <strong><?php echo h($stat['value']); ?></strong>
              <span><?php echo h($stat['label']); ?></span>
            </article>
            <?php endforeach; ?>
          </div>
        </section>

        <!-- JOIN -->
        <section class="view content-view" id="view-join" <?php echo $view !== 'join' ? 'style="display:none"' : ''; ?>>
          <div class="content-shell split-shell">
            <div>
              <p class="eyebrow">Quick Start</p>
              <h1>Join MCCW in a few minutes.</h1>
              <p class="lead">Download the modpack, join Discord and follow updates on YouTube.</p>
            </div>
            <div class="link-stack">
              <?php foreach ($join_links as $link): ?>
              <a class="resource-link" href="<?php echo h($link['href']); ?>" target="_blank" rel="noopener noreferrer">
                <span><?php echo h($link['kicker']); ?></span>
                <strong><?php echo h($link['label']); ?></strong>
              </a>
              <?php endforeach; ?>
            </div>
          </div>
        </section>

        <!-- INFO -->
        <section class="view content-view" id="view-info" <?php echo $view !== 'info' ? 'style="display:none"' : ''; ?>>
          <div class="content-shell">
            <p class="eyebrow">Server Info</p>
            <h1>Seasonal, technical and community-driven.</h1>
            <p class="lead">
              MCCW is made for players who want to build machines, plan infrastructure,
              claim places on an Earth map and shape each season together.
            </p>
            <div class="feature-grid">
              <?php foreach ($features as $feature): ?>
              <article class="feature-card">
                <span><?php echo h($feature['kicker']); ?></span>
                <h2><?php echo h($feature['title']); ?></h2>
                <p><?php echo h($feature['text']); ?></p>
              </article>
              <?php endforeach; ?>
            </div>
            <div class="rules-list">
              <?php foreach ($rules as $rule): ?>
              <article class="rule-row">
                <h2><?php echo h($rule['title']); ?></h2>
                <p><?php echo h($rule['text']); ?></p>
              </article>
              <?php endforeach; ?>
            </div>
          </div>
        </section>

        <!-- STAFF -->
        <section class="view content-view" id="view-staff" <?php echo $view !== 'staff' ? 'style="display:none"' : ''; ?>>
          <div class="content-shell">
            <p class="eyebrow">Team</p>
            <h1>Staff, devs and builders.</h1>
            <p class="lead">The MCCW team keeps the server, community and new projects moving.</p>
            <div class="staff-grid">
              <?php foreach ($staff as $member): ?>
              <article class="staff-card">
                <div>
                  <h2><?php echo h($member['name']); ?></h2>
                  <p><?php echo h($member['role']); ?></p>
                </div>
                <canvas class="viewer" width="320" height="260" data-skin="<?php echo h($member['skin']); ?>"></canvas>
              </article>
              <?php endforeach; ?>
            </div>
          </div>
        </section>

        <!-- IMPRINT -->
        <section class="view content-view" id="view-imprint" <?php echo $view !== 'imprint' ? 'style="display:none"' : ''; ?>>
          <div class="content-shell">
            <p class="eyebrow">Legal</p>
            <h1>Imprint</h1>
            <p class="lead">This page is currently being set up. Check back soon.</p>
            <div class="rules-list">
              <article class="rule-row imprint-placeholder">
                <h2>Contact</h2>
                <p>Coming soon.</p>
              </article>
              <article class="rule-row imprint-placeholder">
                <h2>Responsible</h2>
                <p>Coming soon.</p>
              </article>
              <article class="rule-row imprint-placeholder">
                <h2>Disclaimer</h2>
                <p>Coming soon.</p>
              </article>
            </div>
          </div>
        </section>

      </main>

      <footer class="site-footer">
        <span>Made by meowtroid24</span>
        <button type="button" onclick="setViewPhp('home')">Back to top</button>
      </footer>
    </div>
  </div>

  <noscript>
    <main class="noscript-card">
      <h1>MCCW</h1>
      <p>Please enable JavaScript to use this site.</p>
    </main>
  </noscript>

  <script src="vendor/three.min.js"></script>
  <script src="script.js"></script>
  <script src="vendor/skinview3d.bundle.js"></script>
  <script src="staff-skin-data.js"></script>
  <script>
    // PHP-rendered initial view passed to JS
    const PHP_INITIAL_VIEW = <?php echo json_encode($view); ?>;
    const PHP_ALLOWED_VIEWS = <?php echo json_encode(array_column($nav_items, 'view')); ?>;
  </script>
  <script src="app-php.js"></script>
</body>
</html>
