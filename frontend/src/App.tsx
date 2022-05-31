
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Landing from './pages/Landing';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <Router>

        <Header />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
