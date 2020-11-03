class GoodReadsService {
    apiKey = 'c5PtNYgnHXDRUsVuOrTOg';
    parser = new DOMParser();

    //https://cors-anywhere.herokuapp.com/
    async findBook(query) {
        const response = await fetch(`/search/index.xml?q=${query}&key=${this.apiKey}`, {mode:'cors'});
        const xml = await response.text();
        const id = this.getBookId(xml);

        if(id) {
            return await this.getBookById(id);
        } 


        return null;
    }

    async findBookId(query) {
        const response = await fetch(`/search/index.xml?q=${query}&key=${this.apiKey}`, {mode:'cors'});
        const xml = await response.text();
        const id = this.getBookId(xml);

        return id;
    }


    //https://cors-anywhere.herokuapp.com/
    async getBookById(id) {
        const response = await fetch(`/book/show.xml?id=${id}&key=c5PtNYgnHXDRUsVuOrTOg`, {mode:'cors'});
        const xml = await response.text();
        return this.getBookDetails(xml);
    }

    getBookId(xml) {
        
        const xmlDoc = this.parser.parseFromString(xml,"text/xml");
        const book = xmlDoc.getElementsByTagName("work")[0];

        if(book) {
            const bestBook = book.getElementsByTagName("best_book")[0];
            const bookId = bestBook.getElementsByTagName("id")[0].innerHTML;
            return bookId;
        }

        return null;
    }

    getBookDetails(xml) {
        const xmlDoc = this.parser.parseFromString(xml, "text/xml");
        const averageRating = xmlDoc.getElementsByTagName("average_rating")[0].innerHTML;
        const authors = xmlDoc.getElementsByTagName("authors")[0].getElementsByTagName("author");
        const link = xmlDoc.getElementsByTagName("link")[0].innerHTML;
        const description = xmlDoc.getElementsByTagName("description")[0].innerHTML;
        const numPages = xmlDoc.getElementsByTagName("average_rating")[0].innerHTML;
        const ratingsCount = xmlDoc.getElementsByTagName("work")[0].getElementsByTagName("ratings_count")[0].innerHTML;
            
        return { description, averageRating, ratingsCount, authors, link, numPages };
    }
}

export default new GoodReadsService();