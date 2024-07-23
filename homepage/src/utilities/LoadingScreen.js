import React from "react";
import Lottie from "lottie-react";
import { useLottie } from "lottie-react";
import groovyWalkAnimation from "../assets/loader.json";
import "../assets/css/style.css"


const video = "https://gcpsucks.s3.ap-south-1.amazonaws.com/loader.mp4"

function LoadingScreen() {
  const options = {
  animationData: groovyWalkAnimation,
  loop: true
};

const { View } = useLottie(options, {
  height: 400,
  width:400,
});


  return (
        <div className="loader-overlay">
      <div  className="loader" >
      {View}
      </div>
       </div> );
}

export { LoadingScreen };
