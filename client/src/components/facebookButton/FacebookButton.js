import React from 'react';
import Facebook from '../../assets/images/login/FACEBOOK.png';
import FacebookLight from '../../assets/images/login/FACEBOOK-light.png';
import authApi from '../../api/auth.api';
import { notification } from 'antd';
import FacebookIcon from "../../assets/images/project/facebook.svg"
import { useSelector } from 'react-redux';
import { getTheme } from '../../redux/appSlice';

const FacebookButton = ({
    onSuccess = () => {},
    renderType = "LOGIN_PAGE"
}) => {
    const theme = useSelector(getTheme)
    const onLoginFB = () => {
        window.FB.login(function(response){
            if(response?.status === "connected"){
                let accessToken = response?.authResponse?.accessToken
                const payload = {
                    token: accessToken
                };
                authApi.loginWidthFaceBook(payload).then(data => {
                    onSuccess(data)
                }).catch(err => {
                    notification.error({
                        message: err?.response?.data.message || "Login fail! Please try again!"
                    })
                })
            }
        });
    }
    return (
        <>
            {
                renderType === "LOGIN_PAGE" && <div className='other-login-btn' onClick={onLoginFB}>
                    <img src={theme === 'dark' ? Facebook : FacebookLight} alt='Facebook'/>
                </div>
            }

            {   renderType === "PUBLISH_PAGE" && <div className="btn-social btn-facebook mt-[clamp(4px,1vh,16px)] xl:mt-[clamp(4px,3vh,25px)]" onClick={onLoginFB}>
                <img src={FacebookIcon} alt="" />
                Continue with Facebook
            </div>
            }
        </>
        
    );
};

export default FacebookButton;
