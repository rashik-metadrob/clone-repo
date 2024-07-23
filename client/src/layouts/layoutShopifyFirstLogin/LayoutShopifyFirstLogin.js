import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { Navigate, Outlet } from "react-router-dom"
import { USER_ROLE } from "../../utils/constants"
import { useSelector } from "react-redux"
import { getUser } from "../../redux/appSlice"
import routesConstant from "../../routes/routesConstant"
import ShopifyFirstLoginFooter from "../../components/shopifyComponents/shopifyFirstLoginFooter/ShopifyFirstLoginFooter"

const LayoutShopifyFirstLogin = () => {
  const user = useSelector(getUser)
  return <>
    {
      user && user?.role === USER_ROLE.RETAILERS ? 
      <Layout className="h-[100vh]" id='siteLayout'>
        <Content
          className="site-layout-content bg-[#0D0C0C]"
          style={{
            margin: 0,
            padding: 0,
            minHeight: 0,
            overflowY: "auto"
          }}
        >
          <Outlet />
        </Content>
        <ShopifyFirstLoginFooter />
      </Layout> :
      <Navigate to={routesConstant.shopify.path} />
    }  
  </>
}
export default LayoutShopifyFirstLogin