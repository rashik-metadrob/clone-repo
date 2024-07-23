import { useSelector } from "react-redux"
import { getPlayerAvatar } from "../../../../../redux/modelSlice"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { getAssetsUrl, loadModel } from "../../../../../utils/util"
import { useFrame, useThree } from "@react-three/fiber"
import { AnimationMixer } from "three"
import { getIsOverrideMaterialDesktop, getIsOverrideMaterialMobile } from "../../../../../redux/configSlice"
import { isMobile } from "react-device-detect"

const PlayerAvatar = ({
    baseActions,
    activateAction = () => {},
    visible
}) => {
    const { gl } = useThree()
    const [currentPlayerModel, setCurrentPlayerModel] = useState()
    const currentPlayerAvatar = useSelector(getPlayerAvatar)
    const mixer = useRef(null);
    const location = useLocation();
    const isPublishMode = location.pathname.includes('publish')
    const isOverrideMaterialDesktop = useSelector(getIsOverrideMaterialDesktop)
    const isOverrideMaterialMobile = useSelector(getIsOverrideMaterialMobile)

    const shouldOverrideMaterial = useMemo(() => {
        return (!isMobile && isOverrideMaterialDesktop) || (isMobile && isOverrideMaterialMobile)
    }, [isOverrideMaterialDesktop, isOverrideMaterialMobile])
    const playerAvatarUrl = useMemo(() => {
        if(!isPublishMode){
            return `${process.env.REACT_APP_HOMEPAGE}/model/avatars/Remy_emissive.glb`
        } else {
            return currentPlayerAvatar?.filePath ? getAssetsUrl(currentPlayerAvatar.filePath) : ""
        }
    }, [isPublishMode, currentPlayerAvatar?.filePath])

    useFrame((state, delta) => {
        if (mixer.current && visible) {
            mixer.current.update(delta);
        }
    })

    useEffect(() => {
        if(playerAvatarUrl){
            loadModel(playerAvatarUrl, () => {}, gl, shouldOverrideMaterial).then(model => {
                model.scene.scale.set(0.87, 0.87, 0.87)

                mixer.current = new AnimationMixer(model.scene);
                setCurrentPlayerModel(model)
                let a = model.animations.length;
                for (let i = 0; i < a; i++) {
                    let clip = model.animations[i];
                    const name = clip.name;
                    if (baseActions.current[name]) {
                        const action = mixer.current.clipAction(clip);
                        activateAction(action);
                        baseActions.current[name].action = action;
                    }
                }
            })
        }
    }, [playerAvatarUrl, shouldOverrideMaterial])

    return <>
        {currentPlayerModel && <primitive object={currentPlayerModel.scene}/>}
    </>
}
export default PlayerAvatar