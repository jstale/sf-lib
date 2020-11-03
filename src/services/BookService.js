class BookService {
    async getBooks() {
        const response = await fetch(`/books/books.json`);
        const json = await response.json();
        return json;
    }
}

export default new BookService();