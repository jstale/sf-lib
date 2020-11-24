import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import BookService from "../../services/BookService";
import "./BookReader.scss"

const BookReader = (props) => {
    const { id, chapterNumParam, pageNum } = useParams();
    const [ chapter, setChapter ] = useState({});
    const [ page, setPage ] = useState(1);
    const [ chapterEnd, setChapterEnd] = useState(null);
    const [ chapterStart, setChapterStart] = useState(null);
    const [ chapterStats, setChapterStats] = useState({});
    const [ nextMode, setNextMode ] = useState(1);//1 - skip page 2 - skip chapter
    const [ prevMode, setPrevMode ] = useState(2);//1 - skip page 2 - skip chapter

    const observer = useRef(new IntersectionObserver(entries => {
        entries.forEach((entry => {
            if(entry.target.id === "chapterEnd" && entry.isIntersecting)
                setNextMode(2);

            if(entry.target.id === "chapterTitle" && entry.isIntersecting)
                setPrevMode(2);
        }));
        //console.log(firstEntry); 


        
    }, { threshold: 1 }));

    useEffect(() => {
        const chapterEndElement = chapterEnd; // create a copy of the element from state
        const chapterStartElement = chapterStart;
        const currentObserver = observer.current;
      
        if (chapterEndElement) 
            currentObserver.observe(chapterEndElement);

        if(chapterStartElement) 
            currentObserver.observe(chapterStartElement);
        
        return () => {
            if (chapterEndElement)
                currentObserver.unobserve(chapterEndElement);
            if (chapterStartElement) 
                currentObserver.unobserve(chapterStartElement);

          };
    }, [chapterEnd, chapterStart]);

    const chapterNum = chapterNumParam | 1;

    async function fetchBook() {
        console.log("fetchBook start");
        const book = await BookService.getBook(id);
        setChapter(book);
        setNextMode(1);
    }

    useEffect(() => {
        fetchBook();
    }, []);

    const handleNext = async () => {
        if(nextMode === 2) {
            const nextChapter = await BookService.getChapter(id, chapter.index + 1);
            let chapStats = { ...chapterStats };
            chapStats["" + chapter.index] = page;
            setChapterStats(chapStats);
            setChapter(nextChapter);
            setPage(1);
            setNextMode(1);
            setPrevMode(2);
        } else {
            setPrevMode(1);
            setPage(page + 1);
        }
    };

    const handlePrev = async () => {
        if(prevMode === 2) {
            const nextChapter = await BookService.getChapter(id, chapter.index - 1);
            setChapter(nextChapter);
            setPage(chapterStats["" + nextChapter.index]);
            setNextMode(2);
            setPrevMode(1);
        } else {
            setNextMode(1);
            setPage(page - 1);
        }
    };


    let content = null;

    const style = {
        left:  -1695 * (page - 1) + "px"
    }

    if(chapter.index)
    {
        const title = <h2 id="chapterTitle" ref={setChapterStart}>{chapter.title}</h2>
        let paragraphs = chapter.paragraphs.map((p) => <p>{p}</p>);
        paragraphs.push(<div id="chapterEnd" ref={setChapterEnd} onClick={handleNext} style={{ "min-height":"1px", "min-width":"1px"}}></div>);
        content = (<div className="book-reader">
                        <button onClick={handlePrev} className="btn-prev">
                            <span class="icon is-large">
                                <i class="fas fa-angle-left"></i>
                            </span>
                        </button>
                        <button onClick={handleNext} className="btn-next">
                            <span class="icon">
                                <i class="fas fa-angle-right"></i>
                            </span>
                        </button>
                        <div className="columnss" style={style}>
                            {title}
                            <div>{paragraphs}</div>
                        </div>
                    </div>)
    }

    return <div>{content}</div>;
}

export default BookReader;