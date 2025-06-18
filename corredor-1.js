
const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const player = document.getElementById('player');
const doorSound = document.getElementById('doorSound');
const stepSound = document.getElementById('stepSound');



const playerX_min_screen = 100;
const playerX_max_screen = window.innerWidth - 400;


let playerX = 300;
let playerY = 300;
const moveSpeed = 8;
let isMoving = false;
let isInteracting = false;
let facingRight = true;

const backgroundMusic = document.getElementById('background-music');
let musicaIniciada = false;

function iniciarMusica() {
    if (!musicaIniciada) {
        backgroundMusic.play().then(() => {
            musicaIniciada = true;
            console.log("🎵 Música iniciada com sucesso.");
        }).catch((e) => {
            console.warn("⚠️ Navegador bloqueou autoplay:", e);
        });
    }
}

// Inicia após qualquer interação do jogador
document.addEventListener('keydown', iniciarMusica);
document.addEventListener('click', iniciarMusica);


window.addEventListener('resize', () => {
    updateBackgroundPosition();
});


const escada = document.getElementById('escada');
const escadaWorldX = 1350;

function updateBackgroundPosition() {
    const maxBackgroundScrollWidth = (2.35 * window.innerWidth) - window.innerWidth; // Total de pixels que o fundo pode rolar
    const playerMovementRange = playerX_max_screen - playerX_min_screen; // Total de pixels que o jogador pode mover na tela

    let backgroundPixelOffset = 0;
    if (playerMovementRange > 0) {
        const playerProgress = (playerX - playerX_min_screen) / playerMovementRange;

        backgroundPixelOffset = playerProgress * maxBackgroundScrollWidth;
    }

    viewport.style.backgroundPosition = `-${backgroundPixelOffset}px center`;

    const escadaScreenX = escadaWorldX - backgroundPixelOffset;
    escada.style.left = `${escadaScreenX}px`; // Usa 'left' para posicionamento
}

const portas = [
    { nome: "Quarto 1", min: 30, max: 200 },
    { nome: "Quarto 2", min: 450, max: 650 },
    { nome: "Quarto 3", min: 1100, max: 1350 },
    { nome: "Quarto 4", min: 1650, max: 1900 },
    { nome: "Quarto 5", min: 2200, max: 2350 },
    { nome: "Corredor 2", min: 800, max: 1050 }
];


function verificarPorta() {
    const maxScroll = (2.35 * window.innerWidth) - window.innerWidth;
    const movementRange = playerX_max_screen - playerX_min_screen;

    if (movementRange <= 0) return null;

    const playerProgress = (playerX - playerX_min_screen) / movementRange;
    const worldX = playerProgress * maxScroll;

    return portas.find(p => worldX >= p.min && worldX <= p.max);
}




const savedX = localStorage.getItem('playerX');
if (savedX !== null) {
    playerX = parseInt(savedX);
    localStorage.removeItem('playerX'); // limpa para não usar em outras telas sem querer
}



document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        if (e.key === 'Escape') {
            fecharInteracao();
        }
        return;
    }

    let moved = false;
    const roomWidth = window.innerWidth;
    const roomHeight = window.innerHeight;
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;
    const portaAtual = verificarPorta();


    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (playerX - moveSpeed >= 0) {
                playerX -= moveSpeed;
                facingRight = false;
                moved = true;
                player.style.transform = 'scaleX(1)';
            }
            break;

        case 'ArrowRight':
        case 'd':
        case 'D':
            if (playerX + moveSpeed + playerWidth <= roomWidth) {
                playerX += moveSpeed;
                facingRight = true;
                moved = true;
                player.style.transform = 'scaleX(-1)';
            }
            break;

        case 'i':
        case 'I':
            toggleInventario();
            break;

        case 'e':
        case 'E':
            if (portaAtual) {

                switch (portaAtual.nome) {
                    case 'Quarto 1':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'helo.html';
                        }, 1000);
                        break;
                    case 'Quarto 2':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-1-1.html';
                        }, 1000);
                        break;
                    case 'Quarto 3':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-1-2.html';
                        }, 1000);
                        break;
                    case 'Quarto 4':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-1-3.html';
                        }, 1000);
                        break;
                    case 'Quarto 5':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-1-4.html';
                        }, 1000);
                        break;
                    case 'Corredor 2':
                        if (Inventario.has('cerebro1')) {
                            localStorage.setItem('parte1FoiMostrada', 'false');
                            window.location.href = 'corredor-2.html';
                        } else {
                            alert('Você precisa terminar o desafio da Helo.');
                        }
                        break;
                }
            }
            break;
    }

    if (moved) {
        updatePlayerPosition();
        updateBackgroundPosition();
        if (!isMoving) {
            isMoving = true;
            player.src = 'ethan/ethan-andando-unscreen.gif';
            stepSound.currentTime = 0;
            stepSound.play();
        }

    }

    if (portaAtual) {
        interaction.style.display = 'block';
        interaction.textContent = `Pressione E para entrar no ${portaAtual.nome}`;
    } else {
        interaction.style.display = 'none';
    }
});


updatePlayerPosition();
updateBackgroundPosition();



document.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'A', 'a', 'D', 'd'].includes(e.key)) {
        isMoving = false;
        player.src = 'ethan/ethan-parado-unscreen.gif';
        stepSound.pause();
        stepSound.currentTime = 0;
    }
});


function updatePlayerPosition() {
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
}

// Inicializa posição
updatePlayerPosition();
function backToMenu() {
    localStorage.clear();
    window.location.href = 'index.html';
}
const janelaInventario = document.getElementById('inventario-janela');
const listaInventario = document.getElementById('inventario-lista');

function toggleInventario() {
    const janela = document.getElementById('inventario-janela');
    const visivel = janela.style.display === 'block';
    janela.style.display = visivel ? 'none' : 'block';

    if (!visivel) {
        mostrarInventario();
    }
}




const imagensDosItens = {
    'Colar perdido': 'imagens/colar-perdido.png',
    'duda': 'imagens/laudo-duda.png',
    'Helo': 'imagens/laudo-helo.png',
    'madu': 'imagens/laudo-madu.png',
    'Liv': 'imagens/laudo-livx.png',
    '?': 'imagens/laudo-ethan.png',
    'Lápis': 'imagens/mao_caneta.png',
    'livro': 'imagens/livro.png',
    'chave': 'imagens/mao_chave.png',
    'mesa': 'imagens/mesa_digital.png',
    'fone': 'imagens/fone_de_ouvido.png',
    'cerebro1': 'imagens/cerebro1.png',
    'cerebro2': 'imagens/cerebro2.png',
    'cerebro3': 'imagens/cerebro3.png',
    'cerebro4': 'imagens/cerebro4.png',


};



// Atualiza e mostra os itens do inventário
function mostrarInventario() {
    const itens = Inventario.list();
    listaInventario.innerHTML = ''; // limpa lista

    itens.forEach(item => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.innerText = item;
        btn.style.margin = '5px';
        btn.onclick = () => interagirComItem(item);
        li.appendChild(btn);
        listaInventario.appendChild(li);
    });
}

function interagirComItem(item) {
    if (imagensDosItens[item]) {
        interactionImage.src = imagensDosItens[item];
        interactionScreen.style.display = 'flex';
        isInteracting = true;
        fecharInventario();
    } else {
        alert(`Imagem para "${item}" não encontrada.`);
    }
}


const interactionScreen = document.getElementById('interaction-screen');
const interactionImage = document.getElementById('interaction-image');

function fecharInteracao() {
    interactionScreen.style.display = 'none';
    isInteracting = false;
}

