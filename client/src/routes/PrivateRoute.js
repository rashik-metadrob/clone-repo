import { Navigate, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import { getStorageRefreshToken, getStorageToken, getStorageUserDetail, removeAllUserData, setStorageRefreshToken, setStorageToken } from "../utils/storage";
import LayoutAdmin from "../layouts/layoutAdmin/LayoutAdmin";
import LayoutDashboard from "../layouts/layout/Layout";
import { useDispatch, useSelector } from 'react-redux';
import { getUser , getFirstLogin, setUser } from '../redux/appSlice';
import { getHomeFirst,setHomeFirst } from "../redux/homepageSlice";

import Onboarding from '../components/Onboarding/Onboarding'
import axios from "axios";
import { getIsFirstAccess, setIsFirstAccess } from "../redux/dashboardSlice";
import { USER_ROLE } from "../utils/constants";
import LayoutCustomer from "../layouts/layoutCustomer/LayoutCustomer";
import { getRefreshToken } from "../api/base.api";
import global from "../redux/global";
import LayoutRetailerDrobA from "../layouts/layoutRetailerDrobA/LayoutRetailerDrobA";

const PrivateRoute = ({}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isFirstAccess = useSelector(getIsFirstAccess)
    const refreshTokenLocal = getStorageRefreshToken();

    const token = getStorageToken();
    const [isAuth, setIsAuth] = useState(!!token || false);
    const currentUser = getStorageUserDetail();
    const firsTime=useSelector(getFirstLogin);
    const isHomeFirst=useSelector(getHomeFirst)
    const firstAccess = useRef(true)

    useEffect(() => {
      dispatch(setIsFirstAccess(false))
      if(firstAccess.current){
        firstAccess.current = false
        checkUserLogin().then(res => {
          if(!res){
            navigate("/login")
          }
        })
      }
    }, []);

    const checkUserLogin = async () => {
      if(getStorageRefreshToken()){
        try {
          const res = await getRefreshToken();
          setStorageToken(res.data.access.token)
          setStorageRefreshToken(res.data.refresh.token)

          return Promise.resolve(true);
        } catch (e) {
          removeAllUserData();
          dispatch(setUser(null))
          return Promise.resolve(false);
        }
      } else {
        removeAllUserData();
        dispatch(setUser(null))
        return Promise.resolve(false);
      }
    }

    useEffect(() => {
      const trackingScriptTag = document.createElement("script")
      trackingScriptTag.id = "trackingScriptTag"
      trackingScriptTag.innerHTML = `
      (function(c,l,a,r,i,t,y){ c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src=" https://www.clarity.ms/tag/"+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "iwxej5ixib");
      `
      document.body.append(trackingScriptTag)

      return () => {
        const tag = document.getElementById('trackingScriptTag')
        if(tag) {
          tag.remove()
        }
      }
    }, [])

    return <>
    {isAuth && currentUser ? currentUser?.role === USER_ROLE.CUSTOMER ? <LayoutCustomer /> : (global.IS_DROB_A ? <LayoutRetailerDrobA /> : <LayoutDashboard />) : <Navigate to="/login" />}
    {!!!currentUser?.isOnboarding && <Onboarding />}
  </>
}

export default PrivateRoute
