
const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const paintingInteraction = document.getElementById('painting-interaction');
const player = document.getElementById('player');
const painting = document.getElementById('escrivaninha');
const stepSound = document.getElementById('stepSound');
const doorSound = document.getElementById('doorSound');
const paintingSound = document.getElementById('paintingSound');

const overlayImageContainer = document.getElementById('overlay-image-container');

let playerX = 50;
let playerY = 280;
let isInteracting = false;
let facingRight = true;
let isMoving = false;


const moveSpeed = 5;

const backgroundScale = 2.35;
let worldWidth = backgroundScale * window.innerWidth;

const paintingWorldX = 2000; // Adjust this value! E.g., 500, 1000, 2500, etc.

const doorProximityThreshold = 100;

let playerX_min_screen = 50;
let playerX_max_screen = window.innerWidth - player.offsetWidth - 50;

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateBackgroundPosition() {
    const totalScrollableBackgroundWidth = (backgroundScale * window.innerWidth) - window.innerWidth;
    const playerMovementRange = playerX_max_screen - playerX_min_screen;

    let backgroundPixelOffset = 0;
    if (playerMovementRange > 0) {
        const playerProgress = (playerX - playerX_min_screen) / playerMovementRange;
        const clampedPlayerProgress = Math.max(0, Math.min(1, playerProgress)); // Ensure 0-1 range
        backgroundPixelOffset = clampedPlayerProgress * totalScrollableBackgroundWidth;
    }

    viewport.style.backgroundPosition = `-${backgroundPixelOffset}px center`;

    const paintingScreenX = paintingWorldX - backgroundPixelOffset;
    painting.style.left = `${paintingScreenX}px`; // Use 'left' for direct positioning
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isInteracting) {
        fecharInteracao();
    }
});


function verificarProximidadeDaPorta() {
    return playerX < playerX_min_screen + doorProximityThreshold;
}

function verificarProximidadeDoQuadro() {
    const paintingRect = painting.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    const proximityThreshold = 100; // You might need to adjust this value
    return (
        playerRect.right >= paintingRect.left - proximityThreshold &&
        playerRect.left <= paintingRect.right + proximityThreshold &&
        playerRect.bottom >= paintingRect.top &&
        playerRect.top <= paintingRect.bottom
    );
}

document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        if (e.key === 'Escape') {
            endInteraction();
        }
        return;
    }
    if (overlayImageContainer.style.display === 'flex') {
        return; // Do nothing if the overlay is visible
    }

    let moved = false;
    const roomWidth = window.innerWidth;
    const playerWidth = player.offsetWidth;

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
            if (verificarProximidadeDoQuadro()) {
                if (Inventario.has('chave')) {
                    Inventario.remove('chave');
                    paintingSound.currentTime = 0;
                    paintingSound.play();
                    paintingInteraction.style.display = 'none';
                    openOverlayImage(); // abre a gaveta
                } else {
                    alert('Você precisa da chave para abrir a gaveta.');
                }
            } else if (verificarProximidadeDaPorta()) {
                doorSound.play();
                interaction.style.display = 'none';
                setTimeout(() => {
                    window.location.href = 'corredor-4.html';
                }, 1000);
            }

            break;
    }

    if (moved) {
        isMoving = true;
        player.classList.remove('idle');
        player.classList.add('walking');
        stepSound.play();
        updatePlayerPosition();
        updateBackgroundPosition();
        checkInteractionDisplay();
    }
});


document.addEventListener('keyup', function (e) {
    if (['a', 'd', 'A', 'D', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        isMoving = false;
        player.classList.remove('walking');
        player.classList.add('idle');
        stepSound.pause();
        stepSound.currentTime = 0;
        checkInteractionDisplay();
    }
});


function checkInteractionDisplay() {
    if (overlayImageContainer.style.display === 'flex') {
        interaction.style.display = 'none';
        paintingInteraction.style.display = 'none';
        return;
    }

    if (verificarProximidadeDaPorta() && !isMoving) {
        interaction.style.display = 'block';
    } else {
        interaction.style.display = 'none';
    }

    if (verificarProximidadeDoQuadro() && !isMoving) {
        paintingInteraction.style.display = 'block';
    } else {
        paintingInteraction.style.display = 'none';
    }
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isInteracting) {
        if (overlayImageContainer.style.display === 'flex') {
            closeOverlayImage();
        }
        else if (interactionScreen.style.display === 'flex') {
            fecharInteracao();
        }
    }
});


function openOverlayImage() {
    overlayImageContainer.style.display = 'flex';
    isInteracting = true;
    player.classList.remove('walking');
    player.classList.add('idle');
    stepSound.pause();
    stepSound.currentTime = 0;

    if (!Inventario.has('fone')) {
        Inventario.add('fone');
    }

    checkInteractionDisplay();
}


function closeOverlayImage() {
    overlayImageContainer.style.display = 'none';
    isInteracting = false;   // <<< adiciona aqui
    checkInteractionDisplay();
}


player.classList.add('idle');

updatePlayerPosition();
updateBackgroundPosition();
checkInteractionDisplay();

// Recalculate on screen resize
window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth - 50;
    worldWidth = backgroundScale * window.innerWidth;
    updatePlayerPosition();
    updateBackgroundPosition();
    checkInteractionDisplay();
});

function gameLoop() {
    requestAnimationFrame(gameLoop);
}

gameLoop();

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

