import './BookDetails.scss'
import { UseEffect } from 'react'

const BookDetails = (props) => {

    UseEffect(() => {
        if(props.book) {
            if (props.book.goodreadsId) {
                GoodReadsService.getBookById(props.book.goodreadsId).then(bookDetailsHandler);
            } else {
                const originalTitle =  props.book.originalTitle ?  props.book.originalTitle.substring(0, props.book.originalTitle.length - 6) : "";
                //query = query.replace("(", "").replace(")", "");
                GoodReadsService.findBook({title: props.book.title, originalAuthor: props.book.originalTitle.split(" ")[0], originalTitle}).then(bookDetailsHandler);
            }
        }
    });


    let metadata = {};
    metadata = { ...props.data.metadata };
    if(metadata.description) {
        metadata.description = metadata.description.replace("<![CDATA[", "")
                                                    .replace("]]>", "");
    }

    const style = {
        top:  props.data.position
    }

    return <div className={`book-details ${props.data.isVisible ? "shown" : ""}`} style={style}>
            
            <div className="card is-horizontal">
                <div className="card-image">
                    <div className="cover">
                        <img src={props.data.book ? "images/" + props.data.book.path + ".jpg" : ""} alt="cover"/>
                    </div>
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
                        <p className="title is-4">{props.data.book ? props.data.book.title : ""}</p>
                        <p className="subtitle is-6">{props.data.book ? props.data.book.author : ""}</p>
                    </div>
                    </div>

                    <div className="content">
                        <div className={`pageloader ${props.data.metadata ? "" : "is-active"}`}></div>
                        <div className="description" dangerouslySetInnerHTML={{__html: metadata.description}}></div>
                    </div>
                </div>
                </div>
            
        </div>
}

export default BookDetails;