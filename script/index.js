import { session } from "./session.js";
import { domMethod, domElements } from "./dommethod.js";
import { word } from "./word.js";


domMethod.setCleanState(session, domElements, '/asset/word.json');

domElements.typearea.onpaste = () => false;
domElements.typearea.addEventListener('keydown', startTimer);
domElements.typearea.addEventListener('keydown', handleOnType);

// ************************************************************
// helper function

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
                session.setNewPhrase(word.getNextText(word.setting.wordPerStream))
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

