import React from 'react'
import './Sidebar.css'
import { AiFillDashboard } from "react-icons/ai";
import { GiMedicines } from "react-icons/gi";
import { FaPersonHiking } from "react-icons/fa6";
import { PiWarningCircle } from "react-icons/pi";
import { GiEmptyWoodBucketHandle } from "react-icons/gi";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaMandalorian } from "react-icons/fa";

import {NavLink} from 'react-router-dom'
function Sidebar() {
    
  return (
    <div className="sidebar-content">
      <NavLink to="/">
        <AiFillDashboard className="icon text-primary" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/medicine">
        <GiMedicines className="icon text-success" />
        <span>Medicine</span>
      </NavLink>
      <NavLink to="/category">
        <BiSolidCategoryAlt className="icon text-secondary" />
        <span>Category</span>
      </NavLink>
      <NavLink to="/headmans">
        <FaMandalorian className="icon text-secondary" />
        <span>Headmans</span>
      </NavLink>
      <NavLink to="/patients">
        <FaPersonHiking className="icon text-info" />
        <span>Patints</span>
      </NavLink>
      <NavLink to="/expiry">
        <PiWarningCircle className="icon text-warning" />
        <span>Close to expiry</span>
      </NavLink>
      <NavLink to="/finished">
        <GiEmptyWoodBucketHandle className="icon text-danger" />
        <span>Finished medicine</span>
      </NavLink>
    </div>
  );
}

export default Sidebar
