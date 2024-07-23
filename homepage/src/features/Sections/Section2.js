
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

export function Section2() {
  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu behavior
    // Additional custom logic if needed
  };
  return (
    <section className="howWork_wrapper">
      <div className="heading section--reveal">
      <AnimationOnScroll animateIn="animate__fadeInUp" duration={1.2}>
        <div className="title">HOW <span>METADROB</span> WORKS</div>
        <p>No code involved, simple drag and drop facility</p>
      </AnimationOnScroll>
      </div>
      <video src="https://gcpsucks.s3.ap-south-1.amazonaws.com/HOW-TO-BUILD-NEW.mp4" className="section--reveal" playsInline autoPlay muted="muted" loop id="myVideo" onContextMenu={handleContextMenu}>
        Your browser does not support the video tag.
      </video>

    </section>
  );
}

export default Section2;
