export let domMethod = {
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