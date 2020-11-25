class BookService {
    async getBooks() {
        const response = await fetch(`/resources/books/books_updated.json`);
        const json = await response.json();
        return json;
    }

    async getBook(path, chapterNum) {
        chapterNum = chapterNum | 1;
        const response = await fetch(`/resources/books/${path}/p${chapterNum}.html.json`);
        const json = await response.json();
        return json;
    }

    async getChapter(path, chapterNum) {
        const response = await fetch(`/resources/books/${path}/p${chapterNum}.html.json`);
        const json = await response.json();
        return json;
    }
}

export default new BookService();