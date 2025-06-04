export let session = {
    setting: {
        allowBackSpace: true,
        spaceAsSeperator: true,
        //TODO: stopCursorOnError,
    },
    
    _targetPassage: '',
    _typedPassage: '',
    _cursorIndex: 0,
    statistic: {
        _startTime: null,
        _stopTime: null,
        totalLetter: 0,
        correctLetter: 0,
        wrongLetter: 0,
        getWPM() {
            if (!this._startTime) return 0;

            let finalTime = this._stopTime ?? Date.now();
            console.log(`timePassed: ${finalTime - this._startTime}`)
            let timeDiffSec = (finalTime - this._startTime) / 1000;
            console.log(timeDiffSec)
            return Math.round((this.totalLetter / 5) / (timeDiffSec / 60));
        }
    },

    setNewPassage(passage) {
        this._targetPassage = passage;
        this._typedPassage = '';
        this._cursorIndex = 0;
    },

    start() {
        this.statistic._startTime = new Date();
    },

    stop() {
        this.statistic._stopTime = new Date();
    },

    update(key) {
        console.log(key)
        if (key === this._targetPassage[this._cursorIndex]) { // correct key
            this._addTypedLetter(key, true);

        } else if (key === ' ') {
            handleSpace(this);

        } else if (key === "Backspace") {
            if (!this.setting.allowBackSpace) return;
            if (this.setting.spaceAsSeperator) {
      
                let typedWordCount = this._typedPassage.split(" ").length;
                if (this._cursorIndex <= getWordStartIndex(typedWordCount -1, this._targetPassage)) {
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

        function handleSpace(session) {
            if (!session.setting.spaceAsSeperator) {
                session._addTypedLetter(' ', false);
                return;
            } else {
                session._addTypedLetter('\u2423', false);
                session._addTypedLetter(' ', true);

                let typedWordCount = session._typedPassage.trim().split(' ').length;
                let nexWordStartIndex = getWordStartIndex(typedWordCount, session._targetPassage);
                session._cursorIndex = nexWordStartIndex;
            }
        }
    },

    getHighlightElement() {
        let highlighted = new DocumentFragment();

        if (!this._typedPassage) {
            if (!this._targetPassage) return null;

            appendSpan(this._targetPassage, 'untyped');
            return highlighted;
        }

        if (this.setting.spaceAsSeperator){
            let targetWordList = this._targetPassage.split(' ');
            let typedWordList = this._typedPassage.split(' ');

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
            appendHiglightLinear(this._typedPassage, this._targetPassage)
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
        this._typedPassage += key;
    },

    _deleteTypedLetter(retriveStatistic=true) {
        if(this._cursorIndex <= 0) return;

        --this._cursorIndex;

        if (retriveStatistic) {
            --this.statistic.totalLetter;

            let typedCharAtCursor = this._typedPassage[this._cursorIndex];
            let targetCharAtCursor = this._targetPassage[this._cursorIndex];
            if (typedCharAtCursor === targetCharAtCursor) {
                --this.statistic.correctLetter;
            } else {
                --this.statistic.wrongLetter;
            }
        }

        this._typedPassage = this._typedPassage.slice(0, -1); 
    },
}