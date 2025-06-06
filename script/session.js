export let session = {
    setting: {
        allowBackSpace: true,
        spaceAsSeperator: true,
        //TODO: stopCursorOnError,
    },
    
    statistic: {
        _startTime: null,
        _stopTime: null,
        totalLetter: 0,
        correctLetter: 0,
        wrongLetter: 0,
        getWPM() {
            if (!this._startTime) return 0;

            let finalTime = this._stopTime ?? Date.now();
            let timeDiffSec = (finalTime - this._startTime) / 1000;
            return Math.round((this.totalLetter / 5) / (timeDiffSec / 60));
        }
    },

    setNewPhrase(phrase) {
        this._targetPhrase = phrase;
        this._typedPhrase = '';
        this._cursorIndex = 0;
    },

    start() {
        this.statistic._startTime = new Date();
    },

    stop() {
        this.statistic._stopTime = new Date();
    },

    update(key) {
        console.log(this._cursorIndex)
        if (key === this._targetPhrase[this._cursorIndex]) { // correct key
            this._addTypedLetter(key, true);

        } else if (key === ' ') {
            handleWrongSpace(this);

        } else if (key === "Backspace") {
            if (!this.setting.allowBackSpace) return;
            if (this.setting.spaceAsSeperator) {
      
                let typedWordCount = this._typedPhrase.split(" ").length;
                if (this._cursorIndex <= getWordStartIndex(typedWordCount -1, this._targetPhrase)) {
                    return;
                }
            }

            this._deleteTypedLetter();

        } else { // if wrong key
            this._addTypedLetter(key, false);
        }

        function getWordStartIndex(nthWord, passage) {
            let wordList = passage.trim().split(' ');
            return passage.indexOf(wordList[nthWord]);
        }

        function handleWrongSpace(session) {
            if (!session.setting.spaceAsSeperator) {
                session._addTypedLetter(' ', false);
                return;
            } else {
                let typedWord = session._typedPhrase.split(' ');
                let typedWordCount = typedWord.length;
                let nexWordStartIndex = getWordStartIndex(typedWordCount, session._targetPhrase);
                session._cursorIndex = nexWordStartIndex;

                let lastTypedWordLength = typedWord[typedWordCount - 1].length;
                let lastTargetWordLength = session._targetPhrase.split(' ')[typedWordCount - 1].length;

                if (lastTypedWordLength < lastTargetWordLength) {
                    session._typedPhrase += "\u2423 ";
                }
                ++session.statistic.totalLetter;
                ++session.statistic.wrongLetter;
            }
        }
    },

    getHighlightElement() {
        let highlighted = new DocumentFragment();

        if (!this._typedPhrase) {
            if (!this._targetPhrase) return null;

            appendSpan(this._targetPhrase, 'untyped');
            return highlighted;
        }

        if (this.setting.spaceAsSeperator){
            let targetWordList = this._targetPhrase.split(' ');
            let typedWordList = this._typedPhrase.split(' ');

            let typedWordCount = Math.min(targetWordList.length, typedWordList.length);

            // highlight words before current
            for (let i = 0; i < typedWordCount - 1; ++i) {
                appendHiglightLinear(typedWordList[i], targetWordList[i], true);
                appendSpan(' ', 'correct');
            }

            // highlight current word
            appendHiglightLinear(typedWordList[typedWordCount - 1], targetWordList[typedWordCount - 1]);

            if (typedWordCount < targetWordList.length) {
                appendSpan(' ' + targetWordList.slice(typedWordCount).join(' '), 'untyped')
            }

        } else {
            appendHiglightLinear(this._typedPhrase, this._targetPhrase)
        }

        return highlighted;

        // helper function

        function appendHiglightLinear(typedPassage, targetPassage, markMissedAsWrong=false) {
            let typedLetterCount = Math.min(typedPassage.length, targetPassage.length);
            for (let i = 0; i < typedLetterCount; ++i) {
                let typedLetter = typedPassage[i];
                let targetLetter = targetPassage[i];
                if (typedLetter === targetLetter) {
                    appendSpan(targetLetter, 'correct');
                } else {
                    appendSpan(targetLetter, 'wrong');
                }
            }

            if (typedLetterCount < targetPassage.length) {
                if (markMissedAsWrong) {
                    appendSpan(targetPassage.slice(typedLetterCount), 'wrong');
                } else {
                    appendSpan(targetPassage[typedLetterCount], 'untyped current');
                    if (targetPassage.length > typedLetterCount + 1) {
                        appendSpan(targetPassage.slice(typedLetterCount + 1), 'untyped');
                    }
                    
                }
                
            }
        }

        function appendSpan(content, className) {
            let span = document.createElement('span');
            span.className = className;
            span.textContent = content;

            highlighted.append(span);
        }

    },

    isLastOfPhrase() {
        if (!this.setting.spaceAsSeperator) {
            return this.statistic.totalLetter >= this._targetPhrase.length
        }

        let targetWords = this._targetPhrase.split(' ');
        let typedWords = this._typedPhrase.split(' ');

        if (targetWords.length <= typedWords.length) return true; 
    },

    _addTypedLetter(key, isCorrectLetter, countStatistic=true) {
        // Error checking. Remove later
        if (key.length !== 1) {
            console.error(`moveCursorForward: key is not a single letter: "${key}"`);
            return;
        }

        if (countStatistic) {
            ++this.statistic.totalLetter;
            if(isCorrectLetter) {
                ++this.statistic.correctLetter;
            } else {
                ++this.statistic.wrongLetter;
            }  
        }
        
        ++this._cursorIndex;
        this._typedPhrase += key;
    },

    _deleteTypedLetter(retriveStatistic=true) {
        if(this._cursorIndex <= 0) return;

        --this._cursorIndex;

        if (retriveStatistic) {
            --this.statistic.totalLetter;

            let typedCharAtCursor = this._typedPhrase[this._cursorIndex];
            let targetCharAtCursor = this._targetPhrase[this._cursorIndex];
            if (typedCharAtCursor === targetCharAtCursor) {
                --this.statistic.correctLetter;
            } else {
                --this.statistic.wrongLetter;
            }
        }

        this._typedPhrase = this._typedPhrase.slice(0, -1); 
    },

    _targetPhrase: '',
    _typedPhrase: '',
    _cursorIndex: 0,
}