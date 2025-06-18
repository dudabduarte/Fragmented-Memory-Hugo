
let playerX = 50;
let playerY = 270;
const moveSpeed = 8;
let isMoving = false;
let isInteracting = false;
let currentDialogueIndex = 0;
let isTyping = false;
let typeIntervalId;
const player = document.getElementById('player');
let gameDialogue;
let parte1FoiMostrada = false;
let mesaFoiEntregue = false;



const doorSound = new Audio('caminho/para/o/som_da_porta.mp3');
const livxVoiceSound = new Audio('caminho/para/o/som_da_livx.mp3');

const dialogueScreen = document.getElementById('dialogueScreen');
const dialogueMessage = document.getElementById('dialogueMessage');
const ethanDialogueImg = document.getElementById('ethanDialogueImg');
const livxDialogueImg = document.getElementById('livxDialogueImg');
const ethanDialogueName = document.getElementById('ethanDialogueName');
const livxDialogueName = document.getElementById('livxDialogueName');
const dialogueIndicator = document.getElementById('dialogueIndicator');
const dialogueText = document.getElementById('dialogueMessage');
const stepSound = document.getElementById('stepSound');


const interaction = document.getElementById('interactionMessage');
const Livx = document.getElementById('Livx');

let playerX_min_screen = 0;
let playerX_max_screen = window.innerWidth - player.offsetWidth;

function carregarEstado() {
    parte1FoiMostrada = localStorage.getItem('parte1FoiMostrada') === 'true';
    mesaFoiEntregue = localStorage.getItem('mesaFoiEntregue') === 'true';
}

const gameDialogueParte1 = [
    {
        speaker: "Jogador",
        text: "Você é... humana? Está viva?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Livx",
        text: "Ah, sem dúvidas, não sou um holograma... ainda não. Sou humana. Acho que sou. Mas sei lá, tem dias que nem isso parece verdade.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Você, por outro lado... sua aparência é familiar. Não é do tipo que se perde no primeiro corredor, certo?",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Eu... não me lembro de nada. O que é esse lugar?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: ""
    },
    {
        speaker: "Livx",
        text: "Uau, você não lembra de nada? Que engraçado. Esse lugar... É um pesadelo. Ou só mais uma piada cósmica mal contada. Vai saber.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Mas enfim... se você quer mesmo ajudar, tem uma coisa que pode fazer por mim, claro… se quiser, lógico..",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Minha mesa digital. Eu deixei em algum lugar desse prédio quando tudo começou a dar errado. Sem ela... eu tô igual cego em tiroteio...",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/livx-suando.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Ela tem dados. Nomes. E... sei lá, talvez um pouco da minha sanidade também.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-suando.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Onde eu posso achar essa mesa?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-suando.png",
        audio: ""
    },
    {
        speaker: "Livx",
        text: "Ah, não sei... Não é como se tivesse um mapa, né?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-suando.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Procura por uma sala de servidores ou um laboratório técnico. Deve estar por ali. Dica: 'onde a coisa toda dá errado'.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Se encontrar, ótimo. Se não... bom, vou ter que me trancar neste quarto, igual eu fiz com o meu curso da faculdade.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: "livxVoiceSound"
    }
];

const gameDialogueParte2 = [
    {
        speaker: "Jogador",
        text: "Achei a mesa. Funciona?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: ""
    },
    {
        speaker: "Livx",
        text: "F-Funciona...",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/livx-suando.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Parece que ninguém quis ‘fuçar’... ainda. Que sorte a minha, né?",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Agora... sobre o 'paciente 60'...Adivinha quem é? É você. Surpresa.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Paciente? Como assim? O que isso significa?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: ""
    },
    {
        speaker: "Livx",
        text: "Significa que você tem um número. Um registro. Um lugar aqui... seja lá o que aqui for.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Sabe o que é mais louco? Eu também tô nesse sistema. Eu, Heloísa... talvez todos nós sejamos só... peças de xadrez...",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-suando.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Você sabia disso desde o começo?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: ""
    },
    {
        speaker: "Livx",
        text: "Eu desconfiava. Mas saber de verdade? Não. Só... sentia. Como um peso no estômago, entende?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Mas agora... tudo parece confirmar. E se tudo é manipulado, por que ainda me importo?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Pelo menos agora você tem companhia. Eu tenho os meus próprios demônios, mas... talvez dividir o fardo torne as coisas menos insanas.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-suando.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "...É bom saber que você tá aqui. Mesmo que eu não queira admitir.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-sorrindo.png",
        audio: "livxVoiceSound"
    },
];
const gameDialogueSemMesa = [
    {
        speaker: "Livx",
        text: "Ei... você ainda não encontrou a mesa digital?",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Ela é fundamental. Sem ela, eu mal consigo pensar.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/livx-suando.png",
        audio: "livxVoiceSound"
    },
    {
        speaker: "Livx",
        text: "Procura em alguma sala técnica ou laboratório... não vai ser fácil, mas é importante.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/livx-desconfiada.png",
        audio: "livxVoiceSound"
    }
];


// --- Funções do Jogo ---

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}


function verificarProximidadeDaPorta() {
    const doorX = 0;
    const doorProximityThreshold = 50; // Ajuste este valor para definir a largura da área de interação
    return Math.abs(playerX - doorX) < doorProximityThreshold;
}

function verificarProximidadeDaLivx() {
    const playerRect = player.getBoundingClientRect();
    const livxRect = Livx.getBoundingClientRect();


    const proximityThreshold = -30;

    // Verifica a sobreposição ou proximidade no eixo X
    const isNearLivxX = (
        playerRect.right >= livxRect.left - proximityThreshold &&
        playerRect.left <= livxRect.right + proximityThreshold
    );
    return isNearLivxX; // Para interações laterais, X é o mais comum
}


function checkInteractionDisplay() {
    if (isMoving || isInteracting) {
        interaction.style.display = 'none';
        return;
    }

    if (verificarProximidadeDaLivx()) {
        interaction.innerText = 'Pressione E para interagir com Livx';
        interaction.style.display = 'block';
    } else if (verificarProximidadeDaPorta()) {
        interaction.innerText = 'Pressione E para sair';
        interaction.style.display = 'block';
    } else {
        interaction.style.display = 'none';
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
            if (playerX - moveSpeed >= playerX_min_screen) { // Usa playerX_min_screen
                playerX -= moveSpeed;
                moved = true;
                player.style.transform = 'scaleX(1)';
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (playerX + moveSpeed + playerWidth <= playerX_max_screen) { // Usa playerX_max_screen
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
                if (verificarProximidadeDaLivx()) {
                    startInteraction();
                } else if (verificarProximidadeDaPorta()) {
                    // Saída manual pela porta
                    doorSound.play();
                    interaction.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = 'corredor-1.html'; // <--- Altere se o destino for outro quarto
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


let dialogueState = ''; // 'parte1', 'parte2' ou 'semMesa'

function startInteraction() {
    isInteracting = true;
    dialogueScreen.style.display = 'flex';
    currentDialogueIndex = 0;

    const jogadorTemMesa = Inventario.has('mesa');
    const jogadorTemCerebro2 = Inventario.has('cerebro2');

    if (!parte1FoiMostrada) {
        gameDialogue = [...gameDialogueParte1];
        dialogueState = 'parte1';
    } else if (jogadorTemMesa && !mesaFoiEntregue) {
        gameDialogue = [...gameDialogueParte2];
        dialogueState = 'parte2';
        Inventario.add('cerebro2');
    } else if (jogadorTemCerebro2) {
        gameDialogue = [
            {
                speaker: "Livx",
                text: "Isso é tudo que minha cabeça confusa consegue lembrar. O resto? Boa sorte.",
                ethanImg: "personagens/ethan-desinteressado.png",
                heloImg: "personagens/livx-sorrindo.png",
                audio: "livxVoiceSound"
            }
        ];
        dialogueState = 'posmesa';
    } else if (!jogadorTemMesa && !mesaFoiEntregue) {
        gameDialogue = [...gameDialogueSemMesa];
        dialogueState = 'semmesa';
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

        if (dialogueState === 'parte2' && !mesaFoiEntregue) {
            mesaFoiEntregue = true;
            localStorage.setItem('mesaFoiEntregue', 'true');

            Inventario.remove('mesa');
            Inventario.remove('Lápis');
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
    // Pausa e reseta o som de voz da Livx
    if (livxVoiceSound) {
        livxVoiceSound.pause();
        livxVoiceSound.currentTime = 0;
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
        // Usa 'heloImg' do objeto de diálogo, mas atribui a 'livxDialogueImg'
        livxDialogueImg.src = line.heloImg;

        if (line.speaker === "Jogador") {
            ethanDialogueName.innerText = "Jogador";
            livxDialogueName.innerText = "";
            ethanDialogueImg.style.opacity = '1';
            livxDialogueImg.style.opacity = '0.5';
            dialogueText.style.borderColor = 'blue';
            // Pausa o som de voz da Livx se o jogador estiver falando
            if (livxVoiceSound) {
                livxVoiceSound.pause();
                livxVoiceSound.currentTime = 0;
            }
        } else if (line.speaker === "Livx") {
            ethanDialogueName.innerText = "";
            livxDialogueName.innerText = "Livx";
            ethanDialogueImg.style.opacity = '0.5';
            livxDialogueImg.style.opacity = '1';
            dialogueText.style.borderColor = 'purple';
            if (line.audio === "livxVoiceSound" && livxVoiceSound) {
                livxVoiceSound.currentTime = 0;
                livxVoiceSound.play().catch(e => console.error("Erro ao tocar áudio de voz da Livx:", e));
            }
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

    const playerAtLeftEdgeThreshold = 5;
    if (playerX <= playerAtLeftEdgeThreshold && !isInteracting) {
        doorSound.play();
        interaction.style.display = 'none';
        setTimeout(() => {
            window.location.href = 'corredor-2.html';
        }, 500);
        return;
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth; // Ajustado para ser mais preciso
    updatePlayerPosition();
    checkInteractionDisplay();
});

carregarEstado()
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
