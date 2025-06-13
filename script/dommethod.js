import { word } from "./word.js";

export const domElements = {
    passage: document.getElementById("passage"),
    typearea: document.getElementById("typearea"),
    accuracyDisplays: document.querySelectorAll('.accuracy-display'),
    errorDisplays: document.querySelectorAll('.error-display'),
    wpmDisplays: document.querySelectorAll('.wpm-display'),
}

export let domMethod = {

    async setCleanState(session, domElements, filePath) {
        session.statistic.totalLetter = 0;
        session.statistic.correctLetter = 0;
        session.statistic.wrongLetter = 0;

        domMethod.updateStatusBar(session, domElements);
        domElements.typearea.innerHTML = '';

        await word.loadFrom(filePath);
        session.setNewPhrase(word.getNextText(word.setting.wordPerStream));
        domMethod.setContent(domElements.passage ,session.getHighlightElement());
    },

    setContent(target, documentFragment) {
        target.innerHTML = '';
        target.append(documentFragment);
    },

    updateStatusBar(session, domElements) {
        let stat = session.statistic;
        if (stat.totalLetter <= 0) {
            this.updateWPM(session, domElements);
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
    },

    updateWPM(session, domElements) {
    domElements.wpmDisplays?.forEach((element) => {
        element.innerHTML = session.statistic.getWPM();
    });
}
}