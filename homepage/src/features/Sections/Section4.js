
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"




import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";


const img10 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/gallery-reverse3.webp";
const img11 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/gallery-reverse4.webp";
const img12 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/gallery-reverse5.webp";
const img13 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/gallery-reverse6.webp";
const img14 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/gallery-reverse7.webp";
const img1 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/image-slick-5.webp";
const img2 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/image-slick-6.webp";
const img3 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/image-slick-7.webp";
const img4 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/image-slick-8.webp";
const img5 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/image-slick-9.webp";
const img6 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/image-slick-10.webp";
const img7 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/image-slick-11.webp";
const img8 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/gallery-reverse1.webp";
const img9 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/gallery/gallery-reverse2.webp";

export function Section4() {
  return (
    <div >
    <section className={"shoppingExperience_wrapper section"}>
    <div class="buffer-space-2"></div>


      <div className={"heading section--reveal"}>
      <AnimationOnScroll animateIn="animate__fadeInUp" duration={1.2}>
        <div className={"title"}>Building a <span>Future-Ready</span><br/>
          shopping experience</div>
        <p>Choose from 100+ virtual store</p>
        </AnimationOnScroll>

      </div>
      <div >
         <div className='slider2' style={{display: 'flex' , flexDirection: 'row', padding: '0%'}}
         // className="row" id="gallery"
         >
           <div className="image" style={{margin: '2rem'}}>  <img src={img1} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img2} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img3} alt="" /> </div>
         <div className="image" style={{margin: '2rem'}}>  <img src={img4} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img5} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img6} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img7} alt="" /> </div>
         </div>

         <div className='slider2' style={{display: 'flex' , flexDirection: 'row', margin: '0%'}}
         // className="col section--reveal" id="galleryReverse"
         >
           <div className="image" style={{margin: '2rem'}}>  <img src={img8} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img9} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img10} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img11} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img12} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img13} alt="" /> </div>
           <div className="image" style={{margin: '2rem'}}>  <img src={img14} alt="" /> </div>
         </div>

       </div>

    </section>


    </div>
  );
}

export default Section4;
