import React from 'react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';

function Nav() 
{
  const auth = localStorage.getItem('user');
  console.log(auth);
  const navigate = useNavigate();
    const logout = () => 
    {
        localStorage.clear();
        navigate("/signup");
    }
    const login = () => 
  {
      localStorage.clear();
      navigate("/signup");
  }

  return (
    <div className='nav'>
      {auth ? (
       <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add">Add</Link></li>
        <li><Link to="/update">Update</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link onClick={logout} to="/signup">Logout</Link>
        <span className='text-white'>({JSON.parse(auth).name})</span></li> 
       </ul>
         ) : (
          <ul>
            <li>
              <Link onClick={login} to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        )}
    </div>
  )
}

export default Nav;
