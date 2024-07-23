import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getNewProjectInfo, setNewProjectInfo, setNewprojectInfoName } from "../../../redux/modelSlice"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../../redux/appSlice"
import { CONFIG_TEXT, PROJECT_MENU_ACTION, PROJECT_MODE, PROJECT_TAB_NO, PROJECT_TYPE, USER_CONFIG_KEY, USER_ROUTE_PREFIX } from "../../../utils/constants"
import projectApi, { createProject, deleteProject, getListProject, updateProjectById } from "../../../api/project.api"
import { userApi } from "../../../api/user.api"
import { Col, Row, notification, Modal, Spin } from "antd"
import _ from "lodash"
import userConfigApi from "../../../api/userConfig.api"
import './styles.scss'
import { getAssetsUrl } from "../../../utils/util"
import ModalProjectName from "../../modalProjectName/ModalProjectName"
import ProjectItem from "../../projectItem/ProjectItem"
import Lottie from "lottie-react";
import loadingAnimation from "../../../assets/json/Add Products.json"

const ShopifyProjectTab = ({
    activeKeyProject
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ListProjects, setListProjects] = useState([]);
    const [loading, setLoading] = useState(false)

    const timeoutRef = useRef()
    const newProjectInfo = useSelector(getNewProjectInfo)
    const user = useSelector(getUser);
    useEffect(() => {
        handleLoadProject()
    }, [activeKeyProject])

    const handleLoadProject = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        setLoading(true)
        timeoutRef.current = setTimeout(() => {
            let filterData = {
                type: PROJECT_TYPE.TEMPLATE,
                limit: 100
            }
            if(activeKeyProject !== PROJECT_TAB_NO.TEMPLATES){
                filterData.type = PROJECT_TYPE.PROJECT
                filterData.createdBy = user.id
                if(activeKeyProject === PROJECT_TAB_NO.PUBLISHED){
                    filterData = Object.assign(filterData, {mode: PROJECT_MODE.PUBLISH})
                }
                if(activeKeyProject === PROJECT_TAB_NO.ARCHIEVES){
                    filterData = Object.assign(filterData, {mode: PROJECT_MODE.ARCHIVE})
                }
                if(activeKeyProject === PROJECT_TAB_NO.DRAFT){
                    filterData = Object.assign(filterData, {mode: PROJECT_MODE.UNSAVED})
                }
            }
            getListProject(filterData).then(data => {
                setListProjects(data.results)
                setLoading(false)
            })
        }, 200)
    }

    const handleTemplateClick = async (project) => {
        if(project.isLock){
            notification.warning({message: "This is a locked template!"})

            return
        }
        // Check user can create new draft store with pricing plan
        const rs = await userApi.checkCanCreateNewStore(project.createdBy);
        if(!rs.result){
            notification.warning({message: rs?.message || CONFIG_TEXT.REACH_LIMIT})
            return
        }
        const cloneProject = _.cloneDeep(project)
        delete(cloneProject.id)

        setIsModalOpen(true)
        dispatch(setNewProjectInfo({
            ...cloneProject,
            templateId: project.id,
            materials: {},
            createdBy: user.id,
        }))
    }

    const handleProjectClick = (el) => {
        navigate(`${USER_ROUTE_PREFIX.RETAILER_EDIT_PROJECT}${el.id}`)
    }

    const createNewStore = (data) => {
        createProject(data).then(async data => {
            if(data.id){
                const body = {
                    userId: data.createdBy,
                    key: USER_CONFIG_KEY.NUM_OF_DRAFT_STORE_IN_MONTH
                }
                await userConfigApi.userCreateStore(body);
                navigate(`${USER_ROUTE_PREFIX.RETAILER_EDIT_PROJECT}${data.id}`)
                notification.success({
                    message: "Project created successfully!"
                })
            }
        }).catch(err => {
            notification.error({
                message: "Failed to create project!"
            })
        })
    }

    const handleImageClick = (el) => {
        if(activeKeyProject == PROJECT_TAB_NO.TEMPLATES){
            handleTemplateClick(el)
        } else {
            handleProjectClick(el)
        }
    }

    const handleModelProjectNameClose = (projectName) => {
        if(!projectName){
            notification.warning({
                message: "Project name is required!"
            })
            return
        }
        setIsModalOpen(false)
        dispatch(setNewprojectInfoName(projectName))

        // listProducts get from template
        let data = {
            ...newProjectInfo,
            plans: [],
            name: projectName,
            mode: PROJECT_MODE.UNSAVED,
            type: "project",
            isBlank: false
        }
        delete data.createdAt
        delete data.updatedAt
        createNewStore(data)
    }

    const handleMenuClick = (info, item) => {
        if(info.key === PROJECT_MENU_ACTION.ARCHIEVE){
            Modal.confirm({
                title: "Are you sure to archive this store? This action can’t be undone.",
                centered: true,
                className: "dialog-confirm",
                onOk: () => {
                    onChangeModeProject(item.id, PROJECT_MODE.ARCHIVE)
                }
            })
        } else if(info.key === PROJECT_MENU_ACTION.RESTORE){
            onChangeModeProject(item.id, PROJECT_MODE.PUBLISH)
        } else if(info.key === PROJECT_MENU_ACTION.DELETE){
            Modal.confirm({
                title: "Are you sure to delete this store? This action can’t be undone.",
                centered: true,
                className: "dialog-confirm",
                onOk: () => {
                    deleteProject(item.id).then(rs => {
                        handleLoadProject()
                        notification.success({
                            message: "Deleted successfully!!"
                        })
                    }).catch(err => {
                        notification.error({
                            message: "Delete fail!"
                        })
                    })
                }
            })
            
        } else if(info.key === PROJECT_MENU_ACTION.UNPUBLISH){
            Modal.confirm({
                title: "Are you sure to unpublish this store?",
                centered: true,
                className: "dialog-confirm",
                onOk: () => {
                    onChangeModeProject(item.id, PROJECT_MODE.UNSAVED)
                }
            })
        }
    }

    const onChangeModeProject = async (id, newMode) => {
        if(newMode === PROJECT_MODE.PUBLISH && user?.id){
            const rs = await userApi.checkCanPublishStore(user?.id);
            if(!rs.result){
                notification.warning({message: rs?.message || CONFIG_TEXT.REACH_LIMIT})
                return
            }
        }

        projectApi.updateProjectMode(id, {mode: newMode}).then(rs => {
            if(newMode === PROJECT_MODE.PUBLISH && user?.id){
                const body = {
                    userId: user.id,
                    key: USER_CONFIG_KEY.NUM_OF_PUBLISH_STORE_IN_MONTH
                }
                userConfigApi.userPublishStore(body)
            }
            handleLoadProject()
            if(newMode === PROJECT_MODE.UNSAVED) {
                notification.success({
                    message: CONFIG_TEXT.MOVED_TO_DRAFT
                })
            } else if(newMode === PROJECT_MODE.PUBLISH) {
                notification.success({
                    message: "Published Store successfully!"
                })
            } else {
                notification.success({
                    message: "Update successfully!"
                })
            }
        }).catch(err => {
            notification.error({
                message: "Update fail!"
            })
        })
    }

    return <>
        <Row className="shopify-project-tab" gutter={[24, 24]}>
            {
                loading && <Col span={24}>
                    <Spin spinning={true} className="loading-indicator-wrapper-no-translate" indicator={<Lottie animationData={loadingAnimation} />}> 
                    </Spin>
                </Col>
            }
            {
                !loading && ListProjects.map((el, index) => <>
                    <Col 
                        key={el.id} 
                        lg={6} 
                        md={12} 
                        sm={12} 
                        xs={24} 
                    >
                        <ProjectItem 
                            key={`project-item-${index}-${el.id}`} 
                            activeKey={activeKeyProject}
                            el={el}
                            handleTemplateClick={handleTemplateClick}
                            handleProjectClick ={handleProjectClick}
                            handleMenuClick={handleMenuClick}
                        />
                    </Col>
                </>)
            }
        </Row>
        <ModalProjectName
            open={isModalOpen}
            onClose={() => {setIsModalOpen(false)}}
            onOk={(value) => {handleModelProjectNameClose(value)}}
        />
    </>
}
export default ShopifyProjectTab