import './BookDetails.scss'

const BookDetails = (props) => {

    let metadata = {};
    if(props.data.metadata && props.data.metadata.description) {
        metadata = { ...props.data.metadata };
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
                        <img src={props.data.book ? "images/" + props.data.book.path + ".jpg" : ""}/>
                    </div>
                </div>
                <div class="card-content">
                    <div class="media">
                    <div class="media-right">
                        <figure class="image is-48x48">
                            <p><strong>{metadata.averageRating}</strong></p>
                            <img src="goodreads.gif" alt="Placeholder image"/>
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">{props.data.book ? props.data.book.title : ""}</p>
                        <p class="subtitle is-6">{props.data.book ? props.data.book.author : ""}</p>
                    </div>
                    </div>

                    <div class="content">
                        <div className="description" dangerouslySetInnerHTML={{__html: metadata.description}}></div>
                    </div>
                </div>
                </div>
            
        </div>
}

export default BookDetails;