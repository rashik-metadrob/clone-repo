
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

       <meta name="description" content=" Step into the future of fashion retail with ease! Create your virtual fashion store and showcase your style to the world. Join us now and discover the future of fashion. Start today!" data-react-helmet="true" />
     </Helmet>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }} />

        <div>
        <video src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Fashion.mp4" width={'100%'} autoPlay loop muted="muted" controlsList="nodownload"  playsInline="" onContextMenu={handleContextMenu}></video>
        </div>
       <section className="virtuaL_wrapper section">
      <div className="container">
        <div className="row">
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

            <div className="row">
                <div className="col-md-4">
                    <div className="row" style={{textAlign: 'left', fontWeight: '400', marginTop: '1%', fontSize: '1.2rem'}}> Transform your physical store into a virtual store, increase user confidence & engagement, and expand your sales channels with a virtual fashion store. </div>
                </div>
                <div className="col-md-4">
                    <img src={ArrowPNG} alt="" />
                </div>
                <div className="col-md-4">
                <img src={SCreate} alt="" />

                </div>
            </div>
            <div className='row mb-5'><span style={{textAlign: 'left',fontWeight: '400', fontSize: '1.4rem'}}>So Why Stay With Conventional Automobile Websites......We Bring You The Virtual Automobile showroom</span></div>
            <div className=' row mt-5'>
                <div className='col-lg-5 mt-5'>
                    {/* <img style={{marginTop: '3rem'}} src={Grp624Png} alt="" /> */}
          <Lottie height={600} width={900} animationData={RealV} loop={true} style={{marginTop: '3rem'}}/>

                </div>
                <div className='col-lg-6'>
                    <img src={MGrp34} alt="" />
                </div>
            </div>
          </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

            <div className='row mb-5'>
            <span className='row' style={{textAlign: 'left', fontSize:'5rem', fontWeight:300}}><span>COMPLETELY</span></span>
            <span className='row' style={{textAlign: 'left', fontSize:'5rem', fontWeight:700}}><span>REALISTIC VIEW</span></span>
          </div>

        <div className='mt-5 mb-5'>
        <img src={EnderImg} alt="" />
        </div>
        <div className='row mt-5'>

            <div  className='col-lg-9'>
          <Lottie height={600} width={900} animationData={VTryO} loop={true} />

            </div>
            <div className='col-lg-3' style={{float: 'right',textAlign: 'left'}}><span style={{fontWeight: '400', fontSize: '1.4rem'}}>So Why Stay With Conventional Automobile Websites......We Bring You The Virtual Automobile showroom</span></div>

        </div>
        </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

        <div className='row'>
          <div className='col-lg-5'>
          {/* <img src={MobileImgPng} alt=""/> */}
          </div>
          <div className='col-md-4'>
            <div className='row'>
              <span className='row'  style={{fontWeight: '200', fontSize: '6.5rem'}}>Virtual</span>
              <span className='row'  style={{fontWeight: '700', fontSize: '6.5rem', marginLeft: '10rem'}}>TRY-ON</span>
              <div className='row mt-5' style={{textAlign: 'left'}}>
                <span style={{width: '100%'}}>
                <span>Upload </span><span style={{fontWeight: '200'}}>Your Furniture In </span><span style={{fontWeight: '600'}}> 3D Format </span><span style={{fontWeight: '200'}}>(.obj, .FBX, .Glb, .Gtf) </span><span style={{fontWeight: '600'}}>Drag & Drop </span> <span style={{fontWeight: '200'}}>It in the Selected Template & Start Making The </span><span style={{fontWeight: '600'}}>Desired Virtual Store Design.</span>
                </span>
              </div>

            </div>
          </div>
        </div>


        <div>
        <img src={VTRNPNG} alt="" />
        </div>
        </AnimationOnScroll>

        </div>


        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>


        <div className='row' style={{alignContent: 'center', alignItems: 'center',}}>
          <span className='col-md-5'></span>
          <span className='col-md-7'>
            <img src={ArrowLPng} alt=""/>
          </span>
        </div>

        <div className='row' style={{textAlign: 'center', font: 'normal normal bold 60px/73px Montserrats'}}><span className='mt-5'>LOVED IT</span></div>
        <div className='row' style={{textAlign: 'center'}}><span style={{font: 'normal normal 300 15px/22px Montserrat'}}>No one ever said you can't have more ! Here is a <span style={{font: 'normal normal bold 18px/25px Montserrat'}}>Brand new way </span></span><span style={{font: 'normal normal 300 15px/22px Montserrat'}}>to showcase your online presence in style.</span></div>

        </AnimationOnScroll>


      </div>

    </section>
    <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>


    </AnimationOnScroll>

    <section className='mb-5'>
        <div className='row mb-5'>
            <div className='col-md-3'></div>
            <div className='col-lg-6' style={{alignContent: 'center', alignItems: 'center',}}>
            <img src={MGrp34} alt="" />
            </div>
        </div>
    </section>

    <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>


    <Section11 className='mt-5'/>
    </AnimationOnScroll>
    <AnimationOnScroll animateIn="animate__fadeIn" duration={1.2}>

    <Section6/>
    </AnimationOnScroll>

    </div>
  );
}

export default FashionPage;
