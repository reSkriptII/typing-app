import {session} from "./session.js";

const domElements = {
    passage: document.getElementById("passage"),
    typearea: document.getElementById("typearea"),
    accuracyDisplays: document.querySelectorAll('.accuracy-display'),
    errorDisplays: document.querySelectorAll('.error-display'),
    wpmDisplays: document.querySelectorAll('.wpm-display'),
}

cleanSetupApp(session, domElements);

domElements.typearea.onpaste = () => false;

let wpmInteval;
domElements.typearea.addEventListener('keydown', startTimer);
function startTimer() {
    console.log('startTimer')
    session.start();
    wpmInteval = setInterval(() => updateWPM(session, domElements), 500);
    domElements.typearea.removeEventListener('keydown', startTimer);
}

domElements.typearea.addEventListener('keydown', (event) => {
    let key = event.key;
    if (key in ['Control', 'Alt', 'Shift', 'Meta']) {
        return;
    }

    if(key.length === 1 || key === 'Backspace')  {
        session.update(event.key);
    
        setPassageDisplay(session.getHighlightElement());
        updateStatusBar(session, domElements);
        typearea.innerHTML = session._typedPassage;

        // if (session.isPassageComplete()) {
        //     // TODO: session.setNewPassage();
        // }
    }
    
});

// ************************************************************
// helper function

function setPassageDisplay(element) {
    passage.innerHTML = '';
    passage.append(element);
}

function cleanSetupApp(session, domElements) {
    session.setNewPassage('example message that should show on div');
    setPassageDisplay(session.getHighlightElement());

    session.statistic.totalLetter = 0;
    session.statistic.correctLetter = 0;
    session.statistic.wrongLetter = 0;

    updateStatusBar(session, domElements);
}

function updateStatusBar(session, domElements) {
    
    let stat = session.statistic;
    if (stat.totalLetter <= 0) {
        updateWPM(session, domElements);
        domElements.errorDisplays.forEach((element) => {
            element.innerHTML = 0;
        });

        domElements.accuracyDisplays?.forEach((element) => {
            element.innerHTML = '100%';
        });

        return;
    }

    domElements.errorDisplays?.forEach((element) => {
        element.innerHTML = stat.wrongLetter;
    });

    domElements.accuracyDisplays?.forEach((element) => {
        element.innerHTML = Math.round(100 * stat.correctLetter / stat.totalLetter) + '%';
    });    
}

function updateWPM(session, domElements) {
    domElements.wpmDisplays?.forEach((element) => {
        element.innerHTML = session.statistic.getWPM();
    });
}


