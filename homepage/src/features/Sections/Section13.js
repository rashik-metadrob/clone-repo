
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

import { useSelector, useDispatch } from 'react-redux';
import "../../assets/css/style.css"

import {
  toggle,
  bookModalStatus

} from '../Slices/bookModalSlice';
import {
  increment,

} from '../counter/counterSlice';
const img1 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/johnDoe.webp";
const grp = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/grp-img.webp";
export function Section11() {
  const dispatch = useDispatch();
  const count = useSelector(bookModalStatus);


  const handleModal=(e)=>{
    dispatch(toggle());

  }
  return (
<section>
        <section className="metaList section--reveal">

        <div className="container1">
             <div className="column1">
             <img src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Image.webp" alt="Image 1" className="image1" />
             </div>
             <div className="column1">
             <img src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Jewelry.webp" alt="Image 2" className="image1" />
             </div>
             <div className="column1 column-31">
       <div className="row1 image-container">
         <img
           src="https://gcpsucks.s3.ap-south-1.amazonaws.com/Rectangle+396.webp"
           alt="Image 3"
           className="image3"
         />
       </div>
       <div className="row1 title-container">
         <h2 className="title1">
           Personalized Customer <br /> Experiences
         </h2>
       </div>
       <div className="row1 points-container">
         <span >Featured Produce Area</span>
         <span>Virtual Try-On</span>
         <span>Retail Gamification</span>
         <span>Compatible with metaverse and Web</span>
       </div>
     </div>



           </div>





        </section>





        <section className="customized_Wrapper">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div style={{textAlign:"left"}} className="inner_content">
                  <div className="heading ">
                    <div className="subTitle">Looking for something</div>
                    <div className="title ">Customized</div>
                    <p>We get your customized virtual store built by our designers.</p>
                    <div onClick={handleModal}  >
                    <a href="#" className="mainButton">Get Started</a>
           </div>
                             </div>

                </div>

              </div>
              <div className="col-sm-6">
                <img   id="tilt" src={grp} alt=""/>
              </div>
            </div>
          </div>

        </section>
</section>
  );
}

export default Section11;
