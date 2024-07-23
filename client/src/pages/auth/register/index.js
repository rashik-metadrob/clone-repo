import { Col, Row, Spin, notification } from 'antd';
import { useState } from 'react';
import routesConstant from '../../../routes/routesConstant';
import { useNavigate } from 'react-router-dom';
import FacebookButton from '../../../components/facebookButton/FacebookButton';
import GoogleButton from '../../../components/googleButton/GoogleButton';
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from '../../../utils/storage';
import { getAgreeWithTermAndConditions, setAgreeWithTermAndConditions, setUser } from '../../../redux/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { decodeUrl, getDefaultHomePage } from '../../../utils/util';
import InstagramButton from '../../../components/instagramButton/InstagramButton';
import _ from 'lodash'
import { APP_SOURCES, USER_ROLE } from '../../../utils/constants';
import LOGO from "../../../assets/images/LOGO.svg";
import authApi from '../../../api/auth.api';
import CarouselLoginAndRegister from '../../../components/carouselLoginAndRegister/CarouselLoginAndRegister';

import BackGround1 from "../../../assets/images/login/bg-1.png"
import BackGround2 from "../../../assets/images/login/bg-2.png"
import BackGround3 from "../../../assets/images/login/bg-3.png"
import ModalTermsAndConditions from '../../../components/modalTermsAndConditions/ModalTermsAndConditions';
import global from '../../../redux/global';

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
    name: ""
  })
  const [index, setIndex] = useState(0)
  const [items, setItems] = useState([
    {
        id: 1,
        background: BackGround1
    },
    {
        id: 2,
        background: BackGround2
    },
    {
        id: 3,
        background: BackGround3
    }
  ])
  const [isShowModalTermsAndConditions, setIsShowModalTermsAndConditions] = useState(false)
  const agreeWithTermAndConditions = useSelector(getAgreeWithTermAndConditions)

  const onSubmit = () => {
    const returnUrl = new URLSearchParams(window.location.search).get(
      "returnUrl"
    );
    let role = USER_ROLE.RETAILERS;
    if (returnUrl) {
      role = USER_ROLE.CUSTOMER;
    }
    //Validate
    if (!formData.password1 || !formData.name || !formData.password2 || !formData.email) {
      notification.warning({
        message: "One or more fields is invalid."
      })
      return
    }
    if (formData.password1 !== formData.password2) {
      notification.warning({
        message: "Password must be same."
      })
      return
    }
    if(!agreeWithTermAndConditions){
      notification.warning({
        message: "Please agree with Terms and Conditions!"
      })
      return
    }
    setLoading(true)
    let sendData = {
      email: formData.email,
      password: formData.password1,
      name: formData.name,
      role: role,
      appSource: global.IS_DROB_A ? APP_SOURCES.DROBA : APP_SOURCES.METADROB
    }
    authApi.register(sendData).then(data => {
      setLoading(false)
      if (returnUrl) {
        window.location = decodeUrl(returnUrl)
      } else {
        notification.success({
          message: "Please check your email to active your account!"
        })

        // if(data.user?.role === USER_ROLE.RETAILERS){
        //   navigate(routesConstant.firstLogin.path)
        // } else {
        //   navigate(getDefaultHomePage(data.user))
        // }
      }

    }).catch(err => {
      notification.error({
        message: err?.response?.data.message || "Incorrect infomation"
      })
      setLoading(false)
    })
  }
  const onNavigateToLogin = () => {
    const returnUrl = new URLSearchParams(window.location.search).get(
      "returnUrl"
    );
    console.log("returnUrl", returnUrl)
    if (returnUrl) {
      navigate(`${routesConstant.login.path}?returnUrl=${returnUrl}`, { replace: true })
    } else {
      navigate(routesConstant.login.path, { replace: true })
    }
  }
  const onLoginSuccess = (data) => {
    if(global.IS_DROB_A){
      if(data.user?.role !== USER_ROLE.ADMIN && _.get(data, ['user', 'appSource']) === APP_SOURCES.METADROB) {
        // Notify
        notification.warning({
          message: "Incorrect email or password"
        })
        return
      }
    }

    if(!global.IS_DROB_A){
      if(data.user?.role !== USER_ROLE.ADMIN && _.get(data, ['user', 'appSource']) === APP_SOURCES.DROBA) {
        // Notify
        notification.warning({
          message: "Incorrect email or password"
        })
        return
      }
    }

    setStorageUserDetail(data.user)
    dispatch(setUser(data.user))
    setStorageToken(data.tokens.access.token)
    setStorageRefreshToken(data.tokens.refresh.token)
   
    notification.success({
      message: "Sign up successfully!"
    })
    const returnUrl = new URLSearchParams(window.location.search).get(
      "returnUrl"
    );
    if (returnUrl) {
      window.location = decodeUrl(returnUrl)
    } else {
      if(data.user?.role === USER_ROLE.RETAILERS && !_.get(data, ['user', 'isCompleteEnterProfile'], false)){
        navigate(routesConstant.firstLogin.path)
      } else {
        navigate(getDefaultHomePage(data.user))
      }
    }
  }

  const onShowTermsAndConditions = (e) => {
    e.stopPropagation()

    setIsShowModalTermsAndConditions(true)
  }

  return <>
    <div className='px-[32px] md:px-[73px] min-h-screen flex justify-center items-center w-full relative'>
      {
        items.map((el, idx) => (
          <div 
              className={`login-image-wrapper ${index % items.length === idx ? 'active' : ''}`} 
              key={el.id} 
              style={{
                  backgroundImage: `url(${el.background})`
              }}
          >
          </div>
        ))
      }
      <Row className='login__container rounded-[10px] md:rounded-[20px] overflow-hidden w-full relative z-[2]'>
        <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24} className='left-col flex flex-col gap-[50px]'>
          <div className='flex justify-start w-full'>
            <img src={LOGO} alt="" className='h-[44px]'/>
          </div>
          <div className='w-full flex items-center flex-auto'>
            <div className='login-form'>
              <div className='login-title'>Welcome To METADROB</div>
              <div className='sub__login-title'>Create Your Metadrob account & step into the world of future retail.</div>
              <div className='form-input-container mt-[24px] 2xl:mt-[50px]'>
                <div className='form-title'>
                Name
                </div>
                <input
                  type='text'
                  className='input-text-form'
                  placeholder='Name'
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                  }}
                />
              </div>
              <div className='form-input-container mt-[20px]'>
                <div className='form-title'>
                  Email
                </div>
                <input
                  type='email'
                  className='input-text-form'
                  placeholder='Email'
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                  }}
                />
              </div>
              <div className='form-input-container mt-[20px]'>
                <div className='form-title'>
                  Password
                </div>
                <input
                  type='password'
                  className='input-text-form'
                  placeholder='Password'
                  value={formData.password1}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password1: e.target.value
                    })
                  }}
                />
              </div>
              <div className='form-input-container mt-[20px]'>
                <div className='form-title'>
                Repeat Password
                </div>
                <input
                  type='password'
                  className='input-text-form'
                  placeholder='Repeat Password'
                  value={formData.password2}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password2: e.target.value
                    })
                  }}
                />
              </div>
              <div className='option-login mt-[18px]'>
                <div className='remember' onClick={() => dispatch(setAgreeWithTermAndConditions(!!!agreeWithTermAndConditions))}>
                  <div className={`${agreeWithTermAndConditions ? 'checked' : 'unchecked'}`}></div>
                  <span>I agree with <span className='text-[#00F6FF] underline' onClick={(e) => {onShowTermsAndConditions(e)}}>Terms & Conditions</span></span>
                </div>
              </div>
              <Spin spinning={loading} wrapperClassName='mt-[40px] rounded-[110px] overflow-hidden'>
                <button className='login-button' onClick={onSubmit}>Create an account</button>
              </Spin>
              <div className='other-login mt-[25px]'>
                <div className='other-login-title'>Continue with</div>
                <GoogleButton onSuccess={(data) => { onLoginSuccess(data) }} />
                {/* <FacebookButton onSuccess={(data) => { onLoginSuccess(data) }} /> */}
                {/* <InstagramButton /> */}
              </div>
              <div className='register mt-[25px]'>
                Already have an account? <span className='register-now' onClick={() => { onNavigateToLogin() }}>Sign In</span>
              </div>
            </div>
          </div>
          
        </Col>
        <Col xxl={13} xl={13} lg={13} md={13} sm={0} xs={0} className='right-col p-[15px] md:p-[30px]'>
          <CarouselLoginAndRegister onIndexChange={(value) => {setIndex(value)}} />
        </Col>
      </Row>
    </div>
    <ModalTermsAndConditions
        open={isShowModalTermsAndConditions}   
        onClose={() => {setIsShowModalTermsAndConditions(false)}}
        onAgree={() => {
          dispatch(setAgreeWithTermAndConditions(true))
          setIsShowModalTermsAndConditions(false)
        }}
    />
  </>
 
}

export default Register
