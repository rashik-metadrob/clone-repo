import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react"
import { AnimationMixer, Vector3 } from "three";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import ElementName from "./ElementName";
import { useSelector } from "react-redux";
import { ACTION_TIME, PLAYER_ACTION_NAME, PLAYER_GENDER, PUBLISH_ROLE } from "../../../../../utils/constants";
import _ from "lodash";
import { getAssetsUrl, loadModel } from "../../../../../utils/util";
import { getOtherPlayers } from "../../../../../redux/photonSlice";

const PhotonElement = ({
    position,
    rotation,
    action,
    name,
    socketId,
    currentPosition,
    playerId,
    playerAvatar
}) => {
    const { gl } = useThree()
    const modelElementRef = useRef()
    const [object, setObject] = useState()
    const mixer = useRef(null);
    const baseActions = useRef({
        [PLAYER_ACTION_NAME.IDLE]: { weight: 1 },
        [PLAYER_ACTION_NAME.WALK]: { weight: 0 },
        [PLAYER_ACTION_NAME.RUN]: { weight: 0 },
        [PLAYER_ACTION_NAME.WAVING]: { weight: 0 },
        [PLAYER_ACTION_NAME.DISMISSING]: { weight: 0 },
        [PLAYER_ACTION_NAME.AGREEING]: { weight: 0 },
      });
    const playerAvatarUrl = useMemo(() => {
        return playerAvatar?.filePath ? getAssetsUrl(playerAvatar.filePath) : ""
    }, [playerAvatar?.filePath])
    const otherPlayers = useSelector(getOtherPlayers)

    const totalPos = () => {
        return position && position.length === 3 ? position[0] + position[1] + position[2] : 0;
    }

    const totalCurrentPos = () => {
        return currentPosition && currentPosition.length === 3 ? currentPosition[0] + currentPosition[1] + currentPosition[2] : 0;
    }

    const isMute = () => {
        return !!otherPlayers.find(el => el.clientId === playerId && (el.mute || el.beMuted) )
    }

    //Spatial audio
    useEffect(() => {
        if(currentPosition && position && !isMute()){
            setVolumnOfVoice(1)

            // Disable Spatial audio
            // const distance = new Vector3(currentPosition[0], currentPosition[1], currentPosition[2]).distanceTo(new Vector3(position[0], position[1], position[2]))
            // if(distance < 2){
            //     setVolumnOfVoice(1)
            // } else if(distance < 6){
            //     setVolumnOfVoice((4 - (distance - 2)) / 4)
            // } else {
            //     setVolumnOfVoice(0)
            // }
        } else {
            setVolumnOfVoice(0)
        }
    }, [totalPos(), totalCurrentPos(), isMute()])

    const setVolumnOfVoice = (vol) => {
        if(socketId){
            let audioEl = document.getElementById(socketId + "_audio");
            if (audioEl != null) {
                audioEl.volume = vol
            }
        }
    }

    useEffect(() => {
        if(playerAvatarUrl){
            loadModel(playerAvatarUrl, () => {}, gl).then(model => {
                let newObject = SkeletonUtils.clone(model.scene);
                newObject.scale.set(0.87, 0.87, 0.87)
                mixer.current = new AnimationMixer(newObject);

                setObject(newObject)
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
    }, [playerAvatarUrl])

    useEffect(() => {
        return () => {
            if(object && object.dispose){
                object.dispose()
            }
        }
    },[])

    const handlePlayerAnimation = (actionName) => {

        if (!baseActions.current[actionName]) {
            return
        }
        if (baseActions.current[actionName].weight > 0) {
            return
        }

        Object.keys(baseActions.current).forEach(el => {
            baseActions.current[el].weight = 0
        })
        baseActions.current[actionName].weight = 5

        Object.keys(baseActions.current).forEach(el => {
            if (baseActions.current[el].action) {
                activateAction(baseActions.current[el].action);
            }
        })
    }

    useEffect(() => {
        handlePlayerAnimation(action)
    }, [action])

    useFrame((state, delta) => {
        if (mixer.current) {
          mixer.current.update(delta);
        }
    })

    function activateAction(action) {
        if (action) {
          const clip = action.getClip();
          const settings = baseActions.current[clip.name];
          setWeight(action, settings.weight);
          action.play();
        }
    }
    
    function setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    return <>
        <group ref={modelElementRef} position={position} rotation={rotation}>
            {object && <primitive object={object}/>}
            <ElementName name={name}/>
        </group>
    </>
}

function areEqual(prevProps, nextProps) {
    if(_.get(prevProps, ['model', 'length'], 0) !== _.get(nextProps, ['model', 'length'], 0)){
        return false
    }

    if(_.get(prevProps, ['playerAvatar', 'filePath'], "") !== _.get(nextProps, ['playerAvatar', 'filePath'], "")){
        return false
    }

    if(_.some([0, 1, 2], i => {
        return _.get(prevProps, ['currentPosition', i], 0) !== _.get(nextProps, ['currentPosition', i], 0)
        || _.get(prevProps, ['rotation', i], 0) !== _.get(nextProps, ['rotation', i], 0)
        || _.get(prevProps, ['position', i], 0) !== _.get(nextProps, ['position', i], 0)
    })){
        return false
    }

    return !_.some(['action', 'name', 'socketId', 'playerId'], function (ident) {
        return !_.isEqual(prevProps[ident], nextProps[ident])
    })
}


export default React.memo(PhotonElement, areEqual)