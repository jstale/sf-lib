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
            <div style={{ display: "flex", width: "70%", margin: "auto" }}>
                <div className="cover">
                    <img src={props.data.book ? "images/" + props.data.book.path + ".jpg" : ""}/>
                </div>
                <div style={{ display: "flex", "flexDirection": "column", "margin": "30px 0 0 50px" , width: "100%" }}>
                    <div>{metadata.averageRating}</div>
                    <div className="description" dangerouslySetInnerHTML={{__html: metadata.description}}></div>
                </div>

            </div>
        </div>
}

export default BookDetails;