
import React,{useState,useEffect} from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import "animate.css/animate.min.css";
import logo from "../../assets/images/logo/logo-2x.png"
import { useSelector, useDispatch } from 'react-redux';
import {
  toggle,
  bookModalStatus

} from '../Slices/bookModalSlice';
import { getPage } from "../../utilities/utils";
import insta from "../../assets/images/instacolor.svg";
import linkdin from "../../assets/images/linkdincolor.svg"
import twitter from "../../assets/images/twittercolor.svg"
import fb from "../../assets/images/fbcolor.svg"

const whatsapp = "https://gcpsucks.s3.ap-south-1.amazonaws.com/px-conversions/whatsapp.webp"


export function Footer() {
  const dispatch = useDispatch();

  const [pageView, setPageView] = useState(null);
  const [loading, setLoading] = useState(true);
  //
  // useEffect(() => {
  //   const fetchPageData = async () => {
  //      if(loading==true){
  //       try {
  //         const url="/"
  //         const data = await getPage(url);
  //         const {pageType} = data;
  //
  //         setPageView(data);
  //     } catch (err) {
  //       console.log(JSON.parse(err));
  //     }
  //     setLoading(false);
  //
  //      }
  //
  //   };
  //
  //   fetchPageData();
  // }, []);

  const handleModal=(e)=>{
    dispatch(toggle());


  }

  if(loading==true){
    return null
  }else{
    let blog_1=pageView.childrenPages[0].pageContent;
    let blog_2=pageView.childrenPages[1].pageContent;
    let date1=new Date(blog_1.lastPublishedAt)
    let date2=new Date(blog_2.lastPublishedAt)
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];


    return (
    <div >

    <a href="https://wa.me/+919509619057?text=Hi, I would like to speak to a Care Expert!" target="_blank" className="whatsappbg">
    <img src={whatsapp} alt="" />
    </a>
    <footer>
      <div className="full_content">
        <div className="container">
          <div className="row">
            <div style={{textAlign:'left'}} className="col-sm-12 col-md-6 col-lg-3">
              <div className="foot-item-left section--reveal">
              <img src={logo} className="foot-logo" alt="" width="250" />
                <div className="address">Create a digitally immersive experience for your customers</div>
                <a href="https://goo.gl/maps/HWBbu8L2SXTaHcr69" className="link-item">
                <div className="leftbgfoo"> <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                  <path id="Path_120" data-name="Path 120" d="M-1020.916,479.039h-6.469a1.246,1.246,0,0,1-.839-1.34c.015-2.679.008-5.36.006-8.039a1.777,1.777,0,0,0-1.93-1.92c-.994,0-1.99,0-2.984,0a1.792,1.792,0,0,0-2,1.987c0,2.656-.01,5.311.008,7.969a1.25,1.25,0,0,1-.837,1.342h-6.469a.272.272,0,0,0-.089-.05,3.933,3.933,0,0,1-3.305-4.046c.046-3.384.011-6.77.011-10.154V464.4a.59.59,0,0,0-.112-.037c-.176,0-.353,0-.527-.01a3.236,3.236,0,0,1-2.852-1.8,7.407,7.407,0,0,1-.368-1.011v-.984a4.986,4.986,0,0,1,1.622-2.514q6.938-6.9,13.852-13.832a3.32,3.32,0,0,1,5.053,0q7.161,7.153,14.318,14.311c.124.124.248.248.362.382a3.3,3.3,0,0,1-1.9,5.391,11.581,11.581,0,0,1-1.164.1v.432c0,3.49.01,6.981-.01,10.469a3.844,3.844,0,0,1-2.769,3.589C-1020.513,478.936-1020.715,478.984-1020.916,479.039Z" transform="translate(1049.677 -443.039)" fill="#fff"/>
                  </svg> </div>
                <div className="rightfoobg"> <span>Address: Sanghi Building, Mirza Ismail Rd, C Scheme, Ashok Nagar, Jaipur, Rajasthan 302001 </span> </div>
                </a> <a href="tel:9509619057" className="link-item">
                <div className="leftbgfoo"> <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                  <g id="Group_46" data-name="Group 46" transform="translate(1010.577 -581.549)">
                    <path id="Path_121" data-name="Path 121" d="M-976.814,592.018c-.06.264-.112.532-.179.794a2.773,2.773,0,0,1-2.867,2.273c-1.352.016-2.7.016-4.055-.009a2.777,2.777,0,0,1-2.737-3.649c.047-.179.092-.36.143-.561a15.928,15.928,0,0,0-14.37-.034c.052.212.1.421.156.631a2.734,2.734,0,0,1-2.443,3.545,42.684,42.684,0,0,1-4.809-.018,2.654,2.654,0,0,1-2.406-2.106,5.809,5.809,0,0,1,1.188-5.194,12.439,12.439,0,0,1,4.446-3.544,24.063,24.063,0,0,1,13.186-2.5,23.306,23.306,0,0,1,8.908,2.513,13.129,13.129,0,0,1,4.343,3.419,6.43,6.43,0,0,1,1.446,3.267.445.445,0,0,0,.052.116Z" transform="translate(0 0)" fill="#fff"/>
                    <path id="Path_122" data-name="Path 122" d="M-998.89,590.482c0-.456,0-.872,0-1.287a1.01,1.01,0,0,1,.991-1.088,1.008,1.008,0,0,1,1.021,1.058c.009.219,0,.439,0,.66s0,.414,0,.638h3.226c0-.432-.009-.855,0-1.28a1.02,1.02,0,0,1,.839-1.067,1,1,0,0,1,1.17.962c.016.45,0,.9,0,1.4.367,0,.725,0,1.081,0,1.539.007,1.264-.134,2.329.992.989,1.047,2,2.076,2.949,3.155a12.933,12.933,0,0,1,3.253,7.418c.146,1.493.094,3,.127,4.509.009.385.011.77,0,1.155a1.026,1.026,0,0,1-1.121,1.1q-12.25,0-24.5,0a.979.979,0,0,1-1.094-1.018,40.171,40.171,0,0,1,.219-6.579,13.647,13.647,0,0,1,2.07-5.191,23.777,23.777,0,0,1,2.831-3.3c.56-.588,1.13-1.17,1.678-1.77a1.352,1.352,0,0,1,1.1-.481C-1000.123,590.5-999.53,590.482-998.89,590.482Zm3.621,14.643a5.29,5.29,0,0,0,5.279-5.256,5.3,5.3,0,0,0-5.283-5.29,5.3,5.3,0,0,0-5.265,5.278A5.291,5.291,0,0,0-995.268,605.125Z" transform="translate(1.564 5.295)" fill="#fff"/>
                    <path id="Path_123" data-name="Path 123" d="M-1003.04,596.031a3.265,3.265,0,0,1,3.274-3.227,3.265,3.265,0,0,1,3.227,3.274,3.268,3.268,0,0,1-3.273,3.229A3.272,3.272,0,0,1-1003.04,596.031Z" transform="translate(6.09 9.094)" fill="#fff"/>
                  </g>
                  </svg> </div>
                <div className="rightfoobg"> <span>Phone: +91 950 961 9057</span> </div>
                </a> <a href="mailto:info@metadrob.com" className="link-item">
                <div className="leftbgfoo"> <svg xmlns="http://www.w3.org/2000/svg" width="34.693" height="24.402" viewBox="0 0 34.693 24.402">
                  <g id="Group_47" data-name="Group 47" transform="translate(1107.993 -557.116)">
                    <path id="Path_124" data-name="Path 124" d="M-1047.477,580.705l-.3.941-10.29-10.5,10.29-10.489.3.938Z" transform="translate(-25.822 -1.833)" fill="#fff"/>
                    <path id="Path_125" data-name="Path 125" d="M-1104.292,557.322a11.54,11.54,0,0,1,1.489-.191q12.466-.017,24.931-.008c1.118,0,2.237-.02,3.353.01a11.849,11.849,0,0,1,1.436.216c-.145.161-.208.239-.279.309q-6.543,6.511-13.087,13.021a2.961,2.961,0,0,1-3.308.814,3.5,3.5,0,0,1-1.206-.78q-6.611-6.538-13.192-13.109c-.047-.047-.09-.1-.134-.148Z" transform="translate(-1.914)" fill="#fff"/>
                    <path id="Path_126" data-name="Path 126" d="M-1104.066,595.857l10.345-10.546c.5.5.953.954,1.4,1.409a5.026,5.026,0,0,0,2.484,1.44,5.022,5.022,0,0,0,4.876-1.4c.469-.456.919-.932,1.414-1.435l10.37,10.578a8.684,8.684,0,0,1-1.285.182c-2.337.021-4.674.01-7.011.01q-10.617,0-21.235,0A3.2,3.2,0,0,1-1104.066,595.857Z" transform="translate(-2.031 -14.583)" fill="#fff"/>
                    <path id="Path_127" data-name="Path 127" d="M-1097.384,571.2l-10.27,10.476a3,3,0,0,1-.338-1.466q0-4.065,0-8.13c0-3.286-.008-6.572.01-9.858a10.6,10.6,0,0,1,.2-1.444l.147-.033Z" transform="translate(0 -1.878)" fill="#fff"/>
                  </g>
                  </svg> </div>
                <div className="rightfoobg"> <span>Email: info@metadrob.com</span> </div>
                </a>
                 </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3">
              <div className="foot-item-center section--reveal">
                <div className="title"> Category <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18.071" height="31.313" viewBox="0 0 18.071 31.313">
                  <defs>
                    <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                      <stop offset="0" stop-color="#16f6fe"/>
                      <stop offset="1" stop-color="#9904fc"/>
                    </linearGradient>
                  </defs>
                  <path id="Path_128" data-name="Path 128" d="M-1.231,0H9.828L2.815,31.313H-8.243Z" transform="translate(8.243)" fill="url(#linear-gradient)"/>
                  </svg> </div>
                <ul style={{textAlign:'left'}}>
                  <li style={{listStyleType:"none"}}><a href="/">Home</a></li>
                  <li style={{listStyleType:"none"}}><a href="/aboutus">About Us</a></li>
                  <li style={{listStyleType:"none"}}><a href="/#scrollbook" data-scroll="scrollbook">Contact Us</a></li>
                  <li style={{listStyleType:"none"}}><a href="/blogs">Blog</a></li>
                  <li style={{listStyleType:"none"}}><a href="/PrivacyPolicy">Privacy Policy</a></li>

                  <li style={{listStyleType:"none"}}><a href="/TermsAndConditions">Terms and Conditions</a></li>
                  <li style={{listStyleType:"none"}}><a href="/CancellationRefundPolicy">Cancellation and Refund Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3">
              <div className="foot-item-center centerTwo section--reveal">
                <div className="title"> Recent Post <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18.071" height="31.313" viewBox="0 0 18.071 31.313">
                  <defs>
                    <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                      <stop offset="0" stop-color="#16f6fe"/>
                      <stop offset="1" stop-color="#9904fc"/>
                    </linearGradient>
                  </defs>
                  <path id="Path_128" data-name="Path 128" d="M-1.231,0H9.828L2.815,31.313H-8.243Z" transform="translate(8.243)" fill="url(#linear-gradient)"/>
                  </svg> </div>
                <div style={{textAlign:'left'}} className="d-flex">
                  <div className="content">
                  <a href={"/blogs"+blog_1.url}>
                                      <div className="text">{blog_1.title}</div>

                  </a>
                    <div className="date"> <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22.418" height="22.421" viewBox="0 0 22.418 22.421">
                      <defs>
                        <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                          <stop offset="0" stop-color="#16f6fe"/>
                          <stop offset="1" stop-color="#9904fc"/>
                        </linearGradient>
                      </defs>
                      <g id="Group_49" data-name="Group 49" transform="translate(991.903 -492.671)">
                        <path id="Path_130" data-name="Path 130" d="M-991.9,504.54v-1.314c.013-.078.029-.155.041-.233.07-.483.11-.971.214-1.447a10.887,10.887,0,0,1,4.16-6.559,10.876,10.876,0,0,1,9.15-2.053,10.823,10.823,0,0,1,6.529,4.131,10.9,10.9,0,0,1,2.268,7.938,10.825,10.825,0,0,1-2.734,6.266,11.011,11.011,0,0,1-6.484,3.647c-.422.075-.849.117-1.274.174h-1.314a1.161,1.161,0,0,0-.169-.036,10.664,10.664,0,0,1-4.891-1.542,11.062,11.062,0,0,1-5.319-7.7C-991.807,505.392-991.846,504.964-991.9,504.54Zm11.213-10.125a9.474,9.474,0,0,0-9.472,9.459,9.476,9.476,0,0,0,9.455,9.476,9.477,9.477,0,0,0,9.483-9.47A9.473,9.473,0,0,0-980.69,494.416Z" transform="translate(0 0)" fill="url(#linear-gradient)"/>
                        <path id="Path_131" data-name="Path 131" d="M-976.312,503.98c0-.846-.006-1.693,0-2.539a.871.871,0,0,1,1.178-.864.893.893,0,0,1,.563.9c0,1.481,0,2.963,0,4.443a.43.43,0,0,0,.2.394q1.443,1.067,2.872,2.152a.865.865,0,0,1,.369.955.862.862,0,0,1-1.366.462c-.55-.4-1.088-.811-1.63-1.218-.578-.433-1.15-.874-1.735-1.3a1.04,1.04,0,0,1-.453-.916C-976.308,505.629-976.312,504.8-976.312,503.98Z" transform="translate(-5.252 -2.644)" fill="url(#linear-gradient)"/>
                      </g>
                      </svg>
            {date1.getDate()}  {month[date1.getMonth()]}  {date1.getFullYear()}</div>
                  </div>
                </div>
                <div style={{textAlign:'left'}} className="d-flex">
                  <div className="content">
                           <a href={"/blogs"+blog_2.url}>
                                      <div className="text">{blog_2.title}</div>

                  </a>
                    <div className="date"> <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22.418" height="22.421" viewBox="0 0 22.418 22.421">
                      <defs>
                        <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                          <stop offset="0" stop-color="#16f6fe"/>
                          <stop offset="1" stop-color="#9904fc"/>
                        </linearGradient>
                      </defs>
                      <g id="Group_49" data-name="Group 49" transform="translate(991.903 -492.671)">
                        <path id="Path_130" data-name="Path 130" d="M-991.9,504.54v-1.314c.013-.078.029-.155.041-.233.07-.483.11-.971.214-1.447a10.887,10.887,0,0,1,4.16-6.559,10.876,10.876,0,0,1,9.15-2.053,10.823,10.823,0,0,1,6.529,4.131,10.9,10.9,0,0,1,2.268,7.938,10.825,10.825,0,0,1-2.734,6.266,11.011,11.011,0,0,1-6.484,3.647c-.422.075-.849.117-1.274.174h-1.314a1.161,1.161,0,0,0-.169-.036,10.664,10.664,0,0,1-4.891-1.542,11.062,11.062,0,0,1-5.319-7.7C-991.807,505.392-991.846,504.964-991.9,504.54Zm11.213-10.125a9.474,9.474,0,0,0-9.472,9.459,9.476,9.476,0,0,0,9.455,9.476,9.477,9.477,0,0,0,9.483-9.47A9.473,9.473,0,0,0-980.69,494.416Z" transform="translate(0 0)" fill="url(#linear-gradient)"/>
                        <path id="Path_131" data-name="Path 131" d="M-976.312,503.98c0-.846-.006-1.693,0-2.539a.871.871,0,0,1,1.178-.864.893.893,0,0,1,.563.9c0,1.481,0,2.963,0,4.443a.43.43,0,0,0,.2.394q1.443,1.067,2.872,2.152a.865.865,0,0,1,.369.955.862.862,0,0,1-1.366.462c-.55-.4-1.088-.811-1.63-1.218-.578-.433-1.15-.874-1.735-1.3a1.04,1.04,0,0,1-.453-.916C-976.308,505.629-976.312,504.8-976.312,503.98Z" transform="translate(-5.252 -2.644)" fill="url(#linear-gradient)"/>
                      </g>
                      </svg>
            {date2.getDate()}  {month[date2.getMonth()]}  {date2.getFullYear()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3">
              <div className="foot-item-right section--reveal">
                <div className="title"> Recent Post <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18.071" height="31.313" viewBox="0 0 18.071 31.313">
                  <defs>
                    <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                      <stop offset="0" stop-color="#16f6fe"/>
                      <stop offset="1" stop-color="#9904fc"/>
                    </linearGradient>
                  </defs>
                  <path id="Path_128" data-name="Path 128" d="M-1.231,0H9.828L2.815,31.313H-8.243Z" transform="translate(8.243)" fill="url(#linear-gradient)"/>
                  </svg> </div>
                <div className="follow_social"> <a href="https://www.facebook.com/metadrob/" target="_blank">
                <img src={fb} alt="" />
                </a> <a href="https://www.instagram.com/metadrob/" target="_blank">
                <img src={insta} alt="" /></a> <a href="https://www.instagram.com/metadrob/" target="_blank">
                <img src={twitter} alt="" /></a> <a href="https://twitter.com/Metadrob_" target="_blank">
                <img src={linkdin} alt=""/></a> </div>
                <div className="block">
                  <div className="text">Make your own <br/>
                    store Today</div>
                    <div onClick={handleModal} className="header-right"  >
           <a href="#" className="mainButton">Book a Demo</a>
           </div>

                  </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="copyright section--reveal">COPYRIGHT © 2023 ALL RIGHTS RESERVED BY MetaDrob</div>
    </footer>


    </div>
  );
  }

}

export default Footer;
