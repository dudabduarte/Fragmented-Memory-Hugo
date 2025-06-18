function backToMenu() {
    localStorage.clear();
    window.location.href = 'index.html';
}

const diario = document.getElementById('diario');
const interactionScreen = document.getElementById('interaction-screen');
const interactionImage = document.getElementById('interaction-image');
const interactionMessage = document.getElementById('interaction-message');
const player = document.getElementById('player');
const roomScreen = document.getElementById('room-screen');
const stepSound = document.getElementById('stepSound');



let playerX = 300;
let playerY = 300;
const moveSpeed = 8;
let isMoving = false;
let isInteracting = false;
let facingRight = true;

const portaArea = {
    xMin: 300,
    xMax: 350,
    yMin: 280,
    yMax: 340
};


function isPlayerNearPorta() {
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;

    const playerRight = playerX + playerWidth;
    const playerBottom = playerY + playerHeight;

    const horizontalOverlap = playerRight >= portaArea.xMin && playerX <= portaArea.xMax;
    const verticalOverlap = playerBottom >= portaArea.yMin && playerY <= portaArea.yMax;

    return horizontalOverlap && verticalOverlap;
}

document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        if (e.key === 'Escape') {
            endInteraction();
        }
        return;
    }

    let moved = false;
    const roomWidth = window.innerWidth;
    const roomHeight = window.innerHeight;
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;

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
        case 'E':
        case 'e':
            if (isPlayerNearDiario()) {
                startInteraction();
            } else if (isPlayerNearPorta()) {
                window.location.href = 'corredor-1.html';
            }
            break;
        case 'i':
        case 'I':
            toggleInventario();
            break;
    }
    if (moved) {
        updatePlayerPosition();
        checkInteractionMessage();
        if (!isMoving) {
            isMoving = true;
            player.src = 'ethan/ethan-andando-unscreen.gif';
            stepSound.currentTime = 0;
            stepSound.play();
        }

    }
});

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

function isPlayerNearDiario() {
    const playerRect = player.getBoundingClientRect();
    const diarioRect = diario.getBoundingClientRect();

    return !(
        playerRect.right < diarioRect.left ||
        playerRect.left > diarioRect.right ||
        playerRect.bottom < diarioRect.top ||
        playerRect.top > diarioRect.bottom
    );
}

function checkInteractionMessage() {
    if (isPlayerNearDiario() && !isInteracting) {
        interactionMessage.style.display = 'block';
        interactionMessage.textContent = 'Pressione E para ler o diário';
    } else if (isPlayerNearPorta() && !isInteracting) {
        interactionMessage.style.display = 'block';
        interactionMessage.textContent = 'Pressione E para sair do quarto';
    } else {
        interactionMessage.style.display = 'none';
        interactionMessage.textContent = '';
    }
}

function startInteraction() {
    isInteracting = true;
    interactionScreen.style.display = 'flex';
    interactionImage.src = 'imagens/imagem-livro.png';
    interactionMessage.style.display = 'none';
}

function endInteraction() {
    isInteracting = false;
    interactionScreen.style.display = 'none';
    checkInteractionMessage();
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
    if (item === 'Diário') {
        interactionImage.src = 'imagens/imagem-livro.png'; // caminho correto
        interactionScreen.style.display = 'flex';
        isInteracting = true;
        fecharInventario();
    } else {
        alert(`Você clicou no item: ${item}`);
    }
}

function fecharInventario() {
    janelaInventario.style.display = 'none';
}

updatePlayerPosition();