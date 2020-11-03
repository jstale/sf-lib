import React from  'react'
import BookListItem from './BookListItem'
import BookDetails from './BookDetails'

import BookService from '../../services/BookService'
import GoodReadsService from '../../services/GoodReadsService'
import { useEffect, useState } from 'react'
import './BookList.scss'


const BookList = () => {
    const [ bookDetailsState, updateBookDetails ]  = useState({ isVisible: false, book: null });
    const [ bookDetailsPositionState, setBookDetailsPosition ]  = useState(430);
    const [ booksState, updateBooks ]  = useState([]);
    const [ filteredBooksState, filterBooks ]  = useState([]);

    const bookListRef = React.createRef();
    
    async function fetchBooks() {
        const books = await BookService.getBooks();
        books.map(book => book.ref = React.createRef());

        let filteredBooks = [...books];
        sortBooks(filteredBooks);

        updateBooks(books);
        filterBooks(filteredBooks);
    }

    const searchBooks = (e) => {
        updateBookDetails({isVisible: false, book: null});

        const query = e.target.value.toLowerCase();
        let filteredBooks = [...booksState];

        filteredBooks.map(b => { b.isSelected = false; b.isDetailsOpened = false; } );
        sortBooks(filteredBooks);

        if(query.length > 2) {
            filteredBooks = filteredBooks.filter((book) => {
                return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
            });
        }

        filterBooks(filteredBooks);
        
        console.log(e);
    }

    const sortBooks = (books) => {
        books.sort((a, b) => {  
            if(a.author < b.author) { return -1; }
            if(a.author > b.author) { return 1; }
        return 0;});
    }

    const findBook = async (book) => {
        const filteredBooks = [...filteredBooksState];
        const selectedBook = filteredBooks.find(b => book.path === b.path);

        filteredBooks.map(b => { b.isSelected = false; b.isDetailsOpened = false; } );
        selectedBook.isSelected = true;
        filterBooks(filteredBooks);

        const newY = selectedBook.ref.current.getBoundingClientRect().y;
        const oldY = bookDetailsState.book && bookDetailsState.book.ref.current?.getBoundingClientRect().y;
        const scrollY = bookListRef.current.scrollTop;
        const containerY = bookListRef.current.getBoundingClientRect().y;

        if(newY !== oldY){
            
            let y = scrollY + 260 + (newY - containerY);

            if(oldY !== undefined && oldY !== null && newY > oldY) {
                y-=400;
            }

            setBookDetailsPosition(y);

            updateBookDetails({isVisible: false});
            setTimeout(() => {
                selectedBook.ref.current.scrollIntoView({
                    behavior: "smooth",
                });

                setTimeout(() => {
                    selectedBook.isDetailsOpened = true;
                    filterBooks(filteredBooks);
                    updateBookDetails({isVisible: true, book: selectedBook});
                    
                }, 300);
            }, 10);
        } else {
            updateBookDetails({isVisible: true, book: selectedBook});
            selectedBook.isDetailsOpened = true;
            filterBooks(filteredBooks);
        }

        if(book.goodreadsId){
            GoodReadsService.getBookById(book.goodreadsId).then(bookDetailsHandler.bind(this, selectedBook));
        } else {
            GoodReadsService.findBook(book.originalTitle).then(bookDetailsHandler.bind(this, selectedBook));
        }
    }

    const bookDetailsHandler = (selectedBook, bookDetails) => {
        let currentDetails = bookDetailsState;
        currentDetails.metadata = bookDetails;
        currentDetails.isVisible = true;
        currentDetails.book = selectedBook;
        
        updateBookDetails(currentDetails);
    }

    useEffect(() => {
            fetchBooks();
    }, []);

    // ******************************* render ************************************

    let bookElements = [];
    
    if(filteredBooksState) {
        bookElements = filteredBooksState.map((book) =>
            <BookListItem book={book} click={() => findBook(book)}></BookListItem>
        );
    }
    
    return (
        <div style={{width:"100%"}}>

            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <div class="field">
                        <div class="control">
                            <input type="text" onChange={searchBooks} placeholder="Search" className="input" ></input> 
                        </div>
                    </div>
                </div>

            </div>
            <div className="book-list" ref={bookListRef}>
                
                {bookElements}
                <BookDetails position={bookDetailsPositionState} data={bookDetailsState}></BookDetails>
            </div>
        
        </div>
    )
}

export default BookList;