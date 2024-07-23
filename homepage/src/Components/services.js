
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';

import "../assets/css/style.css"

import RealV from "../assets/RealV.json";
import VTryO from "../assets/VTryO.json";
import { Section11} from '../features/Sections/Section11';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from 'react-router-dom';

import Section6 from '../features/Sections/Section6';
import Section13 from '../features/Sections/Section13';

import { AnimationOnScroll } from 'react-animation-on-scroll';
import Lottie from "lottie-react";


const SCreate = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/SCreate.webp"
const VTRNPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/VTRN.webp"
const Grp624Png = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Grp624.webp"
const ArrowPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Arrow.webp"
const ArrowLPng = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/ArrowL.webp"
const EnderImg = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/ender.webp"
const MGrp34 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/123+1.webp"


const handleContextMenu = (event) => {
  event.preventDefault(); // Prevent the default context menu behavior
  // Additional custom logic if needed
};

export function Services() {

  const jsonLdScript = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Create Your Virtual Fashion Store with Metadrob | Sign Up Now",
    "image": "URL_TO_YOUR_PRODUCT_IMAGE",
    "description": "Step into the future of fashion retail with ease! Create your virtual fashion store and showcase your style to the world. Join us now and discover the future of fashion. Start today!",
    "brand": {
      "@type": "Brand",
      "name": "Metadrob"
    },
    "gtin8": "YOUR_GTIN8_CODE",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "157"
    }
  };


  return (
    <div >

    <Helmet>
    <title>Build Your Virtual Furniture Store with Metadrob</title>

       <meta name="description" content="Create your own virtual furniture store with ease! Showcase your products in a stunning virtual showroom and reach a global audience. Start today!" data-react-helmet="true" />
     </Helmet>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }} />

        <div>
        <h2 class="services-heading">Our Services</h2>
        <img src="https://gcpsucks.s3.ap-south-1.amazonaws.com/12+4.webp" width={'100%'} style={{marginTop:"-5%"}} onContextMenu={handleContextMenu}></img>
        </div>
       <section class="virtuaL_wrapper section">
      <div class="container34">
        <div class="row">
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

        <div className="services-section-container-1">
          <div className="services-section-image-container-1">
            {/* Replace 'your-image.jpg' with the actual path to your image */}
            <img src={"https://gcpsucks.s3.ap-south-1.amazonaws.com/zdfgfdg.webp"} alt="Your Image" className="services-section-image-1" />
            <div className="services-section-text-container-1">
              <p className="services-section-text-1">
              Virtual Store Editor
              </p>
              <div className="services-section-text-2">Metadrob's Virtual Store Editor is the ultimate tool for retailers looking to bridge the gap between the physical and digital worlds. With our easy-to-use platform, you can create immersive 3D virtual showrooms that captivate your customers and boost your sales.</div>

            </div>
          </div>

        </div>


        <div className="services-section-2-columns-container">
              <div className="services-section-2-column services-section-2-column1">
                <p className="services-section-2-column-text">Drag-and-Drop Interface: Build your virtual showroom within minutes, with no coding required.</p>
              </div>
              <div className="services-section-2-column services-section-2-column2">
                <p className="services-section-2-column-text">Customizable 3D Environments: Tailor your showroom to match your brand's identity and style.</p>
              </div>
              <div className="services-section-2-column services-section-2-column3">
                <p className="services-section-2-column-text">Product Showcase: Display your products in stunning detail, allowing customers to explore them from every angle.</p>
              </div>
            </div>


                    <div className="services-section-2-columns-container">
                          <div className="services-section-2-column services-section-2-column1">
                            <p className="services-section-2-column-text">Customer Engagement: Interact with customers in real time and provide personalized assistance.</p>
                          </div>
                          <div className="services-section-2-column services-section-2-column2">
                            <p className="services-section-2-column-text">Analytics: Gain valuable insights into customer behavior and preferences to optimize your showroom.</p>
                          </div>
                          <div className="services-section-2-column services-section-2-column3">
                            <p className="services-section-2-column-text"></p>
                          </div>
                        </div>





                        <div className="services-heading-2">Ready to transform your retail experience? <a href="https://www.metadrob.com/vs/login"><span class='title-price2'>Get Started</span> </a>with Metadrob's Virtual Store Editor now.</div>




                        <div className="services-section-3-container">
                              <div className="services-section-3-column1">
                                <div className="services-section-3-title">Custom Virtual Showrooms</div>
                                <div className="services-section-3-subtitle">Elevate Your Brand with Tailor-Made 3D Virtual Showrooms</div>
                                <div className="services-section-3-text">Metadrob's Virtual Store Editor is the ultimate tool for retailers looking to bridge the gap between the physical and digital worlds. With our easy-to-use platform, you can create immersive 3D virtual showrooms that captivate your customers and boost your sales.</div>


                                <ul className="services-section-3-points">
                                  <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Brand Consistency: Maintain brand consistency and reinforce your brand image in the digital space.</li>
                                  <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Engaging Customer Experiences: Create immersive environments that captivate and inform your customers.</li>
                                  <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Tailored Solutions: We customize every aspect, from layout and design to product presentation, to meet your specific needs.</li>
                                  <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Unique Themes: Develop themed showrooms that highlight your products and services in a distinctive way.</li>
                                  <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Competitive Advantage: Stand out in the market with a unique and memorable shopping experience.</li>
                                </ul>
                                <div className="services-section-3-ready-text">
                                  Ready to elevate your brand?<br />
                                      <Link to="/ContactUs">
                                  <span class='title-price2'>Consult Our Experts</span>
                                  </Link> to create your custom virtual showroom today.
                                </div>
                              </div>
                              <div className="services-section-3-column2">
                                <img src="https://gcpsucks.s3.ap-south-1.amazonaws.com/gfgaeger.webp" alt="Square Image" />
                              </div>
                            </div>





          </AnimationOnScroll>



        </div>




      </div>

    </section>


                    <div className="services-section-4-container">
                      <div className="INDUSTRYV2-SECTIONQ-image-container">
                        {/* Replace 'your-image.jpg' with the actual path to your image */}
                        <img src={"https://gcpsucks.s3.ap-south-1.amazonaws.com/fzsdf.webp"} alt="Your Image" className="INDUSTRYV2-SECTIONQ-image2" />
                        <div className="INDUSTRYV2-SECTIONQ-text-container">
                          <p className="INDUSTRYV2-SECTIONQ-text">
                          Gamification
                          </p>
                        </div>
                      </div>
                      <hr className="INDUSTRYV2-SECTIONQ-white-line" />
                      <div className="INDUSTRYV2-SECTIONQ-text2">Gamify Your Retail Experience for Maximum Engagement</div>

                    </div>
                    <div class="buffer-space-pricing"></div>


                    <section class="virtuaL_wrapper section">
                   <div class="container34">
                   <div className="services-heading-4">At Metadrob, we understand the power of gamification in retail. We offer tailored game development services that leverage the unique features of your products and services to engage and inform your customers.</div>
                   <hr className="INDUSTRYV2-SECTIONQ-white-line" />

                   <div className="services-section-2-columns-container-k">
                         <div className="services-section-2-column services-section-2-column1">
                           <p className="services-section-2-column-text">Drag-and-Drop Interface: Build your virtual showroom within minutes, with no coding required.</p>
                         </div>
                         <div className="services-section-2-column services-section-2-column2">
                           <p className="services-section-2-column-text">Customizable 3D Environments: Tailor your showroom to match your brand's identity and style.</p>
                         </div>
                         <div className="services-section-2-column services-section-2-column3">
                           <p className="services-section-2-column-text">Product Showcase: Display your products in stunning detail, allowing customers to explore them from every angle.</p>
                         </div>
                       </div>


                               <div className="services-section-2-columns-container">
                                     <div className="services-section-2-column services-section-2-column1">
                                       <p className="services-section-2-column-text">Customer Engagement: Interact with customers in real time and provide personalized assistance.</p>
                                     </div>
                                     <div className="services-section-2-column services-section-2-column2">
                                       <p className="services-section-2-column-text">Analytics: Gain valuable insights into customer behavior and preferences to optimize your showroom.</p>
                                     </div>
                                     <div className="services-section-2-column services-section-2-column3">
                                       <p className="services-section-2-column-text"></p>
                                     </div>
                                   </div>





                                                           <div className="services-section-3-container">
                                                           {/* <div className="services-section-3-column2">
                                                             <img src="https://gcpsucks.s3.ap-south-1.amazonaws.com/fdsfsd.webp" alt="Square Image" />
                                                           </div> */}
                                                                 <div className="services-section-3-column1 ">
                                                                   <div className="services-section-3-title">Social Shopping</div>
                                                                   <div className="services-section-3-subtitle">Shop Together, Anytime, Anywhere with Multiplayer Avatars</div>
                                                                   <div className="services-section-3-text">Metadrob's Multiplayer Avatars feature takes social shopping to a whole new level. Shop with friends and family in a virtual store, interact with others, and make informed purchase decisions together.</div>


                                                                   <ul className="services-section-3-points">
                                                                     <li className="services-section-3-point" style={{ col: '#16F6FE' }}>Real-Time Interaction: Virtually shop together, discuss products, and seek recommendations.</li>
                                                                     <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Enhanced Decision-Making: Collaborate, share opinions, and jointly explore products for better choices.</li>
                                                                     <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Customer Satisfaction: Add an element of fun and excitement to shopping, leading to higher satisfaction.</li>
                                                                     <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Boosted Conversion Rates: Build trust and a sense of community, increasing the likelihood of completing purchases.</li>
                                                                     <li className="services-section-3-point" style={{ fill: '#16F6FE' }}>Unforgettable Shopping Experiences: Memorable moments in virtual showrooms lead to word-of-mouth referrals and brand loyalty.</li>
                                                                   </ul>
                                                                   <div className="services-section-3-ready-text">
                                                                   Ready to revolutionize your shopping experience? <br />
                                                                    Contact us with Multiplayer Avatars now.
                                                                   </div>
                                                                 </div>

                                                               </div>
                     </div>
</section>

    <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

    <Section6/>
    </AnimationOnScroll>

    </div>
  );
}

export default Services;
