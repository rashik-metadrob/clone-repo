import { Suspense, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Center, Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {AmbientLight, Box3, Vector2, Vector3} from "three"
import { apllyMaterials, getAssetsUrl, loadModel } from "../../../../../utils/util";
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import { KernelSize } from 'postprocessing'
import _ from "lodash";
import DecorativeRoomEnvironment from "../decorativeRoomEnvironment/DecorativeRoomEnvironment";
import derivative from "antd/es/theme/themes/default";

const DecorativeModel = forwardRef(({
  onLoading = () => {},
  decorative,
  onLoadMaterials = () => {},
  onSelectMaterial = () => {},
  onFitToObject = () => {}
}, ref) => {
    const [object, setObject] = useState()
    const {scene, gl, camera, raycaster} = useThree()
    window.scene = scene
    const meshesForMaterialsRef = useRef()
    const outlinePassRef = useRef()
    const timeOutHandle = useRef()
    const productRef = useRef()

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
      loadModel(getAssetsUrl(decorative.objectUrl), () => {}, gl).then(model => {
        const decorativeMaterial = _.get(decorative, ['attributes', 'decorativeMaterial'], null)
        if(decorativeMaterial){
          apllyMaterials(model.materials, decorativeMaterial)
        }

        meshesForMaterialsRef.current = traverseMeshOfMaterial(model.scene, model.materials)

       
        onLoading(100)
        onLoadMaterials(model.materials)
        
        setObject(model)
      }).catch(err => {
        console.log('MODEL DOWNLOAD ERR', err)
      })
    },[])

    useEffect(() => {
      if(object){
        const debounce = _.debounce(() => {
            if(productRef.current){
                onFitToObject(new Box3().setFromObject(productRef.current))
            }
        }, 200)

        debounce()
      }
    }, [object])

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
        <Suspense fallback={null}>
          <group ref={productRef}>
            <Center>
              {object && <primitive
                object={object.scene}
              />}
            </Center>
          </group>
        </Suspense>
      </Selection>
      <DecorativeRoomEnvironment
        object={object}
      />
    </>
})
export default DecorativeModel