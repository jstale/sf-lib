import './BookSearch.scss'

const BookSearch = (props) => (
    <div className="columns book-search">
        <div className="column is-4 is-offset-4">
            <div className="field">
                <div className="control">
                    <input type="text" onChange={props.onChange} placeholder="Search" className="input" ></input> 
                </div>
            </div>
        </div>

    </div>
);


export default BookSearch;