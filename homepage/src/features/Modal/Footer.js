import React from 'react';
import './Footer.css'; // Create a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <img src="https://gcpsucks.s3.ap-south-1.amazonaws.com/ADPL-Logo-white-transparent+3.png" alt="Logo" className="footer-logo" />
        <div class="lel split-text">Aroras Designs PVT. LTD. India’s first IT based garment manufacturing company. But that's not all! Exciting news awaits as ADPL is launching a virtual shopping experience, allowing you to dress your own avatar!</div>
        </div>
        <div className="footer-column">
          <h3>Site Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Advance technology</a></li>
            <li><a href="#">Advance Machines</a></li>
            <li><a href="#">Produt Development</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Useful Links</h3>
          <ul>
            <li><a href="#">Collaboration</a></li>
            <li><a href="#">Jobs</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <p>CONTACT

H1/22, RIICO Industrial Area,
Mansarovar,Jaipur, Raj-302020

technology@adpl.com

1800-570-2122

</p>
        </div>
      </div>
      <div className="copyright">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
