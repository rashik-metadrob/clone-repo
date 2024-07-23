import { Layout } from "antd";
import { useEffect, useState } from "react";
import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { setCollapsed } from "../../redux/navbarSlice";
import {
  setStepIndex,
  setRun,
  getRun,
  getStepIndex,
  setSteps,
  getSteps,
} from "../../redux/joyrideSlice";
import { changeFirstLogin, setUser } from "../../redux/appSlice";

import Joyride, {
  ACTIONS,
  EVENTS,
} from "react-joyride";
import { Card, Button, Typography } from "antd";
import ArrowImage from "../../assets/images/Next.svg"; // Import your arrow image
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/user.api";
import {
  setStorageUserDetail,
} from "../../utils/storage";

const { Title } = Typography;
const { Header } = Layout;

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function scrollToTop() {
  // For modern browsers
  if (window.scrollTo) {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Adds smooth scrolling animation
    });
  }
  // For older browsers
  else if (document.documentElement.scrollTop) {
    document.documentElement.scrollTop = 0;
  }
}

function CustomTooltip({
  continuous,
  isLastStep,
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

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const run = useSelector(getRun);
  const steps = useSelector(getSteps);

  const stepIndex = useSelector(getStepIndex);
  const [disableScrolling, setdisableScrolling] = useState(false);

  const handleJoyrideCallback = (data) => {
    const { action, index, type, status, step } = data;
    console.log(type, index, "status");
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (
        type === "step:after" &&
        index === 1 /* or step.target === '#home' */
      ) {
        document.body.style.overflow = "hidden";
        dispatch(setCollapsed(false));

        dispatch(setStepIndex(nextStepIndex));
      } else if (
        type === "step:after" &&
        index === 2 /* or step.target === '#home' */
      ) {
        dispatch(setRun(false));
        dispatch(changeFirstLogin());
        userApi
          .completeOnboarding()
          .then((data) => {
            setStorageUserDetail(data);
            dispatch(setUser(data));
            window.location.reload();
        })
        .catch((err) => {
          window.location.reload();
        });
      } else {
        dispatch(setStepIndex(nextStepIndex));
      }
    }

    if (action === ACTIONS.SKIP) {
      userApi
        .completeOnboarding()
        .then((data) => {
          console.log('user detail', data)
          setStorageUserDetail(data);
          dispatch(setUser(data));
        })
        .catch((err) => {
        });
    }
    console.log(index, action, "act");
  };

  // const targetElementIds = ['tester','analytics','products','onlinevirtualstore','ethRef','analyticsContainer','addNew','rc-tabs-15-tab-1','rc-tabs-15-tab-2','rc-tabs-15-tab-3'];
  const targetElementIds = [
    ["body", "Welcome to your metaverse", "center", "Welcome"],
    [
      "tester",
      "This is your dashboard where you can see an overview of your products.",
      "bottom",
      "Home",
    ],
    [
      "analytics",
      "This is your analytics tab that gives gives you insights of your store",
      "right",
      "Analytics",
    ],
    [
      "products",
      "This is your products tab where you can add 3d models to your store with meta information.",
      "right",
      "Upload",
    ],
  ];
  // other=[,['addNew','This is your add a product tab.','bottom','Add New Products'],['onlinevirtualstore','This is your tab where you can open your customized online store','right','3D Stores'],['rc-tabs-15-tab-1','You can view your various templates.','bottom','Custom Templates'],['rc-tabs-15-tab-2','You can view your various projects.','bottom','Your Projects'],['rc-tabs-15-tab-3','You can view your various archives.','bottom','Archives']]
  const navigateFunc = (path) => {
    // Use React Router's navigation method to navigate to the previous page or step
    navigate(path);
  };
  useEffect(() => {
    targetElementIds.forEach((id) => {
      let targetElement = null;
      if (id[0] == "body") {
        targetElement = "body";
      } else {
        targetElement = document.getElementById(id[0]);
      }
      console.log(targetElement, "k");

      if (targetElement !== null) {
        console.log("hello");
        const isElementAlreadyAdded = steps.some(
          (s) => s.target === targetElement
        );
        console.log(steps, "tr");

        if (!isElementAlreadyAdded) {
          console.log(targetElement, "target");
          // dispatch(
          //   setSteps({
          //     content: <h2>{id[1]}</h2>,
          //     placement: id[2],
          //     target: targetElement,
          //     action: "lol",
          //     title: id[3],
          //   })
          // );
        }
      }
    });
  }, []);
  console.log(steps, run, "target");

  return (
    <Joyride
      tooltipComponent={CustomTooltip}
      continuous
      disableOverlayClose
      hideCloseButton
      run={run}
      callback={handleJoyrideCallback}
      locale={{
        last: "Next",
        next: "Next",
      }}
      disableScrolling={disableScrolling}
      steps={steps}
      stepIndex={stepIndex}
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
  );
};

export default Onboarding;
