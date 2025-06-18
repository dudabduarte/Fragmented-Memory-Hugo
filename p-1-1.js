const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const quadroInteraction = document.getElementById('painting-interaction');
const player = document.getElementById('player');
const quadro = document.getElementById('quadro');
const stepSound = document.getElementById('stepSound');
const doorSound = document.getElementById('doorSound');
const quadroSound = document.getElementById('quadroSound');

let playerX = 50;
let playerY = 280;
let isMoving = false;
let facingRight = true;
const moveSpeed = 5;
let isInteracting = false;


let worldWidth = 2.35 * window.innerWidth;

const quadroWorldX = 2000;

let playerX_min_screen = 50;
let playerX_max_screen = window.innerWidth - player.offsetWidth - 50;

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateBackgroundPosition() {
    const maxBackgroundScrollWidth = (2.35 * window.innerWidth) - window.innerWidth; // Total de pixels que o fundo pode rolar
    const playerMovementRange = playerX_max_screen - playerX_min_screen; // Total de pixels que o jogador pode mover na tela

    let backgroundPixelOffset = 0;
    if (playerMovementRange > 0) {
        const playerProgress = (playerX - playerX_min_screen) / playerMovementRange;

        backgroundPixelOffset = playerProgress * maxBackgroundScrollWidth;
    }

    viewport.style.backgroundPosition = `-${backgroundPixelOffset}px center`;

    const quadroScreenX = quadroWorldX - backgroundPixelOffset;
    quadro.style.left = `${quadroScreenX}px`; // Usa 'left' para posicionamento
}

function verificarProximidadeDaPorta() {
    const doorProximityThreshold = 100; // Distância em pixels para ativar a interação
    return playerX < playerX_min_screen + doorProximityThreshold;
}

function verificarProximidadeDoQuadro() {
    const quadroRect = quadro.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    const proximityThreshold = 100; // Distância em pixels para ativar a interação
    return (
        playerRect.right >= quadroRect.left - proximityThreshold &&
        playerRect.left <= quadroRect.right + proximityThreshold &&
        playerRect.bottom >= quadroRect.top &&
        playerRect.top <= quadroRect.bottom
    );
}

function checkInteractionDisplay() {
    // Se o jogador estiver se movendo, esconde as interações
    if (isMoving) {
        interaction.style.display = 'none';
        quadroInteraction.style.display = 'none';
        return;
    }

    // Mostra ou esconde interação com a porta
    if (verificarProximidadeDaPorta()) {
        interaction.style.display = 'block';
    } else {
        interaction.style.display = 'none';
    }

    // Mostra ou esconde interação com o quadro
    if (verificarProximidadeDoQuadro()) {
        quadroInteraction.style.display = 'block';
    } else {
        quadroInteraction.style.display = 'none';
    }
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
            console.log('Tecla I detectada');

            toggleInventario();
            break;
     case 'e':
case 'E':
    if (!isInteracting) {
        if (verificarProximidadeDaPorta()) {
            doorSound.play();
            interaction.style.display = 'none';
            setTimeout(() => {
                window.location.href = 'corredor-1.html';
            }, 1000);
        } else if (verificarProximidadeDoQuadro()) {
            quadroSound.play(); // <-- TOCA O SOM DO QUADRO AQUI
            quadroInteraction.style.display = 'none';

        }
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
    if (['a', 'd', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        isMoving = false;
        player.classList.remove('walking');
        player.classList.add('idle');
        stepSound.pause();
        stepSound.currentTime = 0; 
        checkInteractionDisplay(); 
    }
});

updatePlayerPosition();
updateBackgroundPosition();
checkInteractionDisplay();
gameLoop();

window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth - 50;
    worldWidth = 2.35 * window.innerWidth;
    updatePlayerPosition();
    updateBackgroundPosition();
    checkInteractionDisplay();
});

function gameLoop() {
    requestAnimationFrame(gameLoop);
}


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

