import { session } from "./session.js";
import { word } from "./word.js";
import { domElements, domMethod } from "./dommethod.js";

const allowBackspaceToggle = document.getElementById("allowbackspace");
const spaceModeToggle = document.getElementById("spacemode");
const shuffleToggle = document.getElementById("shuffle");
const darkmodeToggle = document.getElementById("darkmode-toggle");

allowBackspaceToggle.addEventListener("input", () => {
    session.setting.allowBackspace = allowBackspaceToggle.checked;
    domMethod.setCleanState(session, domElements, session.filePath);
})

spaceModeToggle.addEventListener("input", () => {
    session.setting.spaceAsSeperator = spaceModeToggle.checked;
    domMethod.setCleanState(session, domElements, session.filePath);
});

shuffleToggle.addEventListener("input", () => {
    word.setting.shuffle = shuffleToggle.checked;
    domMethod.setCleanState(session, domElements, session.filePath);
})

darkmodeToggle.addEventListener("click", () => {
    let currentMode = (darkmodeToggle.dataset.theme === "dark")? "light" : "dark";
    darkmodeToggle.dataset.theme = currentMode;
    darkmodeToggle.innerHTML = (currentMode === "dark")? "🌙" : "☀️";
    document.documentElement.dataset.theme = currentMode
})

const letterSelector = document.getElementById("includeletter");

for (let i = 0; i < 26; ++i) {
    const letter = String.fromCharCode(97 + i);
    const includeLetterToggle = document.createElement("button");

    includeLetterToggle.className = "letter-toggle";
    includeLetterToggle.dataset.status = "set";
    includeLetterToggle.innerHTML = letter;
    includeLetterToggle.addEventListener("click", (event) => setLetter(letter, event));
    letterSelector.appendChild(includeLetterToggle);
    
}

function setLetter(letter, event) {
    let elemData = event.currentTarget.dataset;

    if (elemData.status === "set") {
        elemData.status = "unset"
        word.setting.excludedLetter.add(letter);
    } else {
        elemData.status = "set";
        word.setting.excludedLetter.delete(letter);
    }

    domMethod.setCleanState(session, domElements, session.filePath)
    console.log(word.setting.excludedLetter)
}