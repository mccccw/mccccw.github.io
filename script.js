const panorama = document.getElementById('panorama');
const images = [
  'assets/panorama1.jpg',
  'assets/panorama2.jpg',
  'assets/panorama3.jpg',
  'assets/panorama4.jpg',
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
