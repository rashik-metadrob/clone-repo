
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


       <meta name="description" content=" Step into the future of fashion retail with ease! Create your virtual fashion store and showcase your style to the world. Join us now and discover the future of fashion. Start today!" data-react-helmet="true" />
     </Helmet>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }} />



        <div>
        <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Build Your Virtual Furniture Store with Metadrob",
    "image": "URL_TO_YOUR_PRODUCT_IMAGE",
    "description": "Create your own virtual furniture store with ease! Showcase your products in a stunning virtual showroom and reach a global audience. Start today",
    "brand": {
      "@type": "Brand",
      "name": "Metadrob"
    },
    "gtin8": "YOUR_GTIN8_NUMBER",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "168"
    }
  }
</script>
        <h2 class="services-heading">Automobile</h2>

        <video src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Fashion.mp4" width={'100%'} autoPlay loop muted="muted" controlsList="nodownload"  playsInline="" onContextMenu={handleContextMenu}></video>
        </div>
       <section class="virtuaL_wrapper section">
      <div class="container">
        <div class="row">
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

        <div className="industryv2-container">
              <div className="industryv2-column">
                      <div className="industryv2-info">
                <div className="industryv2-percentage">92%</div>
                <div className="industryv2-text">car buyers do a web search before visiting real store</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">30%</div>
                <div className="industryv2-text">of automobile buyers want an online experience</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">73%</div>
                <div className="industryv2-text">of new buyers want to shop for their next car online!</div>
                </div>

              </div>
            </div>






            <div className="industry-pagek">
              <div className="industry-sectionK">
                <div className="industry-columnK text-columnK">
                  <p className="industry-centered-textK2 ">AUTOMOBILE INDUSTRY IS GETTING REVOLUTIONIZED</p>
                </div>
                <div className="industry-columnK image-columnK">
                  <img src={MGrp34} alt="Centered Image" className="industry-centered-imageK2" />
                </div>
              </div>
              <div className="industry-lineK"></div>
              <div className="industry-columnK text-columnK">

              <div className="industry-bottom-textK">Transform your physical store into a virtual store, increase user confidence & engagement, and expand your sales channels with a virtual fashion store.</div>
            </div>
            </div>



            <div className="INDUSTRYV2-SECTIONM-container">
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                  </div>
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <h1 className="INDUSTRYV2-SECTIONM-title">MULTIPLE <br/>FEATURED Area </h1>
                      <div className="INDUSTRYV2-SECTIONM-line"></div>
                    </div>
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <p className="INDUSTRYV2-SECTIONM-text">Limited features area issue....Worry not in virtual showroom you can Create as many featured area as you want</p>
                      <div className="INDUSTRYV2-SECTIONM-line"></div>
                    </div>
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <p className="INDUSTRYV2-SECTIONM-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
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
                          SALES RESPRESENTATIVE AVATAR
                          </p>
                        </div>
                      </div>
                      <hr className="INDUSTRYV2-SECTIONQ-white-line" />
                      <div className="INDUSTRYV2-SECTIONQ-text2">Transform your physical store into a virtual store, increase user confidence & engagement, and expand your sales channels with a virtual fashion store.</div>

                    </div>


                    <section class="virtuaL_wrapper section">
                   <div class="container">
                   <div className="INDUSTRYV2-SECTIONM-container2">
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                           </div>
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <h1 className="INDUSTRYV2-SECTIONM-title">REAL-TIME<br/>OPINION </h1>
                               <div className="INDUSTRYV2-SECTIONM-line"></div>
                             </div>
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <p className="INDUSTRYV2-SECTIONM-text">Get rid of maintaining the costly display inventory....</p>
                               <div className="INDUSTRYV2-SECTIONM-line"></div>
                             </div>
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <p className="INDUSTRYV2-SECTIONM-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
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
