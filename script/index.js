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

setupCleanState(session, domElements);

domElements.typearea.onpaste = () => false;
domElements.typearea.addEventListener('keydown', startTimer);
domElements.typearea.addEventListener('keydown', handleOnType);

// ************************************************************
// helper function

async function setupCleanState(session, domElements) {
    session.statistic.totalLetter = 0;
    session.statistic.correctLetter = 0;
    session.statistic.wrongLetter = 0;

    domMethod.updateStatusBar(session, domElements);
    
    session.setNewPhrase(await word.fetchWord('/asset/word.txt'));
    domMethod.setContent(domElements.passage ,session.getHighlightElement());
}

function handleOnType(event) {
    let key = event.key;
    if (key in ['Control', 'Alt', 'Shift', 'Meta']) {
        return;
    }

    if(key.length === 1 || key === 'Backspace')  {
        session.update(event.key);
    
        domMethod.setContent(domElements.passage, session.getHighlightElement());
        domMethod.updateStatusBar(session, domElements);
        typearea.innerHTML = session._typedPhrase;

        if (session.isPhraseComplete()) {
             // TODO: session.setNewPassage();
             alert('done')
        }
    }
    
}

let wpmInteval;
function startTimer() {
    session.start();
    setTimeout(() => domMethod.updateWPM(session, domElements), 200)
    wpmInteval = setInterval(() => domMethod.updateWPM(session, domElements), 500);
    domElements.typearea.removeEventListener('keydown', startTimer);
}

