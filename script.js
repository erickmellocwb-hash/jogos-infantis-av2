// ==================== JOGO 1: MATEMÁTICA - TABUADA ====================
let mathScore = 0;
let mathCurrent = 0;
let mathQuestions = [];

function generateMathQuestions() {
    const qs = [];
    for (let i = 0; i < 10; i++) {
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        const correct = a * b;
        let options = [correct];

        while (options.length < 4) {
            let wrong = correct + (Math.floor(Math.random() * 12) - 6);
            if (wrong <= 0) wrong = correct + Math.floor(Math.random() * 6) + 1;
            if (!options.includes(wrong)) options.push(wrong);
        }
        options = options.sort(() => Math.random() - 0.5);
        qs.push({ a, b, correct, options });
    }
    return qs;
}

function startMathGame() {
    mathScore = 0;
    mathCurrent = 0;
    mathQuestions = generateMathQuestions();
    document.getElementById('math-score').textContent = '0';
    document.getElementById('math-question-num').textContent = '1';
    showMathQuestion();
}

function showMathQuestion() {
    if (mathCurrent >= 10) {
        showMathFinal();
        return;
    }

    const q = mathQuestions[mathCurrent];
    document.getElementById('math-question-num').textContent = mathCurrent + 1;
    document.getElementById('math-question').textContent = `${q.a} × ${q.b} = ?`;
    document.getElementById('math-feedback').textContent = '';
    document.getElementById('math-feedback').className = 'feedback';

    const optsDiv = document.getElementById('math-options');
    optsDiv.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkMathAnswer(opt, q.correct, btn);
        optsDiv.appendChild(btn);
    });
}

function checkMathAnswer(selected, correct, btn) {
    const buttons = document.querySelectorAll('#math-options .option-btn');
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        mathScore += 10;
        btn.classList.add('correct');
        document.getElementById('math-feedback').textContent = '🎉 Acertou! +10 pontos';
        document.getElementById('math-feedback').className = 'feedback correct';
    } else {
        btn.classList.add('wrong');
        buttons.forEach(b => {
            if (parseInt(b.textContent) === correct) b.classList.add('correct');
        });
        document.getElementById('math-feedback').textContent = `😕 Errado! A resposta era ${correct}`;
        document.getElementById('math-feedback').className = 'feedback wrong';
    }

    document.getElementById('math-score').textContent = mathScore;

    setTimeout(() => {
        mathCurrent++;
        showMathQuestion();
    }, 1200);
}

function showMathFinal() {
    const box = document.getElementById('math-question-box');
    let message = '';
    if (mathScore >= 80) message = '🌟 Incrível! Você é um gênio da tabuada!';
    else if (mathScore >= 50) message = '👏 Muito bem! Continue praticando!';
    else message = '💪 Bom esforço! Treine mais um pouco!';

    box.innerHTML = `
        <div class="final-screen">
            <h2>${message}</h2>
            <div class="final-score">${mathScore} pontos</div>
            <p style="margin-bottom:20px;">Você acertou ${mathScore / 10} de 10 perguntas!</p>
            <button class="btn btn-success" onclick="location.reload()">Jogar Novamente</button>
        </div>
    `;
}

// ==================== JOGO 2: PORTUGUÊS - FORCA ====================
const hangmanWords = [
    { word: 'SUBSTANTIVO', hint: 'Classe de palavra que nomeia seres, objetos e sentimentos' },
    { word: 'ADJETIVO', hint: 'Palavra que caracteriza o substantivo' },
    { word: 'VERBO', hint: 'Palavra que indica ação, estado ou fenômeno' },
    { word: 'PRONOME', hint: 'Palavra que substitui ou acompanha o substantivo' },
    { word: 'ADVERBIO', hint: 'Palavra que modifica o verbo, adjetivo ou outro advérbio' },
    { word: 'SINONIMO', hint: 'Palavra com significado semelhante a outra' },
    { word: 'ANTONIMO', hint: 'Palavra com significado contrário a outra' },
    { word: 'SUJEITO', hint: 'Termo da oração sobre o qual se diz algo' },
    { word: 'PREDICADO', hint: 'Tudo o que se declara sobre o sujeito' },
    { word: 'PARAGRAFO', hint: 'Cada uma das partes de um texto' },
    { word: 'ORACAO', hint: 'Frase com verbo' },
    { word: 'PONTO', hint: 'Sinal de pontuação que indica fim de frase' },
    { word: 'VIRGULA', hint: 'Sinal de pontuação que separa elementos' },
    { word: 'ARTIGO', hint: 'Palavra que determina o substantivo (o, a, os, as...)' }
];

const hangmanStages = [
    `  +---+
  |   |
      |
      |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

let currentWord = '';
let currentHint = '';
let guessedLetters = [];
let wrongGuesses = 0;
let gameOver = false;

function startHangman() {
    const random = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    currentWord = random.word;
    currentHint = random.hint;
    guessedLetters = [];
    wrongGuesses = 0;
    gameOver = false;

    document.getElementById('hangman-hint').textContent = 'Dica: ' + currentHint;
    document.getElementById('hangman-message').textContent = '';
    document.getElementById('btn-new-hangman').style.display = 'none';

    updateHangmanDisplay();
    createLetterButtons();
}

function createLetterButtons() {
    const grid = document.getElementById('letters-grid');
    grid.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.onclick = () => guessLetter(letter, btn);
        grid.appendChild(btn);
    });
}

function guessLetter(letter, btn) {
    if (gameOver || guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    btn.disabled = true;

    if (currentWord.includes(letter)) {
        btn.classList.add('used-correct');
    } else {
        btn.classList.add('used-wrong');
        wrongGuesses++;
    }

    updateHangmanDisplay();
    checkHangmanWinLose();
}

function updateHangmanDisplay() {
    document.getElementById('hangman-drawing').textContent = hangmanStages[wrongGuesses];

    let display = '';
    for (let char of currentWord) {
        display += guessedLetters.includes(char) ? char : '_';
    }
    document.getElementById('hangman-word').textContent = display;
}

function checkHangmanWinLose() {
    const wordDisplay = document.getElementById('hangman-word').textContent;

    if (!wordDisplay.includes('_')) {
        gameOver = true;
        document.getElementById('hangman-message').textContent = '🎉 Parabéns! Você acertou!';
        document.getElementById('hangman-message').style.color = '#00b894';
        document.getElementById('btn-new-hangman').style.display = 'inline-block';
        disableAllLetters();
    } else if (wrongGuesses >= 6) {
        gameOver = true;
        document.getElementById('hangman-message').textContent = `😢 Game Over! A palavra era: ${currentWord}`;
        document.getElementById('hangman-message').style.color = '#e17055';
        document.getElementById('btn-new-hangman').style.display = 'inline-block';
        disableAllLetters();
    }
}

function disableAllLetters() {
    document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
}

// ==================== JOGO 3: CIÊNCIAS - SISTEMA SOLAR ====================
const scienceQuestions = [
    {
        emoji: '☀️',
        question: 'Qual é a estrela no centro do nosso Sistema Solar?',
        options: ['A Lua', 'O Sol', 'Marte', 'Júpiter'],
        correct: 1
    },
    {
        emoji: '🪐',
        question: 'Qual é o maior planeta do Sistema Solar?',
        options: ['Terra', 'Saturno', 'Júpiter', 'Netuno'],
        correct: 2
    },
    {
        emoji: '🌍',
        question: 'Qual planeta é conhecido como o "Planeta Azul"?',
        options: ['Marte', 'Vênus', 'Terra', 'Urano'],
        correct: 2
    },
    {
        emoji: '🔴',
        question: 'Qual planeta é conhecido como o "Planeta Vermelho"?',
        options: ['Júpiter', 'Marte', 'Mercúrio', 'Saturno'],
        correct: 1
    },
    {
        emoji: '🌙',
        question: 'Qual é o satélite natural da Terra?',
        options: ['Sol', 'Lua', 'Fobos', 'Titã'],
        correct: 1
    },
    {
        emoji: '☄️',
        question: 'O que é um cometa?',
        options: ['Uma estrela cadente', 'Um corpo gelado que orbita o Sol', 'Um planeta anão', 'Uma galáxia pequena'],
        correct: 1
    },
    {
        emoji: '🌌',
        question: 'Quantos planetas existem no Sistema Solar?',
        options: ['7', '8', '9', '10'],
        correct: 1
    },
    {
        emoji: '💫',
        question: 'Qual planeta tem anéis bem visíveis?',
        options: ['Júpiter', 'Marte', 'Saturno', 'Vênus'],
        correct: 2
    }
];

let scienceScore = 0;
let scienceCurrent = 0;
let scienceOrder = [];

function startScienceGame() {
    scienceScore = 0;
    scienceCurrent = 0;
    scienceOrder = [...Array(scienceQuestions.length).keys()].sort(() => Math.random() - 0.5);
    document.getElementById('science-score').textContent = '0';
    showScienceQuestion();
}

function showScienceQuestion() {
    if (scienceCurrent >= scienceQuestions.length) {
        showScienceFinal();
        return;
    }

    const q = scienceQuestions[scienceOrder[scienceCurrent]];
    document.getElementById('science-question-num').textContent = scienceCurrent + 1;
    document.getElementById('science-emoji').textContent = q.emoji;
    document.getElementById('science-question').textContent = q.question;
    document.getElementById('science-feedback').textContent = '';
    document.getElementById('science-feedback').className = 'feedback';

    const optsDiv = document.getElementById('science-options');
    optsDiv.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'science-option';
        btn.textContent = opt;
        btn.onclick = () => checkScienceAnswer(index, q.correct, btn);
        optsDiv.appendChild(btn);
    });
}

function checkScienceAnswer(selected, correct, btn) {
    const buttons = document.querySelectorAll('#science-options .science-option');
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        scienceScore += 10;
        btn.classList.add('correct');
        document.getElementById('science-feedback').textContent = '🚀 Acertou! +10 pontos';
        document.getElementById('science-feedback').className = 'feedback correct';
    } else {
        btn.classList.add('wrong');
        buttons[correct].classList.add('correct');
        document.getElementById('science-feedback').textContent = '💥 Quase! Continue tentando!';
        document.getElementById('science-feedback').className = 'feedback wrong';
    }

    document.getElementById('science-score').textContent = scienceScore;

    setTimeout(() => {
        scienceCurrent++;
        showScienceQuestion();
    }, 1300);
}

function showScienceFinal() {
    const box = document.getElementById('science-question-box');
    let message = '';
    if (scienceScore >= 70) message = '🌟 Você é um verdadeiro astronauta!';
    else if (scienceScore >= 40) message = '👏 Bom conhecimento espacial!';
    else message = '🛰️ Continue explorando o universo!';

    box.innerHTML = `
        <div class="final-screen">
            <h2>${message}</h2>
            <div class="final-score">${scienceScore} pontos</div>
            <p style="margin-bottom:20px;">Você acertou ${scienceScore / 10} de ${scienceQuestions.length} perguntas!</p>
            <button class="btn btn-success" onclick="location.reload()">Jogar Novamente</button>
        </div>
    `;
}

// ==================== JOGO 4: GEOGRAFIA ====================
const geoQuestions = [
    {
        emoji: '🇧🇷',
        question: 'Qual é a capital do Brasil?',
        options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
        correct: 2
    },
    {
        emoji: '🗺️',
        question: 'Qual é o maior estado do Brasil em território?',
        options: ['Minas Gerais', 'Amazonas', 'Bahia', 'Pará'],
        correct: 1
    },
    {
        emoji: '🏖️',
        question: 'Qual estado brasileiro é famoso pelas praias de Florianópolis?',
        options: ['Paraná', 'Rio Grande do Sul', 'Santa Catarina', 'São Paulo'],
        correct: 2
    },
    {
        emoji: '🌍',
        question: 'Em qual continente fica o Brasil?',
        options: ['África', 'Ásia', 'América do Sul', 'Europa'],
        correct: 2
    },
    {
        emoji: '🏛️',
        question: 'Qual é a capital de Minas Gerais?',
        options: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem'],
        correct: 0
    },
    {
        emoji: '🌊',
        question: 'Qual oceano banha a costa brasileira?',
        options: ['Pacífico', 'Índico', 'Atlântico', 'Ártico'],
        correct: 2
    },
    {
        emoji: '🌳',
        question: 'Qual bioma brasileiro é conhecido como "pulmão do mundo"?',
        options: ['Cerrado', 'Mata Atlântica', 'Amazônia', 'Pampa'],
        correct: 2
    },
    {
        emoji: '📍',
        question: 'Qual é a capital do estado de São Paulo?',
        options: ['Campinas', 'Santos', 'São Paulo', 'Ribeirão Preto'],
        correct: 2
    }
];

let geoScore = 0;
let geoCurrent = 0;
let geoOrder = [];

function startGeoGame() {
    geoScore = 0;
    geoCurrent = 0;
    geoOrder = [...Array(geoQuestions.length).keys()].sort(() => Math.random() - 0.5);
    document.getElementById('geo-score').textContent = '0';
    showGeoQuestion();
}

function showGeoQuestion() {
    if (geoCurrent >= geoQuestions.length) {
        showGeoFinal();
        return;
    }

    const q = geoQuestions[geoOrder[geoCurrent]];
    document.getElementById('geo-question-num').textContent = geoCurrent + 1;
    document.getElementById('geo-emoji').textContent = q.emoji;
    document.getElementById('geo-question').textContent = q.question;
    document.getElementById('geo-feedback').textContent = '';
    document.getElementById('geo-feedback').className = 'feedback';

    const optsDiv = document.getElementById('geo-options');
    optsDiv.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'geo-option';
        btn.textContent = opt;
        btn.onclick = () => checkGeoAnswer(index, q.correct, btn);
        optsDiv.appendChild(btn);
    });
}

function checkGeoAnswer(selected, correct, btn) {
    const buttons = document.querySelectorAll('#geo-options .geo-option');
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        geoScore += 10;
        btn.classList.add('correct');
        document.getElementById('geo-feedback').textContent = '🗺️ Acertou! +10 pontos';
        document.getElementById('geo-feedback').className = 'feedback correct';
    } else {
        btn.classList.add('wrong');
        buttons[correct].classList.add('correct');
        document.getElementById('geo-feedback').textContent = '📍 Quase! Observe o mapa mental!';
        document.getElementById('geo-feedback').className = 'feedback wrong';
    }

    document.getElementById('geo-score').textContent = geoScore;

    setTimeout(() => {
        geoCurrent++;
        showGeoQuestion();
    }, 1300);
}

function showGeoFinal() {
    const box = document.getElementById('geo-question-box');
    let message = '';
    if (geoScore >= 70) message = '🌟 Você conhece bem o Brasil!';
    else if (geoScore >= 40) message = '👏 Bom conhecimento geográfico!';
    else message = '🧭 Continue explorando o mapa!';

    box.innerHTML = `
        <div class="final-screen">
            <h2>${message}</h2>
            <div class="final-score">${geoScore} pontos</div>
            <p style="margin-bottom:20px;">Você acertou ${geoScore / 10} de ${geoQuestions.length} perguntas!</p>
            <button class="btn btn-success" onclick="location.reload()">Jogar Novamente</button>
        </div>
    `;
}

// ==================== JOGO 5: HISTÓRIA ====================
const histQuestions = [
    {
        emoji: '📜',
        question: 'Em que ano o Brasil foi "descoberto" pelos portugueses?',
        options: ['1492', '1500', '1822', '1889'],
        correct: 1
    },
    {
        emoji: '🇧🇷',
        question: 'Quem gritou "Independência ou Morte!" às margens do Ipiranga?',
        options: ['Dom João VI', 'Dom Pedro I', 'Tiradentes', 'Getúlio Vargas'],
        correct: 1
    },
    {
        emoji: '📅',
        question: 'Em que ano foi proclamada a Independência do Brasil?',
        options: ['1808', '1822', '1889', '1500'],
        correct: 1
    },
    {
        emoji: '👑',
        question: 'Quem foi o primeiro imperador do Brasil?',
        options: ['Dom Pedro II', 'Dom João VI', 'Dom Pedro I', 'Deodoro da Fonseca'],
        correct: 2
    },
    {
        emoji: '⚔️',
        question: 'Quem foi o líder da Inconfidência Mineira?',
        options: ['Tiradentes', 'Zumbi dos Palmares', 'Dom Pedro I', 'José Bonifácio'],
        correct: 0
    },
    {
        emoji: '🏛️',
        question: 'Em que ano foi proclamada a República no Brasil?',
        options: ['1822', '1889', '1500', '1930'],
        correct: 1
    },
    {
        emoji: '🌴',
        question: 'Quem foi Zumbi dos Palmares?',
        options: ['Um imperador', 'Líder de um quilombo', 'Um bandeirante', 'Um padre jesuíta'],
        correct: 1
    },
    {
        emoji: '📚',
        question: 'Qual foi a primeira capital do Brasil?',
        options: ['Rio de Janeiro', 'Brasília', 'Salvador', 'São Paulo'],
        correct: 2
    }
];

let histScore = 0;
let histCurrent = 0;
let histOrder = [];

function startHistGame() {
    histScore = 0;
    histCurrent = 0;
    histOrder = [...Array(histQuestions.length).keys()].sort(() => Math.random() - 0.5);
    document.getElementById('hist-score').textContent = '0';
    showHistQuestion();
}

function showHistQuestion() {
    if (histCurrent >= histQuestions.length) {
        showHistFinal();
        return;
    }

    const q = histQuestions[histOrder[histCurrent]];
    document.getElementById('hist-question-num').textContent = histCurrent + 1;
    document.getElementById('hist-emoji').textContent = q.emoji;
    document.getElementById('hist-question').textContent = q.question;
    document.getElementById('hist-feedback').textContent = '';
    document.getElementById('hist-feedback').className = 'feedback';

    const optsDiv = document.getElementById('hist-options');
    optsDiv.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'hist-option';
        btn.textContent = opt;
        btn.onclick = () => checkHistAnswer(index, q.correct, btn);
        optsDiv.appendChild(btn);
    });
}

function checkHistAnswer(selected, correct, btn) {
    const buttons = document.querySelectorAll('#hist-options .hist-option');
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        histScore += 10;
        btn.classList.add('correct');
        document.getElementById('hist-feedback').textContent = '📜 Acertou! +10 pontos';
        document.getElementById('hist-feedback').className = 'feedback correct';
    } else {
        btn.classList.add('wrong');
        buttons[correct].classList.add('correct');
        document.getElementById('hist-feedback').textContent = '⏳ Quase! Revise a história!';
        document.getElementById('hist-feedback').className = 'feedback wrong';
    }

    document.getElementById('hist-score').textContent = histScore;

    setTimeout(() => {
        histCurrent++;
        showHistQuestion();
    }, 1300);
}

function showHistFinal() {
    const box = document.getElementById('hist-question-box');
    let message = '';
    if (histScore >= 70) message = '🌟 Você é um grande historiador!';
    else if (histScore >= 40) message = '👏 Bom conhecimento histórico!';
    else message = '📖 Continue estudando o passado!';

    box.innerHTML = `
        <div class="final-screen">
            <h2>${message}</h2>
            <div class="final-score">${histScore} pontos</div>
            <p style="margin-bottom:20px;">Você acertou ${histScore / 10} de ${histQuestions.length} perguntas!</p>
            <button class="btn btn-success" onclick="location.reload()">Jogar Novamente</button>
        </div>
    `;
}
