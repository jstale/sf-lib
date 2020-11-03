import logo from './logo.svg';
import './App.css';

import BookList from './components/BookList/BookList'

const App = () => {
 
    return (
      <div className="App">
        <header className="App-header">
          <h1>Polarisova biblioteka</h1>
          <BookList/>
        </header>
      </div>
    );
  
}

export default App;
