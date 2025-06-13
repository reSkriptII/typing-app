export let word = {
    setting: {
        excludedLetter: new Set(),
        wordPerStream: 10,
    },

    async loadFrom(path) {
        let excludedLetter = this.setting.excludedLetter;
        try {
            let file = await fetch(path);
            let wordList = await file.json();
            
            this._dictinary = wordList.filter(notContainExcludedLetter);
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