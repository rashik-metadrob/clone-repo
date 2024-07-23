import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import '../../assets/css/style.css';
import logo from '../../assets/images/logo/logo-2x.png';
import logoo from '../../assets/images/apple-touch-icon.png';

import { useSelector, useDispatch } from 'react-redux';
import {
  toggle,
  bookModalStatus

} from '../Slices/bookModalSlice';
import {
  increment,

} from '../counter/counterSlice';
export function Header() {
  const isMobileView = window.innerWidth <= 768; // Define the breakpoint for mobile view
  let dispatch=useDispatch()
  const handleModal=(e)=>{
    dispatch(toggle());


  }
  return (
    <div>
    <span className="rtest">
      <div className="navB">
        <div className="navB-title">
          <div>
            <Link to="/" className="logo-img">
              <img width={'30%'} src={logo} alt="" />
            </Link>
          </div>
        </div>

        <input id="menu-toggle" type="checkbox" />
        <label className="menu-button-container" htmlFor="menu-toggle">
          <div className="menu-button"></div>
        </label>

        <div className="menu">
          <span className="navHome mt-4 hvrCls">
            <Link to="/">Home</Link>
          </span>
          <span className="mt-4 abtUs hvrCls">
            <Link to="/aboutus">About Us</Link>
          </span>
          <span className="mt-4 abtUs hvrCls">
          <Link to="/services">Services</Link>
          </span>
          {/* <span className="mt-4 abtUs hvrCls">
            <Link to="/Pricing">Pricing</Link>
          </span> */}
          <span className="mt-4 navBlog hvrCls">
            <Link to="/blogs">Blogs</Link>
          </span>


{       /*     <div className="dropdown my-custom-dropdown2">
              <button className="dropdown-btn mt-4 hvrCls">Industry</button>
              <div className="dropdown-menu my-custom-dropdown">
                <Link to="/fashion">Fashion</Link>
                <Link to="/automobile">Automobile</Link>
                <Link to="/furniturestore">Furniture</Link>

              </div>
            </div>
          */}


          <span className="mt-4 ctUs hvrCls">
          <Link to="/ContactUs">Contact Us</Link>

          </span>
          <span>
            <a
              data-bs-toggle="modal"
              data-bs-target="#bookdemo"
              className={isMobileView ? '' : 'navDemo'}
               onClick={handleModal}
            >
Get started            </a>
          </span>
        </div>
      </div>
      </span>
      <header class="header">

<input class="menuu-btn" type="checkbox" id="menuu-btn" />

<label class="menuu-icon" for="menuu-btn"><span class="navicon"></span></label>
<img width={'10%'} style={{marginLeft:"1vw",marginTop:"4vw"}} src={logoo} alt="" />

<ul class="menuu">
  <li>           <Link to="/">Home</Link>
</li>
  <li>               <Link to="/aboutus">About Us</Link>
</li>
  <li>            <Link to="/Pricing">Pricing</Link>
</li>
  <li>            <Link to="/blogs">Blogs</Link>
</li>

  <li>
  <Link to="/services">Services</Link>

  </li>



  <li>
  <Link to="/ContactUs">Contact Us</Link>

  </li>
  <li>
  <a
    data-bs-toggle="modal"
    data-bs-target="#bookdemo"
    className={isMobileView ? '' : 'navDemo'}
     onClick={handleModal}
  >
Get started  </a>
  </li>

</ul>
</header>
    </div>
  );
}

export default Header;
