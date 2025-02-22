import React, { useState, useEffect } from 'react';
import '../components/css/login.css';
import loginlogo from '../logo/indexlogo.png';
import logo from '../logo/sidebarlogo.png';
import { useNavigate } from 'react-router-dom';

import { BASE_URL } from "./config";

const Login = () =>
{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), 
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate("/");
      } else {
        setErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Network error, please try again.");
      console.error("Network Error:", error);
    } 
    finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="container-fluid logincontainer">
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={login}>
              <img src={logo} alt="" height="70" className="form-logo" style={{ align: "right" }} />
              <div className="form mt-3">
                <h3 className="mt-2">Login</h3>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="mb-3">
                  <label>Username</label>
                  <input type="text" className="form-control mt-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" className="form-control mt-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
                </div>
                <div className="mb-3 row mt-4">
                  <div className="col-12 loginbtn">
                    <center>
                      // <button type="submit" className="btn btn-1 hover-filled-slide-down" disabled={loading}>
                      //   {loading ? <span>Loading...</span> : <span>Login</span>}
                      // </button>
                  <button type="submit" className="btn btn-1 hover-filled-slide-down">Login</button>

                    </center>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <img src={loginlogo} className="image from-img" alt="2nd Pic" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
