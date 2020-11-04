class GoodReadsService {
    apiKey = 'c5PtNYgnHXDRUsVuOrTOg';
    parser = new DOMParser();

    //https://cors-anywhere.herokuapp.com/
    async findBook(query) {
        const id = await this.findBookId(query);
        if(id) {
            return await this.getBookById(id);
        } else if (query.title) {
            return await this.findBook({originalTitle: query.originalTitle})
        }
        
        return {};
    }

    async findBookId(query) {
        let search =  query.originalTitle;
        if(query.title) {
            search = query.title + " " + query.originalAuthor;
        }
        
        const response = await fetch(`/search/index.xml?q=${search}&key=${this.apiKey}`, {mode:'cors'});
        const xml = await response.text();
        const id = this.getBookId(xml, query.title, query.originalTitle);

        return id;
    }


    //https://cors-anywhere.herokuapp.com/
    async getBookById(id) {
        const response = await fetch(`/book/show.xml?id=${id}&key=c5PtNYgnHXDRUsVuOrTOg`, {mode:'cors'});
        const xml = await response.text();
        return this.getBookDetails(xml);
    }

    getBookId(xml, title, originalTitle) {
        const xmlDoc = this.parser.parseFromString(xml,"text/xml");
        let books = [...xmlDoc.getElementsByTagName("work")];

        if(title && books.length > 1) {
            title = title.replace(/,/g, "").trim();
            books = books.filter(b => {
                const bestBook = b.getElementsByTagName("best_book")[0];
                let xmlTitle = bestBook.getElementsByTagName("title")[0].innerHTML;
                if(xmlTitle.indexOf("(") > 0) {
                    xmlTitle = xmlTitle.substr(0, xmlTitle.indexOf("("));
                }

                xmlTitle = xmlTitle.replace(/,/g, "").trim();
                return title.localeCompare(xmlTitle, 'en', { sensitivity: 'base' }) === 0; 
            });
        }

        const book = books[0];

        if(book) {
            const bestBook = book.getElementsByTagName("best_book")[0];
            const bookId = bestBook.getElementsByTagName("id")[0].innerHTML;
            return bookId;
        }

        return null;
    }

    getBookDetails(xml) {
        const xmlDoc = this.parser.parseFromString(xml, "text/xml");
        const averageRating = xmlDoc.getElementsByTagName("average_rating")[0]?.innerHTML;
        const authors = xmlDoc.getElementsByTagName("authors")[0].getElementsByTagName("author");
        const link = xmlDoc.getElementsByTagName("link")[0].innerHTML;
        const description = xmlDoc.getElementsByTagName("description")[0].innerHTML;
        const numPages = xmlDoc.getElementsByTagName("average_rating")[0].innerHTML;
        const ratingsCount = xmlDoc.getElementsByTagName("work")[0].getElementsByTagName("ratings_count")[0].innerHTML;
            
        return { description, averageRating, ratingsCount, authors, link, numPages };
    }
}

export default new GoodReadsService();