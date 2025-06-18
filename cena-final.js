const dialogueScreen = document.getElementById('dialogueScreen');
const dialogueMessage = document.getElementById('dialogueMessage');
const dialogueIndicator = document.getElementById('dialogueIndicator');

const ethanDialogueDiv = document.getElementById('ethanDialogue');
const ethanDialogueImg = document.getElementById('ethanDialogueImg');
const ethanDialogueName = document.getElementById('ethanDialogueName');

const medicoDialogueDiv = document.getElementById('medicoDialogue');
const medicoDialogueImg = document.getElementById('medicoDialogueImg');
const medicoDialogueName = document.getElementById('medicoDialogueName');

const medicoVoiceSound = new Audio('seucaminho/para/medicoVoiceSound.mp3');

const finalImage = document.getElementById('finalImage');



const introVideoContainer = document.getElementById('introVideoContainer');
const introVideo = document.getElementById('introVideo');
const outroVideoContainer = document.getElementById('outroVideoContainer');
const outroVideo = document.getElementById('outroVideo');
const fragmentedText = document.getElementById('fragmentedText'); // Get the text element

let currentDialogueIndex = 0;
let isTyping = false;
let typingTimeout;
let dialogueAdvanceTimeoutId;
let isInteracting = false;

const gameDialogueParte1 = [
    {
        speaker: "Médica",
        text: "Paciente 62. Processo de reabilitação de memória em andamento. Status: dentro do ciclo de controle.",
        ethanImg: "personagens/ethan-hospital-suando.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "O nível de resistência está além do esperado. Vamos precisar ajustar a abordagem.",
        ethanImg: "personagens/ethan-hospital-suando.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Jogador",
        text: "Ethan...Meu nome... é Ethan. Eu me lembro agora... Eu sou... Ethan!",
        ethanImg: "personagens/ethan-hospital-suando.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Ah, Ethan. Finalmente, você se lembrou.",
        ethanImg: "personagens/ethan-hospital-suando.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Eu... Eu sou Ethan. E o que está acontecendo aqui? O que é tudo isso?",
        ethanImg: "personagens/ethan-hospital-suando.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Você e os outros... Duda, Heloísa, Livx e Madu... são todos parte de um experimento. Um estudo sobre comportamento humano e memória. A simulação que você está vivendo foi projetada para observar como pessoas reais reagem quando suas memórias são manipuladas.",
        ethanImg: "personagens/ethan-hospital-chorando.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Duda, Heloísa, Livx e Madu... Elas são parte disso também?",
        ethanImg: "personagens/ethan-hospital-chorando.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Sim. Elas são como você, Ethan. Cobaias. Mas, ao contrário de você, elas ainda não começaram a entender. Elas estão em diferentes estágios do processo. A memória delas está mais fragmentada, mas em breve, elas também perceberão.",
        ethanImg: "personagens/ethan-hospital-suando.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Então tudo o que vivi... tudo o que senti... foi uma mentira?",
        ethanImg: "personagens/ethan-hospital-chorando.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Não é uma mentira. É um estudo. Duda, Heloísa, Livx, Madu, você... todos vocês foram selecionados para esta simulação. O que fizeram, quem conheceram... tudo isso foi planejado para observar como suas memórias podem ser manipuladas e como suas emoções podem ser alteradas.",
        ethanImg: "personagens/ethan-hospital-suando.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Isso é... eu não posso aceitar. Eu não sou só uma cobaia!",
        ethanImg: "personagens/ethan-hospital-bravo.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Você ainda não entende, Ethan. Esse é o objetivo. Você não tem controle. Nenhum de vocês tem.",
        ethanImg: "personagens/ethan-hospital-bravo.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Duda, Heloísa, Livx e Madu... elas... elas estão presas também, não estão? Elas... elas sabem agora, não sabem?",
        ethanImg: "personagens/ethan-hospital-chorando.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Sim, eventualmente, elas começarão a entender o que são. Mas por enquanto, estão focadas em suas próprias lembranças, seus próprios objetivos dentro da simulação. São distrações necessárias, afinal, como poderiam reagir sem elas?",
        ethanImg: "personagens/ethan-hospital-chorando.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Eu não sou parte de seus malditos testes!",
        ethanImg: "personagens/ethan-hospital-bravo.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Você nunca foi livre, Ethan. E nem as outras cobaias. O ciclo continuará. O que você sente, o que você lembra... tudo é parte do estudo. E você não pode fugir.",
        ethanImg: "personagens/ethan-hospital-bravo.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
    {
        speaker: "Jogador",
        text: "Eu vou acabar com tudo isso! Não vou ser uma cobaia para vocês!",
        ethanImg: "personagens/ethan-hospital-bravo.png",
        medicoImg: "personagens/medico.png",
        audio: ""
    },
    {
        speaker: "Médica",
        text: "Não importa o que você faça. O experimento está além de você... além de mim... além de tudo que conhecemos ou ousamos sonhar. Isso não é só um teste. É o maior experimento já concebido, isso é…",
        ethanImg: "personagens/ethan-hospital-bravo.png",
        medicoImg: "personagens/medico.png",
        audio: "medicoVoiceSound"
    },
];

function typeMessage(message) {
    isTyping = true;
    dialogueMessage.textContent = '';
    dialogueIndicator.style.display = 'none';
    let i = 0;
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    function typeChar() {
        if (i < message.length) {
            dialogueMessage.textContent += message.charAt(i);
            i++;
            typingTimeout = setTimeout(typeChar, 30);
        } else {
            isTyping = false;
            dialogueIndicator.style.display = 'block';
        }
    }
    typeChar();
}

function skipTypingAnimation() {
    clearTimeout(typingTimeout);
    const currentDialogue = gameDialogueParte1[currentDialogueIndex];
    dialogueMessage.textContent = `${currentDialogue.speaker}: ${currentDialogue.text}`;
    isTyping = false;
    dialogueIndicator.style.display = 'block';
}

function displayDialogue(index) {
    if (index < gameDialogueParte1.length) {
        const currentDialogue = gameDialogueParte1[index];

        ethanDialogueImg.classList.remove('speaking-character');
        medicoDialogueImg.classList.remove('speaking-character');

        ethanDialogueImg.src = currentDialogue.ethanImg;
        medicoDialogueImg.src = currentDialogue.medicoImg;

        if (currentDialogue.speaker === "Jogador") {
            ethanDialogueImg.classList.add('speaking-character');
            dialogueMessage.style.borderColor = 'blue';
            if (medicoVoiceSound && !medicoVoiceSound.paused) {
                medicoVoiceSound.pause();
                medicoVoiceSound.currentTime = 0;
            }
        } else if (currentDialogue.speaker === "Médica") {
            medicoDialogueImg.classList.add('speaking-character');
            dialogueMessage.style.borderColor = 'purple';
            // Check if audio is available and ready before attempting to play
            if (currentDialogue.audio === "medicoVoiceSound" && medicoVoiceSound && medicoVoiceSound.readyState >= 2) {
                medicoVoiceSound.currentTime = 0;
                medicoVoiceSound.play().catch(e => console.error("Audio playback error:", e));
            }
        } else {
            dialogueMessage.style.borderColor = 'white';
            if (medicoVoiceSound && !medicoVoiceSound.paused) {
                medicoVoiceSound.pause();
                medicoVoiceSound.currentTime = 0;
            }
        }

        const fullMessage = `${currentDialogue.speaker}: ${currentDialogue.text}`;
        typeMessage(fullMessage);
        currentDialogueIndex = index;
    } else {
        endInteraction();
    }
}

function advanceDialogue() {
    if (dialogueAdvanceTimeoutId) {
        clearTimeout(dialogueAdvanceTimeoutId);
    }
    displayDialogue(currentDialogueIndex + 1);
}

function startDialogue() {
    introVideoContainer.style.display = 'none';
    dialogueScreen.style.display = 'flex';
    isInteracting = true;
    displayDialogue(0);
}

function endInteraction() {
    if (dialogueAdvanceTimeoutId) {
        clearTimeout(dialogueAdvanceTimeoutId);
    }
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    dialogueScreen.style.display = 'none';
    isInteracting = false;
    currentDialogueIndex = 0;
    ethanDialogueImg.src = "";
    medicoDialogueImg.src = "";
    ethanDialogueImg.classList.remove('speaking-character');
    medicoDialogueImg.classList.remove('speaking-character');
    dialogueMessage.style.borderColor = 'white';

    if (medicoVoiceSound && !medicoVoiceSound.paused) {
        medicoVoiceSound.pause();
        medicoVoiceSound.currentTime = 0;
    }

    outroVideoContainer.style.display = 'flex';
    outroVideo.muted = true;
    outroVideo.playsInline = true;
    fragmentedText.style.display = 'block'; // Show the text when the video starts
    const finalImage = document.getElementById('finalImage');
finalImage.style.display = 'none';

outroVideo.play().then(() => {

setTimeout(() => {
    if (!outroVideo.paused) {
        finalImage.style.display = 'block';
    }
}, 5000); // 5000ms = 5 seconds
})
}

document.addEventListener('keydown', (e) => {
    if (isInteracting) {
        if (e.key === 'E' || e.key === ' ' || e.key === 'Enter' || e.key === 'e') {
            if (isTyping) {
                skipTypingAnimation();
            } else {
                advanceDialogue();
            }
        } else if (e.key === 'Escape') {
            endInteraction();
        }
    }
});

introVideo.addEventListener('ended', () => {
    startDialogue();
});

// No need for outroVideo 'ended' event listener if it's looping indefinitely
// outroVideo.addEventListener('ended', () => {
//     outroVideoContainer.style.display = 'none';
//     fragmentedText.style.display = 'none'; // Hide the text when the video ends
// });

window.onload = () => {
    introVideoContainer.style.display = 'flex';
    introVideo.muted = true;
    introVideo.playsInline = true;

    introVideo.play().catch(error => {
        console.error("Autoplay of intro video blocked:", error);
        // If intro video can't autoplay, start dialogue directly
        startDialogue();
    });
    dialogueScreen.style.display = 'none';
    outroVideoContainer.style.display = 'none';
    fragmentedText.style.display = 'none'; // Ensure text is hidden on load
};
