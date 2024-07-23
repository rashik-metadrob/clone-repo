import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { Outlet, useLocation } from "react-router-dom"
import HeaderProject from "../../components/headerProject/HeaderProject"
import { useSelector } from "react-redux"
import { getIsPreviewModel } from "../../redux/modelSlice"
import { useEffect, useState } from "react"
import { getStorageUserDetail, getStorageToken } from "../../utils/storage";

const LayoutProject = () => {
    const isPreviewMode = useSelector(getIsPreviewModel)
    const [isHasHeader, setIsHasHeader] = useState(false)
    let location = useLocation();

    useEffect(() => {
      if(location.pathname.includes('project/checkout') || location.pathname.includes('project/cart') || location.pathname.includes('project/payment-result')){
        setIsHasHeader(true)
      } else {
        setIsHasHeader(false)
      }
  }, [location])
  
    return <Layout className="site-layout project-layout" id='siteLayout'>
      {(isHasHeader) && <HeaderProject />}
      <Content
      className="site-layout-content"
      id="projectSideContentLayout"
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
export default LayoutProject