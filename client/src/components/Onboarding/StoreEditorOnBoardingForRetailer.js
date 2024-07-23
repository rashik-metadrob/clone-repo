import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setWaitingForAction,
  getStoreOnboardingRunForRetailer,
  getStepsStoreOnboardingForRetailer,
  getStepStoreOnboardingIndexForRetailer,
  setStepsStoreOnboardingForRetailer,
  setStoreOnboardingRunForRetailer,
  setStepStoreOnboardingIndexForRetailer,
} from "../../redux/joyrideSlice";
import { setCurrentMenu } from "../../redux/navbarSlice";
import Joyride, {
  ACTIONS,
  EVENTS,
} from "react-joyride";
import { Card, Button, Typography } from "antd";
import ArrowImage from "../../assets/images/Next.svg";
import DragImage from "../../assets/images/project/drag.png"
import gsap from "gsap"
import { setIsCompleteStoreOnboardingForRetailer } from "../../redux/appSlice";
import { setIsPreviewModel } from "../../redux/modelSlice";

const { Title } = Typography;

function CustomTooltip({
  primaryProps,
  skipProps,
  step,
  tooltipProps,
}) {
  return (
    <div>
      <Card
        {...tooltipProps}
        border={false}
        maxWidth={420}
        minWidth={290}
        overflow="hidden"
        borderRadius="md"
        className="myBox"
      >
        {step.title && <Title level={3}>{step.title}</Title>}
        {step.content}
      </Card>
      <button
        style={{
          color: "white",
          fontSize: "20px",
          backgroundSize: "contain",
          backgroundPosition: "center",
          width: "50px",
          height: "50px",
          marginLeft: "auto",
          border: "none",

          borderRadius: "50%",
        }}
        {...skipProps}
      >
        Skip{" "}
      </button>

      <Button
        {...primaryProps}
        size="large"
        style={{
          backgroundImage: `url(${ArrowImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          width: "50px",
          height: "50px",
          marginLeft: "auto",
          border: "none",
          position: "absolute",
          right: 0,
          padding: 0,
          borderRadius: "50%",
          boxShadow: "none",
        }}
      >
        <span className="sr-only">Next</span>
      </Button>
    </div>
  );
}

const StoreEditorOnBoardingForRetailer = () => {
  const dispatch = useDispatch();
  const storeOnboardingRunForRetailer = useSelector(getStoreOnboardingRunForRetailer);
  const steps = useSelector(getStepsStoreOnboardingForRetailer);
  const stepStoreOnboardingIndexForRetailer = useSelector(getStepStoreOnboardingIndexForRetailer);
  const dragRef = useRef()
  const animationRef = useRef()
  const [disableScrolling, setdisableScrolling] = useState(true);

  useEffect(() => {
    // initOnboarding();
    //--
    return () => {
      if(animationRef.current){
        animationRef.current.kill()
      }
    }
  }, []);

  const initOnboarding = () => {
    const targetElementIds = [
      {
        element: '#decorativeMenuItem',
        content: 'Select decorative menu',
        position: 'right',
        title: 'Step 1/7'
      },
      {
        element: '.drawer-library-container .library-item:first-child',
        content: 'Drag and drob an item to the store',
        position: 'right',
        title: 'Step 2/7'
      },
      {
        element: '#btnUploadProduct',
        content: 'Click here to open Upload Product popup',
        position: 'top',
        title: 'Step 3/7'
      },
      {
        element: '#buttonSaveProduct',
        content: 'Fill product data and click Save button',
        position: 'top',
        title: 'Step 4/7'
      },
      {
        element: '.drawer-product-container .product-item:first-child',
        content: 'Drag and drob an item to the store',
        position: 'right',
        title: 'Step 5/7'
      },
      {
        element: '#btnPreview',
        content: 'Click here to preview the store',
        position: 'top',
        title: 'Step 6/7'
      },
      {
        element: '.btn-exit-preview-mode',
        content: 'Click here to exit preview',
        position: 'bottom',
        title: 'Step 7/7'
      }
    ];
    targetElementIds.forEach((e) => {
      let targetElement = e.element;

      if (!targetElement) {
        return;
      }


      // dispatch(
      //   setStepsStoreOnboardingForRetailer({
      //     content: <h2>{e.content}</h2>,
      //     placement: e.position,
      //     target: targetElement,
      //     title: e.title,
      //     disableBeacon: true
      //   })
      // );
    });
  };

  const handleJoyrideCallback = (data) => {
    const { action, index, type, step } = data;

    if (action === ACTIONS.SKIP) {
      dispatch(setIsCompleteStoreOnboardingForRetailer(true))
      dispatch(setStoreOnboardingRunForRetailer(false))
      return
    }
    
    if([EVENTS.TOUR_END].includes(type)){
      dispatch(setIsCompleteStoreOnboardingForRetailer(true))
      dispatch(setStoreOnboardingRunForRetailer(false))
    }

    if([EVENTS.STEP_BEFORE].includes(type)){
      if(index === 1 || index === 4){
        const querySelectorString = index === 1 ? ".drawer-library-container .library-item:first-child" : ".drawer-product-container .product-item:first-child"
        const target = document.querySelector(querySelectorString)
        if(target){
          const bbox = target.getBoundingClientRect()
          dragRef.current.style.top = `${bbox.y + bbox.height / 2}px`
          dragRef.current.style.left = `${bbox.x + bbox.width / 2}px`

          const object = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2
          }

          animationRef.current = gsap.to(
            object, 
            { 
              y: window.innerHeight - 200,
              x: window.innerWidth / 2,
              duration: 1, 
              ease: "none",
              repeat: 50,
              onUpdate: () => {
                dragRef.current.style.top = `${object.y}px`
                dragRef.current.style.left = `${object.x}px`
              }
            }
          )
        }
      }
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)){
        const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

        if(animationRef.current){
            animationRef.current.kill()
        }

        if(index === 2){
            setdisableScrolling(false)
        } else {
            setdisableScrolling(true)
        }

        if(index === 0){
            dispatch(setCurrentMenu('Decoratives'))
        }
        else if(
            // Drag drop decor
            index === 1 
            // Upload product button in drawer product 
            || index === 2 
            // Save product button in modal
            || index === 3
            // Drag drop product
            || index === 4
            // Preview mode
            || index === 5
        ){
          dispatch(setStoreOnboardingRunForRetailer(false));
          dispatch(setWaitingForAction(true))
          dispatch(setStepStoreOnboardingIndexForRetailer(nextStepIndex));
          if(index === 5) {
            dispatch(setIsPreviewModel(true))
          }
          return
        }
      
        setTimeout(() => {
            dispatch(setStepStoreOnboardingIndexForRetailer(nextStepIndex));
        }, 500)
    }
  };

  return (
    <>
      <img 
        ref={dragRef}
        src={DragImage} 
        id="imgDragGif"
        alt=""
        style={{
          position: "fixed",
          zIndex: 10000,
          display: storeOnboardingRunForRetailer && stepStoreOnboardingIndexForRetailer === 1 ? "block" : "none",
          transform: 'translateY(-50%) translateX(-50%)'
        }}
      />
      <Joyride
        tooltipComponent={CustomTooltip}
        continuous
        disableOverlayClose
        hideCloseButton
        run={storeOnboardingRunForRetailer}
        callback={handleJoyrideCallback}
        locale={{
          last: "Next",
          next: "Next",
        }}
        disableScrolling={disableScrolling}
        steps={steps}
        stepIndex={stepStoreOnboardingIndexForRetailer}
        styles={{
          options: {
            zIndex: 1000,
          },
          spotlight: {
            border: "2px solid transparent",
            boxShadow: "0 0 10px 5px #00FFFF",
          },
        }}
      />
    </>
  );
};

export default StoreEditorOnBoardingForRetailer;
