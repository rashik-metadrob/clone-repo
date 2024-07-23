
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
const MGrp34 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/123+1.webp"


const handleContextMenu = (event) => {
  event.preventDefault(); // Prevent the default context menu behavior
  // Additional custom logic if needed
};

export function FurniturePage() {

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
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }} />

       <meta name="description" content="Create your own virtual furniture store with ease! Showcase your products in a stunning virtual showroom and reach a global audience. Start today!" data-react-helmet="true" />
     </Helmet>




        <div>

        <h2 class="services-heading">Furniture</h2>

        <video src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Fashion.mp4" width={'100%'} autoPlay loop muted="muted" controlsList="nodownload"  playsInline="" onContextMenu={handleContextMenu}></video>
        </div>
       <section class="virtuaL_wrapper section">
      <div class="container">
        <div class="row">
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

        <div className="industryv2-container">
              <div className="industryv2-column">
                      <div className="industryv2-info">
                <div className="industryv2-percentage">60%</div>
                <div className="industryv2-text">of consumers believe AR is the missing piece to their furniture shopping puzzle.</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">55%</div>
                <div className="industryv2-text">are convinced that VR will shape their furniture buying decisions in the near future.</div>
                </div>

              </div>
              <div className="industryv2-column">
              <div className="industryv2-info">

                <div className="industryv2-percentage">$30B</div>
                <div className="industryv2-text">The furniture industry is booming, with sales projections set to reach a staggering $30 billion in 2023.</div>
                </div>

              </div>
            </div>






            <div className="industry-pagek">
              <div className="industry-sectionK">
                <div className="industry-columnK text-columnK">
                  <p className="industry-centered-textK2 ">From Showroom Floors to Virtual Doors</p>
                </div>
                <div className="industry-columnK image-columnK">
                  <img src={MGrp34} alt="Centered Image" className="industry-centered-imageK2" />
                </div>
              </div>
              <div className="industry-lineK"></div>
              <div className="industry-columnK text-columnK">

              <div className="industry-bottom-textK">The future of furniture shopping is not just in brick-and-mortar stores; it's in pixels and virtual spaces. Metadrob offers a seamless transition to this digital frontier, ensuring your furniture business doesn't just adapt but thrives.</div>
            </div>
            </div>



            <div className="INDUSTRYV2-SECTIONM-container">
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                  </div>
                  <div className="INDUSTRYV2-SECTIONM-column">
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <h1 className="INDUSTRYV2-SECTIONM-title">Crafting Virtual Masterpieces </h1>
                      <div className="INDUSTRYV2-SECTIONM-line"></div>
                    </div>
                    <div className="INDUSTRYV2-SECTIONM-row">
                      <p className="INDUSTRYV2-SECTIONM-text">Metadrob isn't just a platform; it's a canvas. With our user-friendly interface and innovative features, you can shape your virtual store to not just display but dazzle. Showcase your furniture collection in a way that captivates, engages, and converts visitors into loyal customers.</p>
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
Design with Ease
                          </p>
                        </div>
                      </div>
                      <hr className="INDUSTRYV2-SECTIONQ-white-line" />
                      <div className="INDUSTRYV2-SECTIONQ-text2">Our intuitive drag-and-drop functionality ensures that creating your digital furniture showroom is as simple as arranging pieces in a physical space. Customize, rearrange, and perfect your store's layout with just a few clicks.</div>

                    </div>


                    <section class="virtuaL_wrapper section">
                   <div class="container">
                   <div className="INDUSTRYV2-SECTIONM-container3">
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <img className="INDUSTRYV2-SECTIONM-square-image" src={MGrp34} alt="White Square" />
                           </div>
                           <div className="INDUSTRYV2-SECTIONM-column">
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <h1 className="INDUSTRYV2-SECTIONM-title">Catalog Management, Simplified </h1>
                               <div className="INDUSTRYV2-SECTIONM-line"></div>
                             </div>
                             <div className="INDUSTRYV2-SECTIONM-row">
                               <p className="INDUSTRYV2-SECTIONM-text">Uploading and managing your furniture collection is a breeze with Metadrob. From detailed product descriptions to high-resolution images, ensure your virtual store is as informative as it is immersive. Plus, with our array of themes, layouts, and branding options, your store will be a true reflection of your brand's essence.
</p>
                             </div>

                           </div>
                         </div>
                         <div className="INDUSTRYV2-SECTIONQ-section-container">
                           <div className="INDUSTRYV2-SECTIONQ-image-container">
                             {/* Replace 'your-image.jpg' with the actual path to your image */}
                             <img src={"https://gcpsucks.s3.ap-south-1.amazonaws.com/Default+Screen+1.webp"} alt="Your Image" className="INDUSTRYV2-SECTIONQ-image2" />
                             <div className="INDUSTRYV2-SECTIONQ-text-container">
                               <p className="INDUSTRYV2-SECTIONQ-text">
A New Dimension to Furniture Shopping                               <div className="INDUSTRYV2-SECTIONQ-text3">Imagine a world where customers can see how that sofa or dining table fits in their living room before making a purchase. With our augmented reality tools, this isn't just possible; it's the new norm. Offer a virtual try-on experience, allowing customers to place and visualize furniture pieces in their own spaces.
</div>

                               </p>
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

export default FurniturePage;
