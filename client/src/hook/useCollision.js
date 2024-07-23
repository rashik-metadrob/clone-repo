import { useEffect, useRef } from "react";
import { MetaOctree } from "../components/canvasContainer/components/metaOctree/MetaOctree";
import { Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { getIsObjectsLoaded } from "../redux/modelSlice";
import { checkBox3HasInfinityValue } from "../utils/util";
import _ from "lodash";
import { COLLIDER_PREFIX, FLOOR_PREFIXES } from "../utils/constants";
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';
import { Color } from "three";
import { isMobile } from "react-device-detect";

const useCollision = (onShowSpinner = () => {}) => {
    const objectsOctree = useRef(new MetaOctree());
    const worldOctree = useRef(new MetaOctree());
    const { scene } = useThree()
    const isObjectsLoaded = useSelector(getIsObjectsLoaded)

    useEffect(() => {
        if (scene) {
          const listCollider = []
          scene.traverse(el => {
            if(el?.name.includes(COLLIDER_PREFIX.toLowerCase()) || (isMobile && _.some(FLOOR_PREFIXES, (prefix) => el?.name && (el?.name.toLowerCase().endsWith(prefix) || el?.name.toLowerCase().startsWith(prefix))) )){
              listCollider.push(el)
            }
          })
          if(listCollider.length > 0){
            let newGroups = new Group()
            listCollider.forEach(el => {
              el.updateWorldMatrix(true, true);
              let meshClone = el.clone();
              if(el.parent){
                meshClone.applyMatrix4(el.parent.matrixWorld)
              }
              newGroups.add(meshClone)
    
              if(el.children && el.children.length > 0){
                el.children.forEach(o => {
                  o.updateWorldMatrix(true, true);
                  let meshClone = o.clone();
                  if(o.parent){
                    meshClone.applyMatrix4(o.parent.matrixWorld)
                  }
                  newGroups.add(meshClone)
                })
              }
            })
            worldOctree.current.fromGraphNode(newGroups, true);
            // scene.add(new OctreeHelper(worldOctree.current))
          } else if(!isMobile){
            let groups = scene.children.filter(el => 
              // Not object
              !el.userData.id 
              // Not sound
              && !el.userData.isSound
              // Not transform control
              && !el.isTransformControls
            )
            let newGroups = new Group()
            groups.forEach(el => {
              el.updateWorldMatrix(true, true)
              newGroups.add(el.clone())
            })
            worldOctree.current.fromGraphNode(newGroups, false);
          }
          
          onShowSpinner(0)
        } else {
          onShowSpinner(0)
        }
      }, []);

    useEffect(() => {
        // Wait scene update after load product
        if(isObjectsLoaded){
            onBuildObjectsOctree()
        }
    }, [isObjectsLoaded])
    
    const onBuildObjectsOctree = () => {
        const debounce = _.debounce(() => {
          if(!scene || !objectsOctree.current){
            return
          }
          let groups = scene.children.filter(el => el.userData.id && el.visible)
          if(groups.length === 0){
            return
          }
          const basicMaterial = new MeshBasicMaterial({color: "#FFFF00"})
          if(isObjectsLoaded && groups.length > 0){
            let isValidBox3 = true
            let newGroups = new Group()
            groups.forEach(el => {
              el.updateWorldMatrix(true, true)
              const prodObject = el.getObjectByName(`prod-${el.userData.id}`)
              if(prodObject){
                const box3 = new Box3().setFromObject(prodObject)
                if(!checkBox3HasInfinityValue(box3)){
                  const worldPosition = box3.getCenter(new Vector3());
                  const objectBox = new Mesh(new BoxGeometry(box3.max.x - box3.min.x, box3.max.y - box3.min.y, box3.max.z - box3.min.z), basicMaterial)
                  objectBox.position.copy(worldPosition)
                  newGroups.add(objectBox)
                } else {
                  isValidBox3 = false
                }
              }
            })
            if(isValidBox3){
              if(newGroups.children.length > 0){
                objectsOctree.current.fromGraphNode(newGroups, false);
              }
            } else {
              onBuildObjectsOctree()
            }
          }
        }, 1000)
    
        debounce()
    }

    return {
        objectsOctree,
        worldOctree
    }
}

export default useCollision