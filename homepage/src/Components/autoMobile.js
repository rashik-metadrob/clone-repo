
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';

import "../assets/css/style.css"

import SAvtar from "../assets/SAvtar.json";

import { Section11} from '../features/Sections/Section11';

import { AnimationOnScroll } from 'react-animation-on-scroll';
import Section6 from '../features/Sections/Section6';

import Lottie from "lottie-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Img4 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Image4.webp"
const PngWing = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/pngwing.png"

const LinePng = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/AutoLine.webp"
const CarGrp = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/CarGrp.webp"
const Grp2 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Grp2.webp"
const YUAskPng = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/YUAsk.webp"
const PngCar = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/PngCar.webp"
const ArrowPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Arrow.webp"
export function AutomobilePage() {

  const jsonLdScript = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Create Your Virtual Automobile Showroom | Metadrob",
    "image": "URL_TO_YOUR_AUTOMOBILE_IMAGE",
    "description": "Elevate your automobile business with ease! Create a virtual automobile showroom, showcase your vehicles, connect with customers, and boost sales. Start now!",
    "brand": {
      "@type": "Brand",
      "name": "Metadrob"
    },
    "gtin8": "YOUR_GTIN8_CODE",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "168"
    }
  };

  return (
    <div >

    <Helmet>
       <meta name="Create Your Virtual Automobile Showroom | Metadrob" content="Elevate your automobile business with ease! Create a virtual automobile showroom, showcase your vehicles, connect with customers, and boost sales. Start now!" data-react-helmet="true" />
     </Helmet>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }} />

       <section class="virtuaL_wrapper section">
      <div class="container">
        <div class="heading mb-5">
        <div class="subTitleFur">FUTURE OF AUTOMOBILE INDUSTRY</div>
                <div class="title2">AUTOMOBILE INDUSTRY</div>
                <div class="title3">IS GETTING <span class='linearColor'>REVOLUTIONIZED</span></div>
        <div class="row">

          <div className="col-md-7">
            <div className="content">

                <div className='gradientSec'></div>
                <div className='chooseSection'>
                    <span style={{fontWeight: '200'}}>Automobile industry is going through a big revolution upcoming EV Vechiles </span>
                    <span>

                    <span style={{fontWeight: '200'}}>So Why Stay With Conventional Automobile Websites..... </span><span style={{fontWeight: '600'}}>We Bring You The Virtual Automobile showroom</span>
                    </span>
                </div>
                <div style={{float: 'left'}}>
                  <button type="submit" className="btnTransparent"> <span className='btnTxt'>TRY IT YOURSELF</span> </button>
                </div>
                <div className="col-md-5" style={{float: 'right',marginTop: '12rem'}}>
                  <img src={ArrowPNG} alt=""/>
                </div>
                {/* <div className='arrow1png'>
                  <img className='arrow1pngdiv' src={Arrow1PNG} alt=""/>
                </div> */}
            </div>
          </div>
          <div className="col-md-5">
            <div className='row'>
                {/* <div className='imgBg1'>
                  <img src={bgImg1PNG} style={{zIndex: '-2', position: 'absolute'}} alt=""/>
                </div> */}
                <div className='col-lg-9'>
                    <img src={PngWing} style={{zIndex: '-1', position: 'absolute',  marginBottom: '16rem'}} alt=""/>
                    <img src={PngCar} style={{marginTop: '36rem'}} alt=""/>
                </div>
                {/* <div className='col-md-4'>
                </div> */}
            </div>
          </div>
        </div>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div className='mt-5'>
            <img style={{position: 'relative', zIndex: '-1'}} src={YUAskPng} alt="" />
            <div className='row' style={{position: 'absolute',zIndex: '1', top: '140rem', left: '28rem'}}>
                <div className='col-md-4' style={{textAlign: 'center'}}>
                    <div className='row' style={{textAlign: 'center', fontWeight: '500', marginTop: '2%', fontSize: '5rem'}}>92%</div>
                    <div className='row'>of car buyers do a web search</div>
                </div>
                <div className='col-md-4'>
                    <div className='row' style={{textAlign: 'center', fontWeight: '500', marginTop: '2%', fontSize: '5rem'}}>30%</div>
                    <div className='row'>of automobile buyers want an online experience</div>
                </div>
                <div className='col-md-4'>
                    <div className='row' style={{textAlign: 'center', fontWeight: '500', marginTop: '2%', fontSize: '5rem'}}>73%</div>
                    <div className='row'>of new buyers want to shop for their next car online!</div>
                </div>
            </div>
        </div>
        </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div className='mt-5'>
          <img src={CarGrp} alt=""/>
        </div>
        <div>
          <span className='row' style={{textAlign: 'center', fontSize:'6rem', fontWeight:300}}><span>MULTIPLE FEATURED</span></span>
          <span className='row' style={{textAlign: 'center', fontSize:'6rem', fontWeight:700}}><span>AREA</span></span>
        </div>
        <div className='mb-5'>
        <span className='row mt-5' style={{textAlign: 'center', fontSize:'1.5rem', fontWeight:400}}><span>Limited features area issue....</span></span>
          <span className='row' style={{textAlign: 'center', fontSize:'1rem', fontWeight:100}}><span>Worry not in virtual showroom you can Create as many featured area as you want</span></span>
        </div>
        </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div className='mt-5'>
          <img src={Img4} alt=""/>
        </div>
        <div className='row mb-5'>
          <div className='col-md-6'>
            <span className='row salesTxt'><span>SALES RESPRESENTATIVE</span></span>
            <span className='row' style={{textAlign: 'left', fontSize:'5rem', fontWeight:700, marginLeft: '2rem'}}><span>AVATAR</span></span>
          </div>
          <div className='col-md-5'>
          <Lottie height={600} width={900} animationData={SAvtar} loop={true} />
            {/* <img src={LinePng} alt=""/> */}
          </div>
        </div>
        </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div className='mt-5'>
        <img src={Grp2} alt=""/>
        </div>
        <div className=''>
          <span className='row' style={{textAlign: 'left', fontSize:'6rem', fontWeight:300}}><span>REAL-TIME</span></span>
          <span className='row opTxt' ><span>OPINION</span></span>
          <span className='row' style={{textAlign: 'left', fontSize:'1.5rem', fontWeight:400, marginBottom: '6rem'}}><span>Get rid of maintaining the costly display inventory....</span></span>

        </div>
        </AnimationOnScroll>

        </div>
      </div>

    </section>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>
            <Section6 className='mt-5 mb-5' />
       </AnimationOnScroll>


    <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

    <Section11/>

    </AnimationOnScroll>
    </div>
  );
}

export default AutomobilePage;
