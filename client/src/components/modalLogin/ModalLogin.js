import { Col, Modal, Row, notification } from "antd"
import "./styles.scss"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getRememberLoginInfo, getShouldRememberPassword, setRememberLoginInfo, setShouldRememberPassword, setUser } from "../../redux/appSlice"
import { useEffect, useState } from "react"
import authApi from "../../api/auth.api"
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../utils/storage"
import LOGO from "../../assets/images/LOGO.svg";
import routesConstant from "../../routes/routesConstant"
import GoogleButton from "../googleButton/GoogleButton"
import FacebookButton from "../facebookButton/FacebookButton"

const ModalLogin = ({
    open,
    onClose = () => {},
    onSuccess = () => {},
    loginTitle = "Login to Dashboard",
    loginSubTitle = "This is your dashboard login Panel. Enter Your Login Credentials to login to your dashboard"
}) => {
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
  
      authApi.login(formData).then(data => {
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
  
      onSuccess()
    }
    return <>
        <Modal
            open={open}
            width={500}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            className="modal-login"
            onCancel={() => {onClose()}}
            zIndex={999999}
            centered
        >
            <Row className="modal-login-container">
                <Col span={24} className='left-col flex flex-col gap-[24px]'>
                    <div className='flex justify-start w-full'>
                        <img src={LOGO} alt="" className='h-[44px]'/>
                    </div>
                    <div className='w-full flex items-center flex-auto'>
                        <div className='login-form'>
                            <div className='login-title'>{loginTitle}</div>
                            <div className='sub__login-title'>{loginSubTitle}</div>
                            <div className='form-input-container mt-[24px]'>
                                <div className='form-title'>
                                Email address
                                </div>
                                <input
                                type='email'
                                className='input-text-form'
                                placeholder='metadrob@gmail.com'
                                value={formData.email}
                                onChange={(e) => {setFormData({
                                    ...formData,
                                    email: e.target.value
                                })}}
                                autoComplete='off'
                                />
                            </div>
                            <div className='form-input-container mt-[24px]'>
                                <div className='form-title'>
                                Password
                                </div>
                                <input
                                type='password'
                                className='input-text-form'
                                placeholder='* * * * * * * *'
                                value={formData.password}
                                onChange={(e) => {setFormData({
                                    ...formData,
                                    password: e.target.value
                                })}}
                                autoComplete='off'
                                />
                            </div>
                            <div className='option-login mt-[18px]'>
                                <div className='remember' onClick={() => dispatch(setShouldRememberPassword(!!!shouldRememberPassword))}><div className={`${shouldRememberPassword ? 'checked' : 'unchecked'}`}></div>Remember Me</div>
                                <div className='forget-password' onClick={() => {navigate(routesConstant.forgotPassword.path)}}>Forgot Password</div>
                            </div>
                            <button className='login-button mt-[36px] xl:mt-[48px]' onClick={() => {onSubmit()}}>LOGIN</button>
                            <div className='other-login mt-[25px]'>
                                <div className='other-login-title'>Continue with</div>
                                <GoogleButton onSuccess={(data) => {onLoginSuccess(data)}}/>
                                {/* <FacebookButton onSuccess={(data) => {onLoginSuccess(data)}}/> */}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal>
    </>
}

export default ModalLogin