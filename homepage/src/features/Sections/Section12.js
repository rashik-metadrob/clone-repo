import React, { useRef, useEffect, useState } from 'react';

import Countdown from "react-countdown";
import {
  time,
  timerStatus,
  elementStatus

} from '../Slices/timerSlice';
import { useSelector, useDispatch } from 'react-redux';
import useScrollBlock from "../../utilities/useScrollBlock"
export function Section12() {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const targetRef = useRef(null);
    const vvideoRef = useRef(null);
   const [shouldScroll, setShouldScroll] = useState(false);
  const targetDate = new Date(2023, 8, 20, 11, 59);
  // const targetDate = new Date(2023, 5, 16, 12, 42);
  const [scrollDisabled, setScrollDisabled] = useState(true);
  const scrollRef = useRef(null);
  const [isTargetDate, setTargetDateHit] = useState(false);
  const [isFlow, setFlow] = useState(false);
  const [srcVid,setVid]=useState("https://gcpsucks.s3.ap-south-1.amazonaws.com/BG.mp4")
const [blockScroll, allowScroll] = useScrollBlock();
const e = useSelector(elementStatus);
console.log(e,'e is')
const [isiPhone, setIsiPhone] = useState(false);

useEffect(() => {
  const userAgent = window.navigator.userAgent;
  const isiPhone = /iPhone/i.test(userAgent);
  setIsiPhone(isiPhone);
}, []);
  const [isCompleted, setCompleted] = useState(false); // New state variable to track completion status
  const handleVideoEnded = () => {

      // Execute the callback logic for "new-video" only
      // ...
      console.log("vid")
      window.scrollTo({
        top: 1000,
        behavior: 'smooth',
      });
      allowScroll()
      setFlow(false)
      setVid("https://gcpsucks.s3.ap-south-1.amazonaws.com/MAIN.mp4")

  };

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu behavior
    // Additional custom logic if needed
  };
  // useEffect(() => {
  //   const videoElement = videoRef.current;
  //
  //   const playVideo = () => {
  //     videoElement.play().catch((error) => {
  //       // Handle video play error
  //       console.log('Error playing video:', error);
  //     });
  //   };
  //
  //   playVideo();
  //
  //   return () => {
  //     // Clean up: Pause the video when the component unmounts
  //     videoElement.pause();
  //   };
  // }, []);
  const Completionist = () => <span>You are good to go!</span>;
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        const padValue = (value) => value.toString().padStart(2, '0');
      if (completed) {
        console.log("completed")
        // Render a completed state
        dispatch(time());

        setTargetDateHit(true);
      }
      // Render a countdown
      return (
        <div className="transparent-box">
          <div className="scolumn">
            <div className="stitle">DAYS</div>
            <div className="selement">{padValue(days)}</div>
          </div>
          <div className="scolumn colon">:</div>
          <div className="scolumn">
            <div className="stitle">HOURS</div>
            <div className="selement">{padValue(hours)}</div>
          </div>
          <div className="scolumn colon">:</div>
          <div className="scolumn">
            <div className="stitle">MINUTES</div>
            <div className="selement">{padValue(minutes)}</div>
          </div>
          <div className="scolumn colon">:</div>
          <div className="scolumn">
            <div className="stitle">SECONDS</div>
            <div className="selement">{padValue(seconds)}</div>
          </div>
        </div>
      );
    };

  return (
    <div className="background-video-container">
      {isiPhone ?   <video className="background-video" src="https://gcpsucks.s3.ap-south-1.amazonaws.com/BG.mp4" autoPlay loop="loop" muted defaultmuted={"true"} playsInline  onContextMenu={(e)=>e.preventDefault()}  preload="auto"  ref={vvideoRef}>

          Your browser does not support the video tag.
        </video> :   <video className="background-video" src={srcVid} autoPlay loop="loop" muted defaultmuted={"true"} playsInline  onContextMenu={(e)=>e.preventDefault()}  preload="auto"  ref={vvideoRef}>

          Your browser does not support the video tag.
        </video>}



      <div className="overlay-content">
        <section
          className="homeForm"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >



                  <div style={{ fontSize: '2.5vw', fontWeight: "350", padding: "20px" }} className="title typewriter">
Explore the Advanced Virtual Store Editor                  </div>
                  <div style={{ fontSize: '3.5vw', fontWeight: "350", padding: "20px" }} className="title typewriter">
                    <Countdown date={targetDate} renderer={renderer} />
                  </div>
                  <div style={{ fontSize: '3.5vw', fontWeight: "350", padding: "20px" }} className="title typewriter">

                  </div>
        </section>
      </div>
    </div>
  );
}
