
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import img1 from "../../assets/images/gallery/image-slick-5.webp";
import img2 from "../../assets/images/gallery/image-slick-6.webp";
import img3 from "../../assets/images/gallery/image-slick-7.webp";
import img4 from "../../assets/images/gallery/image-slick-8.webp";
import img5 from "../../assets/images/gallery/image-slick-9.jpg";
import img6 from "../../assets/images/gallery/image-slick-10.jpg";
import img7 from "../../assets/images/gallery/image-slick-11.jpg";
import img8 from "../../assets/images/gallery/gallery-reverse1.jpg";
import img9 from "../../assets/images/gallery/gallery-reverse2.jpg";
import img10 from "../../assets/images/gallery/gallery-reverse3.jpg";
import img11 from "../../assets/images/gallery/gallery-reverse4.jpg";
import img12 from "../../assets/images/gallery/gallery-reverse5.jpg";
import img13 from "../../assets/images/gallery/gallery-reverse6.jpg";
import img14 from "../../assets/images/gallery/gallery-reverse7.jpg";
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "animate.css/animate.min.css";
import Slider from "react-slick";
export function Section4() {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14];
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoPlay: true,
    speed: 2000,
    autoPlaySpeed: 2000,
    cssEase: "linear"
  };
  return (
    <div >
    <section className={"shoppingExperience_wrapper section"}>


      <div className={"heading section--reveal"}>
      <AnimationOnScroll animateIn="animate__fadeInUp" duration={2}>
        <div className={"title"}>Building a <span>Future-Ready</span><br/>
          shopping experience</div>
        <p>Choose from 100+ virtual store</p>
        </AnimationOnScroll>

      </div>
      <Slider {...settings}>
         <div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img1} alt="" /> </div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img2} alt="" /> </div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img3} alt="" /> </div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img4} alt="" /> </div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img5} alt="" /> </div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img6} alt="" /> </div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img7} alt="" /> </div>
         </div>
       </Slider>

    </section>


    </div>
  );
}

export default Section4;
