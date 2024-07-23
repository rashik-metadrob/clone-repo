
import React ,{ useState, useEffect  }  from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import { useSelector, useDispatch } from 'react-redux';
import {
  toggle,
  popupStatus

} from '../Slices/popupSlice';
import { Modal } from "react-bootstrap";
import { postContact } from "../../utilities/utils";
import { postSubscription } from "../../utilities/utils";

import { useMixpanel } from 'react-mixpanel-browser';

function enableBodyScroll() {
  if (document.readyState === 'complete') {
    document.body.style.position = '';
    document.body.style.overflowY = '';

    if (document.body.style.marginTop) {
      const scrollTop = -parseInt(document.body.style.marginTop, 10);
      document.body.style.marginTop = '';
      window.scrollTo(window.pageXOffset, scrollTop);
    }
  } else {
    window.addEventListener('load', enableBodyScroll);
  }
}

function disableBodyScroll({ savePosition = false } = {}) {
  if (document.readyState === 'complete') {
    if (document.body.scrollHeight > window.innerHeight) {
      if (savePosition) document.body.style.marginTop = `-${window.pageYOffset}px`;
      document.body.style.position = 'fixed';
      document.body.style.overflowY = 'scroll';
    }
  } else {
    window.addEventListener('load', () => disableBodyScroll({ savePosition }));
  }
}



export function PopupCounter() {

  const pop = useSelector(popupStatus);
console.log(pop,"pop mf")
  const [delayPassed, setDelayPassed] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  if(pop===true){
disableBodyScroll({ savePosition: true })
}else{
  enableBodyScroll()
}




  const dispatch = useDispatch();



  useEffect(() => {
    if (pop === true) {
      disableBodyScroll({ savePosition: true });
    } else {
      enableBodyScroll();
    }
  }, [pop]);

  // Use a useEffect to dispatch the toggle action after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayPassed(true);
      dispatch(toggle());
    }, 10000);

    // Clear the timer if the component unmounts or if pop changes to false
    return () => clearTimeout(timer);
  }, [dispatch]);

  // useEffect(() => {


  // }, [verifyToken]);

  const handleSubmit=(e)=>{
    // handleReCaptchaVerify()


console.log(e.target.email,"is")
    let jsonData={
      'name': "POP-UP",

      'email':e.target.email.value,
    }
    postSubscription(jsonData);
    alert("Thanks for submitting,we will get back to you.");
    dispatch(toggle())
    e.preventDefault();

  }

  return (
    <div >
    <div id="bookdemo" className="modal fade show" >
    <div className="modal-dialog modal-dialog-centered modal-lg">

    <Modal centered  show={pop}   >

      <Modal.Body className="new-modal-body book-popup-body">
        <Modal.Body className="new-home-form">
        <button
                       type="button"
                       className="close custom-close-button"
                       aria-label="Close"
                       onClick={() => { dispatch(toggle()) }}
                     >
                     </button>
          <div className="new-modal-title">Get Ready, Get Set!</div>
          <div className="new-modal-subtitle">Be the first to know about Metadrob Launch</div>
          <form onSubmit={(e) => handleSubmit(e)} id="new-demo-form">
            <div className="new-input-group">
              <input name="email" required type="text" placeholder="Email*" />
              <div className="new-button-wrapper">
                <input type="submit" value="Notify me" className="new-submit-button" />
              </div>
            </div>
          </form>
          <div className="new-modal-bottitle">
            To see how we may use your information, take a look at our <span className="underline-text">privacy policy</span>
          </div>
        </Modal.Body>
      </Modal.Body>
    </Modal>

    </div >
</div >

</div>


  );
}

export default PopupCounter;
