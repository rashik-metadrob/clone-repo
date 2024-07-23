import { Col, Input, Modal, Row, Spin, Tabs, notification } from "antd";
import "./styles.scss"
// import ListTemplates from "../../assets/json/listTemplate.json"
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import projectApi, { createProject, deleteProject, getListProject, updateProjectById } from "../../api/project.api";
import { useDispatch, useSelector } from "react-redux";
import { getSearchText } from "../../redux/dashboardSlice";
import _ from "lodash"
import { getNewProjectInfo, setNewProjectInfo, setNewprojectInfoName } from "../../redux/modelSlice";
import { getStorageUserDetail } from "../../utils/storage";
import { setRun,getRun,getSteps } from "../../redux/joyrideSlice";
import { CONFIG_TEXT, PERMISSIONS, PROJECT_MENU_ACTION, PROJECT_MODE, PROJECT_TAB_NO, PROJECT_TYPE, USER_CONFIG_KEY, USER_ROUTE_PREFIX } from "../../utils/constants";
import ProjectItem from "../../components/projectItem/ProjectItem";
import userConfigApi from "../../api/userConfig.api";
import { userApi } from "../../api/user.api";
import ModalProjectName from "../../components/modalProjectName/ModalProjectName";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/json/Add Products.json"
import useMeasure from 'react-use-measure'
import { getUser } from "../../redux/appSlice";
import SearchIcon from "../../assets/images/layout/search.svg"
import ExitIcon from "../../assets/images/drob-a/exit.svg"
import SearchSuffixIcon from "../../assets/images/layout/admin/search-suffix.svg"
import usePermissions from "../../hook/usePermissions";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

const OnlineVirtualStore = () => {
    const [ref, bounds] = useMeasure()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const searchText = useSelector(getSearchText)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ListProjects, setListProjects] = useState([]);
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [activeKey, setActiveKey] = useState('')
    const timeoutRef = useRef()
    const newProjectInfo = useSelector(getNewProjectInfo)
    const firstAccess = useRef(true)
    const user = useSelector(getUser);
    const {t} = useTranslation()

    const isFromFirstLogin = Boolean(
        new URLSearchParams(window.location.search).get(
            "isFromFirstLogin"
        )
    )

    const { requirePermissionOfStaff, isStaff, staffOwnerId } = usePermissions()

    // When user is sale person, we dont show template tab and draft tab
    useEffect(() => {
        if(isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)) {
            setActiveKey(PROJECT_TAB_NO.PUBLISHED)
        } else {
            setActiveKey(PROJECT_TAB_NO.TEMPLATES)
        }
    }, [isStaff])

    useEffect(() => {
        if(activeKey) {
            handleUpdateProject()
        }
    }, [activeKey, searchValue, isStaff])

    const handleUpdateProject = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setLoading(true)
            let filterData = {
                search: searchValue,
                type: PROJECT_TYPE.TEMPLATE,
                limit: 100,
            }
            if(activeKey !== PROJECT_TAB_NO.TEMPLATES){
                filterData.type = PROJECT_TYPE.PROJECT
                filterData.createdBy = staffOwnerId ?? user.id
                if(activeKey === PROJECT_TAB_NO.PUBLISHED){
                    filterData = Object.assign(filterData, {mode: PROJECT_MODE.PUBLISH})
                }
                if(activeKey === PROJECT_TAB_NO.ARCHIEVES){
                    filterData = Object.assign(filterData, {mode: PROJECT_MODE.ARCHIVE})
                }
                if(activeKey === PROJECT_TAB_NO.DRAFT){
                    filterData = Object.assign(filterData, {mode: PROJECT_MODE.UNSAVED})
                }
            }
            getListProject(filterData).then(data => {
                if(firstAccess.current && !isFromFirstLogin){
                    if(data.publishTotals){
                        setActiveKey(PROJECT_TAB_NO.PUBLISHED)
                    }
                }
                firstAccess.current = false;
                setListProjects(data.results)
                setLoading(false)
            })
        }, 200)
    }

    const handleMenuClick = (info, item) => {
        alert(",emmuuu")
        if(isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)){
            notification.warning({
                message: CONFIG_TEXT.YOU_DONT_HAVE_PERMISSION
            })
            return
        }
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
                        handleUpdateProject()
                        notification.success({
                            message: "Deleted successfully!"
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
            handleUpdateProject()
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

    const handleProjectClick = (el) => {
      
        if(isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)){
            notification.warning({
                message: CONFIG_TEXT.YOU_DONT_HAVE_PERMISSION
            })
            return
        }
        dispatch(setRun(false))
        navigate(`${USER_ROUTE_PREFIX.RETAILER_EDIT_PROJECT}${el.id}`)
    }

    const handleTemplateClick = async (project) => {
      
        if(project.isLock){
            notification.warning({message: "This is a locked template!"})

            return
        }
        if(isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)){
            notification.warning({
                message: CONFIG_TEXT.YOU_DONT_HAVE_PERMISSION
            })
            return
        }
        // Check user can create new draft store with pricing plan
        const rs = await userApi.checkCanCreateNewStore(project.createdBy);
        if(!rs.result){
            notification.warning({message: rs?.message || CONFIG_TEXT.REACH_LIMIT_DRAFT_STORE})
            return
        }
        const cloneProject = _.cloneDeep(project)
        delete(cloneProject.id)

        const storeName = new URLSearchParams(window.location.search).get(
            "storeName"
        )
        const background = new URLSearchParams(window.location.search).get(
            "background"
        )
        const storeDescription = new URLSearchParams(window.location.search).get(
            "description"
        )

        if(!isFromFirstLogin || !storeName){
            setIsModalOpen(true)
            dispatch(setNewProjectInfo({
                ...cloneProject,
                templateId: project.id,
                materials: {},
                createdBy: user.id,
                background,
                description: storeDescription
            }))
        } else {
            let data = {
                ...cloneProject,
                templateId: project.id,
                materials: {},
                createdBy: user.id,
                plans: [],
                name: storeName,
                mode: PROJECT_MODE.UNSAVED,
                type: "project",
                isBlank: false,
                background,
                description: storeDescription
            }
            delete data.createdAt
            delete data.updatedAt
            createNewStore(data)
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

    const createNewStore = (data) => {
        createProject(data).then(async data => {
            if(data.id){
                const body = {
                    userId: data.createdBy,
                    key: USER_CONFIG_KEY.NUM_OF_DRAFT_STORE_IN_MONTH
                }
                await userConfigApi.userCreateStore(body);
                dispatch(setRun(false))
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

    const onChange = (key) => {
        setActiveKey(key.toString())
    };

    const renderProject = () => {
        return <>
            {
                (!ListProjects || ListProjects.length === 0) 
                && <div className="no-data-text">
                    No data can be found
                </div>
            }
            {ListProjects && ListProjects.length > 0 && <Row gutter={[62, 62]} className="project-list !mx-0">
                {
                    ListProjects.map((el, index) => {
                        return <Col 
                            key={`project-${index}-${el.id}`} 
                            lg={6} 
                            md={12} 
                            sm={12} 
                            xs={24} 
                        >
                            <ProjectItem 
                                key={`project-item-${index}-${el.id}`} 
                                activeKey={activeKey}
                                el={el}
                                handleTemplateClick={handleTemplateClick}
                                handleProjectClick ={handleProjectClick}
                                handleMenuClick={handleMenuClick}
                            />
                        </Col>
                    })
                }
            </Row>}
        </>
    }

    const items = [
        {
            key: PROJECT_TAB_NO.TEMPLATES,
            label: t('store_page.templates'),
            children: renderProject(),
            hidden: isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)
        },
        {
            key: PROJECT_TAB_NO.PUBLISHED,
            label: t('store_page.published'),
            children: renderProject(),
        },
        // {
        //     key: PROJECT_TAB_NO.ARCHIEVES,
        //     label: `Archieves`,
        //     children: renderProject(),
        // },
        {
            key: PROJECT_TAB_NO.DRAFT,
            label: t('store_page.draft'),
            children: renderProject(),
            hidden: isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)
        }
    ];

    return <Row gutter={[26, 26]} className={`!ml-0 !mr-0 pt-[12px] store-container template-page ${isMobile ? '' : 'h-full overflow-y-hidden'}`}>
        <Col span={24} ref={ref}>
            <div className="container-header retailer-container-header">
                <div className="left-side__template">
                    <div className="title">{t('global.select_a_template')}</div>
                </div>
                <div className="right-side__template">
                    <Input
                        placeholder={t('global.search')}
                        className='retailer-shared-search'
                        prefix={<img src={SearchIcon} alt="" />}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value)
                        }}
                        suffix={
                            <>
                                {
                                    searchValue && <img 
                                        src={ExitIcon} 
                                        alt="Clear" 
                                        className="w-[24px] h-[24px] opacity-30 hover:opacity-100 cursor-pointer transition-all"
                                        onClick={() => {setSearchValue("")}}
                                    />
                                }
                                {
                                    !searchValue && <img 
                                        src={SearchSuffixIcon}
                                        alt=""
                                    />
                                }
                            </>
                        }
                    />
                </div>
            </div>
        </Col>
        <Col span={24} className="flex-auto" style={{height: `calc(100% - ${bounds.height + 26}px)`}}>
            <div className="project-list-container h-full">
            <Tabs
                activeKey={activeKey}
                className="project-list-tabs"
                onChange={onChange}
            >
                {items.filter(el => !el.hidden).map((tab) => {
                    const { key, label, children } = tab;
                    return (
                        <Tabs.TabPane
                        key={key}
                        tab={label}
                        >
                            {
                                loading && <Spin spinning={true} className="loading-indicator-wrapper-no-translate" indicator={<Lottie animationData={loadingAnimation} />}> 
                                </Spin>
                            }
                            {
                                !loading && <>{children}</>
                            }
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
            </div>
        </Col>
        <ModalProjectName
            open={isModalOpen}
            onClose={() => {setIsModalOpen(false)}}
            onOk={(value) => {handleModelProjectNameClose(value)}}
        />
    </Row>

}
export default OnlineVirtualStore;
