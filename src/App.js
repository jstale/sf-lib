import logo from './logo.svg';
import './App.scss';

import Layout from './components/Layout/Layout'
import BookList from './components/BookList/BookList'
import BookReader from './components/BookReader/BookReader'
import { BrowserRouter, Route } from 'react-router-dom'
const App = () => {
 
    return (
      <BrowserRouter>
        <div className="App">
            <Layout>
              <Route path="/" exact component={BookList}></Route>
              <Route path="/books/:id" exact component={BookReader}></Route>
              <Route path="/books/:id/chapter/:chapterId" exact component={BookReader}></Route>
              <Route path="/books/:id/chapter/:chapterId/page/:pageId" exact component={BookReader}></Route>
              
            </Layout>
        </div>
      </BrowserRouter>
    );
  
}

export default App;
