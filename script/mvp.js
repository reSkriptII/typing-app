let currentPassage = ['example', 'message', 'that', 'should', 'show', 'on', 'div']; //TODO: fetch real passage
let mode = 'lax'; //TODO

let passage = document.getElementById("passage");
let typearea = document.getElementById("typearea");

if (!passage || !typearea) {
    console.error('ERROR: element not found');
}


passage.innerHTML = currentPassage.join(' ');

typearea.onpaste = () => false;
// typearea.onkeydown = event => { 
//     if (event.key === 'Backspace') return false;
// } //TODO: make this a toggle

typearea.addEventListener('input', handleInput);


function handleInput() {
    let typedLetters = typearea.value;

    switch (mode) {
        case 'strict':
        case 'lax':
            handleCharMode(typedLetters, currentPassage.join(' '));
            // highlighted = createHighlightElement(typedLetters, currentPassage.join(' '));
            // passage.innerHTML = '';
            // passage.append(highlighted);
            break;
        case 'spaced':
            passage.innerHTML = ' ';
            typedWords = typedLetters.split(' ');
            for (let i = 0; i < currentPassage.length; ++i) {
                highlighted = createHighlightElement(typedWords[i], currentPassage[i], i < typedWords.length -1);
                passage.append(highlighted);
                passage.append(' ');
            }

    }
    
    function handleCharMode(inputText, targetText) {
        passage.innerHTML = '';

        for (let i = 0; i < targetText.length; ++i) {
            if (i >= inputText.length) break;
            
            passage.append(markLetter(inputText[i], targetText[i]));
        }

        passage.append(createUntypedSpan());

        // helper function
        function markLetter(inputLetter, targetLetter) {
            let span = document.createElement('span');
            span.className = (inputLetter === targetLetter)? 'correct' : 'wrong';
            span.textContent = targetLetter;
            return span;
        }

        function createUntypedSpan() {
            let span = document.createElement('span');
            span.className = 'untyped';
            span.textContent = targetText.slice(inputText.length);
            return span;
        }
    }
}

function createHighlightElement(inputText, targetText, markAbsentWrong=false) {
    let highlighted = new DocumentFragment();
    if (!inputText) {
        if (!targetText) return;

        appendSpan(targetText, 'untyped');
        return highlighted;
    }
    

    for (let index = 0; index < targetText.length; ++index) {
        if (index >= inputText.length) break;

        if (inputText[index] === targetText[index]) {
            appendSpan(targetText[index], 'correct');
        } else {
            appendSpan(targetText[index], 'wrong');
        }
    }

    appendSpan(targetText.slice(inputText.length), markAbsentWrong? 'wrong' : 'untyped');
    return highlighted;

    function appendSpan(content, className) {
        let span = document.createElement('span');
        span.className = className;
        span.textContent = content;

        highlighted.append(span);
    }
}