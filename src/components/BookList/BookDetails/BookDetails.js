import './BookDetails.scss'
import { useState, useEffect } from 'react'
import GoodReadsService from '../../../services/GoodReadsService'
import { Link } from 'react-router-dom'

const BookDetails = (props) => {

    const [ metadata, setMetadata ]  = useState({});

    useEffect(() => {
        if(props.data.book && props.data.isVisible && metadata.id !== props.data.book.goodreadsId) {
            if (props.data.book.goodreadsId) {
                GoodReadsService.getBookById(props.data.book.goodreadsId).then(bookDetailsHandler);
            } else {
                const originalTitle =  props.data.book.originalTitle ?  props.data.book.originalTitle.substring(0, props.data.book.originalTitle.length - 6) : "";
                //query = query.replace("(", "").replace(")", "");
                GoodReadsService.findBook({title: props.data.book.title, originalAuthor: props.data.book.originalTitle.split(" ")[0], originalTitle}).then(bookDetailsHandler);
            }
        }
    });

    const bookDetailsHandler = (bookDetails) => {
        if(bookDetails.description) {
            bookDetails.description = bookDetails.description.replace('<![CDATA[', '').replace(']]>', '');
        }

        setMetadata(bookDetails);
    }

    const style = {
        top:  props.data.position
    }

    const isLoading = props.data.book && (metadata.id !== props.data.book.goodreadsId);
    const content = isLoading ? <div className="pageloader is-active"></div> : <div className="description" dangerouslySetInnerHTML={{__html: metadata.description}}></div>

    return props.data.book ? <div className={`book-details ${props.data.isVisible ? "shown" : ""}`} style={style}>
            <div className="card is-horizontal">
                <div className="card-image">
                    <div className="cover">
                        <img src={`images/${props.data.book.path}.jpg`} alt="cover"/>
                    </div>
                    <Link className="button" to={`books/${props.data.book.path}/chapter/1/page/1`}>Read</Link>
                </div>
                <div className="card-content">
                    <div className="media">
                        <div className="media-right">
                            <figure className="image is-48x48">
                                <p><strong>{metadata.averageRating ? metadata.averageRating : "N/A"}</strong></p>
                                <img src="goodreads.gif" alt="Placeholder"/>
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="title is-4">{props.data.book.title}</p>
                            <p className="subtitle is-6">{props.data.book.author}</p>
                        </div>
                    </div>

                    <div className="content">
                        {content}
                    </div>
                </div>
            </div>
            
        </div> : null
}

export default BookDetails;