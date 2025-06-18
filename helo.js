const player = document.getElementById('player');
const Helo = document.getElementById('Helo');
const interaction = document.getElementById('interaction');
const dialogueScreen = document.getElementById('dialogueScreen');
const dialogueMessage = document.getElementById('dialogueMessage');
const ethanDialogueImg = document.getElementById('ethanDialogueImg');
const heloDialogueImg = document.getElementById('heloDialogueImg');
const ethanDialogueName = document.getElementById('ethanDialogueName');
const heloDialogueName = document.getElementById('heloDialogueName');
const dialogueIndicator = document.getElementById('dialogueIndicator');
const stepSound = document.getElementById('stepSound');
const doorSound = document.getElementById('doorSound');
const heloVoiceSound = document.getElementById('heloVoiceSound');

let playerX = 50;
let playerY = 250;
let isMoving = false;
let facingRight = true;
const moveSpeed = 5;
let isInteracting = false;
let currentDialogueIndex = 0;
let isTyping = false;
let typeIntervalId;
let gameDialogue = [];
let parte1FoiMostrada = false;
let colarFoiEntregue = false;

let playerX_min_screen = 50;
let playerX_max_screen = window.innerWidth - player.offsetWidth - 50;

function carregarEstado() {
    parte1FoiMostrada = localStorage.getItem('parte1FoiMostrada') === 'true';
    colarFoiEntregue = localStorage.getItem('colarFoiEntregue') === 'true';
}

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateBackgroundPosition() {

}

function verificarProximidadeDaPorta() {

    const doorX = 1;
    const doorProximityThreshold = 100;

    return Math.abs(playerX - doorX) < doorProximityThreshold;
}


function verificarProximidadeDaHelo() {
    const playerRect = player.getBoundingClientRect();
    const heloRect = Helo.getBoundingClientRect();

    const proximityThreshold = 1; // ajuste esse valor se necessário

    return (
        playerRect.right >= heloRect.left - proximityThreshold &&
        playerRect.left <= heloRect.right + proximityThreshold
    );
}


function checkInteractionDisplay() {
    if (isMoving || isInteracting) {
        interaction.style.display = 'none';
        return;
    }

    if (verificarProximidadeDaHelo()) {
        interaction.innerText = 'Pressione E para interagir com Helo';
        interaction.style.display = 'block';
    } else if (verificarProximidadeDaPorta() && playerX < 5) { // Only show 'E' for door if player is not at the very edge (for automatic transition)
        interaction.innerText = 'Pressione E para sair';
        interaction.style.display = 'block';
    } else {
        interaction.style.display = 'none';
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
            if (!isInteracting) {
                if (verificarProximidadeDaHelo()) {
                    startInteraction();
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

document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        // Se a animação de digitação está ativa, pula para o final da frase
        if (isTyping) {
            skipTypingAnimation();
            return;
        }

        // Se a animação de digitação não está ativa, avança para a próxima linha
        if (e.key === 'E' || e.key === ' ' || e.key === 'Enter' || e.key === 'e') { // Avance diálogo com E, Espaço ou Enter
            advanceDialogue();
        } else if (e.key === 'Escape') {
            endInteraction();
        }
        return;
    }
})




const gameDialogueParte1 = [
    {
        speaker: "Jogador",
        text: "Você está bem? O que está fazendo sozinha aqui?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/helo-encontrada.png",
        audio: ""
    },
    {
        speaker: "Heloísa",
        text: "Eu… estou esperando. Disseram que minha família viria me buscar... Mas já faz um tempo. E nada. Nada acontece.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-desconfortavel.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Você... não parece daqui. Se lembra do seu nome?",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-desconfortavel.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Eu... não lembro de nada.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: ""
    },
    {
        speaker: "Heloísa",
        text: "Então, somos dois ferrados, né? Perdidos em algum lugar que não faz sentido.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Mas olha, talvez... você possa me ajudar. Eu perdi meu colar. O colar que meus pais me deram quando eu era criança, está há gerações em minha família, e a japinha aqui perdeu. Tá por aqui, em algum lugar.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Se encontrar, eu te conto o que sei sobre tudo isso...",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Ou sobre o que aconteceu. Se ainda soubermos o que aconteceu. Porque, sinceramente, nada faz sentido mais. E tudo... tudo parece tão... falso.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-desconfortavel.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "O que você quer dizer com 'falso'?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/helo-suando-de-nervoso.png",
        audio: ""
    },
    {
        speaker: "Heloísa",
        text: "Eu não sei, caramba!",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/helo-suando-de-nervoso.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Só sinto que tem algo nos observando o tempo todo. Como se... tudo fosse só uma mentira, uma ilusão, sabe?",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/helo-suando-de-nervoso.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Eu devia parar de pensar nisso. Vai ver é só... paranoia minha.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Esquece. Enfim, vai me ajudar ou não, garoto?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: "heloVoiceSound"
    }];

const gameDialogueParte2 = [
    {
        speaker: "Jogador",
        text: "Achei isso. É seu?",
        ethanImg: "personagens/ethan-sorrindo.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: ""
    },
    {
        speaker: "Heloísa",
        text: "É... é ele.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/helo-sorrindo.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Você encontrou mesmo. Beleza, você cumpriu sua parte.",
        ethanImg: "personagens/ethan-sorrindo-muito.png",
        heloImg: "personagens/helo-sorrindo.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Eu não sei o que está acontecendo, tá? Eu... lembro de outras coisas. Coisas que não fazem mais sentido. Às vezes, tenho flashes... flashes de um lugar diferente.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-suando-de-nervoso.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Não é isso daqui. É um lugar com máquinas, tecnologia e gente me observando o tempo todo.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/helo-suando-de-nervoso.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Mas, ah... não faz sentido nenhum. Tudo... tudo virou uma grande mentira, e acredite, eu odeio mentiras.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-desconfortavel.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Eu não sei o que é real mais, entende? Se você souber, me diz. Porque eu tô começando a duvidar até do que eu mesma vejo.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-desconfortavel.png",
        audio: "heloVoiceSound"
    },
];
const gameDialogueSemColar = [
    {
        speaker: "Heloísa",
        text: "Sério mesmo? Foi lá fora, voltou de mãos abanando e achou que merecia um troféu por tentar? Bravo, campeão.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-suando-de-nervoso.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "A gente teve um trato, lembra? Colar primeiro, respostas depois.",
        ethanImg: "personagens/ethan-suando.png",
        heloImg: "personagens/helo-desconfortavel.png",
        audio: "heloVoiceSound"
    },
    {
        speaker: "Heloísa",
        text: "Se quiser fazer pose de herói, vai ter que se esforçar mais.",
        ethanImg: "personagens/ethan-desinteressado.png",
        heloImg: "personagens/helo-sorrindo-de-lado.png",
        audio: "heloVoiceSound"
    }
];

function startInteraction() {
    isInteracting = true;
    dialogueScreen.style.display = 'flex';
    currentDialogueIndex = 0;

    const jogadorTemColar = Inventario.has('Colar perdido');
    const jogadorTemCerebro1 = Inventario.has('cerebro1');

    if (!parte1FoiMostrada) {
        gameDialogue = [...gameDialogueParte1];
        dialogueState = 'parte1';
    } else if (jogadorTemColar && !colarFoiEntregue) {
        gameDialogue = [...gameDialogueParte2];
        dialogueState = 'parte2';
        Inventario.add('cerebro1');
    } else if (jogadorTemCerebro1) {
        gameDialogue = [
            {
                speaker: "Heloísa",
                text: "Já te disse tudo que sei. O resto, você vai descobrir... ou não.",
                ethanImg: "personagens/ethan-desinteressado.png",
                heloImg: "personagens/helo-sorrindo-de-lado.png",
                audio: "heloVoiceSound"
            }
        ];
        dialogueState = 'poscolar';
    } else if (!jogadorTemColar && !colarFoiEntregue) {
        gameDialogue = [...gameDialogueSemColar];
        dialogueState = 'semcolar';
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

        if (dialogueState === 'parte2' && !colarFoiEntregue) {
            colarFoiEntregue = true;
            localStorage.setItem('colarFoiEntregue', 'true');

            Inventario.remove('Colar perdido');
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
    heloVoiceSound.pause();
    heloVoiceSound.currentTime = 0;
    checkInteractionDisplay();
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

        // Define a imagem do Ethan e da Helo no diálogo
        ethanDialogueImg.src = line.ethanImg;
        heloDialogueImg.src = line.heloImg;

        if (line.speaker === "Jogador") {
            ethanDialogueName.innerText = "Jogador";
            heloDialogueName.innerText = "";
            ethanDialogueImg.style.opacity = '1';
            heloDialogueImg.style.opacity = '0.5';
            dialogueMessage.style.borderColor = 'blue';    // certo
            heloVoiceSound.pause();
            heloVoiceSound.currentTime = 0;
        } else if (line.speaker === "Heloísa") {
            ethanDialogueName.innerText = "";
            heloDialogueName.innerText = "Heloísa";
            ethanDialogueImg.style.opacity = '0.5';
            heloDialogueImg.style.opacity = '1';
            dialogueMessage.style.borderColor = 'purple';  // certo
            if (line.audio === "heloVoiceSound" && heloVoiceSound) {
                heloVoiceSound.currentTime = 0;
                heloVoiceSound.play();
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

    const line = gameDialogue[currentDialogueIndex];
    dialogueMessage.innerHTML = line.text;
    dialogueIndicator.style.display = 'block';

    // Libera para o próximo avanço
    isTyping = false;
    typeIntervalId = null; // limpa referência

}




// --- Inicialização e Loop Principal ---
function gameLoop() {
    updatePlayerPosition();
    checkInteractionDisplay();

    // New logic: Check if player is at the far left edge of the screen
    // and automatically transition to 'corredor-1.html'
    const playerAtLeftEdgeThreshold = 5; // Adjust this value as needed, 0 means pixel-perfect
    if (playerX <= playerAtLeftEdgeThreshold && !isInteracting) {
        doorSound.play();
        interaction.style.display = 'none';
        setTimeout(() => {
            window.location.href = 'corredor-1.html';
        }, 500); // Short delay for sound to play and smooth transition
        return; // Stop the current game loop iteration to prevent further movement or checks
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', () => {
    playerX_max_screen = window.innerWidth - player.offsetWidth - 50;
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
    // Assuming 'Inventario' is defined and works correctly
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
