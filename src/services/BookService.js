class BookService {
    async getBooks() {
        const response = await fetch(`/books/books_updated.json`);
        const json = await response.json();
        return json;
    }
}

export default new BookService();