import React, { useState } from 'react';
import "../../assets/css/style.css"
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";

import twitter from "../../assets/images/Twitter.svg"
import fb from "../../assets/images/Facebook.svg"
import insta from "../../assets/images/Instagram.svg"
import linkdin from "../../assets/images/LinkedIn.svg"

import { postContact } from "../../utilities/utils";
const form = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/form.webp"

export function Section6() {
  const [thanksView, setThanksView] = useState(false)

  const handleSubmit = (e) => {
    let jsonData = {
      'name': e.target.first_name.value + ' ' + e.target.last_name.value,
      'email': e.target.mail.value,
      'message': e.target.message.value
    }

    postContact(jsonData);
    setThanksView(true)

    e.preventDefault();
  }

  return (
    <div style={{
      backgroundImage: `url(${form})`,
      zIndex: '1',
      backgroundPosition: '-60px -90px',
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        {thanksView ? (
          <section
            className="homeForm"
            id="scrollbook"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: "550" }}>THANK YOU</div>
            <div style={{ fontSize: '42px', fontWeight: "350" }} className="title typewriter">
              FOR YOUR QUERY
            </div>
            <div style={{ fontSize: '22px', fontWeight: "300" }} className="title typewriter">
              Someone from the MetaDrob team will reach you soon...
            </div>
          </section>
        ) : (
          <section className="homeForm">
  <div className="line-container">
    {[...Array(8)].map((_, index) => (
      <div key={index} className={`line line--${index + 1}`}></div>
    ))}
  </div>
  <div id="scrollbook" className="container">
  <div className="row">
  <div className="col-md-12 col-lg-6">
    {/* Content for the first row */}
    <div className="fullspace section--reveal">
      <div className="smoothone">
        <div style={{ fontSize: "26px", fontWeight: "450",marginBottom:"20px" }} className="title typewriter">
          Couldn't find what you are
        </div>
      </div>
      <div className="smoothone " style={{ top: "13vh" }}>
        <div style={{ fontSize: "72px" }} className="title typewriter">
          Looking for<span className="customShare">?</span>
        </div>
      </div>
      <div className="smoothone" style={{ top: "43vh" }}>
        {[...Array(3)].map((_, index) => (
          <div key={index} style={{ fontSize: "15px", fontWeight: "450", textAlign: 'left' }} className="title typewriter">
            {index === 0 && "Talk with our virtual store advisor to"}
            {index === 1 && "create a customized solution for your retail"}
            {index === 2 && "brand with guaranteed results."}
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
    <div className="row">
      <div className="col-md-6 hidecol">
        {/* Left side content */}
      </div>
      <div className="col-md-12 col-lg-6">
        {/* Right side content */}
        <AnimationOnScroll animateIn="animate__fadeInUp" duration={1.2}>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <div className="heading">
              <div className="sharetitle">LET'S TALK</div>
            </div>
            <form action="" onSubmit={(e) => handleSubmit(e)} style={{ textAlign: "left" }}>
              <div className="d-flex">
                <div className="input_grp">
                  <label htmlFor="">First Name</label>
                  <input name="first_name" required type="text" />
                </div>
                <div className="input_grp">
                  <label htmlFor="">Last Name</label>
                  <input name="last_name" required type="text" />
                </div>
              </div>
              <div className="input_grp">
                <label htmlFor="">Email Address</label>
                <input name="mail" required type="email" />
              </div>
              <div className="input_grp">
                <label htmlFor="">Message</label>
                <textarea name="message" required cols="30" rows="8"></textarea>
              </div>
              <div className="button-wrapper">
                <input type="submit" value="SUBMIT NOW" className="subBtn" />
              </div>
            </form>
          </div>
        </AnimationOnScroll>
      </div>
    </div>
  </div>
</section>

        )}
      </div>
    </div>
  );
}

export default Section6;
