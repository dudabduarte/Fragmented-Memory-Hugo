const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const paintingInteraction = document.getElementById('painting-interaction');
const player = document.getElementById('player');
const painting = document.getElementById('bau');
const stepSound = document.getElementById('stepSound');
const doorSound = document.getElementById('doorSound');
const paintingSound = document.getElementById('paintingSound');
const sequenceDisplay = document.getElementById('sequence-display');
const sequenceImage = document.getElementById('sequence-image');

let playerX = 50;
let playerY = 280;
let isMoving = false;
let facingRight = true;
const moveSpeed = 5;
let isInteracting = false;


let worldWidth = 2.35 * window.innerWidth;

const paintingWorldX = 2000;

let playerX_min_screen = 50;
let playerX_max_screen = window.innerWidth - player.offsetWidth - 50;

const interactionSequenceImages = [
    'imagens/laudo-ethan.png',
    'imagens/laudo-helo.png',
    'imagens/laudo-livx.png',
    'imagens/laudo-duda.png',
    'imagens/laudo-madu.png'
];
let currentSequenceIndex = 0;
let isShowingSequence = false;

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateBackgroundPosition() {
    const maxBackgroundScrollWidth = (2.35 * window.innerWidth) - window.innerWidth;
    const playerMovementRange = playerX_max_screen - playerX_min_screen;
    let backgroundPixelOffset = 0;
    if (playerMovementRange > 0) {
        const playerProgress = (playerX - playerX_min_screen) / playerMovementRange;

        backgroundPixelOffset = playerProgress * maxBackgroundScrollWidth;
    }

    viewport.style.backgroundPosition = `-${backgroundPixelOffset}px center`;

    const paintingScreenX = paintingWorldX - backgroundPixelOffset;
    painting.style.left = `${paintingScreenX}px`; // Usa 'left' para posicionamento
}

function verificarProximidadeDaPorta() {
    const doorProximityThreshold = 100; // Distância em pixels para ativar a interação
    return playerX < playerX_min_screen + doorProximityThreshold;
}

function verificarProximidadeDoBau() { // Renomeado de verificarProximidadeDoQuadro para Bau
    const paintingRect = painting.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Usa os retângulos para verificar a sobreposição
    const proximityThreshold = 100; // Ajuste conforme necessário
    return (
        playerRect.right >= paintingRect.left - proximityThreshold &&
        playerRect.left <= paintingRect.right + proximityThreshold &&
        playerRect.bottom >= paintingRect.top &&
        playerRect.top <= paintingRect.bottom
    );
}

// Função para exibir a próxima imagem na sequência
function showNextSequenceImage() {
    if (currentSequenceIndex < interactionSequenceImages.length) {
        sequenceImage.src = interactionSequenceImages[currentSequenceIndex];
        sequenceDisplay.style.display = 'flex'; // Mostra a sobreposição
        currentSequenceIndex++;
    } else {
        // Todas as imagens mostradas, esconde a sequência e reinicia
        sequenceDisplay.style.display = 'none';
        currentSequenceIndex = 0; // Reinicia para a próxima interação
        isShowingSequence = false; // Permite ações normais do jogo novamente
        checkInteractionDisplay(); // Re-verifica os prompts de interação
    }
}

document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        if (e.key === 'Escape') {
            endInteraction();
        }
        return;
    }

    if (isShowingSequence) {
        if (e.key === 'e' || e.key === 'E') {
            showNextSequenceImage();
        }
        return; // bloqueia outras ações durante a sequência
    }

    let moved = false;
    const roomWidth = window.innerWidth;
    const playerWidth = player.offsetWidth;

    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (playerX - moveSpeed >= playerX_min_screen) {
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
            if (!isInteracting) {
                if (verificarProximidadeDoBau()) {
                    paintingInteraction.style.display = 'none';
                    isShowingSequence = true;
                    showNextSequenceImage();
                    adicionarItensDoBauAoInventario();


                } else if (verificarProximidadeDaPorta()) {
                    doorSound.play();
                    interaction.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = 'corredor-1.html';
                    }, 1000);
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

function checkInteractionDisplay() {
    if (isShowingSequence) {
        interaction.style.display = 'none';
        paintingInteraction.style.display = 'none';
        return;
    }

    if (verificarProximidadeDaPorta() && !isMoving) {
        interaction.style.display = 'block';
    } else {
        interaction.style.display = 'none';
    }

    if (verificarProximidadeDoBau() && !isMoving) {
        paintingInteraction.style.display = 'block';
    } else {
        paintingInteraction.style.display = 'none';
    }
}

updatePlayerPosition();
updateBackgroundPosition();
checkInteractionDisplay();

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

function adicionarItensDoBauAoInventario() {
    itensDoBau.forEach(item => {
        Inventario.add(item);
    });
}


function fecharInventario() {
    janelaInventario.style.display = 'none';
}

const itensDoBau = ['?', 'Helo', 'Liv', 'duda', 'madu'];

let bauAberto = false;

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

