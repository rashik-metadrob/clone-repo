import { Col, Row, Spin, notification } from "antd"
import LOGO from "../../../assets/images/LOGO.svg";
import CarouselLoginAndRegister from "../../../components/carouselLoginAndRegister/CarouselLoginAndRegister";
import { useState } from "react";
import authApi from "../../../api/auth.api";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import routesConstant from "../../../routes/routesConstant";

import BackGround1 from "../../../assets/images/login/bg-1.png"
import BackGround2 from "../../../assets/images/login/bg-2.png"
import BackGround3 from "../../../assets/images/login/bg-3.png"

const ResetPassword = () => {
  const navigate = useNavigate()
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [loading, setLoading] = useState(false)

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

  const onSubmit = () => {
    if (!password1 || !password2) {
      notification.warning({
        message: "One or more fields is invalid."
      })
      return
    }
    if (password1 !== password2) {
      notification.warning({
        message: "Password must be same."
      })
      return
    }
    const token = new URLSearchParams(window.location.search).get(
      "token"
    );
    if(!token){
      notification.warning({
        message: "Can't find your token."
      })
      return
    }
    setLoading(true)
    authApi.resetPassword(token, {password: password1}).then(rs => {
      notification.success({
        message: "Reset password successfully!"
      })
      setLoading(false)
      navigate(routesConstant.login.path)
    }).catch(err => {
      notification.error({
        message: _.get(err, ['response', 'data', 'message'], `Can't reset password!`)
      })
      setLoading(false)
    })
  }
  return <>
    <div className='px-[32px] md:px-[73px] login-wrapper min-h-screen flex justify-center items-center w-full relative'>
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
      <Row className='login__container rounded-[10px] md:rounded-[20px] overflow-hidden w-full min-h-[90vh] relative z-[2]'>
        <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24} className='left-col flex flex-col gap-[24px] 2xl:gap-[50px]'>
          <div className='flex justify-start w-full'>
            <img src={LOGO} alt="" className='h-[44px]'/>
          </div>
            <div className='w-full flex items-center flex-auto'>
                <div className='login-form'>
                    <div className='login-title'>Reset password</div>
                    <div className='sub__login-title'>Enter your new password</div>
                    <div className='form-input-container mt-[24px] 2xl:mt-[50px]'>
                        <div className='form-title'>
                          Password
                        </div>
                        <input
                          type='password'
                          className='input-text-form'
                          placeholder='* * * * * * * *'
                          value={password1}
                          onChange={(e) => {setPassword1(e.target.value)}}
                          autoComplete='off'
                        />
                    </div>
                    <div className='form-input-container mt-[24px] 2xl:mt-[50px]'>
                        <div className='form-title'>
                          Repeat Password
                        </div>
                        <input
                          type='password'
                          className='input-text-form'
                          placeholder='* * * * * * * *'
                          value={password2}
                          onChange={(e) => {setPassword2(e.target.value)}}
                          autoComplete='off'
                        />
                    </div>
                    <Spin spinning={loading} wrapperClassName="mt-[36px] xl:mt-[48px] 2xl:mt-[100px] rounded-[110px] overflow-hidden">
                      <button className='login-button' onClick={() => {onSubmit()}}>SEND</button>
                    </Spin>
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
export default ResetPassword