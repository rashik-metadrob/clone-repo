import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { Outlet } from "react-router-dom"
import HeaderNormal from "../../components/headerNormal/HeaderNormal"

const LayoutNormal = () => {
    return <Layout className="site-layout h-[100vh]" id='siteLayout'>
      <HeaderNormal />
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
export default LayoutNormal