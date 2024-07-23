import { Suspense, useEffect, useRef, useState } from "react";
import { HDRI } from "../../../../utils/constants";
import { PMREMGenerator } from "three";
import { useThree } from "@react-three/fiber";
import hdriApi from "../../../../api/hdri.api";
import { getAssetsUrl, loadHdriEnvironment } from "../../../../utils/util";

const RoomEnvironment = ({
    project,
    object,
    onLoading = () => {}
}) => {
    const {scene, gl} = useThree()
    const [filePath, setFilePath] = useState()
    const [envMap, setEnvMap] = useState(null)
    const shouldLoadHdr = useRef(false)

    useEffect(() => {
        if(!project){
            return
        }
        if(!project.isAttachHdriToBackground){
            scene.background = null;
        }
        if(project?.hdr === HDRI.FROM_SCENE){
            setFilePath("")
            let evnMapData = new PMREMGenerator(gl).fromScene(scene);
            setEnvMap(evnMapData)
            onLoading(100)
        } else if(project.hdr){
            hdriApi.getHdriById(project.hdr).then(data => {
                if(data && data.filePath){
                    shouldLoadHdr.current = true
                    setFilePath(data.filePath)
                }
            })
        } else {
            shouldLoadHdr.current = true
            setFilePath("")
        }
    }, [scene, gl, object, project])

    useEffect(() => {
        if(shouldLoadHdr.current){
            loadHdriEnvironment(filePath ? getAssetsUrl(filePath) : getAssetsUrl(HDRI.DEFAULT), gl, (percent) => {
                onLoading(percent)
            }).then(envMapData => {
                setEnvMap(envMapData)
            })
        }
    }, [filePath])

    useEffect(() => {
        if(envMap && envMap.texture && project){
            if(project.isAttachHdriToBackground){
                scene.background = envMap.texture;
                } else {
                    scene.background = null;
                }

                scene.environment = envMap.texture
        }
    }, [envMap, project, scene])

    return <>
        {/* {(filePath || !project?.hdr) && 
           <Suspense fallback={<CanvasLoading />}>
                <Environment
                    background={!!project.isAttachHdriToBackground}
                    files={filePath ? getAssetsUrl(filePath) : getAssetsUrl(HDRI.DEFAULT)}
                >
                </Environment>
            </Suspense>
        } */}
    </>
}
export default RoomEnvironment