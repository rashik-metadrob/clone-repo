import './App.css';
import "./assets/scss/shared.scss"
import "./assets/scss/shared-retailer-template.scss"
import "./themes.scss"
import { Routes, Route, useLocation } from "react-router-dom";
import Login from './pages/auth/login/Login'
import routesConstant from './routes/routesConstant';
import Register from './pages/auth/register';
import Discounts from './pages/discounts/Discounts';
import AddProductPage from './pages/addProduct/AddProductPage';
import Analytics from './pages/analytics/Analytics';
import OnlineVirtualStore from './pages/onlineVirtualStore/OnlineVirtualStore';
import Project from './pages/project/Project';
import LayoutProject from './layouts/layoutProject/LayoutProject';
import AddTemplatePage from './pages/admin/addTemplate/AddTemplatePage';
import AdminRoute from './routes/AdminRoute';
import PrivateRoute from './routes/PrivateRoute';
import { Suspense, useEffect,useRef,useState } from 'react';
import { getStorageRefreshToken, getStorageToken, getStorageUserDetail, removeAllUserData, setStorageRefreshToken, setStorageToken } from './utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser , getFirstLogin, getTheme, setExchangeRate, setUserPermissons, getLanguage } from './redux/appSlice';
import { useNavigate } from 'react-router-dom';
import { getHomeFirst } from "./redux/homepageSlice";
import PaymentResult from './pages/paymentResult/PaymentResult';
import LayoutNormal from './layouts/layoutNormal/LayoutNormal';
import NotFound from './pages/notFound/NotFound';
import { getIsFirstAccess, setIsFirstAccess } from './redux/dashboardSlice';
import axios from 'axios';
import EditProductPage from './pages/editProduct/EditProductPage';
import Tutorial from './pages/tutorial/Tutorial';
import AddBannerPage from './pages/admin/addBanner/AddBannerPage';
import { browserHistory } from 'react-router';
import { Web3ReactProvider } from '@web3-react/core'
import { hooks as metaMaskHooks, metaMask } from './connectors/meta-mask'
import AdminTemplateRoute from './routes/AdminTemplateRoute';
import EditModelTemplate from './pages/admin/editModelTemplate/EditModelTemplate';
import AdminTemplatePage from './pages/admin/adminTemplatePage/AdminTemplatePage';
import ProjectRoute from './routes/ProjectRoute';
import {isMobile} from 'react-device-detect';
import AdminUpload from './pages/admin/adminUpload/AdminUpload';
import AdminUsers from './pages/admin/adminUsers/AdminUsers';
import RoomManager from './pages/roomManager/RoomManager';
import Plugins from './pages/plugins/Plugins';
import AdminPricingPlanManagement from './pages/admin/pricingPlan/PricingPlanManagement'
import { getDefaultHomePage } from './utils/util';
import AdminHome from './pages/admin/adminHome/AdminHome';
import AdminApiPage from './pages/admin/adminApiPages/AdminApiPages';
import AdminDecorativePage from './pages/admin/adminDecorativePage/AdminDecorativePage';
import AdminAnimationPage from './pages/admin/adminAnimationPage/AdminAnimationPage';
import AdminUploadTemplatePage from './pages/admin/adminUploadTemplatePage/AdminUploadTemplatePage';
import AdminUploadDecorativePage from './pages/admin/adminUploadDecorativePage/AdminUploadDecorativePage';
import AdminUploadAnimationPage from './pages/admin/adminUploadAnimationPage/AdminUploadAnimationPage';
import AdminCollaborationPage from './pages/admin/adminCollaborationPage/AdminCollaborationPage';
import AdminPricingPlanPage from './pages/admin/adminPricingPlanPage/AdminPricingPlanPage';
import AdminAddEditPlanPage from './pages/admin/adminAddEditPlanPage/AdminAddEditPlanPage';
import AdminStorePage from './pages/admin/adminStorePage/AdminStorePage';
import Shopify from './pages/shopify/Shopify';
import ShopifyCallback from './pages/shopify/ShopifyCallback';
import SpotifyCallback from './pages/spotify/SpotifyCallBack';
import AdminHdriPage from './pages/admin/adminHdriPage/AdminHdriPage';
import AdminUploadHdriPage from './pages/admin/adminUploadHdriPage/AdminUploadHdriPage';
import ShopifyManager from './pages/shopifyManager/ShopifyManager';
import _ from 'lodash';
import { userApi } from './api/user.api';
import RetailerOrdersPage from './pages/retailer/retailerOrdersPage/RetailerOrdersPage';
import RetailerProductsPage from './pages/retailer/retailerProductsPage/RetailerProductsPage';
import Profile from './pages/profile/Profile';
import RetailerHomePage from './pages/retailer/retailerHome/RetailerHomePage';
import RetailerSupportPage from './pages/retailer/retailerSupportPage/RetailerSupportPage';
import RetailerAnalyticsPage from './pages/retailer/retailerAnalyticPage/RetailerAnalyticPage';
import ForgotPassword from './pages/auth/forgotPassword/ForgotPassword';
import ResetPassword from './pages/auth/resetPassword/ResetPassword';
import LayoutRatailerFirstLogin from './layouts/layoutFirstLogin/LayoutFirstLogin';
import FirstLoginPage from './pages/firstLogin/FirstLogin';
import AdminLogin from './pages/auth/adminLogin/AdminLogin';
import shopifyRoutes from './modules/shopify/routes'
import global from './redux/global';
import { getRefreshToken } from './api/base.api';
import { useAuthenticatedFetch } from './modules/shopify/hooks';
import LayoutShopifyFirstLogin from './layouts/layoutShopifyFirstLogin/LayoutShopifyFirstLogin';
import ShopifyFirstLoginPage from './pages/shopify/shopifyFirstLogin/ShopifyFirstLogin';
import AdminTextPage from './pages/admin/adminTextPage/AdminTextPage';
import EditDecorative from './pages/admin/editDecorative/EditDecorative';
import AdminPrivateRoute from './routes/AdminPrivateRoute';
import LayoutAdminDecorative from './layouts/layoutAdminDecorative/LayoutAdminDecorative';
import DemoProject from './pages/demoProject/DemoProject';
import VerifyEmail from './pages/auth/verifyEmail/VerifyEmail';
import EditMediaPage from './pages/editMedia/EditMediaPage';
import RetailerFirstLoginPage from './pages/retailer/retailerFirstLoginPage/RetailerFirstLoginPage';
import DrobAHomePage from './pages/drobA/drobAHomePage/DrobAHomePage';
import AdminTutorialVideoPage from './pages/admin/adminTutorialVideoPage/AdminTutorialVideoPage';
import LayoutOutsideApp from './layouts/layoutOutsideApp/LayoutOutsideApp';
import AdminPlaceholderPage from './pages/admin/adminPlaceholderPage/AdminPlaceholderPage';
import AdminSettingsPage from './pages/admin/adminSettingsPage/AdminSettingsPage';
import configApi from './api/config.api';
import { CONFIG_TYPE } from './utils/constants';
import { setInitConfig, setIsLoadedOverrideMaterialDesktop, setIsLoadedOverrideMaterialMobile, setIsOverrideMaterialDesktop, setIsOverrideMaterialMobile } from './redux/configSlice';
import { getStoreInfo } from './redux/modelSlice';
import { fetchUserStorageInfo } from './redux/userStorageSlice';
import { clearNotificationState, fetchExceedMaximumCapacityNotifications, fetchPublishedStoresAreSentToDraftNotifications } from './redux/notificationSlice';
import AdminRoleAndPermissionPage from './pages/admin/adminRoleAndPermissionPage/AdminRoleAndPermissionPage';
import Invitation from './pages/invitation/Invitation';
import RetailerInvitePage from './pages/retailer/retailerInvitePage/RetailerInvitePage';
import ShopifyAdminRoute from './routes/ShopifyAdminRoute';
import ShopifyAdminPricingPlanPage from './pages/adminShopify/shopifyAdminPricingPlanPage/ShopifyAdminPricingPlanPage';
import ShopifyAdminLogin from './pages/auth/shopifyAdminLogin/ShopifyAdminLogin';
import AdminTicketsPage from './pages/admin/adminTicketsPage/AdminTicketsPage';
import i18n from './languages/i18n';
import { Modal } from 'antd';
import Chatbot from './components/chatbot/Chatbot';

const connectors = [
  [metaMask, metaMaskHooks]
]

function App() {
  const navigate = useNavigate()
  const isFirstAccess = useRef(true)
  const refreshTokenLocal = getStorageRefreshToken();

  const dispatch = useDispatch()
  const userDetail = getStorageUserDetail()
  const user = useSelector(getUser)
  const firsTime=useSelector(getFirstLogin);
  const isHomeFirst=useSelector(getHomeFirst)
  const location = useLocation()
  const theme = useSelector(getTheme)
  const storeInfo = useSelector(getStoreInfo)
  const [isSupportSafari, setIsSupportSafari] = useState(false)
  const language = useSelector(getLanguage)

  useEffect(() => {
    const chromeAgent = window.navigator.userAgent.indexOf("Chrome") > -1;
    const isSafari = window.navigator.userAgent.indexOf("Safari") > -1
    setIsSupportSafari(!(chromeAgent && isSafari))
  }, [])


  useEffect(() => {
    if(window.FB){
      window.FB.init({
        appId            : process.env.REACT_APP_CLIENT_ID_FACEBOOK,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v16.0'
      });
    }
    void metaMask.connectEagerly().catch(() => {
      console.log('Failed to connect eagerly to metamask')
    })

    //return () => unlisten();
  },[])
  

  useEffect(() => {
    i18n.changeLanguage(language || 'en');
  }, [language])

  const getExchangeRate = async () => {
    const res = await axios({
      baseURL: "https://api.currencyapi.com",
      url: "/v3/latest?apikey=cur_live_hwfIntT6zYtwW4b0LTOIc8ukMuWdz85TzSKz8Dqb&currencies=EUR%2CUSD%2CINR",
      method: 'GET',
    });

    if(res.data?.data){
      dispatch(setExchangeRate(res.data?.data))
    }
  }

  useEffect(() => {
    if(!user){
      dispatch(clearNotificationState())
    }
  }, [user, userDetail])

  useEffect(() => {
    if(user?.id){
      userApi.getUserById(user.id).then(data => {
        dispatch(setUser(data))
      })
      userApi.getUserPermissions(user.id).then(data => {
        dispatch(setUserPermissons(_.get(data, ['permissions'], {})))
      })
    }
      
    if(user?.id && getStorageToken() && !global.IS_SHOPIFY) {
      dispatch(fetchUserStorageInfo())
      dispatch(fetchExceedMaximumCapacityNotifications())
      dispatch(fetchPublishedStoresAreSentToDraftNotifications())
    }
  }, [user?.id])

  useEffect(() => {
    dispatch(setIsFirstAccess(false));
    if (isFirstAccess.current && location.pathname === "/") {
      isFirstAccess.current = false
      checkUserLogin().then((res) => {
        if (!res) {
          navigate("/login");
        } else {
          navigate(getDefaultHomePage());
        }
      });
    }

    configApi.getSettings().then(rs => {
      dispatch(setInitConfig(rs))
    })
  }, []);


  useEffect(() => {
    let pageTitle = 'Metadrob'
    const routeConstant = _.flatMap(routesConstant, el => {return [el]}).find(el => el.path === location.pathname)
    if(routeConstant){
      pageTitle = routeConstant.name
    } else if(storeInfo && storeInfo.name) {
      pageTitle = storeInfo.name
    }
    document.title = pageTitle
  }, [location, storeInfo])

  useEffect(() => {
    Modal.destroyAll()
  }, [location])

  const checkUserLogin = async () => {
    if(refreshTokenLocal){
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

  return (
    <Web3ReactProvider connectors={connectors}>
      <Suspense>
        <div className={"App " + (theme === 'light' ? 'light-theme' : 'dark-theme') + ` ${isMobile ? 'App-mobile': ''}`} issupportsafari={isSupportSafari.toString()}>
            <Chatbot />
            <Routes>
              {/* <Route path={routesConstant.retailerFirstLogin.path} element={<LayoutRatailerFirstLogin />} >
                <Route index element={<FirstLoginPage />} />
              </Route> */}
              <Route path={routesConstant.retailerFirstLogin.path} index element={<RetailerFirstLoginPage />} >
              </Route>
              <Route path={routesConstant.shopifyFirstLogin.path} element={<LayoutShopifyFirstLogin />} >
                <Route index element={<ShopifyFirstLoginPage />} />
              </Route>
              {!global.IS_SHOPIFY && <>
                <Route path="/dashboard"  element={<PrivateRoute />} >
                  <Route path={routesConstant.dashboardProfile.path} index element={<Profile />}/>
                  <Route path={routesConstant.dashboardHome.path} index element={global.IS_DROB_A ? <DrobAHomePage /> : <RetailerHomePage />} />
                  <Route path={routesConstant.dashboardSupport.path} index element={<RetailerSupportPage />} />
                  <Route path={routesConstant.dashboardOrders.path} index element={<RetailerOrdersPage />} />
                  <Route path={routesConstant.dashboardInvite.path} index element={<RetailerInvitePage />} />
                  <Route path={routesConstant.dashboardTutorial.path} index element={<Tutorial />} />
                  <Route path={routesConstant.dashboardProduct.path} index element={<RetailerProductsPage />} />
                  <Route path={routesConstant.dashboardCustomers.path} index element={<div />} />
                  <Route path={routesConstant.dashboardCreateProduct.path} index element={<AddProductPage />} />
                  <Route path={routesConstant.dashboardEditProduct.path} index element={<EditProductPage />} />
                  <Route path={routesConstant.dashboardEditMedia.path} index element={<EditMediaPage />} />
                  <Route path={routesConstant.dashboardDiscounts.path} index element={<Discounts />} />
                  <Route path={routesConstant.dashboardAnalytics.path} index element={<RetailerAnalyticsPage />} />
                  <Route path={routesConstant.dashboardMarketing.path} index element={<Analytics />} />
                  <Route path={routesConstant.dashboardPlugins.path} index element={<Plugins />} />
                  <Route path={routesConstant.dashboardRooms.path} index element={<RoomManager />} />
                  <Route path={routesConstant.dashboardStore.path} index element={<OnlineVirtualStore />} />
                  {/* <Route path={routesConstant.dashboardShopifyManager.path} index element={<ShopifyManager />} /> */}
                </Route>
                <Route path={routesConstant.customer.path}  element={<PrivateRoute />} >
                  <Route path={routesConstant.customerProfile.path} index element={<Profile />}/>
                </Route>
                <Route path={routesConstant.admin.path} element={<AdminRoute />} >
                  <Route path={routesConstant.admin.path} index element={<AdminHome />} />
                  <Route path={routesConstant.adminHome.path} index element={<AdminHome />} />
                  <Route path={routesConstant.adminCreateTemplate.path} element={<AddTemplatePage />} />
                  <Route path={routesConstant.adminCreateBanner.path} element={<AddBannerPage />} />
                  <Route path={routesConstant.adminUpload.path} element={<AdminUpload />} />
                  <Route path={routesConstant.adminUsers.path} element={<AdminUsers />} />
                  <Route path={routesConstant.adminPricingPlan.path} element={<AdminPricingPlanManagement />} />
                  <Route path={routesConstant.adminRoleAndPermission.path} element={<AdminRoleAndPermissionPage />} />
                  <Route path={routesConstant.adminApi.path} element={<AdminApiPage />} />
                  <Route path={routesConstant.adminStore.path} element={<AdminStorePage />} />
                  <Route path={routesConstant.adminUploadTemplate.path} element={<AdminTemplatePage />} />
                  <Route path={routesConstant.adminUploadCreateTemplate.path} element={<AdminUploadTemplatePage />} />
                  <Route path={routesConstant.adminUploadDecorative.path} element={<AdminDecorativePage />} />
                  <Route path={routesConstant.adminUploadCreateDecorative.path} element={<AdminUploadDecorativePage />} />
                  <Route path={routesConstant.adminUploadAnimation.path} element={<AdminAnimationPage />} />
                  <Route path={routesConstant.adminUploadCreateAnimation.path} element={<AdminUploadAnimationPage />} />
                  <Route path={routesConstant.adminUploadHdri.path} element={<AdminHdriPage />} />
                  <Route path={routesConstant.adminUploadCreateHdri.path} element={<AdminUploadHdriPage />} />
                  <Route path={routesConstant.adminUploadText.path} element={<AdminTextPage />} />
                  <Route path={routesConstant.adminUploadTutorialVideo.path} element={<AdminTutorialVideoPage />} />
                  <Route path={routesConstant.adminUploadPlaceholder.path} element={<AdminPlaceholderPage />} />
                  <Route path={routesConstant.adminPlan.path} element={<AdminPricingPlanPage />} />
                  <Route path={routesConstant.adminAddEditPlan.path} element={<AdminAddEditPlanPage />} />
                  <Route path={routesConstant.adminMarketing.path} element={<div className='text-[#FFF]'>Under development</div>} />
                  <Route path={routesConstant.adminCollaboration.path} element={<AdminCollaborationPage />} />
                  <Route path={routesConstant.adminTickets.path} element={<AdminTicketsPage />} />
                  <Route path={routesConstant.adminSetting.path} element={<AdminSettingsPage />} />
                </Route>

                <Route path={routesConstant.shopifyAdmin.path} element={<ShopifyAdminRoute />} >
                  <Route path={routesConstant.shopifyAdmin.path} index element={<AdminHome />} />
                  <Route path={routesConstant.shopifyAdminHome.path} index element={<AdminHome />} />
                  <Route path={routesConstant.shopifyAdminUsers.path} element={<AdminUsers />} />
                  <Route path={routesConstant.shopifyAdminStore.path} element={<AdminStorePage />} />
                  <Route path={routesConstant.shopifyAdminUploadTemplate.path} element={<AdminTemplatePage />} />
                  <Route path={routesConstant.shopifyAdminUploadCreateTemplate.path} element={<AdminUploadTemplatePage />} />
                  <Route path={routesConstant.shopifyAdminUploadDecorative.path} element={<AdminDecorativePage />} />
                  <Route path={routesConstant.shopifyAdminUploadCreateDecorative.path} element={<AdminUploadDecorativePage />} />
                  <Route path={routesConstant.shopifyAdminUploadAnimation.path} element={<AdminAnimationPage />} />
                  <Route path={routesConstant.shopifyAdminUploadCreateAnimation.path} element={<AdminUploadAnimationPage />} />
                  <Route path={routesConstant.shopifyAdminUploadHdri.path} element={<AdminHdriPage />} />
                  <Route path={routesConstant.shopifyAdminUploadCreateHdri.path} element={<AdminUploadHdriPage />} />
                  <Route path={routesConstant.shopifyAdminUploadText.path} element={<AdminTextPage />} />
                  <Route path={routesConstant.shopifyAdminUploadTutorialVideo.path} element={<AdminTutorialVideoPage />} />
                  <Route path={routesConstant.shopifyAdminUploadPlaceholder.path} element={<AdminPlaceholderPage />} />
                  <Route path={routesConstant.shopifyAdminPlan.path} element={<ShopifyAdminPricingPlanPage />} />
                  <Route path={routesConstant.shopifyAdminSetting.path} element={<AdminSettingsPage />} />
                </Route>
                <Route path={routesConstant.shopifyAdmin.path} element={<AdminTemplateRoute />} >
                    <Route path={routesConstant.shopifyAdminEditTemplate.path} index element={<EditModelTemplate />} />
                </Route>
                <Route path="/admin" element={<AdminTemplateRoute />} >
                    <Route path={routesConstant.adminEditTemplate.path} index element={<EditModelTemplate />} />
                </Route>
                <Route path={routesConstant.shopifyAdmin.path} element={<AdminPrivateRoute element={<LayoutAdminDecorative />} />} >
                    <Route path={routesConstant.shopifyAdminEditDecorative.path} index element={<EditDecorative />} />
                </Route>
                <Route path="/admin" element={<AdminPrivateRoute element={<LayoutAdminDecorative />} />} >
                    <Route path={routesConstant.adminEditDecorative.path} index element={<EditDecorative />} />
                </Route>
                <Route path={routesConstant.adminLogin.path} element={<AdminLogin />} >
                  <Route index element={<AdminLogin />} />
                </Route>
                <Route path={routesConstant.shopifyAdminLogin.path} element={<ShopifyAdminLogin />} >
                  <Route index element={<ShopifyAdminLogin />} />
                </Route>
                <Route path={routesConstant.forgotPassword.path} element={<ForgotPassword />} >
                  <Route index element={<ForgotPassword />} />
                </Route>
                <Route path={routesConstant.verifyEmail.path} element={<VerifyEmail />} >
                  <Route index element={<VerifyEmail />} />
                </Route>
                <Route path={routesConstant.resetPassword.path} element={<ResetPassword />} >
                  <Route index element={<ResetPassword />} />
                </Route>
                <Route path={routesConstant.register.path} element={<Register />} >
                  <Route index element={<Register />} />
                </Route>
              </>}
              
              <Route path="/project" element={<ProjectRoute />} >
                <Route path="/project/payment-result/:paymentType" index element={<PaymentResult />} />
                <Route path="/project/:editorRole/:id" index element={<Project />} />
              </Route>
              <Route path="/demo" element={<ProjectRoute />} >
                <Route path="/demo/:editorRole/:id" index element={<DemoProject />} />
              </Route>
              <Route path="/publish" element={<LayoutProject />} >
                <Route path="/publish/:role/:id" index element={<Project />} />
              </Route>
              {/* <Route path="/shopify" index element={<Shopify />} /> */}
              <Route path="/shopify/auth/callback" index element={<ShopifyCallback />} />
              <Route path="/spotify/callback" element={<PrivateRoute />} >
                <Route index element={<SpotifyCallback />} />
              </Route>
              
              {
                !global.IS_SHOPIFY && <>
                  <Route path={routesConstant.login.path} element={<Login />} >
                    <Route index element={<Login />} />
                  </Route>
                  <Route path="/" index element={<Login />} >
                  </Route>
                </>
              }
              {global.IS_SHOPIFY && shopifyRoutes.map(route => <Route key={route.name} path={route.path} element={route.component}/>)}
              <Route path={routesConstant.invitation.path} element={<LayoutOutsideApp />} >
                <Route path={routesConstant.invitation.path} index element={<Invitation />} />
              </Route>
              <Route path="*" element={<LayoutOutsideApp />} >
                <Route path="*" index element={<NotFound />} />
              </Route>
            </Routes>
        </div>
      </Suspense>
    </Web3ReactProvider>
  );
}

export default App;
