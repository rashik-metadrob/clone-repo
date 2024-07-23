import React from "react";
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css";
import logo from "../../assets/images/logo/logo-2x.png";
import ring from "../../assets/images/icons/ring.svg";
import bll from "../../assets/images/icons/ball.svg";

import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css/animate.min.css";
import square from "../../assets/images/icons/square.svg";
import { useLottie } from "lottie-react";
import think from "../../assets/think_.json";
import think2 from "../../assets/thinkk.json";
import { useSelector, useDispatch } from "react-redux";
import { useMount } from "react-use";
import { useEffect, useState } from "react";

import { timerStatus, elementStatus, elementRef } from "../Slices/timerSlice";
import { useMixpanel } from "react-mixpanel-browser";

import mixpanel from "mixpanel-browser";
const MIXPANEL_CUSTOM_LIB_URL = "https://www.metadrob.com/lib.min.js";
export function Section1() {
  let cube = "https://gcpsucks.s3.ap-south-1.amazonaws.com/blob.webm";
  const dispatch = useDispatch();
  mixpanel.init("d564c7944daa112c89beda702d3d9b15", {
    debug: true,
    ignore_dnt: true,
  });
  console.log(mixpanel, "midd");
  const [isMobile, setIsMobile] = useState(false);
  // useMount(() => {
  //         let k="testMF"
  //         const targetElement = document.getElementById(k);
  //         dispatch(elementRef(targetElement))
  //
  //
  //
  //
  //       });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [isiPhone, setIsiPhone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isiPhone = /iPhone/i.test(userAgent);
    setIsiPhone(isiPhone);
  }, []);
  const options = {
    animationData: isMobile ? think2 : think,
    loop: true,
  };

  const lottieSize = { height: 1000, width: 1400 };

  const { View } = useLottie(options);
  const time = useSelector(timerStatus);
  console.log(time, "time is");
  const video = document.querySelector(".background-video");
  const video1 = document.querySelector(".elementor-video");

  // Check if the browser is Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Play the video after a user interaction event in Safari
  if (isSafari) {
    document.addEventListener("click", () => {
      if (video) video.play();
      if (video1) video1.play();
    });
  }

  const onCreateVirtualStoreClick = () => {
    // const payload = mixpanel.track("drobverse");

    // const data = JSON.stringify(payload);
    // console.log(data);
    // fetch("https://api.mixpanel.com/track", {
    //   mode: "cors",
    //   credentials: "omit",
    //   cache: "no-store",
    //   redirect: "follow",
    //   method: "POST",
    //   body: new URLSearchParams({ data }).toString(),
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // });
    // mixpanel.track("DashboadView", {
    //   my_custom_prop: "foo",
    // });
    // console.log(mixpanel.track());
  };

  return (
    <div>
      <section className="process_wrapper section">
        <object
          className="svg_iocn shape_svg2"
          type="image/svg+xml"
          data={ring}
        ></object>
        <object
          className="svg_iocn shape_svg"
          type="image/svg+xml"
          data={bll}
        ></object>

        <object
          className="svg_iocn shape_svg3"
          type="image/svg+xml"
          data={square}
        ></object>

        <div className="container">
          <div class="buffer-space-2"></div>

          <div className="heading ">
            {" "}
           
              {" "}
              <img src={logo} alt="" className="section--reveal" />
          
           
              <div className="title">
                <div>Get ready to Level up!</div>
              </div>
        
           
              <p className="section--reveal" style={{ fontWeight: "bold" }}>
                {" "}
                Create your Virtual Showroom using just a few clicks and Level
                up the way your customers experience shopping! Be more
                interactive, realistic and exciting.
              </p>
   
          </div>

          <a
            id="testMF"
            href="https://www.metadrob.com/da/register"
            style={{ position: "relative", zIndex: "9999" }}
            onClick={onCreateVirtualStoreClick}
            className={"countdownBTNtrue"}
          >
            CREATE YOUR VIRTUAL STORE
          </a>

          <div className="inner_content section--reveal">
            <div className="row">
              <div className="row">
                <div className="view-container">{View}</div>
              </div>

              <div className="col-md-12">
                <div className="retailer-secinn2 cubemain">
                  {isiPhone ? (
                    <video
                      className="elementor-video"
                      src="https://gcpsucks.s3.ap-south-1.amazonaws.com/blob.mp4"
                      playsInline
                      autoPlay
                      loop
                      muted="muted"
                      controlsList="nodownload"
                    ></video>
                  ) : (
                    <video
                      className="elementor-video"
                      src={cube}
                      playsInline
                      autoPlay
                      loop
                      muted="muted"
                      controlsList="nodownload"
                    ></video>
                  )}
                </div>
                <div className="unlimited-ceativity" id="unlimitedCeativity">
                  <object
                    type="image/svg+xml"
                    data="https://www.metadrob.com/media/images/virtual-store-1.svg"
                  ></object>

                  <h2>Unlimited Creativity</h2>
                  <p>
                    {" "}
                    With Metadrob, Creativity is limitless. either you choose a
                    virtual template to start with or you start from <br />
                    scratch, either way you can make & change your Virtual Store
                    as creatively as you want{" "}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="unlimited-ceativity zero-no-code">
                  <img
                    src="https://www.metadrob.com/media/images/virtual-store-2.svg"
                    className=""
                    alt=""
                  />
                  <h2>Zero Code</h2>
                  <p>
                    {" "}
                    No Need To Hire any Developer, Build your own Virtual store
                    in few Clicks{" "}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="unlimited-ceativity zero-no-code">
                  {" "}
                  <img
                    src="https://www.metadrob.com/media/images/virtual-store-3.svg"
                    className=""
                    alt=""
                  />
                  <h2>Reliable & Fast</h2>
                  <p>
                    {" "}
                    Create Your Virtual Store in Less than 60 minutes, A
                    Metaverse Ready Virtual Store{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Section1;
