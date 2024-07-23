import { Col, Row, Spin, notification, Input } from 'antd';
import { useEffect, useState } from 'react';
import './styles.scss';
import routesConstant from '../../../routes/routesConstant';
import { Navigate, useNavigate } from 'react-router-dom';
import uathApi from "../../../api/auth.api"
import FacebookButton from '../../../components/facebookButton/FacebookButton';
import GoogleButton from '../../../components/googleButton/GoogleButton';
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from '../../../utils/storage';
import { getAgreeWithTermAndConditions, getRememberLoginInfo, getShouldRememberPassword, setAgreeWithTermAndConditions, setRememberLoginInfo, setShouldRememberPassword, setUser } from '../../../redux/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { decodeUrl, getDefaultHomePage } from '../../../utils/util';
import InstagramButton from '../../../components/instagramButton/InstagramButton';
import LOGO from "../../../assets/images/LOGO.svg";
import { isShopifyEmbedded } from "@shopify/app-bridge/utilities"
import CarouselLoginAndRegister from '../../../components/carouselLoginAndRegister/CarouselLoginAndRegister';
import { APP_SOURCES, USER_ROLE } from '../../../utils/constants';
import global, { isMetadrobDrobAPage, isMetadrobVSPage } from '../../../redux/global';

import BackGround1 from "../../../assets/images/login/bg-1.png"
import BackGround2 from "../../../assets/images/login/bg-2.png"
import BackGround3 from "../../../assets/images/login/bg-3.png"
import _ from 'lodash';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const shouldRememberPassword = useSelector(getShouldRememberPassword)
  const [isLoading, setIsLoading] = useState(false)
  
  const rememberLoginInfo = useSelector(getRememberLoginInfo)
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

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    if(rememberLoginInfo && rememberLoginInfo.email && rememberLoginInfo.password){
      setFormData(rememberLoginInfo)
    }
  }, [rememberLoginInfo])

  if(global.IS_SHOPIFY){
    return <>
      <Navigate to={routesConstant.shopify.path} />
    </>
  }

  const onSubmit = () => {
    //Validate
    if(!formData.email || !formData.password){
      notification.warning({
        message: "Email and password is required."
      })
      return
    }
    setIsLoading(true)
    uathApi.login(formData).then(data => {
      if(shouldRememberPassword){
        dispatch(setRememberLoginInfo(formData))
      } else {
        dispatch(setRememberLoginInfo({email: "", password: ""}))
      }
      setIsLoading(false)
      onLoginSuccess(data)
    }).catch(err => {
      notification.error({
        message: err?.response?.data.message || "Incorrect email or password"
      })
      setIsLoading(false)
    })
  }

  const onNavigateToRegister = () => {
    const returnUrl = new URLSearchParams(window.location.search).get(
      "returnUrl"
    );
    if(returnUrl){
      navigate(`${routesConstant.register.path}?returnUrl=${returnUrl}`, { replace: true })
    } else {
      navigate(routesConstant.register.path, { replace: true })
    }
  }

  const onLoginSuccess = (data) => {
    if(global.IS_DROB_A){
      if(!(data.user?.role === USER_ROLE.ADMIN) && _.get(data, ['user', 'appSource']) === APP_SOURCES.METADROB) {
        // Notify
        notification.warning({
          message: "Incorrect email or password"
        })
        return
      }
    }

    if(!global.IS_DROB_A){
      if(!(data.user?.role === USER_ROLE.ADMIN) && _.get(data, ['user', 'appSource']) === APP_SOURCES.DROBA) {
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
        message: "Login success"
    })

    const returnUrl = new URLSearchParams(window.location.search).get(
        "returnUrl"
    );
    if(returnUrl){
        window.location = decodeUrl(returnUrl)
    } else {
      if(data.user?.role === USER_ROLE.RETAILERS && !_.get(data, ['user', 'isCompleteEnterProfile'], false)){
        navigate(routesConstant.firstLogin.path)
      } else {
        navigate(getDefaultHomePage(data.user, true))
      }
    }
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
        <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24} className='left-col flex flex-col gap-[24px] 2xl:gap-[50px]'>
          <div className='flex justify-start w-full'>
            <img src={LOGO} alt="" className='h-[44px]'/>
          </div>
          <div className='w-full flex items-center flex-auto'>
            <div className='login-form'>
              <div className='login-title'>Login to Dashboard</div>
              <div className='sub__login-title'>This is your dashboard login Panel. Enter Your Login Credentials to login to your dashboard</div>
              <div className='form-input-container mt-[24px] 2xl:mt-[50px]'>
                <div className='form-title'>
                  Email address
                </div>
                <Input
                  type='email'
                  className='input-text-form'
                  placeholder='metadrob@gmail.com'
                  value={formData.email}
                  onChange={(e) => {setFormData({
                    ...formData,
                    email: e.target.value
                  })}}
                  autoComplete='off'
                  onPressEnter={() => {onSubmit()}}
                />
              </div>
              <div className='form-input-container mt-[24px] 2xl:mt-[50px]'>
                <div className='form-title'>
                  Password
                </div>
                <Input
                  type='password'
                  className='input-text-form'
                  placeholder='* * * * * * * *'
                  value={formData.password}
                  onChange={(e) => {setFormData({
                    ...formData,
                    password: e.target.value
                  })}}
                  autoComplete='off'
                  onPressEnter={() => {onSubmit()}}
                />
              </div>
              <div className='option-login mt-[18px]'>
                <div className='remember' onClick={() => dispatch(setShouldRememberPassword(!!!shouldRememberPassword))}><div className={`${shouldRememberPassword ? 'checked' : 'unchecked'}`}></div>Remember Me</div>
                <div className='forget-password' onClick={() => {navigate(routesConstant.forgotPassword.path)}}>Forgot Password</div>
              </div>
              <Spin spinning={isLoading} wrapperClassName=' mt-[36px] xl:mt-[48px] 2xl:mt-[100px] rounded-[110px] overflow-hidden'>
                <button className='login-button' onClick={() => {onSubmit()}}>LOGIN</button>
              </Spin>
              
              <div className='other-login mt-[25px]'>
                <div className='other-login-title'>Login with</div>
                  <GoogleButton onSuccess={(data) => {onLoginSuccess(data)}}/>
                  {/* <FacebookButton onSuccess={(data) => {onLoginSuccess(data)}}/> */}
                  {/* <InstagramButton /> */}
                </div>
                {!isShopifyEmbedded() && <div className='register mt-[28px] 2xl:mt-[90px]'>
                  Don't have an account? <span className='register-now' onClick={() => {onNavigateToRegister()}}>REGISTER NOW</span>
                </div>}
            </div>
          </div>
        </Col>
        <Col xxl={13} xl={13} lg={13} md={13} sm={0} xs={0} className='right-col p-[15px] md:p-[30px]'>
          <CarouselLoginAndRegister onIndexChange={(value) => {setIndex(value)}} />
        </Col>
      </Row>
    </div>
    
  </>
}

export default Login
