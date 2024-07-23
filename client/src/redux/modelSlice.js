import { createSlice } from '@reduxjs/toolkit';
import { AVAILABLE_ANIMATION, INTERACTIVE_MODE, PUBLISH_CAMERA_MODE, PUBLISH_ROLE } from '../utils/constants';
import _ from 'lodash';
import global from './global';

export const modelSlice = createSlice({
    name: 'modelSlice',
    initialState: {
        userIP: "",
        isPreviewModel: false,
        isShowNameModal: false,
        selectedObject: "",
        newProjectInfo: {
            name: ""
        },
        listCameras: [
        ],
        listSpawnPoints: [
        ],
        editorMaterials: {},
        playerName: "",
        playerGender: "male",
        // {id: string, name: string, mute: bool, role: string}
        listPlayers: [],
        isMuteAll: false,
        isMuteAudio: false,
        isObjectsLoaded: false,
        objectsLoadedPercent: 0,

        //Only used for admin edit template
        selectedHdriOfAdminTemplate: "",
        isAttachSelectedHdriToBackground: false,
        templateToneMappingExposure: 1,
        templateAvailableAnimation: AVAILABLE_ANIMATION.PLAY_NEVER,
        selectedMaterial: "",
        isActiveStore: global.IS_SHOPIFY ? false : true,
        isLoadingCheckActiveStore: true,
        canBeJoinMultiplePlayer: false,
        
        // Multiplayer mode
        interactiveMode: INTERACTIVE_MODE.INDIVIDUAL,

        isRunning: false,

        // White label
        isStoreHasWhiteLabel: false,

        // mode action
        action: null,

        storeInfo: null,

        // ModelContainer
        listProducts: [],
        listTexts: [],
        listPlaceholders: [],

        // Check if first time load data
        isLoadedInitData: false,

        // Tree data of model container
        treeData: [],

        //Drawer
        isShowDrawerObjectDetail: false,

        //Demo viewer mode
        isViewerMode: false, 

        //onChangeMutePlayer
        onChangeMutePlayer: false,
        //Player avatar url
        playerAvatar: "",

        // Publish camera mode (camera in Player.js)
        // Standard mode: Show avatar and walk with wasd
        // Focus object mode: Turn off avatar, camera focus to object
        publishCameraMode: PUBLISH_CAMERA_MODE.STANDARD,

        // Editor materials in Detail Object Panel
        objectEditorMaterials: {},

        // All product of current user
        allProducts: [],

        // Is autosaving in Editor mode
        isShowAutoSaving: false
    },
    reducers: {
        setIsShowAutoSaving: (state, action) => {
            state.isShowAutoSaving = action.payload;
        },
        setTemplateAvailableAnimation: (state, action) => {
            state.templateAvailableAnimation = action.payload;
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
        },
        setObjectEditorMaterials: (state, action) => {
            state.objectEditorMaterials = action.payload;
        },
        setPublishCameraMode: (state, action) => {
            state.publishCameraMode = action.payload;
        },
        setIsLoadedInitData: (state, action) => {
            state.isLoadedInitData = action.payload;
        },
        setPlayerAvatar: (state, action) => {
            state.playerAvatar = action.payload;
        },
        setIsViewerMode: (state, action) => {
            state.isViewerMode = action.payload;
        },
        setIsShowDrawerObjectDetail: (state, action) => {
            state.isShowDrawerObjectDetail = action.payload;
        },
        syncProductPrice: (state, action) => {
            if(_.has(action, ['payload', 'id'])){
                state.listProducts =  state.listProducts.map(el => {
                    if(el.id === action.payload.id){
                        return {
                            ...el,
                            ..._.get(action.payload, ['data'], {})
                        }
                    }
                    return el
                });
            }
        },
        setListProducts: (state, action) => {
            state.listProducts = action.payload;
        },
        setAttributeOfProduct: (state, action) => {
            const { attribute, value, id } = action.payload
            if(!_.isNil(attribute) && !_.isUndefined(value) && !_.isNil(id)){
                state.listProducts = state.listProducts.map(el => {
                    if(el.id === id){
                        el[attribute] = value
                    }

                    return el
                })
            }
        },
        setAttributeOfText: (state, action) => {
            const { attribute, value, id } = action.payload
            if(!_.isNil(attribute) && !_.isUndefined(value) && !_.isNil(id)){
                state.listTexts = state.listTexts.map(el => {
                    if(el.id === id){
                        el[attribute] = value
                    }

                    return el
                })
            }
        },
        setAttributeOfPlaceholder: (state, action) => {
            const { attribute, value, id } = action.payload
            if(!_.isNil(attribute) && !_.isUndefined(value) && !_.isNil(id)){
                state.listPlaceholders = state.listPlaceholders.map(el => {
                    if(el.id === id){
                        el[attribute] = value
                    }

                    return el
                })
            }
        },
        setListTexts: (state, action) => {
            state.listTexts = action.payload;
        },
        setListPlaceholders: (state, action) => {
            state.listPlaceholders = action.payload;
        },
        setInteractiveMode: (state, action) => {
            state.interactiveMode = action.payload;
        },
        setCanBeJoinMultiplePlayer: (state, action) => {
            state.canBeJoinMultiplePlayer = action.payload;
        },
        setSelectedMaterial: (state, action) => {
            state.selectedMaterial = action.payload;
        },
        setIsActiveStore: (state, action) => {
            state.isActiveStore = action.payload;
        },
        setIsLoadingCheckActiveStore: (state, action) => {
            state.isLoadingCheckActiveStore = action.payload;
        },
        setIsAttachSelectedHdriToBackground: (state, action) => {
            state.isAttachSelectedHdriToBackground = action.payload;
        },
        setTemplateToneMappingExposure: (state, action) => {
            state.templateToneMappingExposure = action.payload;
        },
        setSelectedHdriOfAdminTemplate: (state, action) => {
            state.selectedHdriOfAdminTemplate = action.payload;
        },
        setObjectsLoadedPercent: (state, action) => {
            state.objectsLoadedPercent = action.payload;
        },
        setIsObjectsLoaded: (state, action) => {
            state.isObjectsLoaded = action.payload;
        },
        setIsMuteAudio: (state, action) => {
            state.isMuteAudio = !state.isMuteAudio;
        },
        setIsPreviewModel: (state, action) => {
            state.isPreviewModel = action.payload;
        },
        setIsShowNameModal: (state, action) => {
            state.isShowNameModal = action.payload;
        },
        setSelectedObject: (state, action) => {
            state.selectedObject = action.payload;
        },
        setNewProjectInfo: (state, action) => {
            state.newProjectInfo = action.payload;
        },
        setNewprojectInfoName: (state, action) => {
            state.newProjectInfo.name = action.payload;
        },
        setListCamera: (state, action) => {
            state.listCameras = action.payload;
        },
        updateListCameraInfo: (state, action) => {
            const newData = action.payload
            state.listCameras = state.listCameras.map((el, index) => {

                return {
                    ...el,
                    name: _.get(newData, [index, 'name'], el.name),
                    assetId: _.get(newData, [index, 'assetId'], el.assetId),
                    thumnail: _.get(newData, [index, 'thumnail'], el.thumnail)
                }
            })
        },
        setListSpawnPoints: (state, action) => {
            state.listSpawnPoints = action.payload;
        },
        setEditorMaterials: (state, action) => {
            state.editorMaterials = action.payload;
        },
        setPlayerName: (state, action) => {
            state.playerName = action.payload;
        },
        setPlayerGender: (state, action) => {
            state.playerGender = action.payload;
        },
        setListPlayers: (state, action) => {
            state.listPlayers = action.payload;
        },
        removePlayer: (state, action) => {
            state.listPlayers = state.listPlayers.filter(el => el.id !== action.payload);
        },
        addPlayer: (state, action) => {
           if(!state.listPlayers.find(el => el.id === action.payload.id)){
                state.listPlayers.push(action.payload);
           }
        },
        addListPlayer: (state, action) => {
            action.payload.forEach(element => {
                if(!state.listPlayers.find(el => el.id === element.id)){
                    state.listPlayers.push(element);
                }
            });
         },
        //{id: string, value: bool}
        onMutePlayer: (state, action) => {
            state.listPlayers = state.listPlayers.map(el => {
                return {
                    ...el,
                    mute: el.id === action.payload.id ? action.payload.value : el.mute
                }
            })

            state.onChangeMutePlayer = !state.onChangeMutePlayer
        },
        onMuteAllPlayer: (state, action) => {
            state.listPlayers = state.listPlayers.map(el => {
                return {
                    ...el,
                    mute: el.role !== PUBLISH_ROLE.SALE ? action.payload : false
                }
            })
        },
        setBeMutedTwoWay: (state, action) => {
            state.listPlayers = state.listPlayers.map(el => {
                return {
                    ...el,
                    beMuted: action.payload.from === el.socketId ? action.payload.value : el.beMuted
                }
            })
        },
        setIsMuteAll: (state, action) => {
            state.isMuteAll = action.payload;
        },
        setUserIP: (state, action) => {
            state.userIP = action.payload;
        },
        resetModelState: (state, action) => {
            state.isActiveStore = false
            state.isLoadingCheckActiveStore = true
            state.storeInfo = null
            state.isRunning = false
            state.selectedObject = ""
            state.isShowNameModal = false
            state.listCameras = []
            state.listSpawnPoints = []
            state.editorMaterials = {}
            state.listPlayers = []
            state.interactiveMode = INTERACTIVE_MODE.INDIVIDUAL
            state.isStoreHasWhiteLabel = false
            state.listProducts = []
            state.listTexts = []
            state.isShowDrawerObjectDetail = false
            state.treeData = []
            state.allProducts = []
        },
        setIsRunning: (state, action) => {
            state.isRunning = action.payload;
        },
        setIsStoreHasWhiteLabel: (state, action) => {
            state.isStoreHasWhiteLabel = action.payload;
        },
        setModelAction: (state, action) => {
            state.action = action.payload;
        },
        setStoreInfo: (state, action) => {
            state.storeInfo = action.payload;
        },
        setTreeData: (state, action) => {
            state.treeData = action.payload;
        },
        syncDataOfTreeAndObjects: (state, action) => {
            const {
                treeData,
                listProducts,
                listTexts,
                listPlaceholders
            } = action.payload;

            state.treeData = treeData;
            state.listProducts = listProducts;
            state.listTexts = listTexts;
            state.listPlaceholders = listPlaceholders;
        },
    }
})

export const {
    setIsShowAutoSaving,
    setTemplateAvailableAnimation,
    setAllProducts,
    setPublishCameraMode,
    setIsLoadedInitData,
    setEditorMaterials,
    setIsPreviewModel,
    setSelectedObject,
    setNewProjectInfo,
    setNewprojectInfoName,
    setListCamera,
    setIsShowNameModal,
    setPlayerName,
    setPlayerGender,
    setListPlayers,
    removePlayer,
    addPlayer,
    addListPlayer,
    onMutePlayer,
    onMuteAllPlayer,
    setIsMuteAll,
    setIsMuteAudio,
    setBeMutedTwoWay,
    setUserIP,
    setListSpawnPoints,
    setIsObjectsLoaded,
    setObjectsLoadedPercent,
    setSelectedHdriOfAdminTemplate,
    setIsAttachSelectedHdriToBackground,
    setTemplateToneMappingExposure,
    setSelectedMaterial,
    updateListCameraInfo,
    setIsActiveStore,
    setIsLoadingCheckActiveStore,
    resetModelState,
    setCanBeJoinMultiplePlayer,
    setInteractiveMode,
    setIsRunning,
    setIsStoreHasWhiteLabel,
    setModelAction,
    setStoreInfo,
    setListProducts,
    setListTexts,
    setListPlaceholders,
    setIsShowDrawerObjectDetail,
    setIsViewerMode,
    syncProductPrice,
    setAttributeOfProduct,
    setPlayerAvatar,
    setTreeData,
    setAttributeOfText,
    setAttributeOfPlaceholder,
    syncDataOfTreeAndObjects,
    setObjectEditorMaterials
} = modelSlice.actions;

export const getIsShowAutoSaving = (state) => state.model.isShowAutoSaving
export const getTemplateAvailableAnimation = (state) => state.model.templateAvailableAnimation
export const getObjectsLoadedPercent = (state) => state.model.objectsLoadedPercent
export const getAllProducts = (state) => state.model.allProducts
export const getObjectEditorMaterials = (state) => state.model.objectEditorMaterials
export const getPublishCameraMode = (state) => state.model.publishCameraMode
export const getIsLoadedInitData = (state) => state.model.isLoadedInitData
export const getTreeData = (state) => state.model.treeData
export const getPlayerAvatar = (state) => state.model.playerAvatar
export const getIsViewerMode = (state) => state.model.isViewerMode
export const getIsShowDrawerObjectDetail = (state) => state.model.isShowDrawerObjectDetail
export const getListProducts = (state) => state.model.listProducts
export const getListTexts = (state) => state.model.listTexts
export const getListPlaceholders = (state) => state.model.listPlaceholders
export const getStoreInfo = (state) => state.model.storeInfo
export const getIsStoreHasWhiteLabel = (state) => state.model.isStoreHasWhiteLabel
export const getInteractiveMode = (state) => state.model.interactiveMode
export const getCanBeJoinMultiplePlayer = (state) => state.model.canBeJoinMultiplePlayer
export const getIsLoadingCheckActiveStore = (state) => state.model.isLoadingCheckActiveStore
export const getIsActiveStore = (state) => state.model.isActiveStore
export const getSetSelectedMaterial = (state) => state.model.selectedMaterial
export const getTemplateToneMappingExposure = (state) => state.model.templateToneMappingExposure
export const getIsAttachSelectedHdriToBackground = (state) => state.model.isAttachSelectedHdriToBackground
export const getSelectedHdriOfAdminTemplate = (state) => state.model.selectedHdriOfAdminTemplate
export const getIsObjectsLoaded = (state) => state.model.isObjectsLoaded
export const getUserIP = (state) => state.model.userIP
export const getIsMuteAudio = (state) => state.model.isMuteAudio
export const getIsMuteAll = (state) => state.model.isMuteAll
export const getListPlayers = (state) => state.model.listPlayers
export const getPlayerName = (state) => state.model.playerName
export const getPlayerGender = (state) => state.model.playerGender
export const getEditorMaterials = (state) => state.model.editorMaterials
export const getListCameras = (state) => state.model.listCameras
export const getListSpawnPoints = (state) => state.model.listSpawnPoints
export const getNewProjectInfo = (state) => state.model.newProjectInfo
export const getSelectedObject = (state) => state.model.selectedObject;
export const getIsPreviewModel = (state) => state.model.isPreviewModel;
export const getIsShowNameModal = (state) => state.model.isShowNameModal;
export const getIsRunning = (state) => state.model.isRunning;
export const getModelAction = (state) => state.model.action;
export const onMuteChange = (state) => state.model.onChangeMutePlayer;

export default modelSlice.reducer;