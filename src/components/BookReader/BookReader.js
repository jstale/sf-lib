import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Helmet } from 'react-helmet'
import BookService from "../../services/BookService";
import "./BookReader.scss"

const BookReader = (props) => {
    const { id, chapterId, pageId } = useParams();
    const [ book, setBook ] = useState({});
    const [ chapter, setChapter ] = useState({});
    const [ page, setPage ] = useState(1);
    const [ lastPage, setLastPage ] = useState(0);
    const [ isInit, setIsInit ] = useState(null);
    const [ chapterEnd, setChapterEnd] = useState(null);
    const [ chapterStart, setChapterStart] = useState(null);
    const [ nextMode, setNextMode ] = useState(1);//1 - skip page 2 - skip chapter
    const [ prevMode, setPrevMode ] = useState(1);//1 - skip page 2 - skip chapter
    const pageRef = useRef(page);
    const isInitRef = useRef(isInit);
    const chapterRef = useRef(chapter);

    function updatePage(newPage) {
        pageRef.current = newPage;
        setPage(newPage);
    }

    function updateIsInit(newIsInit) {
        isInitRef.current = newIsInit;
        setIsInit(newIsInit);
    }

    function updateChapter(newChapter) {
        chapterRef.current = newChapter;
        setChapter(newChapter);
    }

    const observer = useRef(new IntersectionObserver(entries => {
            const start = entries.find(entry => entry.target.id === "chapterTitle");
            const end = entries.find(entry => entry.target.id === "chapterEnd");

            if(start?.isIntersecting && !end){
                setNextMode(1);
                setPrevMode(2);
            }

            if(end) {
                if((!start && end.isIntersecting) || (isInitRef.current === false && start && !start.isIntersecting && end.isIntersecting)){
                    setNextMode(2);
                    setPrevMode(1);
                }
                else if(start?.isIntersecting && end.isIntersecting) {
                    setNextMode(2);
                    setPrevMode(2);
                } else if (start?.isIntersecting && !end.isIntersecting){
                    setNextMode(1);
                    setPrevMode(2);
                } else if(!end.isIntersecting) {
                    setNextMode(1);
                }

                
                if(pageRef.current == -1){
                    const currentX = start?.target.getBoundingClientRect().x || 0;
                    const newLastPage = getLastPage(end.target.getBoundingClientRect().x, currentX);
                    gotoLastPage(chapterRef.current.index, newLastPage);
                    setLastPage(newLastPage);
                }
            }
    }, { threshold: 0.2 }));

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
        updateIsInit(true);
        console.log("fetchBook start");
        const books = await BookService.getBooks();
        const book = books.find(b => b.path === id);
        setBook(book);
        const chapter = await BookService.getChapter(id, chapterId);
        updateChapter(chapter);
        updatePage(parseInt(pageId));
        setNextMode(1);
    }

    const getLastPage = (x, offset) => {
        return Math.trunc((x - offset) / (window.innerWidth + 15)) + 1;
    }

    const gotoLastPage = (chapt, lastPage) => {
        updatePage(lastPage);
        props.history.push(`/books/${id}/chapter/${chapt}/page/${lastPage}`);
        setNextMode(2);
        if(lastPage === 1) {
            setPrevMode(2);
        } else {
            setPrevMode(1);
        }
    }

    useEffect(() => {
        fetchBook();
    }, []);


    useEffect(() => {
        if(chapterStart && chapterEnd) {
            const endX = chapterEnd?.getBoundingClientRect()?.x || 0;
            const startX = chapterStart?.getBoundingClientRect()?.x || 0;
            let newLastPage = getLastPage(endX, startX);

            if(isInit === true) {
                updateIsInit(false);
                newLastPage += 1;
            }

            if(page > newLastPage) {
                newLastPage = page;
            }
            
            setLastPage(newLastPage);
        }
    }, [chapterStart, chapterEnd, page]);

    const handleNext = async () => {
        if(nextMode === 2) {
            const nextChapter = await BookService.getChapter(id, chapter.index + 1);
            setLastPage(0);
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
        if(prevMode === 2 && chapter.index > 1) {
            setLastPage(0);
            const nextChapter = await BookService.getChapter(id, chapter.index - 1);
            updatePage(-1);
            updateChapter(nextChapter);            
        } else if(prevMode === 1 && page > 1) {
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
        let paragraphs = chapter.paragraphs.map((p, i) => <p key={"p"+i} id={i}>{p}</p>);
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
                        <div>Chapter: {chapter.index} Page:{page}/{lastPage}</div>
                    </div>)
    }

    return <div>{content}
            <Helmet>
          <title>{ book?.title }</title>
        </Helmet>
    </div>;
}

export default BookReader;