import _, { clone } from "lodash"
import { PRODUCT_TYPES, TRAVERSE_TREE_DATA_ACTION_NAME, TREE_DATA_NODE_TYPE } from "./constants"
import { uuidv4 } from "./util"
import ProductIcon from "../assets/icons/ProductIcon"
import DecorativeIcon from "../assets/icons/DecorativeIcon"
import OrtherIcon from "../assets/icons/OrtherIcon"
import TextIcon from "../assets/icons/TextIcon"
import FolderIcon from "../assets/icons/FolderIcon"
import { Box3, Euler, Group, Quaternion, Vector3 } from "three"
import CloseFolderIcon from "../assets/icons/CloseFolderIcon"

export const filterTreeDataWithSearch = (treeDataValue, value, listFilterGroup = []) => {
    let data = _.cloneDeep(treeDataValue, value)
    data = data.filter(o => 
        o.nodeType === TREE_DATA_NODE_TYPE.FOLDER 
        || (
            (!value || (value && o.title && o.title.toLowerCase().includes(value.toLowerCase())))
            && (listFilterGroup.length === 0 || (listFilterGroup.length > 0 && listFilterGroup.includes(o.nodeType)))
        )
    )
    
    data = data.map(el => {
        filterTreeDataNodeWithSearch(el, value, listFilterGroup)

        return el
    })

    return data
}

export const filterTreeDataNodeWithSearch = (treeDataNode, value, listFilterGroup) => {
    if(treeDataNode.children){
        treeDataNode.children = treeDataNode.children.filter(o => 
            o.nodeType === TREE_DATA_NODE_TYPE.FOLDER 
            || (
                (!value || (value && o.title && o.title.toLowerCase().includes(value.toLowerCase())))
                && (listFilterGroup.length === 0 || (listFilterGroup.length > 0 && listFilterGroup.includes(o.nodeType)))
            )
        )

        
        for(let i = 0; i < treeDataNode.children.length; i++){
            filterTreeDataNodeWithSearch(treeDataNode.children[i], value, listFilterGroup)
        }
    }
}

export const getNodeTypeOfItemFromListProducts = (product) => {
    const type = _.get(product, ['type'], '')

    switch(type) {
        case PRODUCT_TYPES.PRODUCTS:
            return TREE_DATA_NODE_TYPE.PRODUCT
        case PRODUCT_TYPES.DECORATIVES:
            return TREE_DATA_NODE_TYPE.DECORATIVE
        case PRODUCT_TYPES.ELEMENT:
            return TREE_DATA_NODE_TYPE.OTHER
        default:
            return TREE_DATA_NODE_TYPE.FOLDER
      }
}

export const initTreeDataForProject = (projectData) => {
    const listProducts = _.get(projectData, ['listProducts'], [])
    const listTexts = _.get(projectData, ['listTexts'], [])
    const listPlaceholders = _.get(projectData, ['listPlaceholders'], [])

    let tree = []

    listProducts.forEach(el => {
        tree.push(
            { 
                title: el.name, 
                key: el.id,
                nodeType: getNodeTypeOfItemFromListProducts(el),
                id: el.id,
                parent: null
            }
        )
    })
    listTexts.forEach(el => {
        tree.push(
            { 
                title: _.get(el, ['texts', 0, 'text']), 
                key: el.id,
                nodeType: TREE_DATA_NODE_TYPE.TEXT,
                id: el.id,
                parent: null
            }
        )
    })
    listPlaceholders.forEach(el => {
        tree.push(
            { 
                title: el.name, 
                key: el.id,
                nodeType: TREE_DATA_NODE_TYPE.PLACEHOLDER,
                id: el.id,
                parent: null
            }
        )
    })

    return tree
}

export const unGroupFolder = (data, node) => {
    let cloneData = _.cloneDeep(data)
    
    let items = node.children
    items.forEach(el => {
        el.parent = node.parent
    })
    if(!node.parent){
        cloneData.unshift(...items)
    } else {
        cloneData = traverseTreeDataAndHandleAction(cloneData, TRAVERSE_TREE_DATA_ACTION_NAME.UNGROUP, {parent: node.parent, items})
    }

    return cloneData
}

export const createGroupFolder = (id, items, groupName) => {
    return { 
        title: groupName, 
        key: id,
        nodeType: TREE_DATA_NODE_TYPE.FOLDER,
        id: id,
        parent: null,
        children: items,
        position: {
            x: 0,
            y: 0,
            z: 0,
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0,
        },
        scale: {
            x: 1,
            y: 1,
            z: 1,
        },
        uniformScale: 1,
        axesHelper: false,
    }
}

export const addNewGroupToData = (data, items, groupName, id) => {
    let cloneData = _.cloneDeep(data)
    const firstNode = _.get(items, [0])
    if(!firstNode.parent){
        items.forEach(el => {
            el.parent = id
        })
        const parent = createGroupFolder(id, items, groupName)

        cloneData.unshift(parent)
    } else {
        cloneData = traverseTreeDataAndHandleAction(cloneData, TRAVERSE_TREE_DATA_ACTION_NAME.ADD_NEW_GROUP, {parent: firstNode.parent, items, groupName: groupName})
    }

    return cloneData
}

export const traverseTreeDataAndHandleAction = (data, action, actionData) => {
    let cloneData = _.cloneDeep(data)
    if(action === TRAVERSE_TREE_DATA_ACTION_NAME.ADD_NEW_GROUP){
        const {
            parent,
            items,
            groupName
        } = actionData

        if(!parent){
            const id = uuidv4()

            items.forEach(el => {
                el.parent = id
            })
            const parent = createGroupFolder(id, items, groupName)

            cloneData.unshift(parent)
        } else {
            for(let i = 0; i < cloneData.length; i++){
                cloneData[i] = traverseNodeDataAndHandleAction(cloneData[i], action, actionData)
            }
        }
    } else {
        if(action === TRAVERSE_TREE_DATA_ACTION_NAME.UNGROUP){
            const {
                parent,
                items
            } = actionData
    
            if(!parent){
                items.forEach(el => {
                    el.parent = null
                })
                cloneData.unshift(...items)
            } else {
                for(let i = 0; i < cloneData.length; i++){
                    cloneData[i] = traverseNodeDataAndHandleAction(cloneData[i], action, actionData)
                }
            }
        }
    }

    return cloneData
}

export const traverseNodeDataAndHandleAction = (node, action, actionData) => {
    if(action === TRAVERSE_TREE_DATA_ACTION_NAME.ADD_NEW_GROUP){
        const {
            parent,
            items,
            groupName
        } = actionData
        if(node.children){
            if(node.id === parent){
                const id = uuidv4()

                items.forEach(el => {
                    el.parent = id
                })
                const parent = createGroupFolder(id, items, groupName)
                parent.parent = node.id
                node.children = [..._.get(node, ['children'], [])]
                node.children.unshift(parent)
            } else {
                for(let i = 0; i < node.children.length; i++){
                    node.children[i] = traverseNodeDataAndHandleAction(node.children[i], action, actionData)
                }
            }
        }
    } else if(action === TRAVERSE_TREE_DATA_ACTION_NAME.UNGROUP){
        const {
            parent,
            items
        } = actionData
        if(node.children){
            if(node.id === parent){
                items.forEach(el => {
                    el.parent = parent
                })
                node.children = [..._.get(node, ['children'], [])]
                node.children.unshift(...items)
            } else {
                for(let i = 0; i < node.children.length; i++){
                    node.children[i] = traverseNodeDataAndHandleAction(node.children[i], action, actionData)
                }
            }
        }
    }
    return node
}

export const removeNodeOfTreeData = (data, id) => {
    let node = _.find(data, {id})
    if(node){
        return data.filter(el => el.id !== id)
    } else {
        data.forEach(el => {
            if(el.children){
                el.children = removeNodeOfTreeData(el.children, id)
            }
        })

        return data
    }
}

export const findNodeOfTreeData = (data, id) => {
    let node = _.find(data, {id})
    if(node){
        return node
    } else {
        data.forEach(el => {
            if(el.children){
                let tmp = findNodeOfTreeData(el.children, id)
                if(tmp){
                    node = tmp
                }
            }
        })
    }

    return node
}

export const isNodeDataContainKey = (node, key) => {
    if(node) {
        if(node.id === key) {
            return true
        } else if(node.children){
            if(_.some(node.children, (el) => el.id === key || isNodeDataContainKey(el, key))){
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

export const filterCheckedKeysNotInsideAnother = (keys, data) => {
    let cloneKeys = _.cloneDeep(keys)

    cloneKeys = cloneKeys.map(key => {
        const needToCheckKeys = cloneKeys.filter(el => el !== key)

        let check = false
        needToCheckKeys.forEach(el => {
            const node = findNodeOfTreeData(data, el)
            if(isNodeDataContainKey(node, key)){
                check = true
            }
        })

        if(check){
            return null
        } else {
            return key
        }
    })

    return cloneKeys.filter(el => !!el)
}

export const loop = (data, key, callback) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children, key, callback);
      }
    }
};

export const onDropNode = (data, info) => {
    let cloneData = _.cloneDeep(data)

    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    // the drop position relative to the drop node, inside 0, top -1, bottom 1
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); 

    let dragObj = findNodeOfTreeData(cloneData, dragKey)
    cloneData = removeNodeOfTreeData(cloneData, dragKey)

    // if (!info.dropToGap) {
    //     // Drop on the content
    //     loop(cloneData, dropKey, (item) => {
    //         item.children = item.children || []
    //         // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
    //         dragObj.parent = item.id
    //         item.children.unshift(dragObj)
    //     });
    // } else {
        let ar = [];
        let i;
        let item;
        loop(cloneData, dropKey, (_item, index, arr) => {
            ar = arr
            i = index
            item = _item
        });
        if (dropPosition === -1) {
            // Drop on the top of the drop node
            dragObj.parent = item.parent
            ar.splice(i, 0, dragObj)
        } else {
            // Drop on the bottom of the drop node
            dragObj.parent = item.parent
            ar.splice(i + 1, 0, dragObj)
        }
    // }

    return cloneData
}

export const traverseTreeData = (keys, nodeData) => {
    if(nodeData?.key){
        keys.push(nodeData.key)
    }

    if(_.has(nodeData, ['children'])){
        nodeData.children.forEach(el => {
            traverseTreeData(keys, el)
        })

        return keys
    } else {
        return keys
    }
}

export const getColorOfNode = (node) => {
    const type = _.get(node, ['nodeType'])
    switch(type) {
        case TREE_DATA_NODE_TYPE.PRODUCT:
            return '#00F6FF'
        case TREE_DATA_NODE_TYPE.PLACEHOLDER:
            return '#00F6FF'
        case TREE_DATA_NODE_TYPE.DECORATIVE:
            return '#FFFFFF'
        case TREE_DATA_NODE_TYPE.OTHER:
            return '#FFFFFF'
        case TREE_DATA_NODE_TYPE.TEXT:
            return '#FF6B00'
        default:
            if(_.get(node, ['children', 'length'], 0) > 0 && !_.find(_.get(node, ['children'], []), el => el.nodeType !== TREE_DATA_NODE_TYPE.PRODUCT)){
                return '#00F6FF'
            } else {
                return '#FFFFFF'
            }
    }
}

export const getIconOfNode = (node, isExpanded = false) => {
    const type = _.get(node, ['nodeType'])
    switch(type) {
        case TREE_DATA_NODE_TYPE.PRODUCT:
            return <div className="object-list-icon"><ProductIcon color={getColorOfNode(node)}/></div>
        case TREE_DATA_NODE_TYPE.DECORATIVE:
            return <div className="object-list-icon"><DecorativeIcon/></div>
        case TREE_DATA_NODE_TYPE.OTHER:
            return <div className="object-list-icon"><OrtherIcon/></div>
        case TREE_DATA_NODE_TYPE.TEXT:
            return <div className="object-list-icon"><TextIcon color={getColorOfNode(node)}/></div>
        default:
            if(isExpanded) {
                return <div className="object-list-icon"><FolderIcon color={getColorOfNode(node)}/></div>
            } else {
                return <div className="object-list-icon"><CloseFolderIcon color={getColorOfNode(node)}/></div>
            }
            
    }
}

export const bindDataToTree = (tree, listProducts, listTexts, listPlaceholders) => {
    let data = _.cloneDeep(tree)

    let allKeys = []

    data.forEach(el => {
        allKeys.push(...traverseTreeData([], el))
    })
    
    allKeys = _.uniqBy(allKeys, el => el)

    allKeys.forEach(key => {
        const node = findNodeOfTreeData(data, key)

        if(node && node.nodeType !== TREE_DATA_NODE_TYPE.FOLDER){
             // If exist sync name data
            let sceneProdData = listProducts.find(el => el.id === key)
            if(sceneProdData) {
                node.title = _.get(sceneProdData, ['name'])
            }

            let sceneTextData = listTexts.find(el => el.id === key)
            if(sceneTextData) {
                node.title = _.get(sceneTextData, ['texts', 0, 'text'])
            }

            let scenePlaceholderData = listPlaceholders.find(el => el.id === key)
            if(scenePlaceholderData) {
                node.title = _.get(scenePlaceholderData, ['name'])
            }

            // If no exist, remove
            if(!sceneProdData && !sceneTextData && !scenePlaceholderData){
                data = removeNodeOfTreeData(data, key)
            }
        }
    })

    listProducts.forEach(el => {
        if(!allKeys.includes(el.id)){
            data.push({ 
                title: el.name, 
                key: el.id,
                nodeType: getNodeTypeOfItemFromListProducts(el),
                id: el.id,
                parent: null
            })
        }
    })

    listTexts.forEach(el => {
        if(!allKeys.includes(el.id)){
            data.push({ 
                title: _.get(el, ['texts', 0, 'text']), 
                key: el.id,
                nodeType: TREE_DATA_NODE_TYPE.TEXT,
                id: el.id,
                parent: null
            })
        }
    })

    listPlaceholders.forEach(el => {
        console.log('el', el)
        if(!allKeys.includes(el.id)){
            data.push({ 
                title: _.get(el, ['name']), 
                key: el.id,
                nodeType: TREE_DATA_NODE_TYPE.PLACEHOLDER,
                id: el.id,
                parent: null
            })
        }
    })

    return data
}

export const getAllGroupName = (tree) => {
    let data = _.cloneDeep(tree)

    let allKeys = []

    data.forEach(el => {
        allKeys.push(...traverseTreeData([], el))
    })

    return allKeys.map(key => {
        const node = findNodeOfTreeData(data, key)

        if(node?.nodeType === TREE_DATA_NODE_TYPE.FOLDER && _.get(node, ['title'])){
            return node.title
        }

        return null
    }).filter(el => !!el)
}

export const checkGroupIsUniqueName = (tree, name) => {
    const allGroupNames = getAllGroupName(tree)

    return !allGroupNames.includes(name)
}

export const getRandomGroupName = (tree) => {
    let index = 1
    let name = `Group ${index}`

    while(!checkGroupIsUniqueName(tree, name)){
        index++
        name = `Group ${index}`
    }

    return name
}

export const syncOffsetChangeFromGroupToProdAndText = (tree, id, changeOfNode, listProducts, listTexts, listPlaceholders) => {
    let newListProducts = _.cloneDeep(listProducts)
    let newListTexts = _.cloneDeep(listTexts)
    let newListPlaceholders = _.cloneDeep(listPlaceholders)

    const node = findNodeOfTreeData(tree, id)
    if(node) {
        const keys = traverseTreeData([], node)
        newListProducts = newListProducts.map((el) => {
            if(keys.includes(el.id)){
                return {
                    ...el,
                    position: {
                        x: _.get(el, ['position', 'x'], 0) + _.get(changeOfNode, ['position', 'x'], 0),
                        y: _.get(el, ['position', 'y'], 0) + _.get(changeOfNode, ['position', 'y'], 0),
                        z: _.get(el, ['position', 'z'], 0) + _.get(changeOfNode, ['position', 'z'], 0)
                    },
                    scale: {
                        x: _.get(el, ['scale', 'x'], 0) + _.get(changeOfNode, ['scale', 'x'], 0),
                        y: _.get(el, ['scale', 'y'], 0) + _.get(changeOfNode, ['scale', 'y'], 0),
                        z: _.get(el, ['scale', 'z'], 0) + _.get(changeOfNode, ['scale', 'z'], 0)
                    },
                    uniformScale: _.get(el, ['uniformScale'], 0) + _.get(changeOfNode, ['uniformScale'], 0)
                }
            } else {
                return el
            }
        })

        newListTexts = newListTexts.map((el) => {
            if(keys.includes(el.id)){
                return {
                    ...el,
                    position: {
                        x: _.get(el, ['position', 'x'], 0) + _.get(changeOfNode, ['position', 'x'], 0),
                        y: _.get(el, ['position', 'y'], 0) + _.get(changeOfNode, ['position', 'y'], 0),
                        z: _.get(el, ['position', 'z'], 0) + _.get(changeOfNode, ['position', 'z'], 0)
                    },
                    scale: {
                        x: _.get(el, ['scale', 'x'], 0) + _.get(changeOfNode, ['scale', 'x'], 0),
                        y: _.get(el, ['scale', 'y'], 0) + _.get(changeOfNode, ['scale', 'y'], 0),
                        z: _.get(el, ['scale', 'z'], 0) + _.get(changeOfNode, ['scale', 'z'], 0)
                    },
                    uniformScale: _.get(el, ['uniformScale'], 0) + _.get(changeOfNode, ['uniformScale'], 0)
                }
            } else {
                return el
            }
        })

        listPlaceholders = listPlaceholders.map((el) => {
            if(keys.includes(el.id)){
                return {
                    ...el,
                    position: {
                        x: _.get(el, ['position', 'x'], 0) + _.get(changeOfNode, ['position', 'x'], 0),
                        y: _.get(el, ['position', 'y'], 0) + _.get(changeOfNode, ['position', 'y'], 0),
                        z: _.get(el, ['position', 'z'], 0) + _.get(changeOfNode, ['position', 'z'], 0)
                    },
                    scale: {
                        x: _.get(el, ['scale', 'x'], 0) + _.get(changeOfNode, ['scale', 'x'], 0),
                        y: _.get(el, ['scale', 'y'], 0) + _.get(changeOfNode, ['scale', 'y'], 0),
                        z: _.get(el, ['scale', 'z'], 0) + _.get(changeOfNode, ['scale', 'z'], 0)
                    },
                    uniformScale: _.get(el, ['uniformScale'], 0) + _.get(changeOfNode, ['uniformScale'], 0)
                }
            } else {
                return el
            }
        })

        if(
            _.get(changeOfNode, ['rotation', 'x'], 0) !== 0 
            || _.get(changeOfNode, ['rotation', 'y'], 0) !== 0 
            || _.get(changeOfNode, ['rotation', 'z'], 0) !== 0
        ) {
            const box = new Box3()
            const group = new Group()

            newListProducts.forEach(el => {
                if(keys.includes(el.id)){
                    const object = window.scene.children.find(o => o?.userData?.id === el.id)
                    if(object){
                        box.expandByObject(object)
                        group.add(object.clone())
                    }
                }
            })
            newListTexts.forEach(el => {
                if(keys.includes(el.id)){
                    const object = window.scene.children.find(el => el?.userData?.id === el.id)
                    if(object){
                        box.expandByObject(object)
                        group.add(object.clone())
                    }
                }
            })
            newListPlaceholders.forEach(el => {
                if(keys.includes(el.id)){
                    const object = window.scene.children.find(el => el?.userData?.id === el.id)
                    if(object){
                        box.expandByObject(object)
                        group.add(object.clone())
                    }
                }
            })

            const center = box.getCenter(new Vector3())
            group.position.copy(center)
            group.children.forEach(el => {
                el.position.copy(el.position.sub(center))
            })

            if(_.get(changeOfNode, ['rotation', 'x'], 0) !== 0){
                group.rotateX(_.get(changeOfNode, ['rotation', 'x'], 0))
            } 
            if(_.get(changeOfNode, ['rotation', 'y'], 0) !== 0){
                group.rotateY(_.get(changeOfNode, ['rotation', 'y'], 0))
            } 
            if(_.get(changeOfNode, ['rotation', 'z'], 0) !== 0){
                group.rotateZ(_.get(changeOfNode, ['rotation', 'z'], 0))
            }

            group.children.forEach(el => {
                const position = new Vector3(); // create one and reuse it
                const quaternion = new Quaternion();
                const scale = new Vector3();
                el.updateWorldMatrix(true, true)
                el.matrixWorld.decompose( position, quaternion, scale );
                const rotEuler = new Euler().setFromQuaternion(quaternion)

                let objectData = newListProducts.find(o => o.id === el.userData.id)
                if(!objectData) {
                    objectData = newListTexts.find(o => o.id === el.userData.id)
                }
                if(!objectData) {
                    objectData = newListPlaceholders.find(o => o.id === el.userData.id)
                }

                if(objectData){
                    objectData.position = vector3ToJson(position)
                    objectData.rotation = vector3ToJson(rotEuler)
                }
            })
        }
    }

    return {
        newListProducts,
        newListTexts,
        newListPlaceholders
    }
}

const vector3ToJson = (v) => {
    return {x: v.x, y: v.y, z: v.z}
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld = false){
  
    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }
  
    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset
  
    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }
  
    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}