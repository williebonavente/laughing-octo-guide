import { TypingStats } from './TypingLogic.js';
import { words } from './WordList.js'; 

let stats = new TypingStats();

// Separate this into another module
let time = 60;
let timerInterval = 0;
let timeLeft = time;
let timerActive = true;
let currentWord = 0; 
let currentInput = "";
let lastCaretLine = getWordLine(0);
let userInputs = [];

console.log(stats.start());

function setTime(t, event) {
    time = t;
    timeLeft = t;
    document.getElementById('timer').textContent = formatTime(t);
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));
    if (event) event.target.classList.add('selected');
    resetPractice();
}

function getWordLine(wordIndex) {
    const wordSpan = document.getElementById(`word${wordIndex}`);
    if (!wordSpan) return -1;
    return wordSpan.offsetTop;
}

function checkCaretLineChange() {
    const currLine = getWordLine(currentWord);
    if (currLine !== -1 && currLine !== lastCaretLine) {
        // Caret moved to a new line
        const caret = document.querySelector('.caret');
        if (caret) {
            caret.classList.add('new-line');
            setTimeout(() => caret.classList.remove('new-line'), 200);
        }
        lastCaretLine = currLine;
        // Optionally, trigger any other logic here
        console.log(lastCaretLine);
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerActive = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerActive = false;
            disableTyping();
             // Redirect this into another module 
             document.getElementById('timer').textContent = "Time's up!";
            showResults();
        }
    }, 1000);
}
function isNewVisualLine(currentWord) {
    if (currentWord === 0) return false;
    const prevWordSpan = document.getElementById(`word${currentWord - 1}`);
    const currWordSpan = document.getElementById(`word${currentWord}`);
    if (!prevWordSpan || !currWordSpan) return false;
    return prevWordSpan.offsetTop !== currWordSpan.offsetTop;
}

function updateTimer() {
    const timer = document.getElementById('timer');
    timer.textContent = formatTime(timeLeft);
    if (timeLeft <= 10) {
        timer.classList.add('warning');
    } else {
        timer.classList.remove('warning');
    }
}
function initialRenderWords() {
    const wordsDiv = document.getElementById('words');
    wordsDiv.innerHTML = words.map((word, i) =>
        `<span class="word" id="word${i}">${word}</span>${i < words.length - 1 ? ' ' : ''}`
    ).join('');
}

function updateCurrentWordDisplay() {
    const wordSpan = document.getElementById(`word${currentWord}`);
    if (!wordSpan) return;

    const word = words[currentWord];
    let html = '';

    let caretInserted = false;

    for (let j = 0; j < word.length; j++) {
        let char = word[j];
        let charClass = '';

        if (j < currentInput.length) {
            charClass = currentInput[j] === char ? 'correct-char' : 'incorrect-char';
            html += `<span class="char ${charClass}">${char}</span>`;
        } else {
            // insert caret just before the first untyped character
            if (!caretInserted) {
                html += `<span class="caret" aria-live="polite" aria-label="Caret"></span>`;
                caretInserted = true;
            }
            html += `<span class="char">${char}</span>`;
        }
    }

    // If word is completely typed, caret goes at the end
    if (!caretInserted) {
        html += `<span class="caret" aria-live="polite" aria-label="Caret"></span>`;
    }

    wordSpan.innerHTML = html;
    wordSpan.classList.add('current');
}

function updateWordClasses() {
    for (let i = 0; i < words.length; i++) {
        const wordSpan = document.getElementById(`word${i}`);
        if (!wordSpan) continue;
        wordSpan.classList.remove('current', 'correct');
        if (i < currentWord) wordSpan.classList.add('correct');
        if (i === currentWord) wordSpan.classList.add('current');
    }
}
function updatePreviousWordDisplay(wordIndex) {
    const wordSpan = document.getElementById(`word${wordIndex}`);
    if (!wordSpan) return;
    const input = userInputs[wordIndex] || "";
    let wordHtml = '';
    for (let j = 0; j < words[wordIndex].length; j++) {
        let charClass = '';
        if (j < input.length) {
            charClass = input[j] === words[wordIndex][j] ? 'correct-char' : 'incorrect-char';
        }
        wordHtml += `<span class="char ${charClass}">${words[wordIndex][j]}</span>`;
    }
    wordSpan.innerHTML = wordHtml;
}

function updateCurrentWordClass(isCorrect) {
    if (currentWord >= words.length) return; // Prevent out-of-bounds access
    const wordSpan = document.getElementById(`word${currentWord}`);
    if (!wordSpan) return; // Defensive: element not found
    wordSpan.classList.remove('incorrect', 'correct');
    if (isCorrect === true) wordSpan.classList.add('correct');
    else if (isCorrect === false) wordSpan.classList.add('incorrect');
}
function handleKeydown(e) {
    if (!timerActive) return;
    if (currentWord >= words.length) {
        disableTyping();
        clearInterval(timerInterval);
        document.getElementById('timer').textContent = "Completed";
        // Redirect into the result page 
        return;
    }
    if (e.key === ' ') {
        e.preventDefault();
        stats.registerInput(currentInput, words[currentWord]);
        console.log(stats.getElapsedMinutes());
        console.log('WPM: ', stats.getWPM());
        console.log('CPM:', stats.getCPM());
        console.log('Accuracy: ', stats.getAccuracy());
        if (currentInput.trim() === "") {
            return;
        }
        userInputs[currentWord] = currentInput;
        if (currentInput.trim() === words[currentWord].trim()) {
            updateCurrentWordClass(true);
        } else {
            updateCurrentWordClass(false);
        }

        for (let i = 0; i <= currentWord; i++) {
            updatePreviousWordDisplay(i);
        }
        currentInput = "";
        currentWord++;
        updateWordClasses();
        updateCurrentWordDisplay();
        checkCaretLineChange();

        if (currentWord >= words.length) {
            disableTyping();
            clearInterval(timerInterval);
            document.getElementById('timer').textContent = "Completed";
            showResults();
            return;
        }

        if (isNewVisualLine(currentWord)) {
            const caret = document.querySelector('.caret');
            if (caret) {
                caret.classList.add('new-line');
                setTimeout(() => caret.classList.remove('new-line'), 200);
            }
            console.log(`Moved to a new visual line at word index: ${currentWord}`);

        }

        const prevLine = getWordLine(currentWord - 1);
        const currLine = getWordLine(currentWord);
        if (prevLine !== -1 && currLine !== -1 && prevLine !== currLine) {
            const caret = document.querySelector('.caret');
            if (caret) {
                caret.classList.add('new-line');
                setTimeout(() => caret.classList.remove('new-line'), 200);
            }
            console.log(`Caret moved to a new line at word index: ${currentWord}`);
        }

    } else if (e.key.length === 1) {
        currentInput += e.key;
        //stats.registerInput(currentInput, words[currentWord]);
        updateWordClasses();
        checkCaretLineChange();
        updateCurrentWordDisplay();
    } else if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        updateWordClasses();
        updateCurrentWordDisplay();
        logCaretPosition();
        checkCaretLineChange();
        stats.recordBackspace && stats.recordBackspace();
    }
}

let typingEnabled = false;

function enableTyping(){
    if (!typingEnabled) {
        document.addEventListener('keydown', handleKeydown);
        typingEnabled = true;
    }
}

function disableTyping() {
    if (typingEnabled) {
        document.removeEventListener('keydown', handleKeydown);
        typingEnabled = false;
    }
}

function resetPractice() {
    clearInterval(timerInterval);
    currentWord = 0;
    currentInput = "";
    stats.reset();
    userInputs = [];
    initialRenderWords();
    updateWordClasses();
    updateCurrentWordDisplay();
    updateTimer();
    disableTyping();
    enableTyping(); 
    setTimeout(() => {
        stats.start();
        startTimer();
    }, 500);
}


// Showing stats
function showResults() {
    const wpm = stats.getWPM();
    const cpm = stats.getCPM();
    const accuracy = stats.getAccuracy();
    // render this on like vim focus mode
    alert(`WPM: ${wpm}\nCPM: ${cpm}\nAccuracy: ${accuracy}`);
}


window.onload = function () {
    //renderWords();
    const typingInput = document.getElementById('typingInput');
    typingInput.addEventListener('input', (e) => {
        currentInput = e.target.value;
        caretIndex = typingInput.selectionStart;
        updateWordClasses();
        updateCurrentWordDisplay();

    });

    typingInput.addEventListener('keydown', (e) => {
        // Update caretIndex on navigation keys (arrows, backpsace etc.)
        setTimeout(() => {
            caretIndex = typingInput.selectionStart;
            updateCurrentWordDisplay();
        }, 0);
    });
    initialRenderWords();
    updateWordClasses();
    updateCurrentWordDisplay();
    disableTyping();
    enableTyping();
    updateTimer();
    setTimeout(startTimer, 500);


};
