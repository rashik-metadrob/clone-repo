


import React, { useEffect, useRef } from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/css/style.css"
import { Helmet, HelmetProvider } from "react-helmet-async";

import { Section11} from '../features/Sections/Section11';
import Textra from 'react-textra'
import 'react-image-gallery/styles/css/image-gallery.css'
require('react-img-carousel/lib/carousel.css');

const v1 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/virtual-img1.webp"
const v2 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/virtual-img2.webp"
const v3 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/virtual-img3.webp"
const v4 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/virtual-img4.webp"
const v5 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/virtual-img5.webp"
const v6 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/virtual-img6.webp"
const aboutPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/aboutMetadrob.webp"
const visionPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/vision.webp"
const missionPNG = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/mission.webp"
const c1 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/client-img1.webp"
const c2 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/client-img2.webp"
const c3 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/client-img3.webp"
const c4 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/client-img4.webp"
const c5 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/client-img5.webp"

export function AboutUs() {

  const spanRef = useRef(null);
  const ourMissionRef = useRef(null);
  const ourVisionRef = useRef(null);

  const animateOurMission = () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".ourMission .heading_style", {
      x: -150,
      scrollTrigger: {
        trigger: ".ourMission",
        start: "top 75%",
        scrub: true,
      },
    });
  };
  const animateOurVision = () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".ourVision .heading_style", {
      x: -150,
      scrollTrigger: {
        trigger: ".ourVision",
        start: "top 75%",
        scrub: true,
      },
    });
  };
  useEffect(() => {
    animateOurMission();
    animateOurVision();
  }, []);
    useEffect(() => {
      const span = spanRef.current;
      const textArr = span.getAttribute("data-text").split(", ");
      const maxTextIndex = textArr.length;

      const sPerChar = 0.15;
      const sBetweenWord = 1.5;
      let textIndex = 0;

      typing(textIndex, textArr[textIndex]);

      function typing(textIndex, text) {
        var charIndex = 0;
        var maxCharIndex = text.length - 1;

        var typeInterval = setInterval(function () {
          span.innerHTML = text.substr(0, charIndex); // Clear the contents before typing
          span.innerHTML += text[charIndex];
          if (charIndex === maxCharIndex) {
            clearInterval(typeInterval);
            setTimeout(function () {
              deleting(textIndex, text);
            }, sBetweenWord * 1000);

          } else {
            charIndex += 1;
          }
        }, sPerChar * 1000);
      }

      function deleting(textIndex, text) {
        const minCharIndex = 0;
        let charIndex = text.length - 1;

        const typeInterval = setInterval(() => {
          span.innerHTML = text.substr(0, charIndex);
          if (charIndex === minCharIndex) {
            clearInterval(typeInterval);
            textIndex + 1 === maxTextIndex ? (textIndex = 0) : (textIndex += 1);
            setTimeout(() => {
              typing(textIndex, textArr[textIndex]);
            }, sBetweenWord * 1000);
          } else {
            charIndex -= 1;
          }
        }, sPerChar * 1000);
      }
    }, []);

  return (
    <div >

    <Helmet>

    <title>About Metadrob - A New Step to the Future of E-commerce</title>
      <meta name="description" content="Join the future of online shopping with Metadrob! Elevate your e-commerce journey with immersive 3D virtual stores and captivating metaverse experiences." data-react-helmet="true" />

     </Helmet>
     <div class="buffer-space-3"></div>

    <section class="virtuaL_wrapper section">
      <div class="container34">
        <div class="heading">
          <div class="title typewriter">BRIDGING THE GAP BETWEEN THE RETAILERS &
              <span ref={spanRef}  style={{ display: 'block' }} data-text="VIRTUAL E-COMMERCE"></span>
                        </div>
        </div>

        <div class="img_grid">
          <img src={v1} alt=""/>
          <img src={v2} alt=""/>
          <img src={v3} alt=""/>
          <img src={v4} alt=""/>
          <img src={v5} alt=""/>
          <img src={v6} alt=""/>
        </div>

      </div>

    </section>

    <section class="aboutMetadrob">
      <div class="container">
        <div class="heading">
          <div class="title">About Metadrob</div>
        </div>
        <div class="row section--reveal">
          <div class="col-md-5">
            <div style={{textAlign:'left'}} class="inner_content">
              <p >We believe that all businesses should have the tools and technology. </p>
              <p>they need to reach their full potential in the digital marketplace. That's the foundation of Metadrob, the virtual showroom creation platform that's revolutionizing the way businesses showcase their products online.</p>
            </div>

          </div>
          <div class="col-md-7">
            <img src={aboutPNG} alt=""/>
          </div>
        </div>

      </div>

    </section>

    <section class="aboutUs_text h_about section--reveal">
      <div class="container">
        <div class="aboutCompnay">
          <div class="grid_flex">
            <div class="text">Influence</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <circle id="Ellipse_56" data-name="Ellipse 56" cx="12" cy="12" r="12" fill="#fff"/>
            </svg>
            <div class="text">Unlock</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <circle id="Ellipse_56" data-name="Ellipse 56" cx="12" cy="12" r="12" fill="#fff"/>
            </svg>
            <div class="text ">Immerse</div>
          </div>

        </div>

      </div>

    </section>


      <section className="ourVision" ref={ourVisionRef}>
         <div className="heading_style">
           <div className="title">Our Vision</div>
           <div className="title gradient_style">
             <span style={{}}>Our Vision</span>
           </div>
           <div className="title">Our Vision</div>
         </div>
      <div class="container section--reveal">
        <div class="row">
          <div class="col-md-5">
            <img src={visionPNG} alt=""/>
          </div>
          <div class="col-md-7">
            <div class="content">
              <p style={{textAlign:'left'}}>To create an easy-to-use web-based platform for Retailers empowering them to reach their full potential, captivate and enable their audience to Experience an Unparalleled Shopping Journey. Metadrob strives to be at the forefront of Virtual Showroom technology by delivering exceptional values and driving growth for our clients.</p>
            </div>
          </div>
        </div>
      </div>

    </section>

    <section className="ourMission" ref={ourMissionRef}>
       <div className="heading_style">
         <div className="title">Our Mission</div>
         <div className="title gradient_style">
           <span style={{}}>Our Mission</span>
         </div>
         <div className="title">Our Mission</div>
       </div>
      <div class="container section--reveal">
        <div class="row">
          <div class="col-md-7">
            <div class="content">
              <p style={{textAlign:'left'}}>We aim at evolving the Experiential Retail for both Businesses and Customers. Retailers of all sizes can build their Custom Virtual Showroom for increased ROI and Brand Value. Our mission is to bridge the gap between offline and online Retail by offering highly immersive and futuristic shopping platforms. We thrive to be the one-stop solution for taking retail to the virtual world globally.</p>
            </div>
          </div>
          <div class="col-md-5">
            <img src={missionPNG} alt=""/>
          </div>
        </div>
      </div>
    </section>

    <section class="client_review">
      <div class="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
          <div  class="titleAward">Awards & Recognitions</div>
          <div class="review-slide section--reveal">
            <div  class="swiper-wrapper">
              <Textra
              data={[  <div class="swiper-slide">
                  <div class="cr_item">
                    <div class="content">
                      <h3>Metadrob wins the Global Student Entrepreneur Award at Jaipur Chapter and accelerates for EO GSEA Nationals.</h3>
                      <div class="subTitle">5 April 2023</div>
                    </div>
                  </div>
                </div>,
                <div class="swiper-slide">
                  <div class="cr_item">
                    <div class="content">
                      <h3>One of the top three finalists for Aegis Graham Bell Awards for Innovation in
      Retail.</h3>
                      <div class="subTitle">3 April 2023</div>
                    </div>
                  </div>
                </div>,


                            <div class="swiper-slide">
                              <div class="cr_item">
                                <div class="content">
                                  <h3>Recognized as Top 100 Start-Ups in Southeast Asia by Lemon Ideas India.</h3>
                                  <div class="subTitle">4 April 2023</div>
                                </div>
                              </div>
                            </div>
    ,            <div class="swiper-slide">
                  <div class="cr_item">
                    <div class="content">
                      <h3>Metadrob is a part of the XR Acceleration Program by Meta in association
      with FITT, IT.</h3>
                      <div class="subTitle">5 April 2023</div>
                    </div>
                  </div>
                </div>
    ]}
                effect='simple'
                duration={2000}
                stopDuration={1000}
              />
            </div>
          </div>
          <div class="brands_wrapper">
            <img src={c1} alt="" />
            <img src={c2} alt="" />
            <img src={c3} alt="" />
            <img src={c4} alt="" />
            <img src={c5} alt="" />
          </div>
        </div>
      </div>
    </section>









    <Section11/>


    </div>
  );
}

export default AboutUs;
