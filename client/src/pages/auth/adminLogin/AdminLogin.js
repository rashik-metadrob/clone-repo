import { Col, Row, notification } from 'antd';
import { useEffect, useState } from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import uathApi from "../../../api/auth.api"
import GoogleButton from '../../../components/googleButton/GoogleButton';
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from '../../../utils/storage';
import { getRememberLoginInfo, getShouldRememberPassword, setRememberLoginInfo, setShouldRememberPassword, setUser } from '../../../redux/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getDefaultHomePage } from '../../../utils/util';
import _ from 'lodash'
import { USER_ROLE } from '../../../utils/constants';
import LoginLogo from '../../../assets/images/login/LOGO.svg'

const AdminLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const shouldRememberPassword = useSelector(getShouldRememberPassword)
  const rememberLoginInfo = useSelector(getRememberLoginInfo)

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    if(rememberLoginInfo && rememberLoginInfo.email && rememberLoginInfo.password){
      setFormData(rememberLoginInfo)
    }
  }, [rememberLoginInfo])

  const onSubmit = () => {
    //Validate
    if(!formData.email || !formData.password){
      notification.warning({
        message: "Email and password is required."
      })
      return
    }

    uathApi.login(formData).then(data => {
        if(shouldRememberPassword){
            dispatch(setRememberLoginInfo(formData))
        } else {
            dispatch(setRememberLoginInfo({email: "", password: ""}))
        }
        onLoginSuccess(data)
    }).catch(err => {
        notification.error({
            message: err?.response?.data.message || "Incorrect email or password"
        })
    })
  }

  const onLoginSuccess = (data) => {
    setStorageUserDetail(data.user)
    dispatch(setUser(data.user))
    setStorageToken(data.tokens.access.token)
    setStorageRefreshToken(data.tokens.refresh.token)

    if(_.get(data.user, 'role', '') === USER_ROLE.ADMIN){
        notification.success({
          message: "Login success"
        })
        navigate(getDefaultHomePage(data.user))
    } else {
        notification.error({
          message: "You aren't the Admin of Metadrob!"
        })
    }
  }

  return (
    <Row className="admin-login__container">
      <Col lg={15} md={14} sm={0} xs={0} className="left-col relative">
        <img src={LoginLogo} alt="" className='absolute top-[70px] left-[50px]' />
        <div className='absolute bottom-[70px] left-[50px] text-left max-w-[calc(100%-100px)]'>
          <div className='font-[400] font-inter text-[44px] leading-[53px] text-[#FFF]'>
            Designed for <span className='text-[61px]'>Smart Retail</span>
          </div>
          <div className='font-inter font-[300] text-[16px] leading-[19px] text-[#FFF]'>
            Create Your Metadrob account & step into the world of future retail.
          </div>
        </div>
      </Col>
      <Col lg={9} md={10} sm={24} xs={24} className="right-col">
        <div className="login-form">
          <div className="login-title">Login to Admin Dashboard</div>
          <div className="sub__login-title">
            This is your Admin dashboard login Panel. Enter Your Login
            Credentials to login to your Admin dashboard
          </div>
          <div className="form-input-container">
            <div className="form-title">Email address</div>
            <input
              type="email"
              className="input-text-form"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value,
                });
              }}
            />
          </div>
          <div className="form-input-container !mb-[12px]">
            <div className="form-title">Password</div>
            <input
              type="password"
              className="input-text-form"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  password: e.target.value,
                });
              }}
            />
          </div>
          <div className="option-login">
            <div
              className="remember"
              onClick={() =>
                dispatch(setShouldRememberPassword(!!!shouldRememberPassword))
              }
            >
              <div
                className={`${
                  shouldRememberPassword ? "checked" : "unchecked"
                }`}
              ></div>
              Remember Me
            </div>
            <div className="forget-password">Forgot Password</div>
          </div>
          <button
            className="login-button mt-[36px]"
            onClick={() => {
              onSubmit();
            }}
          >
            Login
          </button>
          <div className="other-login mt-[25px]">
            <div className="other-login-title">Continue with</div>
            <GoogleButton
              onSuccess={(data) => {
                onLoginSuccess(data);
              }}
              renderType='ADMIN_LOGIN_PAGE'
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default AdminLogin
