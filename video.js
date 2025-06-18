const video = document.querySelector('video');


video.controls = false;
video.addEventListener('pause', () => video.play());
video.addEventListener('click', (e) => e.preventDefault());

video.addEventListener('ended', () => {
  window.location.href = 'cena-final.html';
});
