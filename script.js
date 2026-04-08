import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  CubeTextureLoader,
  Vector2,
  MathUtils,
  Color,
} from 'https://unpkg.com/three@0.162.0/build/three.module.js';

const container = document.getElementById('canvas-container');
const scene = new Scene();
scene.background = new Color('#0b1120');

const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0.1);

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
// `sRGBEncoding` removed — some CDN builds of three.module.js don't export it.
// If you host a local three build, you can re-enable correct encoding here.
// renderer.outputEncoding = sRGBEncoding;
renderer.setClearColor(0x0b1120, 1);
container.appendChild(renderer.domElement);

const loader = new CubeTextureLoader();
loader.setPath('assets/');

const panoramas = [
  'panorama_0.png',
  'panorama_1.png',
  'panorama_2.png',
  'panorama_3.png',
  'panorama_4.png',
  'panorama_5.png',
];

const pxSet = ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'];

function loadCubemap(files, fallback) {
  loader.load(
    files,
    (texture) => {
      scene.background = texture;
      console.log('Skybox geladen:', files);
    },
    undefined,
    (err) => {
      console.warn('Skybox konnte nicht geladen werden:', files, err);
      if (fallback) loadCubemap(fallback, null);
      else scene.background = new Color(0x0b1120);
    }
  );
}

loadCubemap(panoramas, pxSet);

const mouse = new Vector2(0, 0);
const targetMouse = new Vector2(0, 0);
let autoRotation = 0;
const rotationSpeed = 0.00008;
const verticalAmplitude = 0.03;

function onMouseMove(event) {
  targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = (event.clientY / window.innerHeight) * 2 - 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', onWindowResize);

function animate() {
  requestAnimationFrame(animate);

  autoRotation += rotationSpeed;
  mouse.lerp(targetMouse, 0.04);

  const rotationYaw = autoRotation + mouse.x * 0.35;
  const rotationPitch = Math.sin(performance.now() * 0.0006) * verticalAmplitude + mouse.y * 0.06;

  camera.rotation.y = MathUtils.lerp(camera.rotation.y, rotationYaw, 0.03);
  camera.rotation.x = MathUtils.lerp(camera.rotation.x, rotationPitch, 0.02);

  renderer.render(scene, camera);
}

animate();
