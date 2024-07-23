
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

export function Section7() {

  return (
    <div >

    <section className="newsletter">
      <div className="container">
        <form>
          <div className="new-full">
          <AnimationOnScroll animateIn="animate__fadeInDown" duration={1.2}>

            <div className="title">METADROB NEWSLETTER</div>
          </AnimationOnScroll>
          <AnimationOnScroll animateIn="animate__fadeInUp" duration={1.2}>

            <div className="fullinnsec section--reveal">
              <input type="text" placeholder="Enter your email" />
              <button type="submit" className="">Subscribe</button>
            </div>
          </AnimationOnScroll>

          </div>
        </form>
      </div>

    </section>



    </div>
  );
}

export default Section7;
