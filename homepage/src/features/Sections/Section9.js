
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";


export function Section9() {

  return (


      <section className="reshapingbusiness section">
      <div className="container">

        <div className="row section--reveal">

          <div className="col-md-7">

            <div style={{testAlign:"left"}} className="inner_content">

          <div  className="title typewriter reshapeheading">


          RESHAPING THE <br/> RETAIL BUSINESS



          </div>

          <div className="titlereshapeheading">
          <AnimationOnScroll animateIn="animate__fadeInUp" duration={1}>

             <p>Empower your business with Metadrob to <span> Create a Web and Metaverse compatible Virtual Store.</span> Our <span> Interactive and Immersive Custom Solutions </span> give your customers a remarkable in-store experience online !</p>
             </AnimationOnScroll >

             </div>

            </div>

          </div>


          <div className="col-md-5">

           <div className="handanimation">
           <iframe className="handinn" src="https://embed.lottiefiles.com/animation/46776"  width="100%" height="100%"></iframe>

           </div>

          </div>
        </div>

        <div className="countermainup">

        <div className="row">

         <div className="col-md-4">
         <div className="text-counter section--reveal">

         <span>66%</span>
         <p>of customers want to <br /> utilize AR while shopping.</p>

         <div className="round-bgani">
         <div className="outer-circle">
    <div className="inner-circle">

    </div>
    </div>
         </div>

         </div>

         </div>

         <div className="col-md-4">
         <div className="text-counter section--reveal">

         <span>77%</span>
         <p>average order value at a <br/> virtual store.</p>

         <div className="round-bgani">
         <div className="outer-circle">
    <div className="inner-circle">

    </div>
    </div>
         </div>

         </div>

         </div>

         <div className="col-md-4">
         <div className="text-counter section--reveal">

         <span>60%</span>
         <p>of users want brands to <br/> sell in the metaverse.</p>


         <div className="round-bgani">
         <div className="outer-circle">
    <div className="inner-circle">

    </div>
    </div>
         </div>

         </div>

         </div>

        </div>

        </div>

      </div>
    </section>



  );
}

export default Section9;
