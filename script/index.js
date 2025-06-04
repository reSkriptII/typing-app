import {session} from "./session.js";
import { domMethod } from "./dommethod.js";

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

function setupCleanState(session, domElements) {
    session.statistic.totalLetter = 0;
    session.statistic.correctLetter = 0;
    session.statistic.wrongLetter = 0;

    domMethod.updateStatusBar(session, domElements);
    
    session.setNewPassage('example message that should show on div');
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
        typearea.innerHTML = session._typedPassage;

        // if (session.isPassageComplete()) {
        //     // TODO: session.setNewPassage();
        // }
    }
    
}

let wpmInteval;
function startTimer() {
    console.log('startTimer')
    session.start();
    wpmInteval = setInterval(() => updateWPM(session, domElements), 500);
    domElements.typearea.removeEventListener('keydown', startTimer);
}

