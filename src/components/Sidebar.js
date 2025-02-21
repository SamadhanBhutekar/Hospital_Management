import React, { useState,useRef } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../logo/sidebarlogo.png";
import { useEffect } from "react";
<<<<<<< HEAD
=======
import {BASE_URL} from './config';

>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
function Sidebar({ isActive, handleToggle }) 
{
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const navigate = useNavigate;
  const [activePath, setActivePath] = useState(window.location.pathname);
  const dropdownRef = useRef(null); 

  const path = window.location.pathname;  
  const segment = path.split('/').pop(); 


  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(() => {
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      sessionStorage.setItem("visited", "true");
      return false;
    }
    const savedState = sessionStorage.getItem("dropdownState");
    return savedState === "true";
  });

  
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => {
      const newState = !prevState;
      sessionStorage.setItem("dropdownState", newState);
      return newState;
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.item1') && !e.target.closest('.sub-menu1')) {
        setIsDropdownOpen(false);
        sessionStorage.setItem("dropdownState", "false"); 
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handlePathChange = () => setActivePath(window.location.pathname);
    window.addEventListener("popstate", handlePathChange);

    return () => window.removeEventListener("popstate", handlePathChange);
  });

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
      <div
        id="sidebar"
        className={isActive ? "sidebar-open" : "sidebar-closed"}>
        <nav>
          <div className="logoconent">
            <Link to="/">
              <img src={logo} alt="logo" width={"40px"} height={"40px"} className="sidebarlogo"/>{" "}
            </Link>
            <label className="logotitle mt-3">GRSS</label>
          </div>
          <hr></hr>

          <ul>
            <li className={activePath === "/" ? "active-link" : ""}>
              <Link to="/" activeclassname="active-link" onClick={() => setActivePath("/")}>
                <span className="icon"><i className="fas fa-th"></i></span>
                <span className="title">Dashboard</span>
              </Link>
            </li>

            <li className={activePath === "/registartion" ? "active-link" : ""}>
              <Link to="/registartion" onClick={() => setActivePath("/registartion")}>
                <span className="icon"><i className="far fa-file-alt"></i></span>
                <span className="title">Registration</span>
              </Link>
            </li>

            <li className={activePath === "/transction" ? "active-link" : ""}>
              <Link to="/transction" onClick={() => setActivePath("/transction")}>
                <span className="icon"> <i className="fas fa-donate"></i></span>
                <span className="title">Transaction</span>
              </Link>
            </li>
 
            <li className="item1 dropdowndesktopview">
              <div className="sub-btn1" onClick={toggleDropdown}>
                <span className="icon1"><i className="fas fa-edit"></i></span>
                <span className="title1">Modification</span>
                <i className={`fas fa-angle-right dropdown ${isDropdownOpen ? "rotate" : ""}`}></i>
              </div>
              <ul ref={dropdownRef} className={`sub-menu1 ${isDropdownOpen ? "show1" : ""}`}>
                <li style={{ color: segment === "package_modification" ? "#0dcaf0" : "" }}>
                  <Link  to="/package_modification" onClick={(e) => e.stopPropagation()}>
                    Package Modification
                  </Link>
                </li>
                <li style={{ color: segment === "attedence_modification" ? "#0dcaf0" : "" }}>
                  <Link to="/attedence_modification" onClick={(e) => e.stopPropagation()}>
                    Attendant Modification
                  </Link>
                </li>
              </ul>
            </li>

            <li className="item drodownmobileview" >
              <div className="sub-btn" onClick={toggleDropdown1}>
                <span className="icon"><i className="fas fa-edit"></i></span>
                <span className="title">Modification</span>
                <i className={`fas fa-angle-right dropdown ${isDropdownOpen1 ? "rotate" : ""}`}></i>
              </div>
              <ul className={`sub-menu ${isDropdownOpen1 ? "show" : ""}`}>
                <Link to="/package_modification">Package Modification</Link>
                <Link to="/attedence_modification">Attendant Modification</Link>
              </ul>
            </li>

            <li className={activePath === "/checkinsearch" ? "active-link" : ""}>
              <Link to="/checkinsearch" onClick={() => setActivePath("/checkinsearch")}>
                <span className="icon"><i className="fa-solid fa-user-check"></i></span>
                <span className="title">Check In</span>
              </Link>
            </li>

            <li className={activePath === "/reports" ? "active-link" : ""}>
              <Link to="/reports" onClick={() => setActivePath("/reports")}>
                <span className="icon"><i className="fas fa-file-alt"></i></span>
                <span className="title">Report</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div id="main-content" className={isActive ? "sidebar-open" : "sidebar-closed"}>
        <div id="header">
<<<<<<< HEAD
          <div className="activelabel" style={{display:"inline-block"}}>
            <label className="" style={{color:"#94a3b8"}}>
=======
         
          <div className="activelabel" style={{display:"inline-block"}}>
            <label className="mx-3" style={{color:"#94a3b8"}}>
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
                {activePath === "/" ? "Late Dr. M. V. Govilkar Rugna Seva Sadan" : ""}
              </label>
              <label className="" style={{color:"#94a3b8"}}>
                {activePath === "/registartion" ? "Patient Registration" : ""}
              </label>
              <label className="" style={{color:"#94a3b8"}}>
                {activePath.startsWith("/addattendant/") ? "Add Attendant" : ""}
              </label>
              <label className="" style={{color:"#94a3b8"}}>
                {activePath.startsWith("/package_charges/") ? "Package Modification" : ""}
              </label>
              <label className="" style={{color:"#94a3b8"}}>
              {activePath.startsWith("/transactionHistory/") ? "Reservation and Account Details" : ""}
              {activePath.startsWith("/accountHistory/") ? "Reservation and Account Details" : ""}   
              </label>
              <label style={{color:"#94a3b8"}}>
              {activePath.startsWith("/print/") ? "Invoice" : ""}   
              </label>
            </div>
            <div className="" >
            <Link onClick={logout}>
              <span className="signout"><i className="fas fa-sign-out-alt"></i></span>
            </Link>
            <div className="toggle1" onClick={handleToggle} style={{ color: "#94a3b8 !important",width:"100px" }}>
              <span className="icon"> <i className="fas fa-bars"></i></span>
            </div>
            <div className="toggle" onClick={handleToggle} style={{ color: "#94a3b8 !important",  width:"10px" }}>
              <span className="icon"><i className="fas fa-bars"></i></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
