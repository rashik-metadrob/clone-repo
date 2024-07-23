import { Suspense, useEffect, useMemo, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber";
import {AmbientLight, AnimationMixer, LoopOnce, LoopRepeat, Vector3} from "three"
import { apllyMaterials, getAssetsUrl, loadModel } from "../../../../utils/util";
import { AVAILABLE_ANIMATION, COLLIDER_PREFIX, HIDDEN_PREFIXES, SPAWN_POINT_PREFIX } from "../../../../utils/constants";
import _ from "lodash";
import RoomEnvironment from "../roomEnvironment/RoomEnvironment";
import CanvasLoading from "../canvasLoading/CanvasLoading";
import { useSelector } from "react-redux";
import { getIsOverrideMaterialDesktop, getIsOverrideMaterialMobile, getIsShowHDRIDesktop, getIsShowHDRIMobile } from "../../../../redux/configSlice";
import { isMobile } from "react-device-detect";

const Room = ({
  onLoading = () => {},
  project,
  onListCameras = () => {},
  onListSpawnPoints = () => {},
  onRoomLoaded = () => {},
  onBuildGrid = () => {}
}) => {
    const {scene, gl} = useThree()
    const [object, setObject] = useState()

    const [envLoadedPercent, setEnvLoadedPercent] = useState(0)
    const [roomLoadedPercent, setRoomLoadedPercent] = useState(0)

    const isOverrideMaterialDesktop = useSelector(getIsOverrideMaterialDesktop)
    const isOverrideMaterialMobile = useSelector(getIsOverrideMaterialMobile)

    const isShowHDRIDesktop = useSelector(getIsShowHDRIDesktop)
    const isShowHDRIMobile = useSelector(getIsShowHDRIMobile)

    const shouldOverrideMaterial = useMemo(() => {
        return (!isMobile && isOverrideMaterialDesktop) || (isMobile && isOverrideMaterialMobile)
    }, [isOverrideMaterialDesktop, isOverrideMaterialMobile])

    const shouldShowHDRI = useMemo(() => {
      const isShow = (!isMobile && isShowHDRIDesktop) || (isMobile && isShowHDRIMobile)

      return isShow && !shouldOverrideMaterial
    }, [isShowHDRIDesktop, isShowHDRIMobile, shouldOverrideMaterial])

    const mixer = useMemo(() => {
      if(object) {
        let newMixer = new AnimationMixer(object.scene);
        return newMixer
      } else {
        return null
      }
    }, [object])

    const action = useMemo(() => {
      if(mixer && object && object.animations.length > 0){
          return mixer.clipAction(object.animations[0])
      } else {
          return null
      }
    }, [mixer, object])

    useFrame((state, delta) => {
      if (mixer && action) {
          mixer.update(delta);
      }
    })

    useEffect(() => {
      if(action && _.get(project, ['templateAvailableAnimation'], AVAILABLE_ANIMATION.PLAY_NEVER) !== AVAILABLE_ANIMATION.PLAY_NEVER){
        action.reset()
        if(_.get(project, ['templateAvailableAnimation'], AVAILABLE_ANIMATION.PLAY_NEVER) === AVAILABLE_ANIMATION.LOOP_ONE){
            action.loop = LoopOnce
        } else {
            action.loop = LoopRepeat
        }
        action.play()
      } else {
        if(action){
          action.stop()
        }
      }
    },[action, project])

    useEffect(() => {
      // https://www.drobverse.com:8081/uploads/1692169636965-file.glb
      // https://www.drobverse.com:8081/uploads/GLTFTEST/untitled.gltf
      // https://drobverse.com:8081/uploads/1695058886342-file.glb
      loadModel(
        getAssetsUrl(project.template), 
        (percent) => {setRoomLoadedPercent(percent)}, 
        gl,
        shouldOverrideMaterial
      )
      .then(model => {
        if(model.cameras.length === 0){
          model.scene.children.forEach(el => {
            if(el.name.includes("Camera")){
              model.cameras.push(el)
            }
          })
        }
        if(model.cameras.length > 0){
          const savedCamera = _.get(project, "cameras", [])
          // Read camera from object
          onListCameras([...model.cameras.filter(el => !el?.name.includes(SPAWN_POINT_PREFIX.toLowerCase())).map((el, index) => {
            el.updateMatrixWorld(true);

            let pos = new Vector3();
            el.getWorldPosition(pos);

            return {
              name: _.get(savedCamera, [index, 'name'], `Wall ${index + 1}`) ,
              thumnail: _.get(savedCamera, [index, 'thumnail'], ``) ,
              assetId: _.get(savedCamera, [index, 'assetId'], ``) ,
              position: {
                x: pos.x,
                y: pos.y,
                z: pos.z
              },
              rotation: {
                x: el.rotation.x,
                y: el.rotation.y,
                z: el.rotation.z
              },
              matrixWorld: el.matrixWorld.toArray()
            }
          })])
          onListSpawnPoints([...model.cameras.filter(el => el?.name.includes(SPAWN_POINT_PREFIX.toLowerCase())).map((el, index) => {
            el.updateMatrixWorld(true);

            let pos = new Vector3();
            el.getWorldPosition(pos);

            return {
              text: `Spawn point ${index + 1}`,
              position: {
                x: pos.x,
                y: pos.y,
                z: pos.z
              },
              rotation: {
                x: el.rotation.x,
                y: el.rotation.y,
                z: el.rotation.z
              },
              matrixWorld: el.matrixWorld.toArray()
            }
          })])
        } else {
          onListCameras([])
          onListSpawnPoints([])
        }

        apllyMaterials(model.materials, project.materials)
        const listCollider = []

        
        //Apply only for sunglass model
        // let numOfLights = 0;
        // model.scene.traverse(el => {
        //   if(el?.isLight){
            // Apply cutomize model by admin
            // if(isSunglassModel){
            //   el.intensity = 0;
            //   el.visible = false;
            // } else {
            //   if(el?.intensity > 1){
            //     el.intensity = 1
            //   }
            // }
        //     numOfLights += 1;
        //   }
        // })
        
        // Set metaness and roughness
        model.scene.traverse(el => {
          if(el?.name.includes(COLLIDER_PREFIX.toLowerCase()) || _.some(HIDDEN_PREFIXES, (prefix) => el?.name && (el?.name.toLowerCase().endsWith(prefix) || el?.name.toLowerCase().startsWith(prefix)))){
            listCollider.push(el)
          }
           // Apply cutomize model by admin
          // if(el?.isMesh){
          //   el.receiveShadow = true;
          //   el.castShadow = true;
          //   if(!el.material.emissiveMap && numOfLights === 0){
          //     el.material.envMapIntensity = 0.5
          //   } else {
          //     if(isSunglassModel){
          //       el.material.envMapIntensity = 0.03
          //     } else {
          //       el.material.envMapIntensity = 0.07
          //     }
          //   }
          //   if(el.material.roughness !== undefined){
          //     el.material.roughness = 1;
          //   }
          //   if(el.material.metalness !== undefined){
          //     el.material.metalness = 0;
          //   }
          // }
        })

        const isSunglassModel = !!model.scene.getObjectByName("Showroom_Table_and_iron_strips001")
        // Add light for sunglass model
        if(isSunglassModel){
          model.scene.add(
            new AmbientLight("#FFFFFF", 2)
          )
        }
        // Hidden collider
        listCollider.forEach(el => {
          el.visible = false
          if(el.children && el.children.length > 0){
            el.children.forEach(o => {
              o.visible = false
            })
          }
        })

        model.scene.userData.isShowroom = true;

        scene.remove(...scene.children.filter(el => el.userData.isShowroom))
        scene.add(model.scene)

        setObject(model)
        onRoomLoaded()

        // Get snapping grid from model
        let snapObject = model.scene.getObjectByName("Snapping_Grid")
        if(!!snapObject){
          snapObject.visible = false;
          let points = buildGrid(snapObject)
          onBuildGrid(points)
        }

        setRoomLoadedPercent(100)
      })
      .catch(err => {
          console.log('MODEL DOWNLOAD ERR', err)
          setRoomLoadedPercent(100)
      })
    }, [])

    useEffect(() => {
      if(!shouldShowHDRI){
        setEnvLoadedPercent(100)
      }
    }, [shouldShowHDRI])

    useEffect(() => {
      onLoading(Math.min(Math.ceil(envLoadedPercent * 0.3 + roomLoadedPercent * 0.7), 100))
    }, [envLoadedPercent, onLoading, roomLoadedPercent])

    const buildGrid = (snapObject) => {
      let snapPoints = []
      if(snapObject){
        snapObject.updateWorldMatrix(true, true);

        let _geo = snapObject['geometry'].clone();
        _geo.applyMatrix4(snapObject.matrixWorld);

        let positions = _geo.attributes.position;
        let normals = _geo.attributes.normal;
        snapPoints = [];
        for (let index = 0; index < positions.count; index++) {
          snapPoints.push(
            {
              point: new Vector3(
                positions.getX(index),
                positions.getY(index),
                positions.getZ(index)
              ),
              normal: new Vector3(
                normals.getX(index),
                normals.getY(index),
                normals.getZ(index)
              )
            }
          );
        }
      }
      return snapPoints;
    }

    return <>
      {/* <Suspense fallback={<CanvasLoading />}>
        {object && (
          <primitive
            object={object.scene}
          />
        )}
      </Suspense> */}

      {
        !shouldShowHDRI && <ambientLight intensity={0.5} />
      }
      
      {shouldShowHDRI && <RoomEnvironment
        project={project}
        object={object}
        onLoading={(percent) => {setEnvLoadedPercent(percent)}}
      />}
    </>
}
export default Room