import logo from './logo.svg';
import './App.scss';

import BookList from './components/BookList/BookList'

const App = () => {
 
    return (
      <div className="App">
          <section className="section">
            <div className="container">
              <h1 className="title">
                Polarisova SF biblioteka
              </h1>
            </div>
          </section>
          <section className="section">
          <BookList/>
          </section>
      </div>
    );
  
}

export default App;
