import { Col, Row, Spin, notification } from "antd"
import LOGO from "../../../assets/images/LOGO.svg";
import CarouselLoginAndRegister from "../../../components/carouselLoginAndRegister/CarouselLoginAndRegister";
import { useEffect, useState } from "react";
import authApi from "../../../api/auth.api";
import _ from "lodash";

import BackGround1 from "../../../assets/images/login/bg-1.png"
import BackGround2 from "../../../assets/images/login/bg-2.png"
import BackGround3 from "../../../assets/images/login/bg-3.png"
import { useNavigate } from "react-router-dom";
import routesConstant from "../../../routes/routesConstant";

const VerifyEmail = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false)

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

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get(
            "token"
        );
        if(!token){
            notification.warning({
                message: "Can't find your token."
            })
            return
        }
        
        authApi.verifyEmail(token).then(rs => {
            setLoading(false)
            setIsVerifiedSuccess(true)
          }).catch(err => {
            setIsVerifiedSuccess(false)
            setLoading(false)
          })
    }, [])

    const onGoToLogin = () => {
        navigate(routesConstant.login.path)
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
      <Row className='login__container rounded-[10px] md:rounded-[20px] overflow-hidden w-full min-h-[90vh] relative z-[2]'>
        <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24} className='left-col flex flex-col gap-[24px] 2xl:gap-[50px]'>
          <div className='flex justify-start w-full'>
            <img src={LOGO} alt="" className='h-[44px]'/>
          </div>
            <div className='w-full flex items-center flex-auto'>
                <div className='login-form'>
                    <div className='login-title'>Verify email</div>
                    {!loading && <div className='sub__login-title'>{ isVerifiedSuccess ? "The email is verified successfully!" : "The account is active or token is expried!" }</div>}
                    <Spin spinning={loading} wrapperClassName="mt-[36px] rounded-[110px] overflow-hidden xl:mt-[48px] 2xl:mt-[100px]">
                        <button className='login-button' onClick={() => {onGoToLogin()}}>Go to login</button>
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
export default VerifyEmail