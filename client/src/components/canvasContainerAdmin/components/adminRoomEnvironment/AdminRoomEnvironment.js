import { Suspense, useEffect, useState } from "react";
import { HDRI } from "../../../../utils/constants";
import { PMREMGenerator } from "three";
import { useThree } from "@react-three/fiber";
import hdriApi from "../../../../api/hdri.api";
import { Environment } from "@react-three/drei";
import { useSelector } from "react-redux";
import { getIsAttachSelectedHdriToBackground, getSelectedHdriOfAdminTemplate } from "../../../../redux/modelSlice";
import { getAssetsUrl } from "../../../../utils/util";
import RoomAdminCanvasLoading from "../roomAdminCanvasLoading/RoomAdminCanvasLoading";

const AdminRoomEnvironment = ({
    object
}) => {
    const {scene, gl} = useThree()
    const [filePath, setFilePath] = useState()
    const selectedHdriOfAdminTemplate = useSelector(getSelectedHdriOfAdminTemplate)
    const isAttachSelectedHdriToBackground = useSelector(getIsAttachSelectedHdriToBackground)

    useEffect(() => {
        if(!isAttachSelectedHdriToBackground){
            scene.background = null;
        }
        if(selectedHdriOfAdminTemplate === HDRI.FROM_SCENE){
            setFilePath("")
            let evnMap = new PMREMGenerator(gl).fromScene(scene).texture;
            scene.environment = evnMap;
            if(isAttachSelectedHdriToBackground){
                scene.background = evnMap;
            } else {
                scene.background = null;
            }
        } else if(selectedHdriOfAdminTemplate){
            hdriApi.getHdriById(selectedHdriOfAdminTemplate).then(data => {
                if(data && data.filePath){
                    setFilePath(data.filePath)
                }
            })
        } else {
            setFilePath("")
        }
      }, [scene, gl, object, selectedHdriOfAdminTemplate, isAttachSelectedHdriToBackground])

    return <>
        <Suspense fallback={<RoomAdminCanvasLoading />}>
            {(filePath ||!selectedHdriOfAdminTemplate) && <Environment
            background={isAttachSelectedHdriToBackground}
            files={filePath ? getAssetsUrl(filePath) : getAssetsUrl(HDRI.DEFAULT)}
            >
            </Environment>}
        </Suspense>
    </>
}
export default AdminRoomEnvironment