import logo from './logo.svg';
import './App.scss';

import Layout from './components/Layout/Layout'
import BookList from './components/BookList/BookList'

const App = () => {
 
    return (
      <div className="App">
          <Layout>
            < BookList/>
          </Layout>
      </div>
    );
  
}

export default App;
