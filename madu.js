let playerX = 50;
let playerY = 225;
const moveSpeed = 8;
let isMoving = false;
let isInteracting = false;
let currentDialogueIndex = 0;
let isTyping = false;
let typeIntervalId;
const player = document.getElementById('player');
let gameDialogue;
let parte1FoiMostrada = false;
let FoneFoiEntregue = false;
let dialogueState = '';


const doorSound = new Audio('caminho/para/o/som_da_porta.mp3');

const dialogueScreen = document.getElementById('dialogueScreen');
const dialogueMessage = document.getElementById('dialogueMessage');
const ethanDialogueImg = document.getElementById('ethanDialogueImg');
const maduDialogueImg = document.getElementById('maduDialogueImg');
const ethanDialogueName = document.getElementById('ethanDialogueName');
const maduDialogueName = document.getElementById('maduDialogueName');
const dialogueIndicator = document.getElementById('dialogueIndicator');
const dialogueText = document.getElementById('dialogueMessage');
const stepSound = document.getElementById('stepSound');



const interactionMessage = document.getElementById('interactionMessage');
const Madu = document.getElementById('Madu');

let playerX_min_screen = 0;
let playerX_max_screen = window.innerWidth - player.offsetWidth;
let playerY_min_screen = 0;
let playerY_max_screen = window.innerHeight - player.offsetHeight;

function carregarEstado() {
    parte1FoiMostrada = localStorage.getItem('parte1FoiMostrada') === 'true';
    FoneFoiEntregue = localStorage.getItem('FoneFoiEntregue') === 'true';
}


const gameDialogueParte1 = [

    {
        speaker: "Jogador",
        text: "Ei... você está bem?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/madu-tedio.png",
    },
    {
        speaker: "Madu",
        text: "Shhh... Consegue ouvir? Não o que está aqui... mas o que ficou preso no silêncio.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/madu-tedio.png",
    },
    {
        speaker: "Jogador",
        text: "O que você está ouvindo?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-sorrindo.png",
    },
    {
        speaker: "Madu",
        text: "Era a última coisa que me mantinha sã... esse fone. Não porque funcionava, mas porque lembrava. Eu ouvia vozes nele... talvez fossem minhas próprias memórias tentando escapar.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/madu-sorrindo.png",
    },
    {
        speaker: "Madu",
        text: "Mas agora... ele está quebrado. E sem ele, as vozes sumiram. Ou pior... ficaram dentro de mim.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-suando.png",
    },
    {
        speaker: "Jogador",
        text: "Talvez eu possa consertá-lo. Ou... encontrar outro.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/madu-tedio.png",
    },
    {
        speaker: "Madu",
        text: "Você faria isso? Procuraria um fone que talvez nem exista mais só porque uma estranha está presa no próprio eco?",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/madu-sorrindo.png",
    },
    {
        speaker: "Jogador",
        text: "Se eu encontrar... o que você vai me contar?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/madu-tedio.png",
    },
    {
        speaker: "Madu",
        text: "Algo que talvez você não queira ouvir. Mas justo por isso... você precisa ouvir.",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/madu-suando.png",
    },
]
const gameDialogueParte2 = [
    {
        speaker: "Jogador",
        text: "Aqui. Esse fone... é o que você queria?",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/madu-sorrindo.png",
    },
    {
        speaker: "Madu",
        text: "É ele. Você ouviu também, né? A voz",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/madu-fone.png",
    },
    {
        speaker: "Jogador",
        text: "Sim... dizia pra não confiar",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-suando.png",
    },
    {
        speaker: "Madu",
        text: "Porque não deve. Nada aqui é o que parece. A dor que sentimos, as pessoas que encontramos... tudo isso pode ter sido plantado. Uma história escrita por mãos invisíveis.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-suando.png",
    },
    {
        speaker: "Jogador",
        text: "Então tudo é mentira?",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/madu-tedio.png",
        audio: ""
    },
    {
        speaker: "Madu",
        text: "Não. Não é mentira. Mas também não é verdade. É um meio-termo perigoso: uma realidade inventada para testar nossos limites. Mas se você está lembrando... se está ouvindo... significa que está pronto para sair disso. Ou pelo menos tentar.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-fone.png",
    },
    {
        speaker: "Jogador",
        text: "Você vai comigo?",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/madu-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Madu",
        text: "Eu não sei se posso. Mas posso te mostrar o caminho... antes que ele desapareça de novo.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-sorrindo.png",
    },
    {
        speaker: "Madu",
        text: "Ei... espera. Quando você ouviu... o que sentiu?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-fone.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "Foi como... se algo tivesse quebrado. Mas ao mesmo tempo... como se parte de mim voltasse. Estranho... Parece até que doeu em mim.",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/madu-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Madu",
        text: "Então leva. Talvez ele ainda tenha algo pra te mostrar. Talvez... seja mais útil pra você agora do que pra mim. Olha... às vezes lembrar dói mesmo. Mas esquecer... pode ser ainda pior.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/madu-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Madu",
        text: "Vai. Antes que o silêncio te alcance de novo.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/madu-sorrindo.png",
    },
];

const gameDialogueSemfone = [
    {
        speaker: "Madu",
        text: "Sem fone, sem informação.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-tedio.png",
        audio: ""
    },
    {
        speaker: "Madu",
        text: "Olha, não posso te ajudar sem o fone.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-tedio.png",
        audio: ""
    },
    {
        speaker: "Madu",
        text: "Sem o fone, não podemos continuar.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/madu-tedio.png",
        audio: ""
    }
];

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}


function verificarProximidadeDaPorta() {
    const doorX = 0;
    const doorProximityThreshold = 50;
    return Math.abs(playerX - doorX) < doorProximityThreshold;
}


function isPlayerNearHelo() {
    const playerRect = player.getBoundingClientRect();
    const maduRect = Madu.getBoundingClientRect();

    const interactionPadding = 100;

    return !(
        playerRect.right < maduRect.left - interactionPadding ||
        playerRect.left > maduRect.right + interactionPadding ||
        playerRect.bottom < maduRect.top - interactionPadding ||
        playerRect.top > maduRect.bottom + interactionPadding
    );
}

function checkInteractionDisplay() {
    if (isMoving || isInteracting) {
        interactionMessage.style.display = 'none';
        return;
    }

    if (isPlayerNearHelo()) { // Verifica proximidade com a Madu
        interactionMessage.innerText = 'Pressione E para interagir com Madu';
        interactionMessage.style.display = 'block';
    } else if (verificarProximidadeDaPorta()) { // Verifica proximidade com a porta
        interactionMessage.innerText = 'Pressione E para sair';
        interactionMessage.style.display = 'block';
    } else {
        interactionMessage.style.display = 'none';
    }
}


// --- Movimentação do jogador e Interações ---
document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        if (isTyping) {
            skipTypingAnimation();
            return;
        }

        if (e.key === 'E' || e.key === ' ' || e.key === 'Enter' || e.key === 'e') {
            advanceDialogue();
        } else if (e.key === 'Escape') {
            endInteraction();
        }
        return;
    }

    let moved = false;
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;

    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (playerX - moveSpeed >= playerX_min_screen) {
                playerX -= moveSpeed;
                moved = true;
                player.style.transform = 'scaleX(1)';
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (playerX + moveSpeed + playerWidth <= playerX_max_screen) {
                playerX += moveSpeed;
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
                if (isPlayerNearHelo()) {
                    startInteraction();
                } else if (verificarProximidadeDaPorta()) {
                    // Saída manual pela porta
                    doorSound.play();
                    interactionMessage.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = 'corredor-4.html'; // <--- Destino atualizado
                    }, 1000);
                }
            }
            break;
    }

    if (moved) {
        updatePlayerPosition();
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


function startInteraction() {
    isInteracting = true;
    dialogueScreen.style.display = 'flex';
    currentDialogueIndex = 0;

    const jogadorTemFone = Inventario.has('fone');
    const jogadorTemCerebro4 = Inventario.has('cerebro4');

    if (!parte1FoiMostrada) {
        gameDialogue = [...gameDialogueParte1];
        dialogueState = 'parte1';
    } else if (jogadorTemFone && !FoneFoiEntregue) {
        gameDialogue = [...gameDialogueParte2];
        dialogueState = 'parte2';
        Inventario.add('cerebro4');
    } else if (jogadorTemCerebro4) {
        gameDialogue = [
            {
                speaker: "Madu",
                text: "Mesmo com o fone. Mesmo com as pistas. Vivemos num mundo irreal, onde a memória é só um jogo da mente.",
                ethanImg: "personagens/ethan-desinteressado.png",
                heloImg: "personagens/madu-fone.png",
                audio: "maduVoiceSound"
            }
        ];
        dialogueState = 'posfone';
    } else if (!jogadorTemFone && !FoneFoiEntregue) {
        gameDialogue = [...gameDialogueSemfone];
        dialogueState = 'semfone';
    }

    displayDialogueLine();
}

function advanceDialogue() {
    currentDialogueIndex++;
    if (currentDialogueIndex >= gameDialogue.length) {
        if (!parte1FoiMostrada && dialogueState === 'parte1') {
            parte1FoiMostrada = true;
            localStorage.setItem('parte1FoiMostrada', 'true');
        }

        if (dialogueState === 'parte2' && !FoneFoiEntregue) {
            FoneFoiEntregue = true;
            localStorage.setItem('FoneFoiEntregue', 'true');

            Inventario.remove('fone');
            mostrarInventario();
        }
        endInteraction();
        displayDialogueLine();
        return;
    }
    displayDialogueLine();
}
function endInteraction() {
    isInteracting = false;
    dialogueScreen.style.display = 'none';
    if (typeIntervalId) {
        clearInterval(typeIntervalId);
    }
    checkInteractionDisplay(); // Re-verifica a exibição da mensagem de interação
}

function displayDialogueLine() {
    if (currentDialogueIndex < gameDialogue.length) {
        const line = gameDialogue[currentDialogueIndex];

        dialogueMessage.innerHTML = '';
        isTyping = true;
        dialogueIndicator.style.display = 'none';
        if (typeIntervalId) {
            clearInterval(typeIntervalId);
        }

        ethanDialogueImg.src = line.ethanImg;
        maduDialogueImg.src = line.heloImg; // Usando heloImg para maduDialogueImg

        if (line.speaker === "Jogador") {
            ethanDialogueName.innerText = "Jogador";
            maduDialogueName.innerText = "";
            ethanDialogueImg.style.opacity = '1';
            maduDialogueImg.style.opacity = '0.5';
            dialogueText.style.borderColor = 'blue';
        } else if (line.speaker === "Madu") {
            ethanDialogueName.innerText = "";
            maduDialogueName.innerText = "Madu";
            ethanDialogueImg.style.opacity = '0.5';
            maduDialogueImg.style.opacity = '1';
            dialogueText.style.borderColor = 'purple';
        }

        let charIndex = 0;
        const typingSpeed = 30;

        typeIntervalId = setInterval(() => {
            if (charIndex < line.text.length) {
                let char = line.text.charAt(charIndex);
                if (char === ' ') {
                    dialogueMessage.innerHTML += '&nbsp;';
                } else {
                    dialogueMessage.innerHTML += char;
                }
                charIndex++;
            } else {
                clearInterval(typeIntervalId);
                isTyping = false;
                dialogueIndicator.style.display = 'block';
            }
        }, typingSpeed);


    } else {
        endInteraction();
    }
}

function skipTypingAnimation() {
    if (typeIntervalId) {
        clearInterval(typeIntervalId);
    }
    isTyping = false;
    const line = gameDialogue[currentDialogueIndex];
    dialogueMessage.innerHTML = line.text;
    dialogueIndicator.style.display = 'block';
}



function gameLoop() {
    updatePlayerPosition();
    checkInteractionDisplay();

    // Checar borda direita
    const playerAtRightEdgeThreshold = window.innerWidth - player.offsetWidth - 5;
    if (playerX >= playerAtRightEdgeThreshold && !isInteracting) {
        doorSound.play();
        interactionMessage.style.display = 'none';
        setTimeout(() => {
            window.location.href = 'corredor-3.html';
        }, 500);
        return;
    }

    // Checar borda esquerda
    const playerAtLeftEdgeThreshold = 5;
    if (playerX <= playerAtLeftEdgeThreshold && !isInteracting) {
        doorSound.play();
        interactionMessage.style.display = 'none';
        setTimeout(() => {
            window.location.href = 'corredor-4.html';
        }, 500);
        return;
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth;
    playerY_max_screen = window.innerHeight - player.offsetHeight;
    updatePlayerPosition();
    checkInteractionDisplay();
});

carregarEstado()
updatePlayerPosition();
checkInteractionDisplay();
gameLoop(); // Inicia o loop principal do jogo


function backToMenu() {
    localStorage.clear();
    window.location.href = 'index.html';
}

const janelaInventario = document.getElementById('inventario-janela');
const listaInventario = document.getElementById('inventario-lista');

function toggleInventario() {
    const visivel = janelaInventario.style.display === 'block';
    if (visivel) {
        janelaInventario.style.display = 'none';
    } else {
        mostrarInventario();
        janelaInventario.style.display = 'block';
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
    if (imagensDosItens[item]) {
        interactionImage.src = imagensDosItens[item];
        interactionScreen.style.display = 'flex';
        isInteracting = true; // Define como interagindo para bloquear o movimento
        fecharInventario();
    } else {
        alert(`Imagem para "${item}" não encontrada.`);
    }
}

const interactionScreen = document.getElementById('interaction-screen');
const interactionImage = document.getElementById('interaction-image');

function fecharInteracao() {
    interactionScreen.style.display = 'none';
    isInteracting = false; // Libera o movimento do player
}