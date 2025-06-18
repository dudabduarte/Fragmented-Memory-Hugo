const viewport = document.getElementById('viewport');
const interaction = document.getElementById('interaction');
const paintingInteraction = document.getElementById('painting-interaction');
const player = document.getElementById('player');
const painting = document.getElementById('cofre');
const stepSound = document.getElementById('stepSound');
const doorSound = document.getElementById('doorSound');
const paintingSound = document.getElementById('paintingSound');

const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');
const cancelPassword = document.getElementById('cancelPassword');
const passwordMessage = document.getElementById('passwordMessage');

let playerX = 50;
let playerY = 280;
const moveSpeed = 5;
let isInteracting = false
let isMoving = false;

let worldWidth = 2.35 * window.innerWidth;

const paintingWorldX = 2000;

const porta = {
    nome: "porta",
    minPosition: 0,
    maxPosition: 5
};

passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        submitPassword.click();
    }
});

const playerX_min_screen = 50;
let playerX_max_screen = window.innerWidth - player.offsetWidth - 50;

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateBackgroundPosition() {
    const totalScrollableBackgroundWidth = worldWidth - window.innerWidth;
    const playerMovementRange = playerX_max_screen - playerX_min_screen;

    let backgroundPixelOffset = 0;
    if (playerMovementRange > 0) {
        const playerProgress = (playerX - playerX_min_screen) / playerMovementRange;
        backgroundPixelOffset = playerProgress * totalScrollableBackgroundWidth;
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
    if (passwordModal.style.display === 'block') {
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

function abrirModalSenha() {
    passwordMessage.textContent = '';
    passwordInput.value = '';
    passwordModal.style.display = 'block';
    setTimeout(() => {
        passwordInput.focus();
    }, 10);
}


painting.addEventListener('click', () => {
    if (!isMoving && verificarProximidadeDoQuadro()) {
        abrirModalSenha();
    }
});

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
            if (verificarProximidadeDoQuadro()) {
                abrirModalSenha();
            } else if (verificarProximidadeDaPorta()) {
                doorSound.play();
                interaction.style.display = 'none';
                setTimeout(() => {
                    window.location.href = 'corredor-2.html';
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
        passwordMessage.textContent = '';
        passwordModal.style.display = 'block';

        setTimeout(() => {
            passwordInput.value = '';
            passwordInput.focus();
        }, 10);
    }
});

submitPassword.addEventListener('click', () => {
    const correctPassword = "25";
    if (passwordInput.value.toLowerCase() === correctPassword) {
        passwordMessage.style.color = 'lightgreen';
        passwordMessage.textContent = 'Parabéns, recebeu sua recompensa: A mesa digital';
        paintingSound.currentTime = 0;
        paintingSound.play();
        passwordInput.disabled = true;
        submitPassword.disabled = true;

        Inventario.add('mesa');

        setTimeout(() => {
            passwordModal.style.display = 'none';
            passwordInput.disabled = false;
            submitPassword.disabled = false;

            mostrarInventario();

            interactionImage.src = imagensDosItens['mesa'];
            interactionScreen.style.display = 'flex';
            isInteracting = true;

                setTimeout(() => {
        isInteracting = false;
    }, 200);


        }, 1000);
    } else {
        passwordMessage.style.color = 'red';
        passwordMessage.textContent = 'Senha incorreta, tente novamente.';
        passwordInput.value = '';
        passwordInput.focus();
    }
});

cancelPassword.addEventListener('click', () => {
    passwordModal.style.display = 'none';
    checkInteractionDisplay();
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && passwordModal.style.display === 'block') {
        passwordModal.style.display = 'none';
        checkInteractionDisplay();
    }
});

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

// Loop principal do jogo
function gameLoop() {
    requestAnimationFrame(gameLoop);
}

gameLoop();

function backToMenu() {
    localStorage.clear();
    window.location.href = 'index.html';
}
const interactionScreen = document.getElementById('interaction-screen');
const interactionImage = document.getElementById('interaction-image');

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
}

function interagirComItem(item) {
    const key = item.trim().toLowerCase();

    if (imagensDosItens[key]) {
        interactionImage.src = imagensDosItens[key];
        interactionScreen.style.display = 'flex';
        isInteracting = true;
        fecharInventario();
    }  
}




function fecharInteracao() {
    interactionScreen.style.display = 'none';
    isInteracting = false;
}

function fecharInventario() {
    janelaInventario.style.display = 'none';
}
