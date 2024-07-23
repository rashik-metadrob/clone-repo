
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import { useSelector, useDispatch } from 'react-redux';
import {
  toggle,
  bookModalStatus

} from '../Slices/bookModalSlice';
import { Modal } from "react-bootstrap";
import { postContact } from "../../utilities/utils";

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



export function BookModal() {
  const modal = useSelector(bookModalStatus);

  if(modal===true){
disableBodyScroll({ savePosition: true })
}else{
  enableBodyScroll()
}




  const dispatch = useDispatch();





  // useEffect(() => {


  // }, [verifyToken]);

  const handleSubmit=(e)=>{
    // handleReCaptchaVerify()



    let jsonData={
      'name': e.target.first_name.value + ' ' + e.target.last_name.value,
      'email':e.target.mail.value,
      'message': e.target.message.value
    }
    postContact(jsonData);
 alert("Thanks for submitting,we will get back to you.");
 dispatch(toggle())
    e.preventDefault();

  }

  return (
    <div >
    <div id="bookdemo" className="modal fade show" >
    <div className="modal-dialog modal-dialog-centered modal-lg">

    <Modal  size="lg" onHide={()=>{dispatch(toggle())}}  show={modal}>
  <Modal.Body className="modal-body bookpopupbody">
  <Modal.Body className="homeForm1">

  <button
                 type="button"
                 className="close custom-close-button"
                 aria-label="Close"
                 onClick={() => { dispatch(toggle()) }}
               >
               </button>
        <Modal.Header  className="heading bookpopupbody" style={{ borderBottom: 'none' , color: 'white'}} >

          <p>Do you need a virtual  Store? Here we have <br/> <span> A CUSTOM SOLUTION</span> for you</p>


        </Modal.Header>
        <Modal.Header className="heading bookpopupbody"  style={{ borderBottom: 'none' }}>

        <div className="title" >  <div className="title"><span>BOOK </span> A DEMO <br/> TODAY</div></div>
        </Modal.Header>

        <Modal.Body >
        <form onSubmit={(e)=>handleSubmit(e)}  id="demo-form">
          <div className="d-flex">
            <div className="input_grp">
              <input type="text" name="first_name" required placeholder="First Name*" />
            </div>
            <div className="input_grp">
              <input type="text" name="last_name" required placeholder="Last Name*"/>
            </div>
          </div>
          <div className="input_grp">
                  <input name="mail" required type="text"  placeholder="E mail*"/>


          </div>
          <div className="input_grp">
            <label htmlFor="">Message</label>
            <textarea name="message" required cols="30" rows="4" placeholder="Message"></textarea>
          </div>


                    <div className="button-wrapper">
              <br/>
              <input type="submit" value="SUBMIT NOW" className="subBtn"  />
            </div>
        </form>
        </Modal.Body>

        </Modal.Body>

</Modal.Body>
    </Modal>
    </div >
</div >
    <div id="bookdemo" className="modal fade show" >

<div className="modal-dialog modal-dialog-centered modal-lg">
<div className="modal-content bookcontent">
<div className="modal-body bookpopupbody">
  <div className="homeForm">
    <div className="col-sm-12">
      <div className="inner_content section--reveal" style={{opacity:'1',visibility:'inherit'}}>
        <div className="heading bookpopupbody">
          <p>Do you need a virtual  Store? Here we have <br/> <span> A CUSTOM SOLUTION</span> for you</p>
          <div className="title"><span>BOOK </span> A DEMO <br/> TODAY</div>
        </div>


      </div>
    </div>
  </div>
</div>
</div>
</div>
</div>
</div>


  );
}

export default BookModal;
