// Variáveis de controle
let playerX = 50;
let playerY = 240;
const moveSpeed = 8;
let isMoving = false;
let isInteracting = false;
let currentDialogueIndex = 0;
let isTyping = false;
let typeIntervalId;
const player = document.getElementById('player');
let gameDialogue;
let parte1FoiMostrada = false;
let livroFoiEntregue = false;


function carregarEstado() {
    parte1FoiMostrada = localStorage.getItem('parte1FoiMostrada') === 'true';
    livroFoiEntregue = localStorage.getItem('livroFoiEntregue') === 'true';
}

const doorSound = new Audio('caminho/para/o/som_da_porta.mp3');

const dialogueScreen = document.getElementById('dialogueScreen');
const dialogueMessage = document.getElementById('dialogueMessage');
const ethanDialogueImg = document.getElementById('ethanDialogueImg');
const dudaDialogueImg = document.getElementById('dudaDialogueImg');
const ethanDialogueName = document.getElementById('ethanDialogueName');
const dudaDialogueName = document.getElementById('dudaDialogueName');
const dialogueIndicator = document.getElementById('dialogueIndicator');
const dialogueText = document.getElementById('dialogueMessage');
const stepSound = document.getElementById('stepSound');


const interactionMessage = document.getElementById('interactionMessage');
const Duda = document.getElementById('Duda');

let playerX_min_screen = 0;
let playerX_max_screen = window.innerWidth - player.offsetWidth;

const gameDialogueParte1 = [
    {
        speaker: "Jogador",
        text: "Você... sabe o que aconteceu aqui?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Depende. Você quer ouvir uma teoria ou a parte que dói?",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "Qualquer coisa. Eu não sei nem por onde começar.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Ninguém sabe. Até tropeçar em algo que deveria ter ficado enterrado.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: " Você tem respostas?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: " Algumas. Fragmentadas. Mas não são gratuitas.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "O que você quer?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Um livro. Meu. Não por apego. Mas porque certas coisas nos mantêm inteiros. Mesmo que só por dentro.",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "Onde eu encontro?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Se eu soubesse, eu mesma teria achado. Mas deve estar por aí... esperando por alguém com mais tempo do que memórias.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "E quando eu trouxer?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Aí eu falo. Ou pelo menos o que ainda faz sentido dizer. Nem tudo merece ser esquecido.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    }
];

const gameDialogueParte2 = [
    {
        speaker: "Jogador",
        text: "Achei. Aqui está.",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Eu sabia que ele ainda estava por aí... mas não sabia onde. É o único pedaço de algo que ainda entendo.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "O que você quer dizer com entende? Você parece... distante.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "É como se eu já tivesse vivido isso antes. Como uma história sem fim. Esse livro era meu refúgio. Quando a realidade não fazia sentido, eu me perdia nele.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "Então, ele te mantém ligada ao que era?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: " Talvez. Ou talvez seja só uma âncora. Sem ele, o que sobra? A memória insiste em voltar, e o livro é o que me lembra de como as coisas eram... ou como eu pensava que eram.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: " E agora? Vai ler de novo?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Não sei... Talvez as palavras não sejam suficientes. Eu costumava achar que ao ler, entenderia tudo. Mas agora, talvez eu precise apenas lembrar de quem eu era.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "Não tem medo de não entender?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: " Medo faz parte, não é? Talvez o medo esteja em descobrir o que vou perder, mais do que o que vou encontrar. Mas, no fim, o que importa é tentar... mesmo que não haja mais nada.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/duda-livro.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "E se o livro não trouxer respostas?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: " Então, talvez eu precise parar de buscar respostas. Algumas coisas não podem ser resolvidas. E isso me mantém aqui: a busca, mesmo quando se dissolve nas sombras do passado.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-suando.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "E o que sobra, quando não há mais nada para buscar?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: " Ler. Continuar, ou tentar. A memória não se apaga... Às vezes, só precisa de um empurrão. Não sei meu fim, mas talvez, se eu continuar, encontre uma saída... ou uma forma de reescrever o que se perdeu.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-livro.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: " E se a resposta não for o que você esperava? Se o que você busca não for o que precisa?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Talvez a verdadeira pergunta seja... o que acontece quando a resposta não importa mais?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-livro.png",
        audio: ""
    }
];
const gameDialogueSemlivro = [
    {
        speaker: "Duda",
        text: "Você ainda não achou o livro? Não esperava menos... ele não aparece fácil.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Ele está por aí, escondido. Talvez esperando que alguém com paciência o encontre.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Sem ele, nada faz sentido. Mas também não se iluda... não vai ser simples.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Duda",
        text: "Continue procurando. Quem sabe o que vai aparecer quando você menos esperar.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/duda-base.png",
        audio: ""
    }
];



function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}


function verificarProximidadeDaPorta() {
    // A porta está no lado direito da tela (playerX próximo de playerX_max_screen)
    const doorX = window.innerWidth - player.offsetWidth; // Considerando que a "porta" é a borda direita
    const doorProximityThreshold = 50; // Ajuste este valor para definir a largura da área de interação
    return Math.abs(playerX - doorX) < doorProximityThreshold;
}


function isPlayerNearDuda() {
    const playerRect = player.getBoundingClientRect();
    const dudaRect = Duda.getBoundingClientRect();

    const interactionPadding = 100; // Pixels de margem para colisão

    return !(
        playerRect.right < dudaRect.left - interactionPadding ||
        playerRect.left > dudaRect.right + interactionPadding ||
        playerRect.bottom < dudaRect.top - interactionPadding ||
        playerRect.top > dudaRect.bottom + interactionPadding
    );
}

function checkInteractionDisplay() {
    if (isInteracting || isMoving) {
        interactionMessage.style.display = 'none';
        return;
    }

    if (isPlayerNearDuda()) {
        interactionMessage.innerText = 'Pressione E para interagir com Duda';
        interactionMessage.style.display = 'block';
    } else if (verificarProximidadeDaPorta()) {
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
    const roomWidth = window.innerWidth;
    const playerWidth = player.offsetWidth;

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
                if (isPlayerNearDuda()) {
                    startInteraction();
                } else if (verificarProximidadeDaPorta()) {
                    // Saída manual pela porta
                    doorSound.play();
                    interactionMessage.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = 'corredor-3.html'; // <--- Altere o destino conforme necessário
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

    const jogadorTemLivro = Inventario.has('livro');
    const jogadorTemCerebro3 = Inventario.has('cerebro3');

    if (!parte1FoiMostrada) {
        gameDialogue = [...gameDialogueParte1];
        dialogueState = 'parte1';
    } else if (jogadorTemLivro && !livroFoiEntregue) {
        gameDialogue = [...gameDialogueParte2];
        dialogueState = 'parte2';
        Inventario.add('cerebro3');
    } else if (jogadorTemCerebro3) {
        gameDialogue = [
            {
                speaker: "Duda",
                text: "Não tenho mais respostas. Só páginas soltas... e uma lembrança que ainda me escapa.",
                ethanImg: "personagens/ethan-desinteressado.png",
                heloImg: "personagens/duda-livro.png",
                audio: "dudaVoiceSound"
            }

        ];
        dialogueState = 'poslivro';
    } else if (!jogadorTemLivro && !livroFoiEntregue) {
        gameDialogue = [...gameDialogueSemlivro];
        dialogueState = 'semlivro';
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

        if (dialogueState === 'parte2' && !livroFoiEntregue) {
            livroFoiEntregue = true;
            localStorage.setItem('livroFoiEntregue', 'true');

            Inventario.remove('livro');
            mostrarInventario();
        }
        endInteraction();
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
        dudaDialogueImg.src = line.heloImg;

        if (line.speaker === "Jogador") {
            ethanDialogueName.innerText = "Jogador";
            dudaDialogueName.innerText = "";
            ethanDialogueImg.style.opacity = '1';
            dudaDialogueImg.style.opacity = '0.5';
            dialogueText.style.borderColor = 'blue';
        } else if (line.speaker === "Duda") {
            ethanDialogueName.innerText = "";
            dudaDialogueName.innerText = "Duda";
            ethanDialogueImg.style.opacity = '0.5';
            dudaDialogueImg.style.opacity = '1';
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

        if (line.audio) {
            const voiceAudio = new Audio(line.audio);
            voiceAudio.play().catch(e => console.error("Erro ao tocar áudio de voz:", e));
        }

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

    const playerAtRightEdgeThreshold = window.innerWidth - player.offsetWidth - 5;
    if (playerX >= playerAtRightEdgeThreshold && !isInteracting) {
        doorSound.play();
        interactionMessage.style.display = 'none';
        setTimeout(() => {
            window.location.href = 'corredor-3.html';
        }, 500);
        return;
    }

    const playerAtLeftEdgeThreshold = 5;
    if (playerX <= playerAtLeftEdgeThreshold && !isInteracting) {
        doorSound.play();
        interactionMessage.style.display = 'none';
        setTimeout(() => {
            window.location.href = 'corredor-3.html';
        }, 500);
        return;
    }

    requestAnimationFrame(gameLoop);
}


window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth;
    updatePlayerPosition();
    checkInteractionDisplay();
});

carregarEstado();
updatePlayerPosition();
checkInteractionDisplay();
gameLoop();

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