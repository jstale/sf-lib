import './BookDetails.scss'

const BookDetails = (props) => {

    let metadata = {};
    metadata = { ...props.data.metadata };
    if(metadata.description) {
        metadata.description = metadata.description.replace("<![CDATA[", "")
                                                    .replace("]]>", "");
    }

    const style = {
        top:  props.position
    }

    return <div className={`book-details ${props.data.isVisible ? "shown" : ""}`} style={style}>
            
            <div class="card is-horizontal">
                <div class="card-image">
                    <div className="cover">
                        <img src={props.data.book ? "images/" + props.data.book.path + ".jpg" : ""} alt="cover"/>
                    </div>
                </div>
                <div class="card-content">
                    <div class="media">
                    <div class="media-right">
                        <figure class="image is-48x48">
                            <p><strong>{metadata.averageRating ? metadata.averageRating : "N/A"}</strong></p>
                            <img src="goodreads.gif" alt="Placeholder"/>
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">{props.data.book ? props.data.book.title : ""}</p>
                        <p class="subtitle is-6">{props.data.book ? props.data.book.author : ""}</p>
                    </div>
                    </div>

                    <div class="content">
                        <div className={`pageloader ${props.data.metadata ? "" : "is-active"}`}></div>
                        <div className="description" dangerouslySetInnerHTML={{__html: metadata.description}}></div>
                    </div>
                </div>
                </div>
            
        </div>
}

export default BookDetails;