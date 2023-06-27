import 'antd/dist/antd.min.css'
import MyList from './components/List'
import Details from './components/Details'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<MyList/>}></Route>
          <Route exact path='/details' element={<Details/>}></Route>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
