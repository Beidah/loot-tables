
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Landing from './pages/Landing';

function App() {
  return (
    <>
      <Router>

        <Header />
        <Routes>
          <Route path='/' element={<Landing />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
