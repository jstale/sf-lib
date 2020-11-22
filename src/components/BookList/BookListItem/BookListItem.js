import { useEffect, useState, useRef } from 'react'
import './BookListItem.scss'


const BookListItem = (props) => {
    
    useEffect(() => {
        if(props.book.isSelected && props.isDetailsOpen) {
            props.book.ref.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    });


    return <div ref={props.book.ref} className={`book-list-item ${props.book.isSelected ? "selected" : ""} ${props.isDetailsOpen && props.book.isSelected ? "opened" : ""}`} onClick={props.click} >
        <div style={{ display: "block", width: "100%" }}>
            <div className="cover">
                <img src={"images/" + props.book.path + ".jpg"} alt={props.book.path}/>
            </div>
            <div className="description">
                <div>{props.book.title}</div>
                <div>{props.book.author}</div>
            </div>
        </div>
    </div>
}

export default BookListItem;