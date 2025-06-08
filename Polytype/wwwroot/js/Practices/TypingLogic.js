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
        this.error = 0;
    }

    start() {
        this.startTime = Date.now();
    }

    registerInput(input, expected) {
        this.typedChars = input.length;
        this.totalWords = expected.length;

        if (input === expected) {
            this.correctWords++;
            this.correctChars += input.length;
        } else {
            for (let i = 0; i < input.length; i++) {
                if (input[i] === expected[i]) this.correctChars++;
                else this.errors++;
            }
        }
    }
    getElapsedMinutes() {
        if (!this.startTime) return 0;
        return (Date.now() - this.startTime) / 60000; // Convert ms to minutes
    }

    getWPM() {
        const minutes = this.getElapsedMinutes() || 1;
        return Math.round(this.correctWords / minutes);
    }

    getCPM() {
        const minutes = this.getElapsedMinutes() || 1;
        return Math.round(this.correctChars / minutes);
    }

    getAccuracy() {
        if (this.typedChars === 0) return 100;
        return Math.round((this.correctChars / this.typedChars) * 100);
    }
} 