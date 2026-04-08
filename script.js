const panorama = document.getElementById('panorama');
const images = [
  'assets/panorama_0.png',
  'assets/panorama_1.png',
  'assets/panorama_2.png',
  'assets/panorama_3.png',
  'assets/panorama_4.png',
  'assets/panorama_5.png',
];
let currentIndex = 0;
let transitionTimeout = null;

function setPanorama(index) {
  const imageUrl = images[index];
  const preload = new Image();
  preload.src = imageUrl;
  preload.onload = () => {
    panorama.style.opacity = '0';
    window.setTimeout(() => {
      panorama.style.backgroundImage = `url('${imageUrl}')`;
      panorama.style.opacity = '1';
    }, 500);
  };
}

function nextPanorama() {
  currentIndex = (currentIndex + 1) % images.length;
  setPanorama(currentIndex);
}

function startRotation() {
  if (images.length === 0) {
    panorama.style.background = 'linear-gradient(135deg, #141414 0%, #1d1d2a 100%)';
    return;
  }

  setPanorama(currentIndex);
  transitionTimeout = window.setInterval(nextPanorama, 12000);
}

startRotation();
