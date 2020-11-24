import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import BookService from "../../services/BookService";
import "./BookReader.scss"

const BookReader = (props) => {
    const { id, chapterId, pageId } = useParams();
    const [ chapter, setChapter ] = useState({});
    const [ page, setPage ] = useState(1);
    const [ chapterEnd, setChapterEnd] = useState(null);
    const [ chapterStart, setChapterStart] = useState(null);
    const [ chapterStats, setChapterStats] = useState({});
    const [ nextMode, setNextMode ] = useState(1);//1 - skip page 2 - skip chapter
    const [ prevMode, setPrevMode ] = useState(2);//1 - skip page 2 - skip chapter
    const pageRef = useRef(page);
    const chapterRef = useRef(chapter);

    function updatePage(newPage) {
        pageRef.current = newPage;
        setPage(newPage);
    }

    function updateChapter(newChapter) {
        chapterRef.current = newChapter;
        setChapter(newChapter);
    }

    const observer = useRef(new IntersectionObserver(entries => {
        entries.forEach((entry => {
            if(entry.target.id === "chapterEnd" && entry.isIntersecting) {
                setNextMode(2);
                setPrevMode(1);
            }

            if(entry.target.id === "chapterTitle" && entry.isIntersecting) {
                setNextMode(1);
                setPrevMode(2);
            }

            if(entry.target.id === "chapterEnd" && !entry.isIntersecting) {
                if(pageRef.current == -1){
                    const lastPage = getLastPage(entry.target);
                    gotoLastPage(lastPage);
                }
            }
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

    async function fetchBook() {
        console.log("fetchBook start");
        const chapter = await BookService.getChapter(id, chapterId);
        updateChapter(chapter);
        setNextMode(1);
    }

    const getLastPage = (target) => {
        return Math.trunc(target.getBoundingClientRect().x / window.innerWidth) + 1;
    }

    const gotoLastPage = (lastPage) => {
        updatePage(lastPage);
        props.history.push(`/books/${id}/chapter/${chapterRef.current.index}/page/${lastPage}`);
        setNextMode(2);
        setPrevMode(1);
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
            updateChapter(nextChapter);
            updatePage(1);
            props.history.push(`/books/${id}/chapter/${nextChapter.index}/page/1`);
            setNextMode(1);
            setPrevMode(2);
        } else {
            setPrevMode(1);
            updatePage(page + 1);
            props.history.push(`/books/${id}/chapter/${chapter.index}/page/${page + 1}`);
        }
    };

    const handlePrev = async () => {
        if(prevMode === 2) {
            const nextChapter = await BookService.getChapter(id, chapter.index - 1);
            const lastPage = chapterStats["" + chapter.index] || -1;
            if(lastPage) {
                gotoLastPage(lastPage);
            }
            else {
                updatePage(lastPage);
            }
            //props.history.push(`/books/${id}/chapter/${nextChapter.index}/page/-1`);
            updateChapter(nextChapter);            
        } else {
            setNextMode(1);
            updatePage(page - 1);
            props.history.push(`/books/${id}/chapter/${chapter.index}/page/${page - 1}`);
        }
    };


    let content = null;

    const style = {
        left:  "calc(-" + (100 * (page - 1)) + "%" + " - " + (15 * (page - 1)) + "px)"
    }

    if(chapter.index)
    {
        const title = <h2 id="chapterTitle" ref={setChapterStart}>{chapter.title}</h2>
        let paragraphs = chapter.paragraphs.map((p, i) => <p key={i} id={i}>{p}</p>);
        paragraphs.push(<div id="chapterEnd" ref={setChapterEnd} onClick={handleNext} style={{ "minHeight":"1px", "minWidth":"1px"}}></div>);
        content = (<div className="book-reader">
                        <button onClick={handlePrev} className="btn-prev">
                            <span className="icon is-large">
                                <i className="fas fa-angle-left"></i>
                            </span>
                        </button>
                        <button onClick={handleNext} className="btn-next">
                            <span className="icon">
                                <i className="fas fa-angle-right"></i>
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