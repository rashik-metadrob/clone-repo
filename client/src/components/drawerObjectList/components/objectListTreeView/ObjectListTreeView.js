import "./styles.scss"
import { useDispatch, useSelector } from "react-redux"
import { getIsLoadedInitData, getListPlaceholders, getListProducts, getListTexts, getSelectedObject, getTreeData, setIsShowDrawerObjectDetail, setListPlaceholders, setListProducts, setListTexts, setSelectedObject, setTreeData, syncDataOfTreeAndObjects } from "../../../../redux/modelSlice"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Checkbox, Dropdown, Input, Modal, Tree, notification } from "antd"
import FolderIcon from "../../../../assets/icons/FolderIcon"
import { EVENT_NAME, OBJECT_LIST_ACTION_MODE, PRODUCT_TYPES, TRAVERSE_TREE_DATA_ACTION_NAME, TREE_DATA_NODE_TYPE } from "../../../../utils/constants"
import _, { forEach } from "lodash"
import ProductIcon from "../../../../assets/icons/ProductIcon"
import TextIcon from "../../../../assets/icons/TextIcon"
import DecorativeIcon from "../../../../assets/icons/DecorativeIcon"
import OrtherIcon from "../../../../assets/icons/OrtherIcon"
import ObjectListSearchIcon from "../../../../assets/images/project/object-list-search.svg"
import ObjectListFilterIcon from "../../../../assets/images/project/object-list-filter.svg"
import ObjectListTrashIcon from "../../../../assets/images/project/object-list-trash.svg"
import ObjectListInfoIcon from "../../../../assets/images/project/object-list-info.svg"
import ObjectListTrashNodeIcon from "../../../../assets/images/project/object-list-trash-node.svg"
import ObjectListFolderIcon from "../../../../assets/images/project/object-list-folder-icon.svg"
import ObjectListFolderOpenIcon from "../../../../assets/images/project/object-list-folder-open-icon.svg"
import ObjectListVisibleIcon from "../../../../assets/images/project/object-list-visible.svg"
import ObjectListInvisibleIcon from "../../../../assets/images/project/object-list-invisible.svg"
import { addNewGroupToData, bindDataToTree, checkGroupIsUniqueName, filterCheckedKeysNotInsideAnother, filterTreeDataWithSearch, findNodeOfTreeData, getColorOfNode, getIconOfNode, getRandomGroupName, loop, onDropNode, removeNodeOfTreeData, traverseTreeData, unGroupFolder } from "../../../../utils/treeData.util"

import ObjectListActionVisibleIcon from "../../../../assets/images/project/object-list-action-visible.svg"
import ObjectListActionInvisibleIcon from "../../../../assets/images/project/object-list-action-invisible.svg"
import ObjectListActionUnlockIcon from "../../../../assets/images/project/object-list-unlock.svg"
import ObjectListActionLockIcon from "../../../../assets/images/project/object-list-lock.svg"
import ObjectListActionTrashIcon from "../../../../assets/images/project/object-list-action-trash.svg"
import { uuidv4 } from "../../../../utils/util"
import { useAppDispatch } from "../../../../redux"

const LIST_FILTER_GROUP = [
    {
        key: TREE_DATA_NODE_TYPE.DECORATIVE,
        label: "Decorative"
    },
    {
        key: TREE_DATA_NODE_TYPE.PRODUCT,
        label: "Product"
    },
    {
        key: TREE_DATA_NODE_TYPE.TEXT,
        label: "Text"
    },
    {
        key: TREE_DATA_NODE_TYPE.OTHER,
        label: "Other"
    }
]

const ObjectListTreeView = () => {
    const dispatch = useAppDispatch()
    const listProducts = useSelector(getListProducts)
    const listPlaceholders = useSelector(getListPlaceholders)
    const listTexts = useSelector(getListTexts)
    const isLoadedInitData = useSelector(getIsLoadedInitData)

    const treeData = useSelector(getTreeData)
    const [listCheckedKeys, setListCheckedKeys] = useState([])
    const [listExpandedKeys, setListExpandedKeys] = useState([])
    const selectedObject = useSelector(getSelectedObject)
    const [objectListActionMode, setObjectListActionMode] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const [listFilterGroup, setListFilterGroup] = useState([])
    const [editNameKeys, setEditNameKeys] = useState([])

    const treeDataRender = useMemo(() => {
        if(!searchValue && listFilterGroup.length === 0){
            return treeData
        } else {
            return filterTreeDataWithSearch(treeData, searchValue, listFilterGroup)
        }
    }, [treeData, searchValue, listFilterGroup])

    const isAllSelectedVisible = useMemo(() => {
        return !_.some(listCheckedKeys, key => {
            let sceneProdData = listProducts.find(el => el.id === key)
            let sceneTextData = listTexts.find(el => el.id === key)
            let scenePlaceholderData = listPlaceholders.find(el => el.id === key)

            if(sceneProdData){
                return !_.get(sceneProdData, ['visible'], true)
            }
            if(sceneTextData){
                return !_.get(sceneTextData, ['visible'], true)
            }
            if(scenePlaceholderData){
                return !_.get(scenePlaceholderData, ['visible'], true)
            }

            return false
        })
    }, [listCheckedKeys, listProducts, listTexts, listPlaceholders])

    const isCheckAll = useMemo(() => {

        return !_.some(
            _.filter(listProducts, el => el.type === PRODUCT_TYPES.PRODUCTS || el.type === PRODUCT_TYPES.DECORATIVES || el.type === PRODUCT_TYPES.ELEMENT),
            el => !listCheckedKeys.includes(el.id)
        ) && !_.some(
            listTexts,
            el => !listCheckedKeys.includes(el.id)
        ) && !_.some(
            listPlaceholders,
            el => !listCheckedKeys.includes(el.id)
        )

    }, [listProducts, listTexts, listCheckedKeys, listPlaceholders])

    const oneGroupKeyInListCheckedKeys = useMemo(() => {
        if(listCheckedKeys.length > 1){
            let listUniqueCheckedKeys = filterCheckedKeysNotInsideAnother(listCheckedKeys, treeData)
            if(listUniqueCheckedKeys.length === 1){
                return listUniqueCheckedKeys[0]
            }

            let listParents = listCheckedKeys.map(el => _.get(findNodeOfTreeData(treeData, el.id), ['parent']))
            listParents = _.uniqBy(listParents, el => el)
            if(listParents.length === 1){
                const parentNode = findNodeOfTreeData(treeData, listParents[0])

                if(_.get(parentNode, ['children', 'length'], 0) === listCheckedKeys.length){
                    return listParents[0]
                }
            }
        }
        return null
    }, [treeData, listCheckedKeys])

    const onBindDataToTree = useCallback(() => {
        if(isLoadedInitData){
            const data = bindDataToTree(treeData, listProducts, listTexts, listPlaceholders)
            if(!_.isEqual(data, treeData)){
                onTreeDataChange(data)
            }
        }
    }, [treeData, listProducts, listTexts, listPlaceholders, isLoadedInitData])

    useEffect(() => {
       // Sync data if delete or add 
       onBindDataToTree()
    }, [onBindDataToTree])

    const onTreeDataChange = (newData) => {
        dispatch(setTreeData(newData))
    }

    const onUnGroup = useCallback((groupKey) => {
        if(groupKey) {
            let data = _.cloneDeep(treeData)
            const node = findNodeOfTreeData(data, groupKey)
            
            if(node.nodeType === TREE_DATA_NODE_TYPE.FOLDER) {
                data = removeNodeOfTreeData(data, groupKey)
                data = unGroupFolder(data, node)

                const childrenIds = _.map(_.get(node, ['children'], []), (el) => el.id)

                const groupId = node.id
                let cloneProducts = _.cloneDeep(listProducts)
                cloneProducts = cloneProducts.map(el => {
                    if(childrenIds.includes(el.id)) {
                        if(!el.transformHistories) {
                            el.transformHistories = []
                        }

                        const oldTransform = _.find(el.transformHistories, {groupId})
                        if(oldTransform){
                            el = {
                                ...el,
                                ...oldTransform.transform
                            }
                            el.transformHistories = el.transformHistories.filter(el => el.groupId !== groupId)
                        }
                    }

                    return el
                })

                let cloneTexts = _.cloneDeep(listTexts)
                cloneTexts = cloneTexts.map(el => {
                    if(childrenIds.includes(el.id)) {
                        if(!el.transformHistories) {
                            el.transformHistories = []
                        }

                        const oldTransform = _.find(el.transformHistories, {groupId})
                        if(oldTransform){
                            el = {
                                ...el,
                                ...oldTransform.transform
                            }
                            el.transformHistories = el.transformHistories.filter(el => el.groupId !== groupId)
                        }
                    }

                    return el
                })

                let clonePlaceholders = _.cloneDeep(listPlaceholders)
                clonePlaceholders = clonePlaceholders.map(el => {
                    if(childrenIds.includes(el.id)) {
                        if(!el.transformHistories) {
                            el.transformHistories = []
                        }

                        const oldTransform = _.find(el.transformHistories, {groupId})
                        if(oldTransform){
                            el = {
                                ...el,
                                ...oldTransform.transform
                            }
                            el.transformHistories = el.transformHistories.filter(el => el.groupId !== groupId)
                        }
                    }

                    return el
                })
                
                dispatch(syncDataOfTreeAndObjects({
                    treeData: data,
                    listProducts: cloneProducts,
                    listTexts: cloneTexts,
                    listPlaceholders: clonePlaceholders,
                }))
            } else {
                notification.warning({
                    message: "Selected node isn't a Folder!"
                })
            }
        } else {
            notification.warning({
                message: "Selected node isn't a Folder!"
            })
        }

        setListCheckedKeys([])
        setListExpandedKeys([])
    }, [treeData])

    const onGroup = useCallback(() => {
        let listUniqueCheckedKeys = filterCheckedKeysNotInsideAnother(listCheckedKeys, treeData)

        if(listUniqueCheckedKeys.length === 0){
            notification.warning({
                message: "Select one or more node to group!"
            })
        } else {
            const items = []
            let data = _.cloneDeep(treeData)
            listUniqueCheckedKeys.forEach(key => {
                const node = findNodeOfTreeData(data, key)
                if(node){
                    items.push(node)
                }
            })
            listUniqueCheckedKeys.forEach(key => {
                data = removeNodeOfTreeData(data, key)
            })

            const groupId = uuidv4()
            if(items.length > 0){
                data = addNewGroupToData(data, items, getRandomGroupName(treeData), groupId)
            }

            let cloneProducts = _.cloneDeep(listProducts)
            cloneProducts = cloneProducts.map(el => {
                if(listUniqueCheckedKeys.includes(el.id)) {
                    if(!el.transformHistories) {
                        el.transformHistories = []
                    }

                    const oldTransform = _.find(el.transformHistories, {groupId})
                    if(oldTransform){
                        oldTransform.transform = {
                            position: _.get(el, ['position']),
                            rotation: _.get(el, ['rotation']),
                            scale: _.get(el, ['scale']),
                            uniformScale: _.get(el, ['uniformScale']),
                        }
                    } else {
                        el.transformHistories.push({
                            groupId,
                            transform: {
                                position: _.get(el, ['position']),
                                rotation: _.get(el, ['rotation']),
                                scale: _.get(el, ['scale']),
                                uniformScale: _.get(el, ['uniformScale']),
                            }
                        })
                    }
                }

                return el
            })

            let cloneTexts = _.cloneDeep(listTexts)
            cloneTexts = cloneTexts.map(el => {
                if(listUniqueCheckedKeys.includes(el.id)) {
                    if(!el.transformHistories) {
                        el.transformHistories = []
                    }

                    const oldTransform = _.find(el.transformHistories, {groupId})
                    if(oldTransform){
                        oldTransform.transform = {
                            position: _.get(el, ['position']),
                            rotation: _.get(el, ['rotation']),
                            scale: _.get(el, ['scale']),
                            uniformScale: _.get(el, ['uniformScale']),
                        }
                    } else {
                        el.transformHistories.push({
                            groupId,
                            transform: {
                                position: _.get(el, ['position']),
                                rotation: _.get(el, ['rotation']),
                                scale: _.get(el, ['scale']),
                                uniformScale: _.get(el, ['uniformScale']),
                            }
                        })
                    }
                }

                return el
            })

            let clonePlaceholders = _.cloneDeep(listPlaceholders)
            clonePlaceholders = clonePlaceholders.map(el => {
                if(listUniqueCheckedKeys.includes(el.id)) {
                    if(!el.transformHistories) {
                        el.transformHistories = []
                    }

                    const oldTransform = _.find(el.transformHistories, {groupId})
                    if(oldTransform){
                        oldTransform.transform = {
                            position: _.get(el, ['position']),
                            rotation: _.get(el, ['rotation']),
                            scale: _.get(el, ['scale']),
                            uniformScale: _.get(el, ['uniformScale']),
                        }
                    } else {
                        el.transformHistories.push({
                            groupId,
                            transform: {
                                position: _.get(el, ['position']),
                                rotation: _.get(el, ['rotation']),
                                scale: _.get(el, ['scale']),
                                uniformScale: _.get(el, ['uniformScale']),
                            }
                        })
                    }
                }

                return el
            })

            dispatch(syncDataOfTreeAndObjects({
                treeData: data,
                listProducts: cloneProducts,
                listTexts: cloneTexts,
                listPlaceholders: clonePlaceholders
            }))
        }

        setListCheckedKeys([])
        setListExpandedKeys([])
    }, [listCheckedKeys, treeData, listProducts, listTexts, listPlaceholders])

    const handleKeyDown = useCallback((e) => {
        if(e.code === "KeyG" && e.altKey && (e.ctrlKey || e.metaKey)){
            onUnGroup(oneGroupKeyInListCheckedKeys)
        } else if(e.code === "KeyG" && (e.ctrlKey || e.metaKey)){
            e.preventDefault()
            onGroup()
        }
    }, [onUnGroup, oneGroupKeyInListCheckedKeys, onGroup])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleKeyDown])

    const onCheckAllChange = (value) => {
        if(value){
            const keys = []
            _.forEach(
                _.filter(listProducts, el => el.type === PRODUCT_TYPES.PRODUCTS || el.type === PRODUCT_TYPES.DECORATIVES || el.type === PRODUCT_TYPES.ELEMENT),
                el => keys.push(el.id)
            ) 
            _.forEach(
                listTexts,
                el => keys.push(el.id)
            ) 
            _.forEach(
                listPlaceholders,
                el => keys.push(el.id)
            ) 
            setListCheckedKeys(keys)
        } else {
            setListCheckedKeys([])
        }
    }

    const onDeleteSelectedObjects = (keys) => {
        Modal.confirm({
            title: "Are you sure to delete selected objects?",
            centered: true,
            className: "dialog-confirm",
            onOk: () => {
                let listUniqueKeys = filterCheckedKeysNotInsideAnother(keys, treeData)
                
                let data = _.cloneDeep(treeData)
                if(oneGroupKeyInListCheckedKeys){
                    data = removeNodeOfTreeData(data, oneGroupKeyInListCheckedKeys)
                } else {
                    listUniqueKeys.forEach(key => {
                        data = removeNodeOfTreeData(data, key)
                    })
                }
                
                onTreeDataChange(data)

                const newListProds = listProducts.filter(el => !keys.includes(el.id))
                const newListPlaceholders = listPlaceholders.filter(el => !keys.includes(el.id))
                const newListTexts = listTexts.filter(el => !keys.includes(el.id))

                dispatch(setListProducts(newListProds))
                dispatch(setListTexts(newListTexts))
                dispatch(setListPlaceholders(newListPlaceholders))
            }
        })
    }

    const onDeleteNode = (e, nodeData) => {
        e.stopPropagation()

        onDeleteSelectedObjects(traverseTreeData([], nodeData))
    }

    const checkAllKeysReferToUnlockObject = useCallback((keys) => {
        return !_.some(keys, key => {
            let sceneProdData = listProducts.find(el => el.id === key)
            let scenePlaceholderData = listPlaceholders.find(el => el.id === key)
            let sceneTextData = listTexts.find(el => el.id === key)

            if(sceneProdData){
                return _.get(sceneProdData, ['isLock'], false)
            }
            if(sceneTextData){
                return _.get(sceneTextData, ['isLock'], false)
            }
            if(scenePlaceholderData){
                return _.get(scenePlaceholderData, ['isLock'], false)
            }

            return false
        })
    }, [listProducts, listTexts, listPlaceholders])

    const onToggleLockNode = (e, nodeData) => {
        e.preventDefault()
        onHandleLockAndUnlockSelectedObject(traverseTreeData([], nodeData))
    }

    const onHandleLockAndUnlockSelectedObject = (keys) => {
        const isAllKeysVisible = checkAllKeysReferToUnlockObject(keys)

        if(isAllKeysVisible){
            // Lock
            const newListProds = _.cloneDeep(listProducts)
            newListProds.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['isLock'], true)
                }
            })
            const newListTexts = _.cloneDeep(listTexts)
            newListTexts.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['isLock'], true)
                }
            })
            const newListPlaceholders = _.cloneDeep(listPlaceholders)
            newListPlaceholders.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['isLock'], true)
                }
            })

            dispatch(setListProducts(newListProds))
            dispatch(setListTexts(newListTexts))
            dispatch(setListPlaceholders(newListPlaceholders))
        } else {
            // Visible
            const newListProds = _.cloneDeep(listProducts)
            newListProds.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['isLock'], false)
                }
            })
            const newListTexts = _.cloneDeep(listTexts)
            newListTexts.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['isLock'], false)
                }
            })
            const newListPlaceholders = _.cloneDeep(listPlaceholders)
            newListPlaceholders.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['isLock'], false)
                }
            })

            dispatch(setListProducts(newListProds))
            dispatch(setListTexts(newListTexts))
            dispatch(setListPlaceholders(newListPlaceholders))
        }
    }

    const checkAllKeysReferToVisibleObject = useCallback((keys) => {
        return !_.some(keys, key => {
            let sceneProdData = listProducts.find(el => el.id === key)
            let sceneTextData = listTexts.find(el => el.id === key)
            let scenePlaceholderData = listPlaceholders.find(el => el.id === key)

            if(sceneProdData){
                return !_.get(sceneProdData, ['visible'], true)
            }
            if(sceneTextData){
                return !_.get(sceneTextData, ['visible'], true)
            }
            if(scenePlaceholderData){
                return !_.get(scenePlaceholderData, ['visible'], true)
            }

            return false
        })
    }, [listProducts, listTexts, listPlaceholders])

    const onToggleVisibleNode = (e, nodeData) => {
        e.preventDefault()
        onHandleVisibleAndInvisibleSelectedObject(traverseTreeData([], nodeData))

    }

    const onHandleVisibleAndInvisibleSelectedObject = (keys) => {
        const isAllKeysVisible = checkAllKeysReferToVisibleObject(keys)

        if(isAllKeysVisible){
            // Hidden
            const newListProds = _.cloneDeep(listProducts)
            newListProds.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['visible'], false)
                }
            })
            const newListTexts = _.cloneDeep(listTexts)
            newListTexts.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['visible'], false)
                }
            })
            const newListPlaceholders = _.cloneDeep(listPlaceholders)
            newListPlaceholders.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['visible'], false)
                }
            })

            dispatch(setListProducts(newListProds))
            dispatch(setListTexts(newListTexts))
            dispatch(setListPlaceholders(newListPlaceholders))
        } else {
            // Visible
            const newListProds = _.cloneDeep(listProducts)
            newListProds.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['visible'], true)
                }
            })
            const newListTexts = _.cloneDeep(listTexts)
            newListTexts.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['visible'], true)
                }
            })
            const newListPlaceholders = _.cloneDeep(listPlaceholders)
            newListPlaceholders.forEach(el => {
                if(keys.includes(el.id)){
                    _.set(el, ['visible'], true)
                }
            })

            dispatch(setListProducts(newListProds))
            dispatch(setListTexts(newListTexts))
            dispatch(setListPlaceholders(newListPlaceholders))
        }
    }

    const onSelectNode = (keys, info) => {
        dispatch(setSelectedObject(info?.node?.key))
    }

    const onOpenObjectDetail = (e, nodeData) => {
        e.stopPropagation()
        dispatch(setSelectedObject(nodeData.key))
        dispatch(setIsShowDrawerObjectDetail(true))
        
        // TODO: focus on selected object
    }

    const onObjectListActionModeChange = (mode) => {
        if(mode === OBJECT_LIST_ACTION_MODE.SEARCH) {
            setSearchValue("")
        }
        if(objectListActionMode === mode){
            setObjectListActionMode("")
        } else {
            setObjectListActionMode(mode)
        }
    }

    const onFilterObjectType = (key) => {
        if(listFilterGroup.includes(key)){
            setListFilterGroup([...listFilterGroup.filter(el => el !== key)])
        } else {
            setListFilterGroup([...listFilterGroup, key])
        }
    }

    const onDrop = (info) => {
        const data = onDropNode(treeData, info)
        onTreeDataChange(data)
    }

    const onDoubleClickName = (nodeData) => {
        if(nodeData.nodeType === TREE_DATA_NODE_TYPE.FOLDER){
            if(!editNameKeys.includes(nodeData.key)){
                setEditNameKeys([...editNameKeys, nodeData.key])
            }
        } else {
            notification.warning({
                message: "Node isn't a folder!"
            })
        }
    }

    const onChangeFolderName = (key, name) => {
        if(name){
            if(checkGroupIsUniqueName(treeData, name)){
                const cloneData = _.cloneDeep(treeData)
                loop(cloneData, key, (_item, index, arr) => {
                    _item.title = name
                });
                onTreeDataChange(cloneData)
                setEditNameKeys([...editNameKeys.filter(el => el !== key)])
            } else {
                notification.warning({
                    message: "Group name is exist!"
                })
            }
        } else {
            notification.warning({
                message: "Group name can't be null!"
            })
        }
    }

    const onCLickNodeData = useCallback((nodeData) => {
        if(_.get(nodeData, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
            if(listExpandedKeys.includes(nodeData.id)){
                setListExpandedKeys(listExpandedKeys.filter(el => el !== nodeData.id))
            } else {
                setListExpandedKeys([...listExpandedKeys, nodeData.id])
            }
        }
    }, [listExpandedKeys])
    
    return <>
        <div>
            <div className="object-list-tree-control">
                <div className="flex gap-[12px] items-center py-[8px]">
                    <Checkbox className="checkbox-check-all" checked={isCheckAll} onChange={(e) => {onCheckAllChange(e.target.checked)}}/>
                    <span className="font-inter font-[600] text-[16px] leading-[19.36px] text-[#000] whitespace-nowrap">
                        Select all
                    </span>
                </div>
                <div className="flex items-center gap-[12px] py-[8px] border-[#007B80]">
                    <img src={ObjectListSearchIcon} alt="" className="cursor-pointer" onClick={() => {onObjectListActionModeChange(OBJECT_LIST_ACTION_MODE.SEARCH)}}/>
                    <div className="border-s-[1px] border-[#007B80] h-full"></div>
                    <img 
                        src={isAllSelectedVisible ? ObjectListVisibleIcon : ObjectListInvisibleIcon} 
                        alt="" 
                        className="cursor-pointer"
                        onClick={() => {
                            onHandleVisibleAndInvisibleSelectedObject(listCheckedKeys)
                        }}
                    />
                    <img 
                        src={oneGroupKeyInListCheckedKeys ? ObjectListFolderOpenIcon : ObjectListFolderIcon} 
                        alt="" 
                        className="cursor-pointer" 
                        onClick={() => {
                                if(oneGroupKeyInListCheckedKeys){
                                    onUnGroup(oneGroupKeyInListCheckedKeys)
                                } else {
                                    onGroup()
                                }
                            }
                        }
                    />
                    <Dropdown
                        menu={{
                            items: [],
                        }}
                        placement="bottomLeft"
                        dropdownRender={() => {
                            return <div className="dropdown-object-list-filter">
                                {
                                    LIST_FILTER_GROUP.map(
                                        el => <>
                                            <div key={el.key} className={`object-list-filter-item ${listFilterGroup.includes(el.key) ? 'active' : ''}`}>
                                                <Checkbox checked={listFilterGroup.includes(el.key)} onClick={() => {onFilterObjectType(el.key)}}>
                                                    {el.label}
                                                </Checkbox>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        }}
                        trigger="click"
                    >
                        <img src={ObjectListFilterIcon} alt="" className="cursor-pointer"/>
                    </Dropdown>
                    <img src={ObjectListTrashIcon} alt="" className="cursor-pointer" onClick={() => {onDeleteSelectedObjects(listCheckedKeys)}}/>
                </div>
            </div>
            <div className={`object-list-search-container ${objectListActionMode === OBJECT_LIST_ACTION_MODE.SEARCH ? "" : "hidden"}`}>
                <input className="input-search-tree" value={searchValue} onChange={(e) => {setSearchValue(e.target.value)}}/>
            </div>
        </div>
        
        <Tree
            showLine
            showIcon={false}
            switcherIcon={
                <FolderIcon />
            }
            draggable
            blockNode
            titleRender={
                (nodeData) => (
                    <>
                        <div className={`object-list-node-container ${!nodeData.parent ? 'object-list-first-node' : ''} flex items-center gap-[8px] relative`}>
                            {
                                !editNameKeys.includes(nodeData.key) && <>
                                    <span
                                        style={{
                                            opacity: !checkAllKeysReferToVisibleObject(traverseTreeData([], nodeData)) ? 0.3 : 1
                                        }}
                                        onClick={() => {
                                            onCLickNodeData(nodeData)
                                        }}
                                    >
                                        { getIconOfNode(nodeData, listExpandedKeys.includes(nodeData.key)) }
                                    </span>
                                    <span 
                                        style={{
                                            color: getColorOfNode(nodeData),
                                            opacity: !checkAllKeysReferToVisibleObject(traverseTreeData([], nodeData)) ? 0.3 : 1
                                        }}
                                        onDoubleClick={() => {onDoubleClickName(nodeData)}}
                                    >
                                        {nodeData.title} {_.has(nodeData, ['children']) && <span style={{color: getColorOfNode(nodeData)}}>{`(${_.get(nodeData, ['children', 'length'], 0)})`}</span>}
                                    </span>

                                    <div className="absolute right-[12px] top-[50%] translate-y-[-50%] flex items-center flex-nowrap gap-[12px] object-list-node-action">
                                        <button onClick={(e) => {onOpenObjectDetail(e, nodeData)}}>
                                            <img src={ObjectListInfoIcon} alt=""/>
                                        </button>
                                        <button onClick={(e) => {onToggleVisibleNode(e, nodeData)}}>
                                            <img src={checkAllKeysReferToVisibleObject(traverseTreeData([], nodeData)) ? ObjectListActionVisibleIcon : ObjectListActionInvisibleIcon} alt=""/>
                                        </button>
                                        <button onClick={(e) => {onToggleLockNode(e, nodeData)}}>
                                            <img src={checkAllKeysReferToUnlockObject(traverseTreeData([], nodeData)) ? ObjectListActionUnlockIcon : ObjectListActionLockIcon} alt=""/>
                                        </button>
                                        <button onClick={(e) => {onDeleteNode(e, nodeData)}}>
                                            <img src={ObjectListActionTrashIcon} alt=""/>
                                        </button>
                                    </div>
                                </>
                            }
                            {
                                editNameKeys.includes(nodeData.key) && <>
                                    <Input 
                                        defaultValue={nodeData.title} 
                                        className="object-list-input-name" 
                                        onPressEnter={(e) => {onChangeFolderName(nodeData.key, e.target.value)}}
                                        onBlur={() => {
                                            setEditNameKeys([...editNameKeys.filter(el => el !== nodeData.key)])
                                        }}
                                    />
                                </>
                            }
                        </div>
                    </>
                )
            }
            selectable={true}
            checkable
            defaultExpandAll
            checkedKeys={listCheckedKeys}
            onCheck={(checked) => {setListCheckedKeys(checked)}}
            expandedKeys={listExpandedKeys}
            onExpand={(expandedKeys) => {setListExpandedKeys(expandedKeys)}}
            selectedKeys={[selectedObject]}
            onSelect={onSelectNode}
            onDrop={onDrop}
            treeData={treeDataRender}
            className="object-list-tree-container"
        />
    </>
}

export default ObjectListTreeView