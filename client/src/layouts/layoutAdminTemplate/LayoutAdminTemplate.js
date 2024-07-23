import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { Outlet, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { getIsPreviewModel } from "../../redux/modelSlice"
import HeaderTemplateAdmin from "../../components/headerTemplateAdmin/HeaderTemplateAdmin"
import { EDIT_TEMPLATE_MODE } from "../../utils/constants"

const LayoutAdminTemplate = () => {
  const {editTemplateMode} = useParams()

    return <Layout className="site-layout h-[100vh]" id='siteLayout'>
      {editTemplateMode === EDIT_TEMPLATE_MODE.CLONE_TEMPLATE && <HeaderTemplateAdmin />}
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
export default LayoutAdminTemplate