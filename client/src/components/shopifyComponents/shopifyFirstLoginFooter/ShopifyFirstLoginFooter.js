import { Input, Layout, Modal, notification } from 'antd';
import "./styles.scss"
import { useSelector } from 'react-redux';
import { getUser } from '../../../redux/appSlice';
import LOGO from "../../../assets/images/LOGO.svg";
import { Link, useNavigate } from 'react-router-dom';
import { getAssetsUrl, getDefaultHomePage } from '../../../utils/util';
import routesConstant from '../../../routes/routesConstant';
import EditProfileIcon from '../../../assets/icons/EditProfileIcon';
import { useEffect, useState } from 'react';
import { userApi } from '../../../api/user.api';
import _ from 'lodash';
import global from '../../../redux/global';
import { useAuthenticatedFetch } from '../../../modules/shopify/hooks';
import { useAppBridgeRedirect } from '../../../modules/shopify/hooks/useAuthenticatedFetch';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const { Footer } = Layout;

const ShopifyFirstLoginFooter = () => {
    const navigate = useNavigate()
    const user = useSelector(getUser)
    const [planName, setPlanName] = useState("")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetch = global.IS_SHOPIFY ? useAuthenticatedFetch() : null
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appBrigdeRedirect = global.IS_SHOPIFY ? useAppBridgeRedirect() : null

    useEffect(() => {
        userApi.getActivePricingPlan().then(async rs => {
            if(_.get(rs, ['plan', 'isFree'], false)) {
                // Redirect user to billing page
                if(global.IS_SHOPIFY) {
                    const response = await fetch("/shopify/request-new-subcription", {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })

                    const data = await response.json()
                    const confirmationUrl = _.get(data, ['confirmationUrl'])
                    if(confirmationUrl){
                        appBrigdeRedirect(confirmationUrl)
                    } else {
                        setPlanName(_.get(data, ['plan', 'name'], 'Free user') || 'Free user')
                    }
                }
            } else {
                setPlanName(_.get(rs, ['plan', 'name'], 'Free user') || 'Free user')
            }
    })
    }, [])

    return <>
        <Footer className='shopify-first-login-footer'>
            <div className='shopify-first-login-footer-container'>
                <div className='flex gap-[12px] items-center'>
                    <img 
                        src={user?.avatar ? getAssetsUrl(user.avatar) : user.socialAvatar ? user.socialAvatar : getAssetsUrl(DEFAULT_AVATAR)} 
                        alt="" 
                        className={'rounded-[50%] w-[48px] h-[48px]'}
                    />
                    <div className='flex gap-[6px] items-center'>
                        <div className='font-inter text-[#FFF] text-[18px] font-[400]'>
                            {user?.name}
                        </div>
                        <div className='cursor-pointer' onClick={() => {}}>
                            <EditProfileIcon />
                        </div>
                    </div>
                    <div className='plane-name cursor-pointer'>
                        {planName}
                    </div>
                </div>
                <div className='group-links'>
                    <Link className='link-item' to="https://www.metadrob.com/aboutus" target='_blank'>
                        About
                    </Link>
                    <Link className='link-item' to="https://www.metadrob.com/FAQ" target='_blank'>
                        Support
                    </Link>
                    <Link className='link-item' to="https://www.metadrob.com/ContactUs" target='_blank'>
                        Contact Us
                    </Link>
                    <div className='link-item' onClick={() => {}}>
                        <img src={LOGO} alt="" className='h-[44px]' />
                    </div>
                </div>
            </div>
        </Footer>
    </>
}
export default ShopifyFirstLoginFooter