import React, { useEffect } from 'react';
import Google from '../../assets/images/login/GOOGLE.png';
import AdminGoogleImage from '../../assets/images/login/ADMIN-GOOGLE.png';
import GoogleLight from '../../assets/images/login/GOOGLE-light.png';
import authApi from '../../api/auth.api';
import { notification } from 'antd';
import { gapi } from 'gapi-script';
import { GoogleLogin } from 'react-google-login';
import GoogleIcon from "../../assets/images/project/google.svg"
import { useSelector } from 'react-redux';
import { getTheme } from '../../redux/appSlice';

const GoogleButton = ({
    onSuccess = () => {},
    renderType = "LOGIN_PAGE"
}) => {
    const theme = useSelector(getTheme)
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_CLIENT_ID_GOOGLE,
                scope: '',
            });
        }
        gapi.load('client:auth2', start);
    }, []);

    const responseGoogle = async (response) => {
        if(response.profileObj){
            const payload = {
                email: response?.profileObj.email,
                name: response?.profileObj.name,
                socialId: response?.profileObj.googleId,
                imageUrl: response?.profileObj?.imageUrl
            };

            await authApi.loginWidthGoogle(payload).then(data => {
                onSuccess(data)
            }).catch(err => {
                notification.error({
                    message: err?.response?.data.message || "Login fail! Please try again!"
                })
            })
        } else {
            notification.error({
                message: "Can't get info from Google! Please try again!"
            })
        }
    };
    const onFailed = (response) => {
        console.log('onFailed', response);
    };

    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_CLIENT_ID_GOOGLE}
            onSuccess={responseGoogle}
            onFailure={onFailed}
            cookiePolicy={'single_host_origin'}
            render={renderProps => {
                return <>
                {
                    renderType === "LOGIN_PAGE" && <div className='other-login-btn' onClick={() => {renderProps.onClick()}}>
                        <img src={theme === "dark" ? Google : GoogleLight} alt='Google'/>
                    </div>
                }
                {
                    renderType === "ADMIN_LOGIN_PAGE" && <div className='admin-login-btn' onClick={() => {renderProps.onClick()}}>
                        <img src={AdminGoogleImage} alt='Google'/>
                        <span className='text'>
                            Google
                        </span>
                    </div>
                }
                {
                    renderType === "PUBLISH_PAGE" && 
                    <div className="btn-social btn-google mt-[clamp(8px,4vh,24px)] xl:mt-[clamp(8px,4vh,46px)]" onClick={() => {renderProps.onClick()}}>
                        <img src={GoogleIcon} alt="" />
                        Continue with google
                    </div>
                }
                </>
            }}
        />
        
    );
};

export default GoogleButton;
