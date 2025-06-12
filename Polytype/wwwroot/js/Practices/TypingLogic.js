export class TypingStats {
    constructor() {
        this.reset();
    }

    reset() {
        this.startTime = null;
        this.typedChars = 0;
        this.typedWords = 0;
        this.correctWords = 0;
        this.totalWords = 0;
        this.correctChars = 0;
        this.errors = 0;
        this.perWordLog = [];
    }

    start() {
        this.startTime = Date.now();
        console.log(this.startTime);
    }

    registerInput(input, expected) {
        this.typedWords++;
        this.typedChars += input.length;
        this.totalWords++;

        if (typeof expected !== "string") {
            console.error("Expected word is undefined or not a string.", expected);
        }

        if (input === expected) {
            this.correctWords++;
            this.correctChars += input.length;
        } else {
            for (let i = 0; i < input.length; i++) {
                if (expected[i] && input[i] === expected[i]) {
                    this.correctChars++;
                } 
                else this.errors++;
            }
        }
        this.logPerWord(input, expected); 
        console.log(`[TypingStats] typedChars: ${this.typedChars}, correctChars: ${this.correctChars}, correctWords: ${this.correctWords}, totalWords: ${this.totalWords}`);

        return {
            wpm: this.getWPM(),
            cpm: this.getCPM(),
            accuracy: this.getAccuracy(),
            typedWords: this.typedWords,
            correctWords: this.correctWords,
            typedChars: this.typedChars,
            correctChars: this.correctChars,
            errors: this.errors
        };

    }

    logPerWord(input, expected) {
        const elapsedMinutes = this.getElapsedMinutes() || 1;
        this.perWordLog.push({
            timestamp: Date.now(),
            input,
            expected,
            typedChars: this.typedChars,
            correctChars: this.correctChars,
            typedWords: this.typedWords,
            correctWords: this.correctWords,
            errors: this.errors,
            wpm: Math.round(this.correctWords / elapsedMinutes),
            cpm: Math.round(this.correctChars / elapsedMinutes),
            accuracy: this.getAccuracy()
        });
    }

    getElapsedMinutes() {
        if (!this.startTime) return 0;
        return (Date.now() - this.startTime) / 60000; // Convert ms to minutes
    }

    getWPM() {
        const minutes = this.getElapsedMinutes() || 1;
        //return Math.round(this.correctWords / minutes);
        return Math.round((this.correctWords) / minutes);
    }

    getCPM() {
        const minutes = this.getElapsedMinutes() || 1;
        return Math.round(this.correctChars / minutes);
    }

    getAccuracy() {
        if (this.typedChars === 0) return 100;
        return Math.round((this.correctChars / this.typedChars) * 100);
    }

    recordKey(char) {
        this.typedChars++;
    }

    recordBackspace() {
        if (this.typedChars > 0) this.typedChars--;
    }
} 