import { session } from "./session.js";
import { word } from "./word.js";
import { domElements, domMethod } from "./dommethod.js";

let settingBar = document.getElementById('includeletter');

for (let i = 0; i < 26; ++i) {
    const letter = String.fromCharCode(97 + i);
    const includeLetterToggle = document.createElement('button');

    includeLetterToggle.className = 'letter-toggle';
    includeLetterToggle.dataset.status = "set";
    includeLetterToggle.innerHTML = letter;
    includeLetterToggle.addEventListener('click', (event) => setLetter(letter, event));
    settingBar.appendChild(includeLetterToggle);
    
}

function setLetter(letter, event) {
    let elemData = event.currentTarget.dataset;

    if (elemData.status === 'set') {
        elemData.status = 'unset'
        word.setting.excludedLetter.add(letter);
    } else {
        elemData.status = 'set';
        word.setting.excludedLetter.delete(letter);
    }

    domMethod.setCleanState(session, domElements, '/asset/word.json')
    console.log(word.setting.excludedLetter)
}