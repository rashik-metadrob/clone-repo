import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setStepStoreOnboardingIndexForViewer,
  setStoreOnboardingRunForViewer,
  setStepsStoreOnboardingForViewer,
  getStepsStoreOnboardingForViewer,
  setWaitingForAction,
  getStoreOnboardingRunForViewer,
  getStepStoreOnboardingIndexForViewer,
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
import { setIsCompleteStoreOnboardingForViewer } from "../../redux/appSlice";
import { setIsPreviewModel } from "../../redux/modelSlice";
import _ from "lodash";

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

const StoreEditorOnBoardingForViewer = () => {
  const dispatch = useDispatch();
  const storeOnboardingRunForViewer = useSelector(getStoreOnboardingRunForViewer);
  const steps = useSelector(getStepsStoreOnboardingForViewer);
  const stepStoreOnboardingIndexForViewer = useSelector(getStepStoreOnboardingIndexForViewer);
  const dragRef = useRef()
  const animationRef = useRef()

  useEffect(() => {
    initOnboarding();
    return () => {
      if(animationRef.current){
        animationRef.current.kill()
      }
    }
  }, []);

  const initOnboarding = () => {
    const debounce = _.debounce(() => {
      const targetElementIds = [
        {
          element: '#decorativeMenuItem',
          content: 'Select decorative menu',
          position: 'right',
          title: 'Step 1/5'
        },
        {
          element: '.drawer-library-container .library-item:first-child',
          content: 'Drag and drob an item to the store',
          position: 'right',
          title: 'Step 2/5'
        },
        {
          element: '#btnPreview',
          content: 'Click here to preview the store',
          position: 'top',
          title: 'Step 3/5'
        },
        {
          element: '.btn-exit-preview-mode',
          content: 'Click here to exit preview',
          position: 'bottom',
          title: 'Step 4/5'
        }
      ];
      targetElementIds.forEach((e) => {
        let targetElement = e.element;
  
        if (!targetElement) {
          return;
        }
  
  
        dispatch(
          setStepsStoreOnboardingForViewer({
            content: <h2>{e.content}</h2>,
            placement: e.position,
            target: targetElement,
            title: e.title,
            disableBeacon: true
          })
        );
      });
    }, 1000)

    debounce()
  };

  const handleJoyrideCallback = (data) => {
    const { action, index, type, step } = data;

    if (action === ACTIONS.SKIP) {
      dispatch(setIsCompleteStoreOnboardingForViewer(true))
      dispatch(setStoreOnboardingRunForViewer(false))
      return
    }
    
    if([EVENTS.TOUR_END].includes(type)){
      dispatch(setIsCompleteStoreOnboardingForViewer(true))
      dispatch(setStoreOnboardingRunForViewer(false))
    }

    if([EVENTS.STEP_BEFORE].includes(type)){
      if(index === 1){
        const target = document.querySelector(".drawer-library-container .library-item:first-child")
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

      if(index === 0){
        dispatch(setCurrentMenu('Decoratives'))
      }
      else if(index === 1){
        dispatch(setStoreOnboardingRunForViewer(false));
        dispatch(setWaitingForAction(true))
        dispatch(setStepStoreOnboardingIndexForViewer(nextStepIndex));
        return
      }
      else if(index === 2){
        dispatch(setStoreOnboardingRunForViewer(false));
        dispatch(setWaitingForAction(true))
        dispatch(setStepStoreOnboardingIndexForViewer(nextStepIndex));
        dispatch(setIsPreviewModel(true))
        return
      }
      
      setTimeout(() => {
        dispatch(setStepStoreOnboardingIndexForViewer(nextStepIndex));
      }, 1000)
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
          display: storeOnboardingRunForViewer && stepStoreOnboardingIndexForViewer === 1 ? "block" : "none",
          transform: 'translateY(-50%) translateX(-50%)'
        }}
      />
      <Joyride
        tooltipComponent={CustomTooltip}
        continuous
        disableOverlayClose
        hideCloseButton
        run={storeOnboardingRunForViewer}
        callback={handleJoyrideCallback}
        locale={{
          last: "Next",
          next: "Next",
        }}
        disableScrolling={true}
        steps={steps}
        stepIndex={stepStoreOnboardingIndexForViewer}
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

export default StoreEditorOnBoardingForViewer;
