
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
const MGrp34 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/31+1.webp"


const handleContextMenu = (event) => {
  event.preventDefault(); // Prevent the default context menu behavior
  // Additional custom logic if needed
};

export function AutomobilePage() {

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
    <title>Create Your Virtual Fashion Store with Metadrob | Sign Up Now</title>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }} />


       <meta name="description" content=" Step into the future of fashion retail with ease! Create your virtual fashion store and showcase your style to the world. Join us now and discover the future of fashion. Start today!" data-react-helmet="true" />
     </Helmet>



        <div>

        <div class="services-heading services-heading-mobile">Automobile</div>

        <video src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Fashion.mp4" width={'100%'} autoPlay loop muted="muted" controlsList="nodownload"  playsInline="" onContextMenu={handleContextMenu}></video>
        </div>
       <section class="virtuaL_wrapper section">
      <div class="container">
        <div class="row">
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

        <div className="industryv2-container">
              <div className="industryv2-column">
                      <div className="industryv2-info">
                <div className="industryv2-percentage">2X</div>
                <div className="industryv2-text">2x as many automotive consumers kickstart their journey online</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">92%</div>
                <div className="industryv2-text">A whopping 92% of car enthusiasts turn to the web before making a purchase</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">45%</div>
                <div className="industryv2-text">On average, car buyers invest nearly 14 hours online, hunting for that perfect ride</div>
                </div>

              </div>
            </div>






            <div className="industry-pagek">
              <div className="industry-sectionK">
                <div className="industry-columnK text-columnK">
                  <p className="industry-centered-textK2 ">Driving the Digital Revolution in Automobiles</p>
                </div>
                <div className="industry-columnK image-columnK">
                  <img src={MGrp34} alt="Centered Image" className="industry-centered-imageK2" />
                </div>
              </div>
              <div className="industry-lineK"></div>
              <div className="industry-columnK text-columnK">

              <div className="industry-bottom-textK">The automobile industry is not just about horsepower and torque anymore; it's about digital horsepower. Metadrob is at the forefront, steering the digital transformation of the automobile sector. Dive in to see how we're turbocharging the car buying experience.</div>
            </div>
            </div>



            <div className="INDUSTRYV2-SECTIONM-container">
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                  </div>
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <h1 className="INDUSTRYV2-SECTIONM-title">3D Virtual Showrooms: The <br/> Future of Car Shopping</h1>
                      <div className="INDUSTRYV2-SECTIONM-line"></div>
                    </div>
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <p className="INDUSTRYV2-SECTIONM-text">Why just read about cars when you can virtually walk around them? Our 3D virtual showrooms offer an immersive experience, allowing customers to explore every nook and cranny of your vehicle lineup.</p>
                      <div className="INDUSTRYV2-SECTIONM-line"></div>
                    </div>
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <p className="INDUSTRYV2-SECTIONM-text"> With interactive 360-degree views and in-depth specifications, it's almost like taking a test drive from their living room.</p>
                    </div>
                  </div>
                </div>






          </AnimationOnScroll>



        </div>




      </div>

    </section>


                    <div className="INDUSTRYV2-SECTIONQ-section-container">
                      <div className="INDUSTRYV2-SECTIONQ-image-container">
                        {/* Replace 'your-image.jpg' with the actual path to your image */}
                        <img src={"https://gcpsucks.s3.ap-south-1.amazonaws.com/Rectangle+445.webp"} alt="Your Image" className="INDUSTRYV2-SECTIONQ-image2" />
                        <div className="INDUSTRYV2-SECTIONQ-text-container">
                          <p className="INDUSTRYV2-SECTIONQ-text">
                          Designing Your Digital Dealership

                          </p>
                        </div>
                      </div>
                      <hr className="INDUSTRYV2-SECTIONQ-white-line" />
                      <div className="INDUSTRYV2-SECTIONQ-text2">First impressions count, especially online. With Metadrob, you're not just setting up a virtual store; you're crafting a digital masterpiece. Our suite of customizable templates and design tools ensures your online dealership resonates with the automotive spirit. Think dynamic colors, iconic logos, and imagery that speaks the language of speed and elegance.</div>

                    </div>


                    <section class="virtuaL_wrapper section">
                   <div class="container">
                   <div className="INDUSTRYV2-SECTIONM-container2">
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                           </div>
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <h1 className="INDUSTRYV2-SECTIONM-title">Guidance, Supercharged</h1>
                               <div className="INDUSTRYV2-SECTIONM-line"></div>
                             </div>
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <p className="INDUSTRYV2-SECTIONM-text">Shopping for a car is a journey, and every customer deserves a co-pilot. Our virtual showrooms are equipped with intelligent chatbots and virtual assistants, ready to answer questions, offer tailored recommendations, and guide customers through every twist and turn of their car-buying adventure.</p>
                               <div className="INDUSTRYV2-SECTIONM-line"></div>
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

export default AutomobilePage;
