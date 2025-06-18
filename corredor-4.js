
const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const player = document.getElementById('player');
const video = document.querySelector('video');
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


window.addEventListener('resize', () => {
    updateBackgroundPosition();
});



const passagem = document.getElementById('passagem');
const passagemWorldX = 1400;

function updateBackgroundPosition() {
    const maxBackgroundScrollWidth = (2.35 * window.innerWidth) - window.innerWidth;
    const playerMovementRange = playerX_max_screen - playerX_min_screen;

    let backgroundPixelOffset = 0;
    if (playerMovementRange > 0) {
        const playerProgress = (playerX - playerX_min_screen) / playerMovementRange;

        backgroundPixelOffset = playerProgress * maxBackgroundScrollWidth;
    }

    viewport.style.backgroundPosition = `-${backgroundPixelOffset}px center`;

    const passagemScreenX = passagemWorldX - backgroundPixelOffset;
    passagem.style.left = `${passagemScreenX}px`;

}



const savedX = localStorage.getItem('playerX');
if (savedX !== null) {
    playerX = parseInt(savedX);
    localStorage.removeItem('playerX');
}


const portas = [
    { nome: "Quarto 1", min: 30, max: 200 },
    { nome: "Quarto 2", min: 450, max: 650 },
    { nome: "Quarto 3", min: 1100, max: 1350 },
    { nome: "Quarto 4", min: 1650, max: 1900 },
    { nome: "Quarto 5", min: 2200, max: 2350 },
];

const mensagempassagem = document.getElementById('interaction-2');

function estaPertoDapassagem() {
    const passagemScreenX = parseInt(passagem.style.left, 10);
    const distancia = Math.abs(playerX - passagemScreenX);
    return distancia < 100;  // 100 pixels de distância
}

function atualizarMensagempassagem() {
    const passagemDisplay = window.getComputedStyle(passagem).display;
    if (passagemDisplay === 'block' && estaPertoDapassagem()) {
        mensagempassagem.style.display = 'block';
        passagem.style.cursor = 'pointer';
    } else {
        mensagempassagem.style.display = 'none';
        passagem.style.cursor = 'default';
    }
}



function verificarPorta() {
    const maxScroll = (2.35 * window.innerWidth) - window.innerWidth;
    const movementRange = playerX_max_screen - playerX_min_screen;

    if (movementRange <= 0) return null;

    const playerProgress = (playerX - playerX_min_screen) / movementRange;
    const worldX = playerProgress * maxScroll;

    return portas.find(p => worldX >= p.min && worldX <= p.max);
}

function temTodosOsCerebros() {
    const itens = Inventario.list();
    const cerebros = ['cerebro1', 'cerebro2', 'cerebro3', 'cerebro4'];
    return cerebros.every(c => itens.includes(c));
}

function Visibilidade() {
    if (temTodosOsCerebros()) {
        passagem.style.display = 'block';
    } else {
        passagem.style.display = 'none';
    }
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
                            window.location.href = 'madu.html';
                        }, 1000);
                        break;
                    case 'Quarto 2':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-4-1.html';
                        }, 1000);
                        break;
                    case 'Quarto 3':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-4-2.html';
                        }, 1000);
                        break;
                    case 'Quarto 4':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-4-3.html';
                        }, 1000);
                        break;
                    case 'Quarto 5':
                        doorSound.play();
                        localStorage.setItem('playerX', playerX);
                        setTimeout(() => {
                            window.location.href = 'p-4-4.html';
                        }, 1000);
                        break;
                }
            } else if (passagem.style.display === 'block' && estaPertoDapassagem()) {
                window.location.href = 'video.html';
            }
            break;

    }

    if (moved) {
        updatePlayerPosition();
        updateBackgroundPosition();
        atualizarMensagempassagem();
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
Visibilidade();
atualizarMensagempassagem()


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


function mostrarInventario() {
    const itens = Inventario.list();
    listaInventario.innerHTML = '';

    itens.forEach(item => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.innerText = item;
        btn.style.margin = '5px';
        btn.onclick = () => interagirComItem(item);
        li.appendChild(btn);
        listaInventario.appendChild(li);
    });
    Visibilidade();
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

