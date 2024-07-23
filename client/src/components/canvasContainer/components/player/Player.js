import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Capsule } from "three/addons/math/Capsule.js";
import { useDispatch, useSelector } from "react-redux";
import { getInteractiveMode, getIsPreviewModel, getListSpawnPoints, getPlayerAvatar, getPlayerGender, getPlayerName, getPublishCameraMode, getSelectedObject, setPublishCameraMode, setSelectedObject } from "../../../../redux/modelSlice";
import gsap from "gsap"
import PoitingDownArrow from "../pointingDownArrow/PoitingDownArrow";
import { socket } from "../../../../socket/socket";
import { getStorageUserDetail } from "../../../../utils/storage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ACTION_KEYS, ACTION_TIME, APP_EVENTS, CONFIG_TEXT, DESKTOP_CAMERA_SPEED, IDLE_CONFIG, INTERACTIVE_MODE, MOBILE_CAMERA_SPEED, PLAYER_ACTION_NAME, PUBLISH_CAMERA_MODE, PUBLISH_ROLE, RUNNING_SPEED, WALKING_SPEED, XRMovementSpeed } from "../../../../utils/constants";
import {isMobile} from 'react-device-detect';
import { useController, useXR, useXREvent } from "@react-three/xr";
import { Vector3 } from "three";
import moment from "moment";
import { notification } from "antd";
import { getIsDisabledPreviewControl, getIsShowDrawerBag, getIsShowDrawerCheckout } from "../../../../redux/uiSlice";
import { checkIsIntersectFaceFlat, findDistanceByRandSquaredLine, isPublishModeLocation } from "../../../../utils/util";
import _ from "lodash";
import { userApi } from "../../../../api/user.api";
import { useKeepRunningAction } from "../../../../hook/keepRunningAction";
import { useTriggerAction } from "../../../../hook/useTriggerAction";
import MultiplePlayerPhoton from "../multiplePlayer/MultiplePlayerPhoton";
import PlayerAvatar from "./components/PlayerAvatar";
import { setOtherPlayer } from "../../../../redux/photonSlice";
import CameraHelper from "../cameraControls/CameraHelper";
import useCollision from "../../../../hook/useCollision";
import CameraControlsDefault from "camera-controls"
import global from "../../../../redux/global";
import usePublishStoreRole from "../../../../hook/usePublishStoreRole";

const GRAVITY = 19;

const CAMERA_DISTANCE = 1.5;
const CAMERA_FORWARD_DISTANCE = 0.5;

const MIN_CAMERA_Y = -1;
const MAX_CAMERA_Y = CAMERA_DISTANCE;

const PEOPLE_HEIGHT = 1.5;

let frameNo = 0;

const CAPSULE_RADUIS = 0.35

export const Player = forwardRef(({
  onExitPointerControl = () => {},
  onShowSpinner = () => {},
  onPlayWalkingSound = () => {},
  onStopWalkingSound = () => {},
  onSetUserIP = () => {},
  onSelectObject = () => {},
  project,
  onSetCanBeJoinMultiplePlayer = (value) => {},
  ...props
}, ref) => {
  const navigate = useNavigate()
  const speedDelta = useRef(0)
  const newPlayerAction = useRef(PLAYER_ACTION_NAME.IDLE)
  const damping = useRef(0)
  const location = useLocation()
  const cameraRef = useRef()
  const cameraPos = useRef(new Vector3())
  const cameraTarget = useRef(new Vector3())
  const { publishRole } = usePublishStoreRole()
  const isPreviewMode = useSelector(getIsPreviewModel);
  const publishCameraMode = useSelector(getPublishCameraMode)
  const { isRunning } = useKeepRunningAction()
  const isRunningRef = useRef(false)
  const dispatch = useDispatch()
  const { actionKey, onResetAction } = useTriggerAction()
  const isActiveAction = useRef(false)
  const [isShowPointing, setIsShowPoiting] = useState(false)
  const [pointingTarget, setPointingTarget] = useState([0, 0, 0])
  const playerName = useSelector(getPlayerName)
  const playerGender = useSelector(getPlayerGender)
  const playerAvatar = useSelector(getPlayerAvatar)
  const { gl, camera, scene, raycaster } = useThree();
  const timeCounter = useRef();
  const currentDeltaTime = useRef();
  const keyStates = useRef({});
  const playerVelocity = useRef(new THREE.Vector3());
  const playerDirection = useRef(new THREE.Vector3());
  const deltaPosition = useRef(new THREE.Vector3());
  const cameraDirection = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  // The start of capsule is not the end vertice of capsule
  // End vertice = start.y - radius
  const playerCollider = useRef(
    new Capsule(new THREE.Vector3(0, CAPSULE_RADUIS, 0), new THREE.Vector3(0, PEOPLE_HEIGHT + CAPSULE_RADUIS, 0), CAPSULE_RADUIS)
  );
  let playerOnFloor = useRef(true);
  const multiplayerSocketRef = useRef(null);
  const currentUser = getStorageUserDetail();
  const tempCameraVector = useRef(new THREE.Vector3());
  const cameraOffsetYRef = useRef(0)
  const baseActions = useRef({
    [PLAYER_ACTION_NAME.IDLE]: { weight: 1 },
    [PLAYER_ACTION_NAME.WALK]: { weight: 0 },
    [PLAYER_ACTION_NAME.RUN]: { weight: 0 },
    [PLAYER_ACTION_NAME.WAVING]: { weight: 0 },
    [PLAYER_ACTION_NAME.DISMISSING]: { weight: 0 },
    [PLAYER_ACTION_NAME.AGREEING]: { weight: 0 },
  });

  const targetPointRef = useRef(new THREE.Vector3(0, 0, 0))
  const initCameraAxis = useRef(new THREE.Vector3(0, 0, -1))
  const currentAnimation = useRef()
  const currentRotationAnimation = useRef()
  const isHandlingMoveAction = useRef(false)
  const modelRef = useRef();
  const [currentPosition, setCurrentPosition] = useState([0, 0, 0])
  const lastPosition = useRef({
    position: [playerCollider.current.start.x, 0, playerCollider.current.start.z],
    rotation: [0 , Math.PI, 0],
    action: "idle"
  })
  const counterFirstUpdate = useRef(10)
  const previousTouch = useRef()
  const cameraWorldPosition = useRef(new THREE.Vector3())
  const selectedObject = useSelector(getSelectedObject)
  const [firstLoadMultiplayer, setFirstLoadMultiplayer] = useState(false)

  const { 
    isPresenting,
    session,
    player, 
  } = useXR()
  const tempMatrix = useRef(new THREE.Matrix4())

  const [isPortraitMode, setIsPortraitMode] = useState(window.innerHeight > window.innerWidth)

  const visiblePlayerAvatar = useMemo(() => {
    return publishCameraMode === PUBLISH_CAMERA_MODE.STANDARD && ((!isMobile && !isPresenting) ||
    (isMobile && !isPortraitMode))
  }, [publishCameraMode, isPresenting, isPortraitMode])

  // const UNIQUE_BROWSER_UUID = useSelector(getUserIP)
  const idleTimestampCounter = useRef()
  const [isMoving, setIsMoving] = useState(false)
  const shouldKickUser = useRef(true)
  const shouldShowMessage = useRef(true)

  const isShowDrawerBag = useSelector(getIsShowDrawerBag)
  const isShowDrawerCheckout = useSelector(getIsShowDrawerCheckout)
  const spawnPoints = useSelector(getListSpawnPoints)

  const shouldHandleKickUser = useMemo(() => {
    return !isShowDrawerBag && !isShowDrawerCheckout && !selectedObject
  }, [isShowDrawerBag, isShowDrawerCheckout, selectedObject])

  const isDisabledMoveControl = useSelector(getIsDisabledPreviewControl)
  const mouseEventRef = useRef({
    clientX: 0,
    clientY: 0
  })

  const interactiveMode = useSelector(getInteractiveMode)

  const {
    objectsOctree,
    worldOctree
  } = useCollision(
    onShowSpinner
  )

  const initialPlayerPosition = useRef({
    capsule: {
      start: new Vector3(),
      end: new Vector3(),
    },
    player: {
      position: new Vector3(),
      rotation: new THREE.Euler()
    }
  })

  useEffect(() => {
    if(isPublishModeLocation(location) && project && project.createdBy){
        // Check retailer has role to multiplayer
        userApi.checkHasMultiplePlayerRole(project.createdBy).then(rs => {
            onSetCanBeJoinMultiplePlayer(!!rs?.result)
        })
    }
}, [project, location])

  useEffect(() => {
    onResetTimestamp()
  }, [isMoving, shouldHandleKickUser])

  function getCurrentAction() {
    let currentAction = PLAYER_ACTION_NAME.IDLE;
    if(baseActions.current) {
      currentAction = Object.keys(baseActions.current).reduce((prev, key) => {
        if(baseActions.current[key]?.weight) {
          return key;
        }
        return prev;
      }, currentAction)
    }
    return currentAction;
  }

  useFrame((state, delta) => {
    if(isPublishModeLocation(location) && multiplayerSocketRef.current){
      const currentAction = getCurrentAction()
      if(
        +modelRef.current.position.x.toFixed(5) !== +lastPosition.current.position[0].toFixed(5)
        || +modelRef.current.position.y.toFixed(5) !== +lastPosition.current.position[1].toFixed(5)
        || +modelRef.current.position.z.toFixed(5) !== +lastPosition.current.position[2].toFixed(5)
        || +modelRef.current.rotation.x.toFixed(5) !== +lastPosition.current.rotation[0].toFixed(5)
        || +modelRef.current.rotation.y.toFixed(5) !== +lastPosition.current.rotation[1].toFixed(5)
        || +modelRef.current.rotation.z.toFixed(5) !== +lastPosition.current.rotation[2].toFixed(5)
        || currentAction !== lastPosition.current.action
      ) {
        if (multiplayerSocketRef.current?.socket && multiplayerSocketRef.current?.clientId && multiplayerSocketRef.current?.multiplayerRoomId.current) {
          const currentAction = getCurrentAction()
          const data = {
            roomId: multiplayerSocketRef.current?.multiplayerRoomId.current,
            clientId: multiplayerSocketRef.current?.clientId,
            socketId: socket.id,
            clientName: playerName || currentUser?.name,
            gender: playerGender,
            playerAvatar: playerAvatar,
            role: publishRole ?? PUBLISH_ROLE.CUSTOMER,
            position: [modelRef.current.position.x, modelRef.current.position.y, modelRef.current.position.z],
            rotation: [modelRef.current.rotation.x, modelRef.current.rotation.y, modelRef.current.rotation.z],
            action: currentAction
          }
          multiplayerSocketRef.current?.socket.emit("raise-event", data)
        }

        if(
          modelRef.current.position.x !== currentPosition[0]
          || modelRef.current.position.y !== currentPosition[1]
          || modelRef.current.position.z !== currentPosition[2]
        ) {
          setCurrentPosition([modelRef.current.position.x, modelRef.current.position.y, modelRef.current.position.z])
        }

        lastPosition.current = {
          position: [modelRef.current.position.x, modelRef.current.position.y, modelRef.current.position.z],
          rotation: [modelRef.current.rotation.x, modelRef.current.rotation.y, modelRef.current.rotation.z],
          action: currentAction
        }
      }
    }

    // Fix bug kick when user not init
    if(isPublishModeLocation(location) && socket.connected && shouldHandleKickUser){
      if(idleTimestampCounter.current && !idleTimestampCounter.current.isMoving){
        timeCounter.current = moment().diff(idleTimestampCounter.current.time, 'seconds');
        if(timeCounter.current > IDLE_CONFIG.NUM_OF_SEC_SHOW_MESSAGE && shouldShowMessage.current){
          // Show message
          shouldShowMessage.current = false;
          notification.warning({
            message: CONFIG_TEXT.KICK_AFTER_90S
          })
        }
        if(timeCounter.current >= IDLE_CONFIG.NUM_OF_SEC_MAXIMUM && shouldKickUser.current){
          //Kick
          shouldKickUser.current = false;
          handleKickIdleUser();
        }
      }
    }

    if(!!!isHandlingMoveAction.current && !isPresenting && worldOctree.current && publishCameraMode === PUBLISH_CAMERA_MODE.STANDARD){
      currentDeltaTime.current = Math.min(0.05, delta);
      controls(currentDeltaTime.current);
      updatePlayer(currentDeltaTime.current);
    }

    // HAND ONLY IN VR MODE
    if(session && isPresenting){
      session.inputSources.forEach(el => {
        if(!!el.handedness && !!el.gamepad){
          if(el.handedness === "left" && el.gamepad.axes.length === 4){
            handleGamepadLeftJoyStick(el.gamepad.axes, delta)
          }
        }
      })
    }
  })

  useEffect(() => {
    if(!isPresenting){
      if(player){
        player.position.set(0, 0, 0)
        player.rotation.set(0, 0, 0)

        setCameraLookInModel()
      }
    }
  }, [isPresenting])

  const actionTimeOut = useRef()

  useEffect(() => {
    // if(!actionKey) {
    //   handlePlayerAnimation(PLAYER_ACTION_NAME.IDLE)
    //   return;
    // }

    switch (actionKey) {
      case ACTION_KEYS.WAVING: {
        isActiveAction.current = true
        handlePlayerAnimation(PLAYER_ACTION_NAME.WAVING)
        if(actionTimeOut.current) {
          clearTimeout(actionTimeOut.current)
        }
        actionTimeOut.current = setTimeout(() => {
          onResetAction();
          isActiveAction.current = false
        }, ACTION_TIME.WAVING);
        break;
      }
      case ACTION_KEYS.DISMISSING: {
        isActiveAction.current = true
        handlePlayerAnimation(PLAYER_ACTION_NAME.DISMISSING)
        if(actionTimeOut.current) {
          clearTimeout(actionTimeOut.current)
        }
        actionTimeOut.current = setTimeout(() => {
          onResetAction();
          isActiveAction.current = false
        }, ACTION_TIME.DISMISSING);
        break;
      }
      case ACTION_KEYS.AGREEING: {
        isActiveAction.current = true
        handlePlayerAnimation(PLAYER_ACTION_NAME.AGREEING)
        if(actionTimeOut.current) {
          clearTimeout(actionTimeOut.current)
        }
        actionTimeOut.current = setTimeout(() => {
          onResetAction();
          isActiveAction.current = false
        }, ACTION_TIME.AGREEING);
        break;
      }
      default: {
        if(actionTimeOut.current) {
          clearTimeout(actionTimeOut.current)
        }
        isActiveAction.current = false
      }
    }
  }, [actionKey])

  useEffect(() => {
    document.addEventListener("visibilitychange", onTabActiveChange)
    return () => {
      document.removeEventListener("visibilitychange", onTabActiveChange)
    }
  }, [])

  const onTabActiveChange = () => {
    if(document.hidden){
      onStopWalkingSound()
      keyStates.current = {}
    }
  }

  const focusToPublishObject = useCallback((e) => {
    const focusId = _.get(e, ['detail', 'id'])
    if(focusId){
      dispatch(setSelectedObject(focusId))
      dispatch(setPublishCameraMode(PUBLISH_CAMERA_MODE.FOCUS_OBJECT))
      const object = scene.getObjectByName(`prod-${focusId}`)
      if(object){
        object.updateWorldMatrix(true, true)
        const objectBox = new THREE.Box3().setFromObject(object)

        if(cameraRef.current){
          cameraRef.current.fitToBox(objectBox, true, {
            paddingTop: 0.2,
            paddingRight: 0.2,
            paddingBottom: 0.2,
            paddingLeft: 0.2
          })
        }
      }
    }
  },[])

  const resetPlayerAvatarToInitState = useCallback(() => {
    onResetAnimation() 

    playerCollider.current.start.copy(initialPlayerPosition.current.capsule.start)
    playerCollider.current.end.copy(initialPlayerPosition.current.capsule.end)
    modelRef.current.position.copy(initialPlayerPosition.current.player.position)
    modelRef.current.rotation.copy(initialPlayerPosition.current.player.rotation)
    
    setCameraLookInModel()
  }, [])

  useEffect(() => {
    window.addEventListener(APP_EVENTS.FOCUS_TO_PUBLISH_OBJECT, focusToPublishObject)
    window.addEventListener(APP_EVENTS.RESET_PLAYER_AVATAR_TO_INIT_STATE, resetPlayerAvatarToInitState)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener(APP_EVENTS.FOCUS_TO_PUBLISH_OBJECT, focusToPublishObject)
      window.removeEventListener(APP_EVENTS.RESET_PLAYER_AVATAR_TO_INIT_STATE, resetPlayerAvatarToInitState)
      window.removeEventListener("resize", handleResize)
    }
  }, [focusToPublishObject, resetPlayerAvatarToInitState])

  const handleResize = () => {
    setIsPortraitMode(window.innerHeight > window.innerWidth)
}

  useEffect(() => {
    if(!selectedObject && publishCameraMode === PUBLISH_CAMERA_MODE.FOCUS_OBJECT){
      onResetAnimation()
      setCameraLookInModel(true).then(() => {
        dispatch(setPublishCameraMode(PUBLISH_CAMERA_MODE.STANDARD))
      }).catch(() => {
        dispatch(setPublishCameraMode(PUBLISH_CAMERA_MODE.STANDARD))
      })
      
    }
  }, [selectedObject, publishCameraMode])

  useEffect(() => {
    if(isDisabledMoveControl){
      keyStates.current = {}
    } else {
      document.addEventListener("keydown", activeKeyState);
      document.addEventListener("keyup", deActiveKeyState);
    }
    return () => {
      document.removeEventListener("keydown", activeKeyState);
      document.removeEventListener("keyup", deActiveKeyState);
    };
  }, [isDisabledMoveControl]);

  useEffect(() => {
    document.addEventListener("keyup", onKeyDown);
    document.addEventListener("pointerup", onPointerUp);
    gl.domElement.addEventListener("dblclick", onDoubleClick);
    gl.domElement.addEventListener("pointermove", onPointerMove);
    gl.domElement.addEventListener("mousemove", onMouseMove);
    gl.domElement.addEventListener("touchmove", onTouchMove);
    gl.domElement.addEventListener("touchend", onTouchEnd);
    document.addEventListener('contextmenu', onContextMenuClick);

    return () => {
      document.removeEventListener("keyup", onKeyDown);
      document.removeEventListener("pointerup", onPointerUp);
      gl.domElement.removeEventListener("dblclick", onDoubleClick);
      gl.domElement.removeEventListener("pointermove", onPointerMove);
      gl.domElement.removeEventListener("mousemove", onMouseMove);
      gl.domElement.removeEventListener("touchmove", onTouchMove);
      gl.domElement.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener('contextmenu', onContextMenuClick);
    }
  }, [isPresenting, selectedObject, location, isDisabledMoveControl])

  useEffect(() => {
    return () => {
      onResetAnimation()
    }
  }, [])

  useEffect(() => {
    cameraRef.current.mouseButtons.wheel = CameraControlsDefault.ACTION.NONE
    cameraRef.current.mouseButtons.left = CameraControlsDefault.ACTION.NONE
    cameraRef.current.mouseButtons.right = CameraControlsDefault.ACTION.NONE
    cameraRef.current.mouseButtons.middle = CameraControlsDefault.ACTION.NONE
    cameraRef.current.touches.one = CameraControlsDefault.ACTION.NONE
    cameraRef.current.touches.two = CameraControlsDefault.ACTION.NONE
    cameraRef.current.touches.three = CameraControlsDefault.ACTION.NONE
    cameraRef.current.rotateTo(0, Math.PI / 2, false)
    
    playerCollider.current.start = new THREE.Vector3(0, 0, 0)
    playerCollider.current.end = new THREE.Vector3(0, PEOPLE_HEIGHT, 0)

    modelRef.current.position.set(playerCollider.current.start.x, 0, playerCollider.current.start.z)
    modelRef.current.rotation.y = camera.rotation.y + Math.PI;
    
    camera.getWorldDirection(tempCameraVector.current);

    // INIT CAMERA POSITION
    setInitCameraPositionWithRandomSpawnPoint()
    setCameraLookInModel()

    // Save initial position value, use it when reset state
    initialPlayerPosition.current.capsule.start.copy(playerCollider.current.start)
    initialPlayerPosition.current.capsule.end.copy(playerCollider.current.end)
    initialPlayerPosition.current.player.position.copy(modelRef.current.position)
    initialPlayerPosition.current.player.rotation.copy(modelRef.current.rotation)
    // End: Save initial position value, use it when reset state

    handlePlayerAnimation(PLAYER_ACTION_NAME.IDLE)
    targetPointRef.current = new THREE.Vector3();
  }, [spawnPoints]);

  const setInitCameraPositionWithRandomSpawnPoint = () => {
    if(spawnPoints && spawnPoints.length > 0){
      const pointIndex = Math.floor(Math.random() * spawnPoints.length)
      const spawnPoint = spawnPoints[pointIndex]

      // Default see -z
      let lookDirection = new Vector3(0, 0, 1);
      lookDirection.applyEuler(new THREE.Euler(spawnPoint.rotation.x, spawnPoint.rotation.y, spawnPoint.rotation.z, 'XYZ'))

      playerCollider.current.end = new Vector3(spawnPoint.position.x, spawnPoint.position.y, spawnPoint.position.z)
      playerCollider.current.start = new Vector3(spawnPoint.position.x, spawnPoint.position.y - PEOPLE_HEIGHT, spawnPoint.position.z)

      const targetPoint = new Vector3(spawnPoint.position.x - lookDirection.x, spawnPoint.position.y - lookDirection.y, spawnPoint.position.z - lookDirection.z)

      const newAngle = findNewAngleOfModel(targetPoint, playerCollider.current.end)

      modelRef.current.position.set(spawnPoint.position.x, spawnPoint.position.y - PEOPLE_HEIGHT, spawnPoint.position.z)
      modelRef.current.rotation.set(0, newAngle + Math.PI, 0)
    }
  }

  const findNewAngleOfModel = (targetPoint, startPoint) => {
    const newDirection = targetPoint.clone().setY(0).sub(startPoint.clone().setY(0)).normalize();
    let newAngle = newDirection.x !== 0 ?  -(newDirection.x / Math.abs(newDirection.x)) * newDirection.angleTo(initCameraAxis.current) : newDirection.angleTo(initCameraAxis.current)
    const oldAngle = modelRef.current.rotation.y -  Math.PI;

    let lowLimit = 0;
    let hightLimit = 0;

    if(newAngle > oldAngle){
      let temp = newAngle
      while(temp > oldAngle){
        temp -= Math.PI * 2
      }

      lowLimit = temp;
      hightLimit = temp + Math.PI * 2;
    }

    if(newAngle < oldAngle){
      let temp = newAngle
      while(temp < oldAngle){
        temp += Math.PI * 2
      }

      lowLimit = temp - Math.PI * 2;
      hightLimit = temp;
    }

    if(lowLimit !== hightLimit){
      if(Math.abs(lowLimit - oldAngle) < Math.abs(hightLimit - oldAngle)){
        newAngle = lowLimit
      } else {
        newAngle = hightLimit
      }
    }

    return newAngle
  }

  const handleKickIdleUser = () => {
    notification.info({
        message: CONFIG_TEXT.KICK_BECAUSE_IDLE
    })
    
    window.isRequiredTracking = false;
    navigate(0)
}

  const onResetTimestamp = () => {
    idleTimestampCounter.current = {
      isMoving: isMoving,
      time: moment()
    }
    shouldShowMessage.current = true;
  }

  const killAnimation = () => {
    if(currentAnimation.current){
      currentAnimation.current.kill()
      currentAnimation.current = null
    }
    if(currentRotationAnimation.current){
      currentRotationAnimation.current.kill()
      currentRotationAnimation.current = null
    }
  }

  const onResetAnimation = () => {
    setIsShowPoiting(false)
    killAnimation()
    isHandlingMoveAction.current = false
    handlePlayerAnimation(PLAYER_ACTION_NAME.IDLE)

    onStopWalkingSound()

  }

  const onKeyDown = (e) => {
    if(e.code === "Escape" && !isPublishModeLocation(location) && !isDisabledMoveControl){
      if(!selectedObject){
        onExitPointerControl()
      } else {
        onSelectObject("")
      }
    }
    if(e.code === "KeyT" && !isDisabledMoveControl && e?.target?.tagName === "BODY"){
      const rect = gl.domElement.getBoundingClientRect();
      const x = mouseEventRef.current.clientX - rect.left;
      const y = mouseEventRef.current.clientY - rect.top;
      let canvasPointer = new THREE.Vector2()
      canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
      canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
      raycaster.setFromCamera(canvasPointer, camera);

      if(scene){
        let intersects = raycaster.intersectObjects([...scene.children], true);

        if(intersects.length){
          let point = intersects[0].point

          let check = checkIsIntersectFaceFlat(intersects[0].object, intersects[0].face, camera);
          if(check){
            targetPointRef.current = new THREE.Vector3(point.x, point.y, point.z);
            moveToNewTarget()
          }
        }
      }
    }
  }

  const onTouchEnd = (e) => {
    previousTouch.current = null;
  }

  const onTouchMove = (e) => {
    e.preventDefault()
    const touch = e.touches[e.touches.length - 1];
    if(touch && previousTouch.current && e.target?.tagName === "CANVAS"){
      e.movementX = touch.pageX - previousTouch.current.pageX;
      let angle = e.movementX / 300
      onRotateTPS(angle)

      e.movementY = touch.pageY - previousTouch.current.pageY;
      let offsetDamping = - e.movementY / 300;
      if(cameraOffsetYRef.current + offsetDamping >= MIN_CAMERA_Y && cameraOffsetYRef.current + offsetDamping <= MAX_CAMERA_Y){
        cameraOffsetYRef.current = cameraOffsetYRef.current + offsetDamping
      }
    }

    previousTouch.current = touch;
  }

  const onPointerMove = (event) => {
    const x = event.clientX
    const y = event.clientY

    mouseEventRef.current = {
        clientX: x,
        clientY: y
    }
  }

  const onMouseMove = (e) => {
    onResetTimestamp()
    // Click left button and drag
    if(e.button === 0 && e.buttons === 1 && !isPresenting && checkPointInCanvas(e)){
      let angle = -e.movementX / 500
      let offsetDamping = e.movementY / 500;
      if(cameraOffsetYRef.current + offsetDamping >= MIN_CAMERA_Y && cameraOffsetYRef.current + offsetDamping <= MAX_CAMERA_Y){
        cameraOffsetYRef.current = cameraOffsetYRef.current + offsetDamping
      }

      onRotateTPS(angle)
    }
  }

  const onRotateTPS = (angle) => {
    if(publishCameraMode === PUBLISH_CAMERA_MODE.FOCUS_OBJECT){
      return
    }
    modelRef.current.rotation.y += angle;

    setCameraLookInModel()
  }

  const setCameraLookInModel = (hasAnimation = false) => {
    if(publishCameraMode === PUBLISH_CAMERA_MODE.FOCUS_OBJECT && !hasAnimation){
      return
    }
    cameraDirection.current.copy(initCameraAxis.current.clone().applyAxisAngle(camera.up, modelRef.current.rotation.y - Math.PI).normalize());
    sideVector.current.copy(cameraDirection.current.clone().cross(camera.up).normalize());

    cameraPos.current.copy(
      modelRef.current.position.clone().setY(modelRef.current.position.y + PEOPLE_HEIGHT)
      .add(cameraDirection.current.multiplyScalar(-findDistanceByRandSquaredLine(CAMERA_DISTANCE, cameraOffsetYRef.current)))
      .add(sideVector.current.clone().multiplyScalar(CAMERA_FORWARD_DISTANCE))
      .add(camera.up.clone().multiplyScalar(cameraOffsetYRef.current))
    ) 
    cameraTarget.current.copy(
      modelRef.current.position.clone().setY(modelRef.current.position.y + PEOPLE_HEIGHT).add(sideVector.current.clone().multiplyScalar(CAMERA_FORWARD_DISTANCE))
    )

    if(hasAnimation) {
      return new Promise((resolve, reject) => {
        cameraRef.current.setLookAt(
          cameraPos.current.x,
          cameraPos.current.y,
          cameraPos.current.z,
          cameraTarget.current.x,
          cameraTarget.current.y,
          cameraTarget.current.z,
          hasAnimation
        ).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    } else {
      cameraRef.current.setLookAt(
        cameraPos.current.x,
        cameraPos.current.y,
        cameraPos.current.z,
        cameraTarget.current.x,
        cameraTarget.current.y,
        cameraTarget.current.z,
        false
      )
    }
     
  }

  const onContextMenuClick = (e) => {
    if(checkPointInCanvas(e)){
      e.preventDefault()
    }
  }

  const onDoubleClick = (e) => {
    const event = e
    const rect = gl.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let canvasPointer = new THREE.Vector2()
    canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
    canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
    raycaster.setFromCamera(canvasPointer, camera);

    if(scene){
      let intersects = raycaster.intersectObjects([...scene.children], true);

      if(intersects.length){
        let point = intersects[0].point

        let check = checkIsIntersectFaceFlat(intersects[0].object, intersects[0].face, camera);
        if(check){
          targetPointRef.current = new THREE.Vector3(point.x, point.y, point.z);
          // Click right mouse to teleport
          moveToNewTarget(1)
        }
      }
    }
  }

  const onPointerUp = (e) => {
    // Button 2 is right click
    if(e.button === 2 && checkPointInCanvas(e)){
      const event = e
      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let canvasPointer = new THREE.Vector2()
      canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
      canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
      raycaster.setFromCamera(canvasPointer, camera);

      if(scene){
        let intersects = raycaster.intersectObjects([...scene.children], true);

        if(intersects.length){
          let point = intersects[0].point

          let check = checkIsIntersectFaceFlat(intersects[0].object, intersects[0].face, camera);
          if(check){
            targetPointRef.current = new THREE.Vector3(point.x, point.y, point.z);
            // Click right mouse to teleport
            moveToNewTarget(0)
          }
        }
      }
    }
  }

  const checkPointInCanvas = (e) => {
    if(!(e.target.tagName === "CANVAS")){
      return false
    }
    const event = e
    const rect = gl.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(x > 0 && x < rect.width && y > 0 && y < rect.height){
        return true
    }

    return false
  }

  function activateAction(action) {
    if(baseActions.current.idle.weight > 0){
      setIsMoving(false)
    } else {
      setIsMoving(true)
    }
    if (action) {
      const clip = action.getClip();
      const settings = baseActions.current[clip.name];
      setWeight(action, settings.weight);
      if(settings.weight > 0){
        action.reset()
        action.play();
      } else {
        if(clip.name !== PLAYER_ACTION_NAME.IDLE){
          action.stop()
        }
      }
      
    }
  }

  function setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  const activeKeyState = (event) => {
    if(checkKeydownInCanvas(event)){
      keyStates.current[event.code] = true;
    }
  };

  const checkKeydownInCanvas = (e) => {
    return e.target.tagName === "BODY"
  }

  const deActiveKeyState = (event) => {
    keyStates.current[event.code] = false;
  };

  const moveToNewTarget = (duration = 0) => {
    onResetAnimation()

    if(!modelRef.current){
      return
    }

    const startPoint = modelRef.current.position;
    const distance = startPoint.distanceTo(targetPointRef.current)
    const newAngle = findNewAngleOfModel(targetPointRef.current, startPoint)

    handlePlayerAnimation( isRunningRef.current ? PLAYER_ACTION_NAME.RUN : PLAYER_ACTION_NAME.WALK)

    if(duration === 0){
      playerCollider.current.start.x = targetPointRef.current.x;
      playerCollider.current.start.y = targetPointRef.current.y + CAPSULE_RADUIS;
      playerCollider.current.start.z = targetPointRef.current.z;
      
      playerCollider.current.end.y = playerCollider.current.start.y + PEOPLE_HEIGHT;
      playerCollider.current.end.x = targetPointRef.current.x;
      playerCollider.current.end.z = targetPointRef.current.z;

      modelRef.current.rotation.set(0, newAngle + Math.PI, 0)
      modelRef.current.position.copy(targetPointRef.current)

      setCameraLookInModel()
    } else {

      isHandlingMoveAction.current = true;
      setPointingTarget([targetPointRef.current.x, targetPointRef.current.y, targetPointRef.current.z])
      setIsShowPoiting(true)
      onPlayWalkingSound()
      currentAnimation.current = gsap.to(modelRef.current.position,
        {
          x: targetPointRef.current.x,
          z: targetPointRef.current.z ,
          y: targetPointRef.current.y,
          duration: duration > 0 ? (distance / 3) / (isRunningRef.current ? RUNNING_SPEED : WALKING_SPEED) : 0, 
          ease: "none",
          onUpdate: () => {
            if(!isPreviewMode){
              return
            }
            playerCollider.current.start.x = modelRef.current.position.x;
            playerCollider.current.start.y = modelRef.current.position.y + CAPSULE_RADUIS;
            playerCollider.current.start.z = modelRef.current.position.z;
            
            playerCollider.current.end.y =  playerCollider.current.start.y + PEOPLE_HEIGHT;
            playerCollider.current.end.x = modelRef.current.position.x;
            playerCollider.current.end.z = modelRef.current.position.z;

            setCameraLookInModel()
          },
          onComplete: () => {
            setIsShowPoiting(false)

            handlePlayerAnimation(PLAYER_ACTION_NAME.IDLE)

            isHandlingMoveAction.current = false

            onStopWalkingSound()
          }
        }
      )
  
      currentRotationAnimation.current = gsap.to(modelRef.current.rotation,
        {
            x: 0,
            z: 0,
            y: newAngle + Math.PI,
            duration: duration > 0 ? 1 : 0, 
            ease: "none",
            onUpdate: () => {
            },
            onComplete: () => {
            }
        }
      )
    }
  }

  useEffect(() => {

    isRunningRef.current = isRunning;

    if(!currentAnimation.current) {
      return;
    }

 
    if(!modelRef.current){
      return
    }

    killAnimation()

    const startPoint = modelRef.current.position;
    const distance = startPoint.distanceTo(targetPointRef.current)
    // const newAngle = findNewAngleOfModel(targetPointRef.current, startPoint)

    handlePlayerAnimation( isRunningRef.current ? PLAYER_ACTION_NAME.RUN : PLAYER_ACTION_NAME.WALK)

    isHandlingMoveAction.current = true;
    // setPointingTarget([targetPointRef.current.x, targetPointRef.current.y, targetPointRef.current.z])
    // setIsShowPoiting(true)
    // onPlayWalkingSound()
    currentAnimation.current = gsap.to(modelRef.current.position,
      {
        x: targetPointRef.current.x,
        z: targetPointRef.current.z,
        y: targetPointRef.current.y,
        duration: (distance / 3) / (isRunning ? RUNNING_SPEED : WALKING_SPEED),
        ease: "none",
        onUpdate: () => {
          if (!isPreviewMode) {
            return
          }
          playerCollider.current.start.x = modelRef.current.position.x;
          playerCollider.current.start.y = modelRef.current.position.y + CAPSULE_RADUIS;
          playerCollider.current.start.z = modelRef.current.position.z;

          playerCollider.current.end.y = playerCollider.current.start.y + PEOPLE_HEIGHT;
          playerCollider.current.end.x = modelRef.current.position.x;
          playerCollider.current.end.z = modelRef.current.position.z;

          setCameraLookInModel()
        },
        onComplete: () => {
          setIsShowPoiting(false)

          handlePlayerAnimation(PLAYER_ACTION_NAME.IDLE)

          isHandlingMoveAction.current = false
          currentAnimation.current = null
          onStopWalkingSound()
        }
      }
    )
  }, [isRunning])

  const handlePlayerAnimation = (actionName) => {
    
    if(!baseActions.current[actionName]){
      return
    }
    if(baseActions.current[actionName].weight > 0){
      return
    }

    if(
      actionName !== PLAYER_ACTION_NAME.WAVING
      && actionName !== PLAYER_ACTION_NAME.AGREEING
      && actionName !== PLAYER_ACTION_NAME.DISMISSING
    ) {
      onResetAction();
    }

    Object.keys(baseActions.current).forEach(el => {
      baseActions.current[el].weight = 0
    })
    baseActions.current[actionName].weight = 5

    Object.keys(baseActions.current).forEach(el => {
      if(baseActions.current[el].action){
        activateAction(baseActions.current[el].action);
      }
    })
  }

  function controls(deltaTime) {
    if(isActiveAction.current) {
      return;
    }

    speedDelta.current = deltaTime * (isMobile ? MOBILE_CAMERA_SPEED : DESKTOP_CAMERA_SPEED) * (isRunning ? RUNNING_SPEED : WALKING_SPEED);
    newPlayerAction.current = PLAYER_ACTION_NAME.IDLE
    if (keyStates.current["KeyW"] || keyStates.current["ArrowUp"]) {
      playerVelocity.current.add(getForwardVector().multiplyScalar(speedDelta.current));
      newPlayerAction.current = isRunningRef.current ? PLAYER_ACTION_NAME.RUN : PLAYER_ACTION_NAME.WALK
    }
    if (keyStates.current["KeyS"] || keyStates.current["ArrowDown"]) {
      playerVelocity.current.add(
        getForwardVector().multiplyScalar(-speedDelta.current)
      );
      newPlayerAction.current = isRunningRef.current ? PLAYER_ACTION_NAME.RUN : PLAYER_ACTION_NAME.WALK
    }
    if (keyStates.current["KeyA"] || keyStates.current["ArrowLeft"]) {
      playerVelocity.current.add(getSideVector().multiplyScalar(-speedDelta.current));
      newPlayerAction.current = isRunningRef.current ? PLAYER_ACTION_NAME.RUN : PLAYER_ACTION_NAME.WALK
    }
    if (keyStates.current["KeyD"] || keyStates.current["ArrowRight"]) {
      playerVelocity.current.add(getSideVector().multiplyScalar(speedDelta.current));
      newPlayerAction.current = isRunningRef.current ? PLAYER_ACTION_NAME.RUN : PLAYER_ACTION_NAME.WALK
    }

    if (keyStates.current["KeyQ"]) {
      onRotateTPS(Math.PI / 300)
    }
    if (keyStates.current["KeyE"]) {
      onRotateTPS(-Math.PI / 300)
    }

    if(newPlayerAction.current === PLAYER_ACTION_NAME.WALK || newPlayerAction.current === PLAYER_ACTION_NAME.RUN){
      onPlayWalkingSound()
    } else {
      onStopWalkingSound()
    }

    if(newPlayerAction.current === PLAYER_ACTION_NAME.IDLE){
      playerVelocity.current.set(0, 0, 0)
    }

    handlePlayerAnimation(newPlayerAction.current)
  }

  function updatePlayer(deltaTime, checkCollistion = true) {
    damping.current = Math.exp(-4 * deltaTime) - 1;

    if ( !playerOnFloor.current ) {
      playerVelocity.current.setY(playerVelocity.current.y - GRAVITY * deltaTime);
      // small air resistance
      damping.current *= 0.1;
    }

    playerVelocity.current.addScaledVector(playerVelocity.current, damping.current);

    deltaPosition.current.copy(playerVelocity.current
      .clone()
      .multiplyScalar(deltaTime));
    playerCollider.current.translate(deltaPosition.current);

    if(counterFirstUpdate.current || _.round(deltaPosition.current.x, 3) !== 0 || _.round(deltaPosition.current.y, 3) !== 0 || _.round(deltaPosition.current.z, 3) !== 0) {
      if(counterFirstUpdate.current) {
        counterFirstUpdate.current --
      }
      // It make the avatar always move 0.3 from y = 0
      if(checkCollistion){
        const resultDecor = playerCollisionsWidthDecor()
        if(resultDecor){
          playerCollider.current.translate(
            resultDecor.normal.multiplyScalar(resultDecor.depth)
          );
        }

        const result = playerCollisions();
        if(result){
          playerCollider.current.translate(
            result.normal.multiplyScalar(result.depth)
          );
        }
      }

      modelRef.current.position.set(playerCollider.current.start.x, playerCollider.current.start.y - CAPSULE_RADUIS, playerCollider.current.start.z);
      setCameraLookInModel()
    }
  }

  function playerCollisionsWidthDecor() {
    const result = objectsOctree.current.capsuleIntersect(playerCollider.current);
    if (!result) {
      return null;
    }
    return result
  }

  function playerCollisions() {
    const result = worldOctree.current.capsuleIntersect(playerCollider.current);
    playerOnFloor.current = false;

    if (!result) {
      return;
    }

    if (result) {
      playerOnFloor.current = result.normal.y > 0;
      if (!playerOnFloor.current) {
        playerVelocity.current.addScaledVector(
          result.normal,
          -result.normal.dot(playerVelocity.current)
        );
      }
    }

    return result
  }

  function getForwardVector() {
    camera.getWorldDirection(playerDirection.current);
    playerDirection.current.y = 0;
    playerDirection.current.normalize();
    return playerDirection.current;
  }

  function getSideVector() {
    camera.getWorldDirection(playerDirection.current);
    playerDirection.current.y = 0;
    playerDirection.current.normalize();
    playerDirection.current.cross(camera.up);
    return playerDirection.current;
  }

  const handleGamepadLeftJoyStick = (axes, timeDelta) => {
    if(isHandlingMoveAction.current){
      return
    }
    playerVelocity.current.add(getForwardVector().multiplyScalar(-1 * XRMovementSpeed * axes[3]));
    playerVelocity.current.add(getSideVector().multiplyScalar(XRMovementSpeed * axes[2]));

    damping.current = Math.exp(-4 * timeDelta) - 1;

    if ( !playerOnFloor.current ) {
      playerVelocity.current.setY(playerVelocity.current.y - GRAVITY * timeDelta);
      damping.current *= 0.1;
    }
    
    playerVelocity.current.addScaledVector(playerVelocity.current, damping.current);
    deltaPosition.current.copy(playerVelocity.current
          .clone()
          .multiplyScalar(timeDelta));

    camera.getWorldPosition(cameraWorldPosition.current);

    // Move player model to camera position
    playerCollider.current.start.x = cameraWorldPosition.current.x;
    playerCollider.current.start.y = cameraWorldPosition.current.y - PEOPLE_HEIGHT + CAPSULE_RADUIS;
    playerCollider.current.start.z = cameraWorldPosition.current.z;
    playerCollider.current.end.x = cameraWorldPosition.current.x;
    playerCollider.current.end.y = cameraWorldPosition.current.y + CAPSULE_RADUIS;
    playerCollider.current.end.z = cameraWorldPosition.current.z;

    // Only set for multiple player, not show avatar in vr mode
    modelRef.current.position.set(cameraWorldPosition.current.x, playerCollider.current.start.y - CAPSULE_RADUIS, cameraWorldPosition.current.z)

    player.position.add(deltaPosition.current);
    const result = playerCollisions();
    if(result){
      player.position.add(
        result.normal.multiplyScalar(result.depth)
      );
    }

    const resultDecor = playerCollisionsWidthDecor()
    if(resultDecor){
      player.position.add(
        resultDecor.normal.multiplyScalar(resultDecor.depth)
      );
    }
  }

  // HANDLE XR MOVE TO TARGET
  const controllerLeft = useController('left');
  const moveXRPlayerToNewTarget = () => {
    onResetAnimation()

    if(!player){
      return
    }

    // startPoint is camera pos
    const startPoint = new THREE.Vector3();
    camera.getWorldPosition(startPoint);
    const distance = startPoint.distanceTo(targetPointRef.current)
    const newCameraDirection = targetPointRef.current.clone().setY(0).sub(startPoint.clone().setY(0)).normalize();
    const newPlayerDownDirection = targetPointRef.current.clone().sub(player.position.clone()).normalize().setX(0).setZ(0);
    const targetPointOfPlayer = player.position.clone().add(newCameraDirection.clone().multiplyScalar(distance)).add(newPlayerDownDirection.clone().multiplyScalar(distance));
    
    handlePlayerAnimation( isRunningRef.current ? PLAYER_ACTION_NAME.RUN : PLAYER_ACTION_NAME.WALK)

    isHandlingMoveAction.current = true;

    setPointingTarget([targetPointRef.current.x, targetPointRef.current.y, targetPointRef.current.z])
    setIsShowPoiting(true)

    onPlayWalkingSound()

    currentAnimation.current = gsap.to(player.position,
      {
          x:  targetPointOfPlayer.x,
          y:  targetPointOfPlayer.y,
          z:  targetPointOfPlayer.z,
          duration: distance / 3, 
          ease: "none",
          onUpdate: () => {
            if(!isPreviewMode){
              return
            }
            camera.getWorldPosition(cameraWorldPosition.current);

            // Move player model to camera position
            playerCollider.current.start.x = cameraWorldPosition.current.x;
            playerCollider.current.start.y = cameraWorldPosition.current.y - PEOPLE_HEIGHT + CAPSULE_RADUIS;
            playerCollider.current.start.z = cameraWorldPosition.current.z;
            playerCollider.current.end.x = cameraWorldPosition.current.x;
            playerCollider.current.end.y = cameraWorldPosition.current.y + CAPSULE_RADUIS;
            playerCollider.current.end.z = cameraWorldPosition.current.z;

            // Only set for multiple player, not show avatar in vr mode
            modelRef.current.position.set(cameraWorldPosition.current.x, playerCollider.current.start.y - CAPSULE_RADUIS, cameraWorldPosition.current.z)
          },
          onComplete: () => {
            setIsShowPoiting(false)

            handlePlayerAnimation(PLAYER_ACTION_NAME.IDLE)

            isHandlingMoveAction.current = false

            onStopWalkingSound()
          }
      }
    )
  } 
  const onLeftControllerClick = () => {
    if(!isPresenting){
      return
    }
    controllerLeft.controller.updateWorldMatrix(true, true)
    tempMatrix.current.identity().extractRotation(controllerLeft.controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controllerLeft.controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix.current);
    let intersects = raycaster.intersectObjects([...scene.children.filter(el => el.userData?.isShowroom)], true);

    if(intersects.length){
      let point = intersects[0].point
      let vector = new Vector3();
      camera.getWorldPosition(vector)
      targetPointRef.current = new THREE.Vector3(point.x, point.y, point.z);

      moveXRPlayerToNewTarget()
    }
  }
  
  useXREvent('select', onLeftControllerClick, { handedness: 'left' })
  
  useImperativeHandle(ref, () => ({
    onMove: (keyW, keyS, keyA, keyD) => {
      keyStates.current["KeyW"] = keyW;
      keyStates.current["KeyS"] = keyS;
      keyStates.current["KeyA"] = keyA;
      keyStates.current["KeyD"] = keyD;      
    },
    onEndMove: () => {
      keyStates.current["KeyW"] = false;
      keyStates.current["KeyS"] = false;
      keyStates.current["KeyA"] = false;
      keyStates.current["KeyD"] = false;     
    },
    selectWall: (el) => {
      // Default see -z
      let lookDirection = new Vector3(0, 0, 1);
      lookDirection.applyEuler(new THREE.Euler(el.rotation.x, el.rotation.y, el.rotation.z, 'XYZ'))

      playerCollider.current.end = new Vector3(el.position.x, el.position.y, el.position.z)
      playerCollider.current.start = new Vector3(el.position.x, el.position.y - PEOPLE_HEIGHT, el.position.z)

      const targetPoint = new Vector3(el.position.x - lookDirection.x, el.position.y - lookDirection.y, el.position.z - lookDirection.z)

      const newAngle = findNewAngleOfModel(targetPoint, playerCollider.current.end)

      // Only update model position and rotation, the position of camera is updated by updatePlayer()
      modelRef.current.position.set(el.position.x, el.position.y - PEOPLE_HEIGHT, el.position.z)
      modelRef.current.rotation.set(0, newAngle + Math.PI, 0)

      setCameraLookInModel()
    }
  }), []);

  useEffect(() => {

    if(firstLoadMultiplayer) {
      if(multiplayerSocketRef.current?.socket && multiplayerSocketRef.current?.clientId && multiplayerSocketRef.current?.multiplayerRoomId.current) {
        const currentAction = getCurrentAction()
        const data = {
          roomId: multiplayerSocketRef.current?.multiplayerRoomId.current,
          clientId: multiplayerSocketRef.current?.clientId,
          socketId: socket.id,
          clientName: playerName || currentUser?.name,
          gender: playerGender,
          playerAvatar: playerAvatar,
          role: publishRole ?? PUBLISH_ROLE.CUSTOMER,
          position: [modelRef.current.position.x, modelRef.current.position.y, modelRef.current.position.z],
          rotation: [modelRef.current.rotation.x, modelRef.current.rotation.y, modelRef.current.rotation.z],
          action: currentAction
        }

        multiplayerSocketRef.current?.socket.emit("raise-event", data)
      }
    }
    else {
      dispatch(setOtherPlayer([]))
    }

  }, [firstLoadMultiplayer])
  return (
    <>
      <CameraHelper 
          ref={cameraRef}
          smoothTime={1}
      />
      <group 
        ref={modelRef} 
        name="modelRef" 
        visible={visiblePlayerAvatar}
      >
        <PlayerAvatar baseActions={baseActions} activateAction={activateAction} visible={visiblePlayerAvatar}/>
      </group>
      {/* PoitingDownArrow make mobile lag */}
      {
        !isMobile && <PoitingDownArrow visible={isShowPointing} target={pointingTarget}/>
      }
      {
        interactiveMode === INTERACTIVE_MODE.LIVE && isPublishModeLocation(location) && <MultiplePlayerPhoton
          ref={(ref) => {
            if (ref?.clientId && ref?.socket) {
              multiplayerSocketRef.current = ref
              setFirstLoadMultiplayer(true)
            }
            else {
              multiplayerSocketRef.current = null
              setFirstLoadMultiplayer(false)
            }
          }}
          currentPosition={currentPosition}
          onSetUserIP={onSetUserIP}
          modelRef={modelRef}
        />
      }
    </>
  );
});
