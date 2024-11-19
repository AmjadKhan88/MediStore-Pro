import { Link, NavLink, useNavigate } from 'react-router-dom';
import {assets} from '../../assets/assets';
import './Navbar.css'
import { AiOutlineLogout } from "react-icons/ai";
function NavbarTop() {
  const navigate = useNavigate();
  const logout = () => {
      if(confirm('Are you sure you want to logout?')) { 
          localStorage.removeItem("medicineToken");
          navigate('/login');
      }
  }
  return (
    <>
      <div style={{ backgroundColor: "#f5f4f2" }}>
        <header className="container d-flex justify-content-around gap-5 align-items-center">
          <div className="logo">
            <img src={assets.logo} alt="" />
            <span>
              <strong>M</strong>edical Store
            </span>
          </div>
          <div className="menu">
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/docs"}>Docs</NavLink>
            <NavLink to={"/about"}>About</NavLink>
            <NavLink to={"/contact"}>Contact Us</NavLink>
          </div>
          <div className="profile">
            <img src={assets.profile_logo} alt="" />
            <div>
              <Link>profile</Link>
              <Link>settings</Link>
              <button onClick={logout}>
                <AiOutlineLogout className="me-1" /> logout
              </button>
            </div>
          </div>
        </header>
      </div>
      <hr className="header-hr" />
    </>
  );
}

export default NavbarTop;
