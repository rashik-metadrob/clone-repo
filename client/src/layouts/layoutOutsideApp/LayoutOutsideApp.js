import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { Outlet } from "react-router-dom"
import HeaderNotFound from "../../components/headerNotFound/HeaderNotFound"

const LayoutOutsideApp = () => {
    return <Layout className="site-layout h-[100vh]" id='siteLayout'>
      <HeaderNotFound />
      <Content
        className="site-layout-content"
        style={{
          margin: 0,
          padding: 0,
          minHeight: 0,
          overflowY: "auto"
        }}
      >
        <Outlet />
      </Content>
  </Layout>
}
export default LayoutOutsideApp