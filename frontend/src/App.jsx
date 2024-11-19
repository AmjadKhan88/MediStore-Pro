import { useContext, useEffect, useState } from 'react'
import './App.css'
import NavbarTop from './components/Navabr/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { StoreContext } from './Context/ContextApi'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
const [token,setToken] = useState('');
const navigate = useNavigate();
const location = useLocation();

const checkToken = () => {
    if(localStorage.getItem('medicineToken')){
      setToken(localStorage.getItem('medicineToken'));
    }else{
      navigate('/login');
    }
}

useEffect( () => {
   checkToken();
}, [location]);



  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <NavbarTop />
      <div className="row">
        <div className="col-md-2 sidebar">
          <Sidebar />
        </div>
        <div className="col-md-10">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App
