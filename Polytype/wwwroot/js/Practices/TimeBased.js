let time = 60;
let timerInterval;
let timeLeft = time;
let timerActive = true;


let words = [
    "Senator", "chairman", "live", "calling", "assembly", "may", "clicking", "needs", "proposal", "articles", "pork", "listing",
    "belfast", "emphasis", "religion", "manitoba", "pepper", "factors", "outlook", "charger", "tomorrow", "partners",
    "dialog", "up", "remained", "slovenia", "buys", "features", "utilization", "occasionally", "fire", "attend", "shift",
    "reasonably", "thing", "zip", "factors", "thorough"
];
let currentWord = 0;
let currentInput = "";


function setTime(t) {
    time = t;
    timeLeft = t;
    document.getElementById('timer').textContent = formatTime(t);
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    resetPractice();
}
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}


function startTimer() {
    timerActive = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerActive = false;
            // Optionally, show a message: 
            // document.getElementById('timer').textContent = "Time's up!";
        }
    }, 1000);
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

function renderWords() {
    const wordsDiv = document.getElementById('words');
    wordsDiv.innerHTML = words.map((word, i) => {
        if (i === currentWord) {
            let chars = '';
            // If nothing typed yet, caret at the start
            if (currentInput.length === 0) {
                chars += `<span class="caret"></span>`;
            }
            for (let j = 0; j < word.length; j++) {
                let charClass = '';
                if (j < currentInput.length) {
                    charClass = currentInput[j] === word[j] ? 'correct-char' : 'incorrect-char';
                }
                // Add caret after the last typed character
                if (j === currentInput.length && currentInput.length !== 0) {
                    chars += `<span class="caret"></span>`;
                }
                chars += `<span class="char ${charClass}">${word[j]}</span>`;
            }
            // If caret is at the end
            if (currentInput.length === word.length) {
                chars += `<span class="caret"></span>`;
            }
            return `<span class="word current" id="word${i}">${chars}</span>`;
        } else {
            let wordClass = '';
            if (i < currentWord) {
                wordClass = 'correct';
            }
            //return `<span class="word ${wordClass}" id="word${i}">${word}</span>`;
            return `<span class="word ${wordClass}" id="words${i}">${word}</span>${i < words.length - 1 ? ' ' : ''}`;
        }
    }).join(' ');
}

function updateCurrentWordClass(isCorrect) {
    if (currentWord >= words.length) return; // Prevent out-of-bounds access
    const wordSpan = document.getElementById(`word${currentWord}`);
    if (!wordSpan) return; // Defensive: element not found
    wordSpan.classList.remove('incorrect', 'correct');
    if (isCorrect === true) wordSpan.classList.add('correct');
    else if (isCorrect === false) wordSpan.classList.add('incorrect');
}

document.addEventListener('keydown', function (e) {
    if (!timerActive) return; // Block typing if timer is done
    if (currentWord >= words.length) return; // Stop if finished
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (currentInput.trim() === words[currentWord]) {
            updateCurrentWordClass(true);
        } else {
            updateCurrentWordClass(false);
        }
        renderWords();
        currentWord++;
        currentInput = "";
    } else if (e.key.length === 1) {
        currentInput += e.key;
        renderWords();
    } else if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        renderWords();
    }

//    // Redirection here
//    if (timeLeft <= 0) {
//        clearInterval(timerInterval);
//        timerActive = false;
//        // Redirect to summary page 
//    }
});

function resetPractice() {
    clearInterval(timerInterval);
    currentWord = 0;
    currentInput = "";
    renderWords();
    updateTimer();
    setTimeout(startTimer, 500);
}

window.onload = function () {
    renderWords();
    updateTimer();
    setTimeout(startTimer, 500);
};
