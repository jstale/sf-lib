import React from  'react'
import BookListItem from './BookListItem/BookListItem'
import BookDetails from './BookDetails/BookDetails'
import BookSearch from './BookSearch'

import BookService from '../../services/BookService'
import GoodReadsService from '../../services/GoodReadsService'
import { useEffect, useState, useRef } from 'react'
import './BookList.scss'


const BookList = () => {
    const [ bookDetailsState, setBookDetails ]  = useState({ isVisible: false, book: null });
    const [ booksState, updateBooks ]  = useState([]);
    const [ filteredBooksState, filterBooks ]  = useState([]);
    const bookDetailsStateRef = useRef(bookDetailsState);
    const bookListRef = React.createRef();

    // Keeps the state and ref equal
    function updateBookDetails(newState) {
        bookDetailsStateRef.current = newState;
        setBookDetails(newState);
    }

    async function fetchBooks() {
        console.log("fetchBooks start");
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

        filteredBooks.map(b => b.isSelected = false);
        sortBooks(filteredBooks);

        if(query.length > 2) {
            filteredBooks = filteredBooks.filter((book) => {
                return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
            });
        }

        filterBooks(filteredBooks);
    }

    const sortBooks = (books) => {
        books.sort((a, b) => {  
            if(a.author < b.author) { return -1; }
            if(a.author > b.author) { return 1; }
        return 0;});
    }

    const resetSelection = (nextSelection) => {
        const filteredBooks = [...filteredBooksState];
        let selectedBook = filteredBooks.find(b => nextSelection.path === b.path);

        filteredBooks.map(b => { b.isSelected = false });

        if(nextSelection) {
            selectedBook = filteredBooks.find(b => nextSelection.path === b.path);
            selectedBook.isSelected = true;
        }

        let bookDetails = {...bookDetailsState};
        bookDetails.book = selectedBook;
        bookDetails.isVisible = false;
        bookDetails.metadata = null;

        updateBookDetails(bookDetails);
        filterBooks(filteredBooks);

        return selectedBook;
    }

    const findBook = async (book) => {
        
        const oldY = bookDetailsState.book && bookDetailsState.book.ref.current?.getBoundingClientRect().y;
        const scrollY = bookListRef.current.scrollTop;
        const containerY = bookListRef.current.getBoundingClientRect().y;

        const selectedBook = resetSelection(book);

        const newY = selectedBook.ref.current.getBoundingClientRect().y;

        if(newY !== oldY) {
            let adjust = 260;
            if(oldY !=null & oldY != undefined && newY > oldY) {
                adjust -= 400;
            }

            const position = scrollY + adjust + (newY - containerY);
            showDetails(position);
        } else {
            showDetails();
        }

        if (book.goodreadsId) {
            GoodReadsService.getBookById(book.goodreadsId).then(bookDetailsHandler);
        } else {
            const originalTitle =  book.originalTitle ?  book.originalTitle.substring(0, book.originalTitle.length - 6) : "";
            //query = query.replace("(", "").replace(")", "");
            GoodReadsService.findBook({title: book.title, originalAuthor: book.originalTitle.split(" ")[0], originalTitle}).then(bookDetailsHandler);
        }
    }

    const showDetails = (position) => {
        let bookDetails = {...bookDetailsStateRef.current};
        bookDetails.isVisible = true;
        bookDetails.position = position || bookDetails.position;
        updateBookDetails(bookDetails);
    }

    const bookDetailsHandler = (bookDetails) => {
        const currentDetails = {...bookDetailsStateRef.current};
        currentDetails.metadata = bookDetails;
        
        updateBookDetails(currentDetails);
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    // ******************************* render ************************************

    let bookElements = [];
    
    if(filteredBooksState) {
        bookElements = filteredBooksState.map((book) =>
            <BookListItem key={book.path} book={book} isDetailsOpen={bookDetailsState.isVisible} click={() => findBook(book)}></BookListItem>
        );
    }
    
    return (
        <section className="section">
            <div style={{width:"100%"}}>
                <BookSearch onChange={searchBooks} />
                <div className="book-list" ref={bookListRef}>
                    
                    {bookElements}
                    <BookDetails data={bookDetailsState}></BookDetails>
                </div>
            
            </div>
        </section>
    )
}

export default BookList;