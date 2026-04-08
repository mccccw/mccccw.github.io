const body = document.body;
const container = document.getElementById('canvas-container');

const panoImages = [0, 1, 2, 3, 4, 5].map((index) =>
  document.getElementById(`pano-${index}`)
);

const hasRequiredPanoramaMarkup = Boolean(container) && panoImages.every(Boolean);

function activateFallback(reason) {
  body.classList.add('panorama-fallback-active');
  if (reason) console.info('Panorama fallback aktiv:', reason);
}

function waitForImage(img) {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve(img);
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve(img), { once: true });
    img.addEventListener('error', () => reject(new Error(`Image failed: ${img.src}`)), {
      once: true,
    });
  });
}

function createScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 0.1);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x070d1a, 1);

  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

function rotateImage180(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  const context = canvas.getContext('2d');
  context.translate(canvas.width, canvas.height);
  context.rotate(Math.PI);
  context.drawImage(image, 0, 0);

  return canvas;
}

function applyCubeBackground(scene, images) {
  // Minecraft panorama_0..5 is not in Three.js CubeTexture axis order.
  // Three expects: +X, -X, +Y, -Y, +Z, -Z.
  // The four side faces need a 180deg rotation to remove vertical seam artifacts.
  const cubeFaceOrder = [
    rotateImage180(images[1]),
    rotateImage180(images[3]),
    images[4],
    images[5],
    rotateImage180(images[2]),
    rotateImage180(images[0]),
  ];
  const cubeTexture = new THREE.CubeTexture(cubeFaceOrder);
  cubeTexture.generateMipmaps = false;
  cubeTexture.minFilter = THREE.LinearFilter;
  cubeTexture.magFilter = THREE.LinearFilter;
  cubeTexture.needsUpdate = true;

  if (THREE.SRGBColorSpace) cubeTexture.colorSpace = THREE.SRGBColorSpace;
  if (THREE.sRGBEncoding) cubeTexture.encoding = THREE.sRGBEncoding;

  scene.background = cubeTexture;
}

function run() {
  if (!hasRequiredPanoramaMarkup) {
    return;
  }

  if (window.location.protocol === 'file:') {
    activateFallback('file:// blockiert WebGL-Cubetexture in Firefox');
    return;
  }

  if (!window.THREE) {
    activateFallback('THREE nicht verfuegbar');
    return;
  }

  Promise.all(panoImages.map(waitForImage))
    .then((images) => {
      const { scene, camera, renderer } = createScene();
      applyCubeBackground(scene, images);

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      window.addEventListener('resize', onWindowResize);

      let yaw = 0;

      function animate() {
        requestAnimationFrame(animate);

        yaw += 0.00065;
        camera.rotation.y = yaw;
        camera.rotation.x = Math.sin(performance.now() * 0.00014) * 0.01;

        renderer.render(scene, camera);
      }

      animate();
    })
    .catch((error) => {
      console.error('Panorama konnte nicht geladen werden:', error);
      activateFallback(error.message || 'Skybox-Load-Error');
    });
}

run();
