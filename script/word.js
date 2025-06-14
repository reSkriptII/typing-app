export let word = {
    setting: {
        excludedLetter: new Set(),
        wordPerStream: 10,
        shuffle: false,
    },

    async loadFrom(path) {
        let excludedLetter = this.setting.excludedLetter;
        try {
            let file = await fetch(path);
            let wordList = await file.json();
            
            this._dictinary = wordList.filter(notContainExcludedLetter);
            if (this.setting.shuffle) {
                shuffle(this._dictinary);
            }
            this._nextWordIndex = 0;
            return true;
        } catch(error) {
            console.log(error);
            return false
        }

        function notContainExcludedLetter(word) {
            for (let char of word.toLowerCase()) {
                if (excludedLetter.has(char)) return false;
            }
            return true;
        }

        function shuffle(arr) {
            console.log(arr)
            for (let i = arr.length - 1; i > 0; --i) {
                console.log(i)
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    },

    getNextText(wordNum=0) {
        if (wordNum) {
            let finishIndex = Math.min(this._nextWordIndex + wordNum, this._dictinary.length);
        
            let wordList = this._dictinary.slice(this._nextWordIndex, finishIndex);
            this._nextWordIndex = finishIndex;
            return wordList.join(' ');
        }
        
        return this._dictinary.join(' ')
    },

    isEndOfDict() {
        return this._nextWordIndex >= this._dictinary.length;
    },

    
    _dictinary: [],
    _nextWordIndex: 0,
}