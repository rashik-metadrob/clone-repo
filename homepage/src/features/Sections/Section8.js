
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import "animate.css/animate.min.css";
const img1 = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/johnDoe.webp";


export function Section8() {

  return (
    <section>
    <div style={{alignSelf: 'center', alignContent: 'center' }}>
        <div class="slider">

            <a href="#slide-1">1</a>
            <a href="#slide-2">2</a>
            <a href="#slide-3">3</a>
            <a href="#slide-4">4</a>
            <a href="#slide-5">5</a>

            <div class="slides">
                <div id="slide-1" className='sliderContent'>
              <div > <img src={img1} className="img" alt="" /> </div>
                <h2>Company Name</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse convallis et lectus eu convallis. Aliquam odio metus, finibus at bibendum at, blandit ut magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas nec velit non diam faucibus egestas. Integer condimentum orci nec nulla hendrerit interdum. Phasellus tristique massa ligula, nec tincidunt magna eleifend vel. Donec id nibh tincidunt velit laoreet rhoncus eu eu libero.</p>
                </div>
                <div id="slide-2" className='sliderContent' >
              <div > <img src={img1} className="img" alt="" /> </div>
                <h2>Company Name</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse convallis et lectus eu convallis. Aliquam odio metus, finibus at bibendum at, blandit ut magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas nec velit non diam faucibus egestas. Integer condimentum orci nec nulla hendrerit interdum. Phasellus tristique massa ligula, nec tincidunt magna eleifend vel. Donec id nibh tincidunt velit laoreet rhoncus eu eu libero.</p>
                </div>
                <div id="slide-3" className='sliderContent' >
              <div > <img src={img1} className="img" alt="" /> </div>
                <h2>Company Name</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse convallis et lectus eu convallis. Aliquam odio metus, finibus at bibendum at, blandit ut magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas nec velit non diam faucibus egestas. Integer condimentum orci nec nulla hendrerit interdum. Phasellus tristique massa ligula, nec tincidunt magna eleifend vel. Donec id nibh tincidunt velit laoreet rhoncus eu eu libero.</p>
                </div>
                <div id="slide-4" className='sliderContent' >
              <div > <img src={img1} className="img" alt="" /> </div>
                <h2>Company Name</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse convallis et lectus eu convallis. Aliquam odio metus, finibus at bibendum at, blandit ut magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas nec velit non diam faucibus egestas. Integer condimentum orci nec nulla hendrerit interdum. Phasellus tristique massa ligula, nec tincidunt magna eleifend vel. Donec id nibh tincidunt velit laoreet rhoncus eu eu libero.</p>
                </div>
                <div id="slide-5" className='sliderContent' >
              <div > <img src={img1} className="img" alt="" /> </div>
                <h2>Company Name</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse convallis et lectus eu convallis. Aliquam odio metus, finibus at bibendum at, blandit ut magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas nec velit non diam faucibus egestas. Integer condimentum orci nec nulla hendrerit interdum. Phasellus tristique massa ligula, nec tincidunt magna eleifend vel. Donec id nibh tincidunt velit laoreet rhoncus eu eu libero.</p>
                </div>
            </div>
            </div>
    </div>


    </section>
  );
}

export default Section8;
