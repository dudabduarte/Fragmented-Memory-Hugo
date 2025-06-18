const music = document.getElementById('background-music');
const introMusic = document.getElementById('intro-music');
const soundToggle = document.getElementById('sound-toggle');
const background = document.getElementById('background');
const titulo = document.getElementById('titulo');

const diario = document.getElementById('diario');
const interactionScreen = document.getElementById('interaction-screen');
const interactionImage = document.getElementById('interaction-image');

let isPlaying = false;
let isInteracting = false;
let facingRight = true;

function toggleSound() {
    if (isPlaying) {
        music.pause();
        introMusic.pause();
        soundToggle.src = "imagens/off.png";
    } else {
        const introScreenActive = document.getElementById('intro-screen').style.display === 'flex';
        (introScreenActive ? introMusic : music).play().catch(err => console.error(err));
        soundToggle.src = "imagens/on.png";
    }
    isPlaying = !isPlaying;
}

function startGame() {
    hideAllScreens();
    document.getElementById('intro-screen').style.display = 'flex';
    music.pause();
    introMusic.play();
    const text = `Você acorda em um 
mundo destruído, onde você não sabe
onde está ou o que está acontecendo...
O que você faz?`;
    document.getElementById('intro-text').innerHTML = '';
    typeText(text, 0);
}

function hideAllScreens() {
    ['menu', 'credits', 'back-menu'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    background.style.display = 'none';
    titulo.style.display = 'none';
}

function typeText(text, index) {
    if (index < text.length) {
        const char = text.charAt(index);
        document.getElementById('intro-text').innerHTML += char;
        setTimeout(() => typeText(text, index + 1), 40);
    } else {
        setTimeout(playVideo, 1000);
    }
}

function playVideo() {
    document.getElementById('intro-screen').style.display = 'none';
    introMusic.pause();

    const videoScreen = document.getElementById('video-screen');
    const video = document.getElementById('cutscene');
    videoScreen.style.display = 'flex';

    video.play();

    video.onended = () => {
        videoScreen.style.display = 'none';
        document.getElementById('gif-screen').style.display = 'flex';


        setTimeout(() => {
            document.getElementById('gif-screen').style.display = 'none';
            window.location.href = 'quarto-ethan.html';
        }, 5000);
    };

}


function showCredits() {
    hideAllScreens();
    document.getElementById('credits').style.display = 'grid';
    document.getElementById('back-menu').style.display = 'flex';
}

function backToMenu() {
    document.getElementById('credits').style.display = 'none';
    document.getElementById('back-menu').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
    background.style.display = 'block';
    titulo.style.display = 'block';
}

