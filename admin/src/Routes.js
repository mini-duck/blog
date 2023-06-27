import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from "react-router-dom";
import history from './lib/history'
import Login from './components/Login'
import Register from './components/Register'
import Adminhome from './components/Adminhome'
import App from './App'

function Main() {
    return (
        <div className="App">
            <HistoryRouter history={history}>
                <Routes>
                    <Route exact path='/' element={<App />}></Route>
                    <Route exact path='/login' element={<Login />}></Route>
                    <Route exact path='/register' element={<Register />}></Route>
                    <Route exact path='/admin/*' element={<Adminhome />}></Route>
                </Routes>
            </HistoryRouter>
        </div>

    )
}
export default Main