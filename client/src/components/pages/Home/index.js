import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../../Navbar"
import './Home.css';


function Home() {

  return (
<<<<<<< HEAD
    <>
        <nav className='navbar'>
          <div className='navbar-container container'>
            <Link to='/' className='navbar-logo' id="nameHead" onClick={closeMobileMenu}>
              
              WePoo
                          </Link>

            <ul className={ 'nav-menu active' }>
              <li className='nav-item'>
                <Link to='/map' className='nav-links' onClick={closeMobileMenu}>
                  Gotta Go
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/player'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Going
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/review'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Gone
                </Link>
              </li>
=======
    <Navbar/>
    
>>>>>>> b6e9ce5e6493b86c37dbe3117e04cf8f852e29c1

  );
}

export default Home;