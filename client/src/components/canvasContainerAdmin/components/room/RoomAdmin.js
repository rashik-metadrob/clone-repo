import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber";
import { AmbientLight, AnimationMixer, LoopOnce, LoopRepeat, Vector2, Vector3} from "three"
import { apllyMaterials, getAssetsUrl, loadModel } from "../../../../utils/util";
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import { KernelSize } from 'postprocessing'
import _ from "lodash";
import AdminRoomEnvironment from "../adminRoomEnvironment/AdminRoomEnvironment";
import { useSelector } from "react-redux";
import { getIsOverrideMaterialDesktop, getIsOverrideMaterialMobile } from "../../../../redux/configSlice";
import { isMobile } from "react-device-detect";
import { AVAILABLE_ANIMATION, COLLIDER_PREFIX, HIDDEN_PREFIXES, SPAWN_POINT_PREFIX } from "../../../../utils/constants";
import { getTemplateAvailableAnimation } from "../../../../redux/modelSlice";

const RoomAdmin = forwardRef(({
  onLoading = () => {},
  project,
  onListCameras = () => {},
  onLoadMaterials = () => {},
  onSelectMaterial = () => {},
  onListSpawnPoints = () => {}
}, ref) => {
    const [object, setObject] = useState()
    const {scene, gl, camera, raycaster} = useThree()
    window.scene = scene
    const meshesForMaterialsRef = useRef()
    const outlinePassRef = useRef()
    const timeOutHandle = useRef()
    const isOverrideMaterialDesktop = useSelector(getIsOverrideMaterialDesktop)
    const isOverrideMaterialMobile = useSelector(getIsOverrideMaterialMobile)
    const templateAvailableAnimation = useSelector(getTemplateAvailableAnimation)

    const shouldOverrideMaterial = useMemo(() => {
        return (!isMobile && isOverrideMaterialDesktop) || (isMobile && isOverrideMaterialMobile)
    }, [isOverrideMaterialDesktop, isOverrideMaterialMobile])

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
      if(action && templateAvailableAnimation !== AVAILABLE_ANIMATION.PLAY_NEVER){
        action.reset()
        if(templateAvailableAnimation === AVAILABLE_ANIMATION.LOOP_ONE){
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
  },[action, templateAvailableAnimation])

    useEffect(() => {
      return () => {
        if(timeOutHandle.current){
          clearTimeout(timeOutHandle.current)
        }
      }
    }, [])

    useImperativeHandle(ref, () => ({
      highlightMaterial: (name) => {
        if(meshesForMaterialsRef.current && name && meshesForMaterialsRef.current[name]){
          if(timeOutHandle.current){
            clearTimeout(timeOutHandle.current)
          }
          outlinePassRef.current.clearSelection()
          outlinePassRef.current.setSelection(meshesForMaterialsRef.current[name])
          timeOutHandle.current = setTimeout(() => {
            outlinePassRef.current.clearSelection()
          }, 5000)
        } else {
          if(timeOutHandle.current){
            clearTimeout(timeOutHandle.current)
          }
          outlinePassRef.current.clearSelection()
        }
      }
    }));

    useEffect(() => {
      loadModel(getAssetsUrl(project.template), () => {}, gl,shouldOverrideMaterial).then(model => {
        if(model.cameras.length > 0){
          const savedCamera = _.get(project, "cameras", [])
          onListCameras([...model.cameras.filter(el => !el?.name.includes(SPAWN_POINT_PREFIX.toLowerCase())).map((el, index) => {
            el.updateMatrixWorld(true);

            let pos = new Vector3();
            el.getWorldPosition(pos);

            return {
              name: _.get(savedCamera, [index, 'name'], `Wall ${index + 1}`) ,
              thumnail: _.get(savedCamera, [index, 'thumnail'], ``) ,
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
              text: `Wall ${index + 1}`,
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
        let numOfLights = 0;
        model.scene.traverse(el => {
          if(el?.name.includes(COLLIDER_PREFIX.toLowerCase()) || _.some(HIDDEN_PREFIXES, (prefix) => el?.name && (el?.name.toLowerCase().endsWith(prefix) || el?.name.toLowerCase().startsWith(prefix)))){
            listCollider.push(el)
          }
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

        meshesForMaterialsRef.current = traverseMeshOfMaterial(model.scene, model.materials)

        onLoading(100)
        onLoadMaterials(model.materials)
        
        setObject(model)
      }).catch(err => {
        console.log('MODEL DOWNLOAD ERR', err)
      })
    },[])

    useEffect(() => {
      gl.domElement.addEventListener("pointerdown", handlePointerDown)
      return () => {
        gl.domElement.removeEventListener("pointerdown", handlePointerDown)
      }
    }, [gl, scene, onSelectMaterial])

    const handlePointerDown = (e) => {
      const event = e
      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let canvasPointer = new Vector2()
      canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
      canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
      raycaster.setFromCamera(canvasPointer, camera);

      if(scene){
          let intersects = raycaster.intersectObjects([...scene.children], true);
          if(intersects.length > 0){
            const intersect = intersects.find(el => el.object.visible)
            if(intersect){
              let materialName = _.get(intersect.object, ['material', 'name'], "")
              if(materialName){
                onSelectMaterial(materialName)
              }
            }
          }
      }
    }

    const traverseMeshOfMaterial = (objectScene, materials) => {
      let meshes = {}

      let keys = Object.keys(materials)
      keys.forEach(el => {
        meshes[el] = []
      })

      objectScene.traverse((obj) => {
        if (obj.material && keys.includes(obj.material.name)) {
          meshes[obj.material.name].push(obj)
        }
      })

      return meshes
    }

    return <>
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
            <Outline ref={outlinePassRef} visibleEdgeColor={0xFFFFFF} hiddenEdgeColor={0xFFFFFF} blur edgeStrength={10} kernelSize={KernelSize.LARGE}/>
        </EffectComposer>
        {object && (
            <primitive
                object={object.scene}
            />
        )}
      </Selection>
      {
        shouldOverrideMaterial && <ambientLight intensity={0.5} />
      }
      <AdminRoomEnvironment
        object={object}
      />
    </>
})
export default RoomAdmin