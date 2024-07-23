
import React, { useEffect, useRef, useState } from 'react';// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../assets/css/style.css"
import img1 from "../assets/images/id-card.png"

import img2 from "../assets/images/prototype.png"

import img3 from "../assets/images/floor-plan.png"
import { Section11 } from '../features/Sections/Section11';
import Textra from 'react-textra'
import 'react-image-gallery/styles/css/image-gallery.css'
import { postSubscription } from "../utilities/utils";

require('react-img-carousel/lib/carousel.css');


export function Pricing() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sectionHeight, setSectionHeight] = useState('');
  const [isMonthly, setIsMonthly] = useState(true);

const togglePricing = () => {
  console.log("dsads")
  setIsMonthly(!isMonthly);
};
  const sectionRef = useRef(null);
  console.log(isExpanded, "dsad")
  const calculateTableHeight = () => {
    const tableContainer = document.querySelector('.pricingplans-table');
    if (tableContainer) {
      const tableHeight = tableContainer.offsetHeight;
      setSectionHeight(tableHeight + 500 + 'px');
    }
  };

  const expandSection = () => {
    setIsExpanded(!isExpanded);


  };
  useEffect(() => {
    if (!isExpanded) {
      calculateTableHeight();
    } else {
      setSectionHeight('50vh');
    }

    gsap.to('.expandable-section', {
      height: sectionHeight,
      duration: 0.5,
      ease: 'power2.inOut',
    });
  }, [isExpanded])

  useEffect(() => {
    let jsonData = {
      'name': "test",
      'email': "test@test.com",

    }
    calculateTableHeight();

  }, [])

  const handleSubmit = (e) => {
    // handleReCaptchaVerify()



    let jsonData = {
      'name': "PRICING",

      'email': e.target.mail.value,
    }
    postSubscription(jsonData);
    alert("Thanks for submitting,we will get back to you.");
    e.preventDefault();

  }
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 50%',
    });
  }, [isExpanded]);

  return (
    <div >
      <div class="buffer-space-pricing"></div>

      <section class="virtuaL_wrapper section">
        <div class="container">
          <div class="title-price" >Get your <span class='title-price2'>Virtual Store</span> up and running </div>

          <div class="parent-container">
            <form onSubmit={(e) => handleSubmit(e)} id="new-demo-form">
              <div class="input-container">

                <input type="text" class="input-field-price" name="mail" placeholder="Enter your email address" />
                <input type="submit" value="Get Started" className="input-button-price" />
              </div>

            </form>
          </div>
          <div class="subtitle-price">By entering your email, you agree to receive marketing emails </div>

          <button className="pricing-button-Monthly" onClick={togglePricing}>
                  {isMonthly ? 'Monthly' : 'Yearly'}
                </button>
                <span>{isMonthly ? 'Yearly (Save up to 30%)' : ''}</span>
                {/* Add your pricing plan components or logic here */}
          <div className="pricing-columns">
            <div className="pricing-column">
              <div className="pricing-box">
                <h2 className="pricing-title">Drob Essentials</h2>
                <p className="pricing-subtitle">All the essential tools for establishing your store, managing product shipments, and handling payment transactions
</p>
                <p className="pricing-pricing">$29<span className="pricing-pricingmo">/mo</span></p>
                <p className="pricing-subtitle-price">yearly 29$</p>
                <h3 className="pricing-heading">What's included on Basic</h3>
                <ul className="pricing-list">
                  <li>Publish 1 virtual store</li>
                  <br />
                  <li>Add 2D Products (images)</li>
                  <br />

                  <li>General 3D Library access </li>
                  <br />

                  <li>2 Staff Accounts</li>
                  <br />

                  <li>Pre Designed Themes</li>
                </ul>
                <button className="pricing-button2" onClick={() => {
                  if (sectionRef.current) {
                    sectionRef.current.scrollIntoView({
                      behavior: 'smooth', // You can use 'auto' or 'smooth' scrolling
                      block: 'start',     // Scroll to the top of the table
                    });
                  }
                }}>Compare</button>
              </div>
            </div>
            <div className="pricing-column card-container">
              <div className="pricing-text">Highly Reccomended</div>

              <div class="white-section">
                <div className="pricing-box2" >
                  <h2 className="pricing-title">Drob Plus</h2>
                  <p className="pricing-subtitle">Level up your business with professional reporting and more staff accounts</p>
                  <p className="pricing-pricing">$99<span className="pricing-pricingmo">/mo</span></p>
                  <p className="pricing-subtitle-price">Yearly $83</p>
                  <h3 className="pricing-heading">What's included on Standard</h3>
                  <ul className="pricing-list">
                    <li>Publish 1 virtual store</li>
                    <br />
                    <li>Add 2D/3D Products</li>
                    <br />

                    <li>General + Special 3D Library access  </li>
                    <br />

                    <li>3 Staff Accounts</li>
                    <br />

                    <li>Pre Designed Themes</li>
                  </ul>
                  <button className="pricing-button2" onClick={() => {
                    if (sectionRef.current) {
                      sectionRef.current.scrollIntoView({
                        behavior: 'smooth', // You can use 'auto' or 'smooth' scrolling
                        block: 'start',     // Scroll to the top of the table
                      });
                    }
                  }}>Compare</button>
                </div>
              </div>

            </div>
            <div className="pricing-column">
              <div className="pricing-box">
                <h2 className="pricing-title">Drob Gold</h2>
                <p className="pricing-subtitle">Get the best of Shopify with custom reporting and our lowest transaction fees</p>
                <p className="pricing-pricing">$399<span className="pricing-pricingmo">/mo</span></p>
                <p className="pricing-subtitle-price">Yearly $329</p>
                <h3 className="pricing-heading">What's included on Professional</h3>
                <ul className="pricing-list">
                  <li>Publish 1 virtual store</li>
                  <br />
                  <li>Add 2D/3D Products</li>
                  <br />

                  <li>General + Special 3D Library access  </li>
                  <br />

                  <li>3 Staff Accounts</li>
                  <br />

                  <li>Premium Pre-Designed Templates</li>
                </ul>
                <button className="pricing-button3" onClick={() => {
                  if (sectionRef.current) {
                    sectionRef.current.scrollIntoView({
                      behavior: 'smooth', // You can use 'auto' or 'smooth' scrolling
                      block: 'start',     // Scroll to the top of the table
                    });
                  }
                }}>Compare</button>
              </div>
            </div>
          </div>

          <div class='row mb-5'>
            <span class='row' style={{ textAlign: 'left', fontSize: '5rem', fontWeight: 700, marginTop: "20vh" }}><span>features</span></span>
          </div>
          <div className="PricingFeatures-app">
            <div className="PricingFeatures-column">
              <div className="PricingFeatures-rounded-square">
                <img src={img1} alt="Image 1" />
              </div>
              <h2 className="PricingFeatures-title">Virtual store</h2>
              <p className="PricingFeatures-subtitle">Build an online store with METADROB’s no-code virtual store creation tool.</p>
            </div>

            <div className="PricingFeatures-column">
              <div className="PricingFeatures-rounded-square">
                <img src={img1} alt="Image 2" />
              </div>
              <h2 className="PricingFeatures-title">Staff Accounts</h2>
              <p className="PricingFeatures-subtitle">Add A sales representative </p>
            </div>

            <div className="PricingFeatures-column">
              <div className="PricingFeatures-rounded-square">
                <img src={img2} alt="Image 3" />
              </div>
              <h2 className="PricingFeatures-title">Custom 3D Products</h2>
              <p className="PricingFeatures-subtitle">Add A sales representative </p>
            </div>

            <div className="PricingFeatures-column">
              <div className="PricingFeatures-rounded-square">
                <img src={img3} alt="Image 4" />
              </div>
              <h2 className="PricingFeatures-title">Pre Designed Themes</h2>
              <p className="PricingFeatures-subtitle">Start designing your virtual store with predesigned virtual store 3d floor layouts.</p>
            </div>
          </div>
        </div>





        {/* Create the expandable section */}
        <div
          ref={sectionRef}
          className="expandable-section"
          style={{ height: sectionHeight, background: 'white', overflow: 'hidden' }}
        >
          {/*<button className="pricingplans-button" onClick={expandSection}>
           {!isExpanded ? '+ Open Table' : '- Close Table'}

         </button> */}

          {/* Content for the expandable section */}

          <>
            <h2 class="pricing-table-heading">Compare All Plans</h2>
            {/* Content for the expandable section */}

            <div class="tableContainer">
              <table className="pricingplans-table">
                <tbody>
                  <tr>
                    <th></th>
                  </tr>
                  <tr class="dark-background">
                    <td>Pricing</td>
                  </tr>
                  <tr class="light-background">
                    <td>Pay Monthly</td>
                  </tr>
                  <tr class="light-background">
                    <td >Pay yearly</td>
                  </tr>
                  <tr class="dark-background">
                    <td >Features</td>
                  </tr>
                  <tr>
                    <td>Themes  <span class="subtitle-table" >Build an online store with metadrob's no-code virtual store creation tool</span>
                    </td>
                  </tr>

                  <tr >
                    <td>Number of Stores Draft</td>
                  </tr>

                  <tr >
                    <td>Number of Products</td>
                  </tr>
                  <tr >
                    <td>Staff Accounts <span class="subtitle-table">Build an online store with metadrob's no-code virtual store creation tool</span></td>
                  </tr>
                  <tr >
                    <td>3D Product Library Access <span class="subtitle-table">Build an online store with metadrob's no-code virtual store creation tool</span></td>
                  </tr>
                  <tr >
                    <td>Upload Limit of Objects</td>
                  </tr>
                  <tr >
                    <td>Multiplayer</td>
                  </tr>
                  <tr >
                    <td>Per person in Room</td>
                  </tr>

                  <tr >
                    <td>Number of rooms/lobby/channels</td>
                  </tr>

                  <tr >
                    <td>Waiting Room</td>
                  </tr>
                  <tr >
                    <td>Custom room creation (per month)</td>
                  </tr>
                  <tr >
                    <td>Staff accounts</td>
                  </tr>
                  <tr >
                    <td>Analytics</td>
                  </tr>
                  <tr >
                    <td>White labelling</td>
                  </tr>

                  <tr >
                    <td>Plugin</td>
                  </tr>
                  <tr >
                    <td>Abandon Card Recovery</td>
                  </tr>
                  <tr >
                    <td>Staff training</td>
                  </tr>

                  <tr >
                    <td>24/7 support</td>
                  </tr>
                  <tr >
                    <td>Number of store can Publish</td>
                  </tr>
                  <tr >
                    <td>Dedicated Support Staff</td>
                  </tr>
                  <tr >
                    <td>Staff training</td>
                  </tr>
                  <tr >
                    <td>Product Integration and store creation</td>
                  </tr>

                  <tr >
                    <td>Loyalty points/rewards for monthly basis</td>
                  </tr>
                  <tr >
                    <td>Referral bonus/points</td>
                  </tr>
                  <tr >
                    <td>Buy more rooms</td>
                  </tr>

                </tbody>
              </table>

              <div class="contentHolder">
              <table className="pricingplans-table content">
                <tbody>
                  <tr >
                   <th className="header-cell">Drob Essentials</th> {/* Second column */}
                   <th className="header-cell">Drob Plus</th> {/* Second column */}
                    <th className="header-cell">Drob Gold</th> {/* Second column */}
                  </tr>
                  <tr class="dark-background">
                    <td></td> {/* Second column content */}
                    <td></td> {/* Third column content */}
                    <td></td> {/* Fourth column content */}
                  </tr>

                  <tr class="light-background">
                    <td>$29</td> {/* Second column content */}
                    <td>$99</td> {/* Third column content */}
                    <td>$399</td> {/* Fourth column content */}
                  </tr>

                  <tr class="light-background">
                    <td>$24</td> {/* Second column content */}
                    <td>$83</td> {/* Third column content */}
                    <td>$329</td> {/* Fourth column content */}
                  </tr>

                  <tr class="dark-background">
                    <td></td> {/* Second column content */}
                    <td></td> {/* Third column content */}
                    <td></td> {/* Fourth column content */}
                  </tr>

                  <tr>

                  <td> <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="green" // Set the fill color to green
                    width="24px" // Set a smaller width and height (e.g., 24px)
                    height="24px"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg></td> {/* Second column content */}
                  <td> <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="green" // Set the fill color to green
                    width="24px" // Set a smaller width and height (e.g., 24px)
                    height="24px"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg></td> {/* Third column content */}
                  <td> <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="green" // Set the fill color to green
                    width="24px" // Set a smaller width and height (e.g., 24px)
                    height="24px"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg></td> {/* Fourth column content */}

                </tr>

                <tr >
                  <td>05</td> {/* Second column content */}
                  <td>15</td> {/* Third column content */}
                  <td>30</td> {/* Fourth column content */}
                </tr>

                <tr>
                  <td>30</td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>2 Accounts</td>
                  <td>3 Accounts</td>
                  <td>8 Accounts</td>
                </tr>
                <tr>

                  <td>General</td>
                  <td>General + Special</td>
                  <td>General + Special</td>
                </tr>
                <tr>
                  <td>Only 2D</td>
                  <td>Both 2D and 3D</td>
                  <td>Both 2D and 3D</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>10</td>
                  <td>20</td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>03</td>
                  <td>08</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>No</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>03</td>
                  <td>08</td>
                </tr>
                <tr>
                  <td>Basic</td>
                  <td>Basic</td>
                  <td>Basic</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>No</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Limited Time</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Advanced Rewards</td>
                </tr>
                <tr>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td  class="buttonTd"><a href="https://www.metadrob.com/vs/register"><button className="pricing-button1">Get Started</button></a></td>
                  <td  class="buttonTd"><a href="https://www.metadrob.com/vs/register"><button className="pricing-button1">Get Started</button></a></td>
                  <td  class="buttonTd"><a href="https://www.metadrob.com/vs/register"><button className="pricing-button1">Get Started</button></a></td>
                </tr>

                </tbody>
              </table>
              </div>

            </div>



          </>

        </div>



      </section>



    </div>
  );
}

export default Pricing;
