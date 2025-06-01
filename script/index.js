import {session} from "./session.js";

let passage = document.getElementById("passage");
let typearea = document.getElementById("typearea");

session.setNewPassage('example message that should show on div');
setPassageDisplay(session.getHighlightElement());

let debugDiv = document.getElementById('debug');

typearea.onpaste = () => false;
typearea.addEventListener('keydown', (event) => {
    session.update(event.key);
    setPassageDisplay(session.getHighlightElement());
    typearea.innerHTML = session._typedPassage;
    event.preventDefault()
});

function setPassageDisplay(element) {
    passage.innerHTML = '';
    passage.append(element);
}



