import { Suspense, useEffect, useState } from "react";
import { HDRI } from "../../../../../utils/constants";
import { PMREMGenerator } from "three";
import { useThree } from "@react-three/fiber";
import hdriApi from "../../../../../api/hdri.api";
import { Environment } from "@react-three/drei";
import { useSelector } from "react-redux";
import { getAssetsUrl } from "../../../../../utils/util";
import { getDecorativeSelectedHdriOfAdminTemplate } from "../../../../../redux/decorativeEditorSlice";
import RoomAdminCanvasLoading from "../../../../../components/canvasContainerAdmin/components/roomAdminCanvasLoading/RoomAdminCanvasLoading";

const DecorativeRoomEnvironment  = ({
    object
}) => {
    const {scene, gl} = useThree()
    const [filePath, setFilePath] = useState()
    const decorativeSelectedHdriOfAdminTemplate = useSelector(getDecorativeSelectedHdriOfAdminTemplate)

    useEffect(() => {
        if(decorativeSelectedHdriOfAdminTemplate === HDRI.FROM_SCENE){
            setFilePath("")
            let evnMap = new PMREMGenerator(gl).fromScene(scene).texture;
            scene.environment = evnMap;
            scene.background = evnMap;
        } else if(decorativeSelectedHdriOfAdminTemplate){
            hdriApi.getHdriById(decorativeSelectedHdriOfAdminTemplate).then(data => {
                if(data && data.filePath){
                    setFilePath(data.filePath)
                }
            })
        } else {
            setFilePath("")
        }
      }, [scene, gl, object, decorativeSelectedHdriOfAdminTemplate])

    return <>
        <Suspense fallback={<RoomAdminCanvasLoading />}>
            {(filePath ||!decorativeSelectedHdriOfAdminTemplate) && <Environment
                background
                files={filePath ? getAssetsUrl(filePath) : getAssetsUrl(HDRI.DEFAULT)}
            >
            </Environment>}
        </Suspense>
    </>
}
export default DecorativeRoomEnvironment