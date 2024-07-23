
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';

import "../assets/css/style.css"

import arrow1Animation from "../assets/images/UploadProducts.json";
import DD from "../assets/D&D.json";
import SL1 from "../assets/SL1.json";
import VTryO from "../assets/VTryO.json";
import { useLottie } from "lottie-react";
import Lottie from "lottie-react";
import { Section11} from '../features/Sections/Section11';

import SIL from '../assets/SIL.json'
import bgImg1PNG from '../assets/images/Img1.png'
import MGrp44 from '../assets/images/MGrp44.png'
import BrdsPNG from '../assets/images/brds.png'
import { Helmet, HelmetProvider } from "react-helmet-async";



import { AnimationOnScroll } from 'react-animation-on-scroll';
import Section6 from '../features/Sections/Section6';



const Arrow5PNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Arrow5.webp"
const Arrow4PNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Arrow4.webp"
const DDImgPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/DDImg.webp"
const MobileImgPng = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/MobileImg.webp"
const SmallCloudPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Small_Cloud.webp"

const ChairPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Chair.webp"
const ArrowPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Arrow.webp"
const Arrow1PNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Arrow1.webp"
const Arrow3PNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/Arrow3.webp"

export function FurniturePage() {

  const options = {
    animationData: arrow1Animation,
    loop: true
  };


  const { View } = useLottie(options, {
    height: 600,
    width: 1200,
  });
  const jsonLdScript = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "Build Your Virtual Furniture Store with Metadrob",
      "image": "URL_TO_YOUR_FURNITURE_IMAGE",
      "description": "Create your own virtual furniture store with ease! Showcase your products in a stunning virtual showroom and reach a global audience. Start today",
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
    document.getElementsByTagName("META")[2].content="Create your own virtual furniture store with ease! Showcase your products in a stunning virtual showroom and reach a global audience. Start today!";
    document.getElementsByTagName("META")[2].name="Build Your Virtual Furniture Store with Metadrob";

  return (
    <div >
<<<<<<< HEAD
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScript) }} />
    <Helmet>
    <title>Build Your Virtual Furniture Store with Metadrob</title>

       <meta name="description" content="Create your own virtual furniture store with ease! Showcase your products in a stunning virtual showroom and reach a global audience. Start today!" data-react-helmet="true" />
     </Helmet>
       <section class="virtuaL_wrapper section">
      <div class="container">
        <div class="heading">
        <div class="subTitleFur">FUTURE OF FURNITURE BUSINESS</div>
                <div class="title2">SHAPING POSSIBILITIES INTO REALITY</div>
        <div class="row">
=======
       <section className="virtuaL_wrapper section">
      <div className="container">
        <div className="heading">
        <div className="subTitleFur">FUTURE OF FURNITURE BUSINESS</div>
                <div className="title2">SHAPING POSSIBILITIES INTO REALITY</div>
        <div className="row">
>>>>>>> origin/dev

          <div className="col-md-7">
            <div className="content">

                <div className='gradientSec'></div>
                <div className='chooseSection'>
                    <span style={{fontWeight: '200'}}>Choose From </span><span style={{fontWeight: '600'}}>100+ Virtual Store Template & Start Making Your Furniture Virtual Store. </span>
                </div>
                <div style={{float: 'left'}}>
                  <button type="submit" className="btnTransparent"> <span className='btnTxt'>TRY IT YOURSELF</span> </button>
                </div>
                <div className="col-md-5" style={{float: 'right',marginTop: '12rem'}}>
                  <img src={ArrowPNG} alt=""/>
                </div>
                <div className='arrow1png'>
                  <Lottie height={600} width={900} animationData={SIL} loop={true} style={{marginTop: '3rem'}}/>
                  {/* <img className='arrow1pngdiv' src={Arrow1PNG} alt=""/> */}
                </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className='row'>
                <div className='imgBg1 brdsAnim'>
                  <img src={BrdsPNG} style={{zIndex: '2', position: 'absolute', right: '30rem',}} alt=""/>
                </div>
                <div className='imgBg1 '>
                  <img src={bgImg1PNG} style={{zIndex: '-2', position: 'absolute'}} alt=""/>
                </div>
                <div className='col-md-4'>
                    <img className='cldAnim' src={SmallCloudPNG} style={{zIndex: '-1', position: 'absolute',  marginRight: '16rem'}} alt=""/>
                    <img className='cldAnim2' src={SmallCloudPNG} style={{zIndex: '-1', position: 'absolute',  marginTop: '20rem'}} alt=""/>
                </div>
                <div className='col-md-9'>
                    <img src={ChairPNG} alt=""/>
                </div>
            </div>
          </div>
          {/* <div className='row'> */}
          <div className='col-lg-4'>
          <img style={{zIndex: '-5', position: 'absolute', left: '1rem',}} src={MGrp44} width={'50%'} height={'50%'} alt=""/>
          </div>
<<<<<<< HEAD
          <div class='col-lg-8'>
          <p class='tempTxt'>1000+</p>
            <div class='blueCrcl cldAnim2' ></div>
            <p class='tempTxt2'>TEMPLATES</p>

=======
          <div className='col-lg-8'>
          <p className='tempTxt'>1000+</p>
            <div className='blueCrcl cldAnim2' ></div>
            <p className='tempTxt2'>TEMPLATES</p>
           
>>>>>>> origin/dev
          </div>


          {/* </div> */}
        </div>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div className='chooseSection2'>
          <span style={{fontWeight: '200', marginLeft: '60rem' }}>Either </span><span style={{fontWeight: '600'}}>Start From Scratch </span><span style={{fontWeight: '200'}}>or Choose from</span><span style={{fontWeight: '600'}}> 100+ premade templates</span>
        </div>
        <div style={{marginLeft: '30rem'}}>
          {/* <img src={Arrow3PNG} alt=""/> */}
          <Lottie height={600} width={900} animationData={SL1} />

        </div>
        <div>
          <span style={{fontSize: '6rem'}}><span style={{fontWeight: '600'}}>Upload </span><span style={{fontWeight: '200'}}>Your Products</span></span>
        </div>
        </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div style={{alignContent: 'center', alignItems: 'center'}}>
        <div style={{alignSelf: 'center'}}>
        <div className='blueCrcl2 cldAnim2' ></div>
          {View}

        </div>

        </div>
        <div className='col'>
          <div className='col-md-5' style={{textAlign: 'left', marginLeft: '10rem'}}><span>Upload </span><span style={{fontWeight: '200'}}>Your Furniture In </span><span style={{fontWeight: '600'}}> 3D Format </span><span style={{fontWeight: '200'}}>(.obj, .FBX, .Glb, .Gtf) </span><span style={{fontWeight: '600'}}>Drag & Drop </span> <span style={{fontWeight: '200'}}>It in the Selected Template & Start Making The </span><span style={{fontWeight: '600'}}>Desired Virtual Store Design.</span></div>
          <div className='col-md-5 blueMoon'></div>
        </div>
        </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div className='row'>
          <div className='col-md-5' style={{marginLeft: '10rem'}}>
            {/* <img src={Arrow4PNG} alt=""/> */}
          <Lottie height={600} width={900} animationData={DD} loop={true} />

          </div>
          <div className='col-md-5' style={{marginTop: '30rem'}}>
            <span className='row p-5 mt-5' ></span>
            <div className='row mt-3' style={{position: 'absolute', zIndex: '2', marginLeft: '39rem', left: '0'}}>
              <div className='col-md-3'>
                <span className='row' style={{fontWeight: '200', fontSize: '12rem'}}>Drag</span>
              </div>
              <div className='col-md-3' style={{marginRight: '1rem', marginTop: '11rem'}}>
                <span className='andBtn'>&</span>
                <span style={{fontWeight: '200', fontSize: '12rem', position: 'absolute', zIndex: '26',}}>Drop</span>
              </div>
            </div>
          </div>
        </div>
        </AnimationOnScroll>
        {/* <div style={{textAlign: 'left'}}>
          <span style={{fontWeight: '200', fontSize: '12rem', marginBottom: '6rem'}}>Drag</span>
        </div> */}
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div className='mt-5'>
          <img src={DDImgPNG} alt=""/>
        </div>
        <div>
          <div className='col-md-5' style={{textAlign: 'left', marginLeft: '10rem'}}><span>Upload </span><span style={{fontWeight: '200'}}>Your Furniture In </span><span style={{fontWeight: '600'}}> 3D Format </span><span style={{fontWeight: '200'}}>(.obj, .FBX, .Glb, .Gtf) </span><span style={{fontWeight: '600'}}>Drag & Drop </span> <span style={{fontWeight: '200'}}>It in the Selected Template & Start Making The </span><span style={{fontWeight: '600'}}>Desired Virtual Store Design.</span></div>
        </div>
        </AnimationOnScroll>
        <AnimationOnScroll animateIn="animate__fadeIn" duration={1.5}>

        <div >
          <div className='col'>
          <Lottie height={600} width={900} animationData={VTryO} loop={true} />
          </div>
        </div>
        </AnimationOnScroll>
<<<<<<< HEAD
        <div class='row'>
          <div class='col-md-4'>
            <div class='row'>
              <span class='row'  style={{fontWeight: '200', fontSize: '6.5rem'}}>Virtual</span>
              <span class='row'  style={{fontWeight: '700', fontSize: '6.5rem', marginLeft: '10rem'}}>TRY-OUTS</span>

              <div> <div class='blueCrcl3 cldAnim2' ></div></div>
              <div class='row mt-5' style={{textAlign: 'left'}}>
=======
        <div className='row'>
          <div className='col-md-4'>
            <div className='row'>
              <span className='row'  style={{fontWeight: '200', fontSize: '6.5rem'}}>Virtual</span>
              <span className='row'  style={{fontWeight: '700', fontSize: '6.5rem', marginLeft: '10rem'}}>TRY-OUTS</span>
           
              <div> <div className='blueCrcl3 cldAnim2' ></div></div>
              <div className='row mt-5' style={{textAlign: 'left'}}>
>>>>>>> origin/dev
                <span style={{width: '100%'}}>
                <span>Upload </span><span style={{fontWeight: '200'}}>Your Furniture In </span><span style={{fontWeight: '600'}}> 3D Format </span><span style={{fontWeight: '200'}}>(.obj, .FBX, .Glb, .Gtf) </span><span style={{fontWeight: '600'}}>Drag & Drop </span> <span style={{fontWeight: '200'}}>It in the Selected Template & Start Making The </span><span style={{fontWeight: '600'}}>Desired Virtual Store Design.</span>
                </span>
              </div>

            </div>
          </div>
          <div className='col'></div>
          <div className='col-lg-6'>
          <img src={MobileImgPng} alt=""/>
          </div>
        </div>
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

export default FurniturePage;
