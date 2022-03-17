export function addLightbox() {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  document.body.appendChild(lightbox);

  const images = document.querySelectorAll('img');
  images.forEach(image => {
    image.addEventListener('click', e => {
      lightbox.classList.add('active');
      const lightboxImg = document.createElement('img');
      lightboxImg.src = image.src;
      while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild);
      }
      lightbox.appendChild(lightboxImg);
    });
  });

  lightbox.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return;
    lightbox.classList.remove('active');
  });
}
