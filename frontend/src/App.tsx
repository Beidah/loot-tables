
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ErrorAlert from './components/ErrorAlert';
import Header from './components/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <Router>
        <Header />
        <ErrorAlert />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
