
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ErrorAlert from './components/ErrorAlert';
import Header from './components/Header';
import BrowseTables from './pages/BrowseTables';
import CreateTable from './pages/CreateTable';
import EditTable from './pages/EditTable';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Table from './pages/Table';
import UserPage from './pages/UserPage';

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
          <Route path='/tables' element={<BrowseTables />} />
          <Route path='/tables/new' element={<CreateTable />} />
          <Route path='/tables/:id' element={<Table />} />
          <Route path='/tables/:id/edit' element={<EditTable />} />
          <Route path='/users/:id' element={<UserPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
