
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
const MGrp34 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/MGrp34.webp"


const handleContextMenu = (event) => {
  event.preventDefault(); // Prevent the default context menu behavior
  // Additional custom logic if needed
};

export function FashionPage() {

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

        <h2 class="services-heading">Fashion</h2>

        <video src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Fashion.mp4" width={'100%'} autoPlay loop muted="muted" controlsList="nodownload"  playsInline="" onContextMenu={handleContextMenu}></video>
        </div>
       <section class="virtuaL_wrapper section">
      <div class="container">
        <div class="row">
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

        <div className="industryv2-container">
              <div className="industryv2-column">
                      <div className="industryv2-info">
                <div className="industryv2-percentage">70%</div>
                <div className="industryv2-text">70% of visitors to virtual stores walk out with a purchase</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">51%</div>
                <div className="industryv2-text">Over 51% of style-savvy consumers love to preview their products using AR before making it their own</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">75%</div>
                <div className="industryv2-text">A stylish 75% of consumers indulge in online shopping at least once a month</div>
                </div>

              </div>
            </div>






            <div className="industry-pagek">
              <div className="industry-sectionK">
                <div className="industry-columnK text-columnK">
                  <p className="industry-centered-textK ">Fashion Forward with Virtual Showrooms</p>
                </div>
                <div className="industry-columnK image-columnK">
                  <img src={MGrp34} alt="Centered Image" className="industry-centered-imageK" />
                </div>
              </div>
              <div className="industry-lineK"></div>
              <div className="industry-columnK text-columnK">

              <div className="industry-bottom-textK">Fashion isn't just about the clothes; it's about the experience. Dive into a world where the lines between reality and virtual blur. With Metadrob, offer your customers an immersive, interactive, and utterly unforgettable fashion journey.</div>
            </div>
            </div>



            <div className="INDUSTRYV2-SECTIONM-container">
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                  </div>
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <h1 className="INDUSTRYV2-SECTIONM-title">Design with Flair</h1>
                      <div className="INDUSTRYV2-SECTIONM-line"></div>
                    </div>
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <p className="INDUSTRYV2-SECTIONM-text">Crafting your digital boutique is a breeze with Metadrob. Our intuitive, user-friendly interface, complete with drag-and-drop functionality, ensures your virtual store is as chic as the collections you house.</p>
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
                        <img src={"https://gcpsucks.s3.ap-south-1.amazonaws.com/Rectangle+445.webp"} alt="Your Image" className="INDUSTRYV2-SECTIONQ-image" />
                        <div className="INDUSTRYV2-SECTIONQ-text-container">
                          <p className="INDUSTRYV2-SECTIONQ-text">
Templates Tailored to Trends                          </p>
                        </div>
                      </div>
                      <hr className="INDUSTRYV2-SECTIONQ-white-line" />
                      <div className="INDUSTRYV2-SECTIONQ-text2">In the ever-evolving world of fashion, standing out is key. Our diverse range of customizable templates is designed with the fashion mogul in mind. Whether you're showcasing haute couture or streetwear, ensure your digital display is as on-trend as your pieces.</div>

                    </div>


                    <section class="virtuaL_wrapper section">
                   <div class="container">
                   <div className="INDUSTRYV2-SECTIONM-container2">
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                           </div>
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <h1 className="INDUSTRYV2-SECTIONM-title">A Personalized Runway Experience</h1>
                               <div className="INDUSTRYV2-SECTIONM-line"></div>
                             </div>
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <p className="INDUSTRYV2-SECTIONM-text">Fashion is personal. It's an expression, a statement. Elevate your e-commerce game by offering tailored shopping experiences.</p>
                               <div className="INDUSTRYV2-SECTIONM-line"></div>
                             </div>
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <p className="INDUSTRYV2-SECTIONM-text">In the ever-evolving world of fashion, standing out is key. Our diverse range of customizable templates is designed with the fashion mogul in mind. Whether you're showcasing haute couture or streetwear, ensure your digital display is as on-trend as your pieces.</p>
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

export default FashionPage;
