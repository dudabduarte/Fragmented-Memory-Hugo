const viewport = document.getElementById('viewport');
const darkOverlay = document.getElementById('darkOverlay');
const interaction = document.getElementById('interaction');
const paintingInteraction = document.getElementById('painting-interaction');
const player = document.getElementById('player');
const painting = document.getElementById('caixa-bailarina');
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
let isMoving = false;
let isModalOpen = false; // Flag para controlar se o modal está aberto
let facingRight = true;
const moveSpeed = 5;
let isInteracting = false;

let worldWidth = 2.35 * window.innerWidth;

const paintingWorldX = 2000;

let playerX_min_screen = 50;
let playerX_max_screen = window.innerWidth - player.offsetWidth - 50;

const senha = document.getElementById('cod');
const senhaWorldX = 1940;

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
    const senhaScreenX = senhaWorldX - backgroundPixelOffset;
    senha.style.left = `${senhaScreenX}px`;
}

function verificarProximidadeDaPorta() {
    const doorProximityThreshold = 100; // Distância em pixels para ativar a interação
    return playerX < playerX_min_screen + doorProximityThreshold;
}

function verificarProximidadeDoQuadro() { // Referência à caixa da bailarina
    const paintingRect = painting.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    const proximityThreshold = 80;
    return (
        playerRect.right >= paintingRect.left - proximityThreshold &&
        playerRect.left <= paintingRect.right + proximityThreshold &&
        playerRect.bottom >= paintingRect.top &&
        playerRect.top <= paintingRect.bottom
    );
}

function checkInteractionDisplay() {
    if (isModalOpen) {
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
    if (isModalOpen) {
        if (e.key === "Enter") {
            submitPassword.click();
        }
        return;
    }

    if (isInteracting) {
        if (e.key === 'Escape') {
            fecharInteracao();
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
        case 'e':
        case 'E':
            if (!isInteracting) {
                if (verificarProximidadeDaPorta()) {
                    doorSound.play();
                    interaction.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = 'corredor-1.html';
                    }, 1000);
                } else             // Lógica de interação com "E"
                    if ((e.key === 'e' || e.key === 'E') && !isMoving) {
                        if (verificarProximidadeDoQuadro()) {
                            passwordMessage.textContent = '';
                            passwordInput.value = '';
                            passwordModal.style.display = 'block';
                            darkOverlay.style.opacity = '0.8'; // ATIVA O ESCURECIMENTO AQUI
                            darkOverlay.style.pointerEvents = 'all'; // Bloqueia interações no fundo
                            isModalOpen = true; // Define o flag do modal como true
                            passwordInput.focus();
                        } else if (verificarProximidadeDaPorta()) {
                            doorSound.play();
                            interaction.style.display = 'none';
                            setTimeout(() => {
                                window.location.href = 'corredor-1.html';
                            }, 1000);
                        }
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
    if (isModalOpen) return; // Não faz nada se o modal estiver aberto

    if (['a', 'd', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        isMoving = false;
        player.classList.remove('walking');
        player.classList.add('idle');
        stepSound.pause();
        stepSound.currentTime = 0; // Reinicia o áudio do passo
        checkInteractionDisplay(); // Atualiza display de interações ao parar
    }
});

painting.addEventListener('click', () => {
    if (!isMoving && verificarProximidadeDoQuadro()) {
        passwordMessage.textContent = '';
        passwordInput.value = '';
        passwordModal.style.display = 'block';
        darkOverlay.style.opacity = '0.8'; // ATIVA O ESCURECIMENTO AQUI TAMBÉM
        darkOverlay.style.pointerEvents = 'all'; // Bloqueia interações no fundo
        isModalOpen = true; // Define o flag do modal como true
        setTimeout(() => {
            passwordInput.focus();
        }, 10);
    }
});

submitPassword.addEventListener('click', () => {
    const correctPassword = "sobrevivente"; // A senha correta
    if (passwordInput.value.toLowerCase() === correctPassword) {
        passwordMessage.style.color = 'lightgreen';
        passwordMessage.textContent = 'Parabéns, recebeu sua recompensa: O Colar perdido';

        Inventario.add('Colar perdido');  // <---- Adiciona o item no inventário!


        paintingSound.currentTime = 0;
        paintingSound.play();

        passwordInput.disabled = true;
        submitPassword.disabled = true;

        setTimeout(() => {
            passwordModal.style.display = 'none';
            passwordInput.disabled = false;
            submitPassword.disabled = false;
            darkOverlay.style.opacity = '0';
            darkOverlay.style.pointerEvents = 'none';
            isModalOpen = false;
            checkInteractionDisplay();
        }, 6000);
    } else {
        passwordMessage.style.color = 'red';
        passwordMessage.textContent = 'Senha incorreta, tente novamente.';
        passwordInput.value = '';
        passwordInput.focus();
    }
});

cancelPassword.addEventListener('click', () => {
    passwordModal.style.display = 'none';
    darkOverlay.style.opacity = '0'; // Desativa o escurecimento ao cancelar
    darkOverlay.style.pointerEvents = 'none'; // Libera interações no fundo
    isModalOpen = false; // Define o flag do modal como false
    checkInteractionDisplay(); // Atualiza a exibição de interações
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && passwordModal.style.display === 'block') {
        passwordModal.style.display = 'none';
        darkOverlay.style.opacity = '0'; // Desativa o escurecimento ao pressionar Esc
        darkOverlay.style.pointerEvents = 'none'; // Libera interações no fundo
        isModalOpen = false; // Define o flag do modal como false
        checkInteractionDisplay(); // Atualiza a exibição de interações
    }
});

updatePlayerPosition();
updateBackgroundPosition();
checkInteractionDisplay();

// Recalcular as posições em caso de redimensionamento da tela
window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth - 50;
    worldWidth = 2.35 * window.innerWidth;
    updatePlayerPosition();
    updateBackgroundPosition();
    checkInteractionDisplay();
});

// Loop principal do jogo para animações e atualizações contínuas
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



const interactionScreen = document.getElementById('interaction-screen');
const interactionImage = document.getElementById('interaction-image');
function fecharInteracao() {
    interactionScreen.style.display = 'none';
    isInteracting = false;
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

function toggleInventario() {
    const visivel = janelaInventario.style.display === 'block';
    if (visivel) {
        fecharInventario();
    } else {
        mostrarInventario();
        janelaInventario.style.display = 'block';
    }
}

// Exibe os itens do inventário na lista
function mostrarInventario() {
    const itens = Inventario.list();
    listaInventario.innerHTML = ''; // limpa lista

    if (itens.length === 0) {
        listaInventario.innerHTML = '<li>Inventário vazio.</li>';
        return;
    }

    itens.forEach(item => {
        const li = document.createElement('li');


        // Criar o botão com o texto do item
        const btn = document.createElement('button');
        btn.innerText = item;
        btn.style.margin = '5px';
        btn.style.verticalAlign = 'middle';
        btn.onclick = () => interagirComItem(item);

        li.appendChild(btn);  // adiciona o botão no li

        listaInventario.appendChild(li);
    });
}


// Ação ao clicar em um item do inventário
function interagirComItem(item) {
    if (imagensDosItens[item]) {
        interactionImage.src = imagensDosItens[item];
        interactionScreen.style.display = 'flex';
        isInteracting = true;
        fecharInventario();
    } else {
        alert(`Você clicou no item: ${item}`);
    }
}

// Fecha o inventário
function fecharInventario() {
    janelaInventario.style.display = 'none';
}

// Fecha o modal de interação da imagem
function fecharInteracao() {
    interactionScreen.style.display = 'none';
    isInteracting = false;
}
