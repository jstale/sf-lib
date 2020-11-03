import React from  'react'
import BookListItem from './BookListItem'
import BookDetails from './BookDetails'

import BookService from '../../services/BookService'
import GoodReadsService from '../../services/GoodReadsService'
import { useEffect, useState } from 'react'
import './BookList.scss'


const BookList = () => {
    const [ bookDetailsState, updateBookDetails ]  = useState({ isVisible: false, book: null });
    const [ bookDetailsPositionState, updateBookDetailsPosition ]  = useState(430);
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
        const query = e.target.value.toLowerCase();
        let filteredBooks = [...booksState];
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
        const oldY = bookDetailsState.book && bookDetailsState.book.ref.current.getBoundingClientRect().y;
        const scrollY = bookListRef.current.scrollTop;
        const containerY = bookListRef.current.getBoundingClientRect().y;

        if(newY !== oldY){
            
            if(newY > oldY) {
                let y = scrollY + 260 + (newY - containerY);
                if(oldY) {
                    y=y-400;
                }

                updateBookDetailsPosition(y);
            }
            else {
                let y = scrollY + 260 + (newY - containerY);
                updateBookDetailsPosition(y);
            }

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

        GoodReadsService.getBookById(book.goodreadsId).then((bookDetails) => {
            let currentDetails = bookDetailsState;
            currentDetails.metadata = bookDetails;
            currentDetails.isVisible = true;
            currentDetails.book = selectedBook;
            
            updateBookDetails(currentDetails);
        });
    }

    const handleScroll = (event) => {
        if(bookDetailsState.isVisible) {
            let oldY = bookDetailsState.book && bookDetailsState.book.ref.current.getBoundingClientRect().y;
            //updateBookDetailsPosition(oldY + 250);
        }
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
        <div>
            <input type="text" onChange={searchBooks} ></input> <button onClick={searchBooks}>Search</button>
            <div className="book-list" ref={bookListRef} onScroll={handleScroll}>
                
                {bookElements}
                <BookDetails position={bookDetailsPositionState} data={bookDetailsState}></BookDetails>
            </div>
        
        </div>
    )
}

export default BookList;