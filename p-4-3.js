
const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const paintingInteraction = document.getElementById('painting-interaction');
const player = document.getElementById('player');
const painting = document.getElementById('mesa');

const passwordScreen = document.getElementById('password-screen');
const passwordInput = document.getElementById('password-input');
const passwordMessage = document.getElementById('password-message');
const rewardImageContainer = document.getElementById('reward-image-container');
const closeRewardImageBtn = document.getElementById('close-reward-image-btn');

const stepSound = document.getElementById('stepSound');
const doorSound = document.getElementById('doorSound');
const paintingSound = document.getElementById('paintingSound');
const rewardSound = document.getElementById('rewardSound');

const senhaCorreta = "se lembre"; // Você pode alterar a senha aqui

let playerX = 50;
let playerY = 280;
let isInteracting = false;
let facingRight = true;
const moveSpeed = 5;
let isMoving = false;

const backgroundScale = 2.35;
let worldWidth = backgroundScale * window.innerWidth;

const paintingWorldX = 2000;
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
        const clampedPlayerProgress = Math.max(0, Math.min(1, playerProgress));
        backgroundPixelOffset = clampedPlayerProgress * totalScrollableBackgroundWidth;
    }

    viewport.style.backgroundPosition = `-${backgroundPixelOffset}px center`;

    // Calcula a posição X da mesa de som na tela
    const paintingScreenX = paintingWorldX - backgroundPixelOffset;
    painting.style.left = `${paintingScreenX}px`; // Usa 'left' para posicionamento
}

function verificarProximidadeDaPorta() {
    // A porta está no lado esquerdo da tela (playerX próximo a playerX_min_screen)
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
    // Se a tela de senha ou recompensa estiver aberta, não mostra interações no ambiente
    if (passwordScreen.style.display === 'flex' || rewardImageContainer.style.display === 'flex') {
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

document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        if (e.key === 'Escape') {
            endInteraction();
        }
        return;
    }
    if (passwordScreen.style.display === 'flex' || rewardImageContainer.style.display === 'flex') {
        if (e.key === "Escape") {
            if (passwordScreen.style.display === 'flex') {
                fecharTelaSenha();
            } else if (rewardImageContainer.style.display === 'flex') {
                closeRewardImageBtn.click(); // Simula clique no botão de fechar recompensa
            }
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
            if (verificarProximidadeDoQuadro()) {
                paintingSound.currentTime = 0;
                paintingSound.play();
                paintingInteraction.style.display = 'none';
                abrirTelaSenha();
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

function abrirTelaSenha() {
    passwordScreen.style.display = 'flex';
    passwordInput.value = '';
    passwordMessage.innerText = '';
    passwordInput.focus();
    checkInteractionDisplay();
}

function fecharTelaSenha() {
    passwordScreen.style.display = 'none';
    passwordInput.value = '';
    passwordMessage.innerText = '';
    checkInteractionDisplay();
}

function checkPassword() {
    const senha = passwordInput.value.trim().toLowerCase();
    if (senha === senhaCorreta) {
        passwordMessage.innerText = "Parabéns, você recebeu sua recompensa!";
        passwordMessage.style.color = 'lightgreen';

        rewardSound.currentTime = 0;
        rewardSound.play(); // Toca o som de recompensa

        Inventario.add('chave');

        setTimeout(() => {
            fecharTelaSenha();
            // Mostra a imagem de recompensa
            rewardImageContainer.style.display = 'flex';
            // Opcional: esconde a imagem de recompensa após um tempo
            setTimeout(() => {
                rewardImageContainer.style.display = 'none';
                rewardSound.pause(); // Pausa o som se ainda estiver tocando
                rewardSound.currentTime = 0;
                checkInteractionDisplay(); // Atualiza para mostrar interações do ambiente
            }, 3000); // Mostra a imagem por 3 segundos
        }, 1500); // Esconde a tela de senha após 1.5 segundos

    } else {
        passwordMessage.innerText = "Senha incorreta. Tente novamente.";
        passwordMessage.style.color = 'red';
        passwordInput.value = ''; // Limpa o campo para nova tentativa
        passwordInput.focus();
    }
}

// Listener para fechar a imagem de recompensa manualmente
closeRewardImageBtn.addEventListener('click', () => {
    rewardImageContainer.style.display = 'none';
    rewardSound.pause();
    rewardSound.currentTime = 0;
    checkInteractionDisplay(); // Atualiza para mostrar interações do ambiente
});

// Event listener para 'Enter' no campo de senha
passwordInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Inicializa o player no estado parado e com a direção padrão
player.classList.add('idle');

// Atualiza posições e displays no carregamento
updatePlayerPosition();
updateBackgroundPosition();
checkInteractionDisplay();

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

