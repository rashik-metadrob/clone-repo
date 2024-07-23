import { Layout } from "antd";
import "./styles.scss"

import { useEffect, useRef } from "react";
import SelectWallCarousel from "../../components/selectWallCarousel/SelectWallCarousel";
import { useDispatch, useSelector } from "react-redux";
import { getIsPreviewModel } from "../../redux/modelSlice";
import { setIsHiddenPreview } from "../../redux/appSlice";
import CanvasContainerDemo from "../../components/canvasContainerDemo/CanvasContainerDemo";

const { Content } = Layout;
const DemoProject = () => {
    const container = useRef()
    const dispatch = useDispatch();
    const isPreviewMode = useSelector(getIsPreviewModel)

    const canvasContainerRef = useRef();
    window.container = container.current

    useEffect(() => {
        dispatch(setIsHiddenPreview(false))
    },[])

    const onSelectWall = (el) => {
        canvasContainerRef.current.selectWall(el)
    }

    return <>
        <Layout className="project-layout relative h-full" id='projectLayout' ref={container}>
            <Content className="flex">
                {!isPreviewMode && <SelectWallCarousel onSelectWall={onSelectWall}/>}
                <CanvasContainerDemo ref={canvasContainerRef} container={container}/>
            </Content>
        </Layout>
    </>
}
export default DemoProject;