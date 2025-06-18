const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const paintingInteraction = document.getElementById('painting-interaction');
const player = document.getElementById('player');
const painting = document.getElementById('estante');
const stepSound = document.getElementById('stepSound');
const doorSound = document.getElementById('doorSound');
const paintingSound = document.getElementById('paintingSound');
const rewardSound = document.getElementById('rewardSound');
const paintingExpanded = document.getElementById('estante-expanded');
const passwordField = document.getElementById('password-field');
const verifyBtn = document.getElementById('verifyBtn');
const cancelBtn = document.getElementById('cancelBtn');
const passwordMessage = document.getElementById('passwordMessage');
const rewardImageContainer = document.getElementById('reward-image-container');
const closeRewardImageBtn = document.getElementById('close-reward-image-btn');

let playerX = 50;
let playerY = 280;
const moveSpeed = 5;
let worldWidth = 2.35 * window.innerWidth;
let isInteracting = false
let isMoving = false;

const paintingWorldX = 2000;

const porta = {
    nome: "porta",
    minPosition: 0,
    maxPosition: 5
};

const playerX_min_screen = 50;
let playerX_max_screen = window.innerWidth - player.offsetWidth - 50;

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateBackgroundPosition() {
    const totalScrollableBackgroundWidth = (2.35 * window.innerWidth) - window.innerWidth;
    const playerMovementRange = playerX_max_screen - playerX_min_screen;

    let backgroundPixelOffset = 0;
    if (playerMovementRange > 0) {
        const playerProgress = (playerX - playerX_min_screen) / playerMovementRange;
        const clampedPlayerProgress = Math.max(0, Math.min(1, playerProgress));
        backgroundPixelOffset = clampedPlayerProgress * totalScrollableBackgroundWidth;
    }

    viewport.style.backgroundPosition = `-${backgroundPixelOffset}px center`;

    const paintingScreenX = paintingWorldX - backgroundPixelOffset;
    painting.style.left = `${paintingScreenX}px`;
}

function verificarProximidadeDaPorta() {
    const doorProximityThreshold = 100;
    return playerX < playerX_min_screen + doorProximityThreshold;
}

function verificarProximidadeDoQuadro() {
    const paintingRect = painting.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const proximityThreshold = 100;
    return (
        playerRect.right >= paintingRect.left - proximityThreshold &&
        playerRect.left <= paintingRect.right + proximityThreshold &&
        playerRect.bottom >= paintingRect.top &&
        playerRect.top <= paintingRect.bottom
    );
}

function checkInteractionDisplay() {
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
            toggleInventario();
            break;
        case 'e':
        case 'E':
            if (verificarProximidadeDoQuadro()) {
                paintingSound.currentTime = 0;
                paintingSound.play();
                paintingInteraction.style.display = 'none';
                paintingExpanded.style.display = 'flex'; // Mostra a tela da estante
                passwordField.focus();

            } else if (verificarProximidadeDaPorta()) {
                doorSound.play();
                interaction.style.display = 'none';
                setTimeout(() => {
                    window.location.href = 'corredor-3.html';
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


painting.addEventListener('click', () => {
    if (!isMoving && verificarProximidadeDoQuadro()) {
        paintingSound.currentTime = 0;
        paintingSound.play();
        paintingExpanded.style.display = 'flex';
        passwordField.focus();
    }
});

verifyBtn.addEventListener('click', () => {
    const input = passwordField.value.trim().replace('.', ',');
    const correctPassword = "x=9 y=3";

    if (input === correctPassword) {
        passwordMessage.style.color = 'lightgreen';
        passwordMessage.textContent = 'Parabéns, recebeu sua recompensa: A chave.';
        paintingSound.currentTime = 0;
        paintingSound.play();
        passwordField.disabled = true;
        verifyBtn.disabled = true;
        cancelBtn.disabled = true;

        paintingExpanded.style.display = 'none';

        rewardSound.currentTime = 0;
        rewardSound.play();
        rewardImageContainer.style.display = 'flex';
        Inventario.add('chave');


        setTimeout(() => {
            passwordMessage.textContent = '';
            passwordField.value = '';
            passwordField.disabled = false;
            verifyBtn.disabled = false;
            cancelBtn.disabled = false;
            rewardImageContainer.style.display = 'none';
        }, 3000);

    } else {
        passwordMessage.style.color = 'red';
        passwordMessage.textContent = 'Senha incorreta, tente novamente.';
        passwordField.value = '';
        passwordField.focus();
    }
});

cancelBtn.addEventListener('click', () => {
    paintingExpanded.style.display = 'none';
    passwordField.value = '';
    passwordMessage.textContent = '';
    passwordField.disabled = false;
    verifyBtn.disabled = false;
    cancelBtn.disabled = false;
});

closeRewardImageBtn.addEventListener('click', () => {
    rewardImageContainer.style.display = 'none';
    rewardSound.pause();
    rewardSound.currentTime = 0;
});


passwordField.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        verifyBtn.click();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") {
        if (paintingExpanded.style.display === 'flex') {
            cancelBtn.click();
        } else if (rewardImageContainer.style.display === 'flex') {
            closeRewardImageBtn.click();
        }
    }
});

window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth - 50;
    worldWidth = 2.35 * window.innerWidth;
    updatePlayerPosition();
    updateBackgroundPosition();
    checkInteractionDisplay();
});

updatePlayerPosition();
updateBackgroundPosition();
checkInteractionDisplay();

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

