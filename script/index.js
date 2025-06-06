import {session} from "./session.js";
import { domMethod } from "./dommethod.js";
import { word } from "./word.js";

const domElements = {
    passage: document.getElementById("passage"),
    typearea: document.getElementById("typearea"),
    accuracyDisplays: document.querySelectorAll('.accuracy-display'),
    errorDisplays: document.querySelectorAll('.error-display'),
    wpmDisplays: document.querySelectorAll('.wpm-display'),
}
let phraseLength = 10;

setupCleanState(session, domElements, '/asset/word.txt');

domElements.typearea.onpaste = () => false;
domElements.typearea.addEventListener('keydown', startTimer);
domElements.typearea.addEventListener('keydown', handleOnType);

// ************************************************************
// helper function

async function setupCleanState(session, domElements, filePath) {
    session.statistic.totalLetter = 0;
    session.statistic.correctLetter = 0;
    session.statistic.wrongLetter = 0;

    domMethod.updateStatusBar(session, domElements);

    await word.loadFrom(filePath);
    session.setNewPhrase(word.getNextText(phraseLength));
    domMethod.setContent(domElements.passage ,session.getHighlightElement());
}

function handleOnType(event) {
    let key = event.key;
    if (key in ['Control', 'Alt', 'Shift', 'Meta']) {
        return;
    }

    if(key.length === 1 || key === 'Backspace')  {
        console.log(key)
        if (event.key === ' ' && session.isLastOfPhrase()) {
            if (word.isEndOfDict()) {
                alert('done')
            } else {
                session.setNewPhrase(word.getNextText(phraseLength))
            }
             
        } else {
            session.update(event.key);
        }
    
        domMethod.setContent(domElements.passage, session.getHighlightElement());
        domMethod.updateStatusBar(session, domElements);
        typearea.innerHTML = session._typedPhrase;

        
    }
    
}

let wpmInteval;
function startTimer() {
    session.start();
    setTimeout(() => domMethod.updateWPM(session, domElements), 200)
    wpmInteval = setInterval(() => domMethod.updateWPM(session, domElements), 500);
    domElements.typearea.removeEventListener('keydown', startTimer);
}

