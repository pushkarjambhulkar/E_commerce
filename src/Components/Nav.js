import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
 // Adjust the path based on your new directory structure


const Nav = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");
  const userName = localStorage.getItem("userName");

  const logout = () => {
    localStorage.clear();
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
     <img 
          alt='logo'
          src='https://static.vecteezy.com/system/resources/previews/016/471/452/original/abstract-modern-ecommerce-logo-ecommerce-logo-design-shop-logo-design-template-creative-ecommerce-logo-vector.jpg'
          style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            float: 'left',
            marginTop: '3px',
            marginLeft: '10px', // corrected from 'margin: left 10px'
          }}
        />
      <div className="container-fluid">
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {auth ? (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-products">Add Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/update-products">Update Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile"> Profile</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={logout}>Logout ({(JSON.parse(auth).name)})</button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              
            </ul>
          )}
          
        </div>
      </div>
    </nav>
  );
};

export default Nav;
