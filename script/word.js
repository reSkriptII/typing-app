export let word = {
    async fetchWord(path) {
        try {
            let word = await fetch(path);

            return await word.text();
        } catch (error) {
            console.error(error);
            return 'a fallback string which should only appear on fetch error';
        }
    }
}