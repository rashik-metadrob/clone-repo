import { Modal, Row, Spin, Tabs, notification } from "antd"
import "./styles.scss"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import routesConstant from "../../../routes/routesConstant"
import useMeasure from "react-use-measure"
import { PAYMENT_TYPE, PROJECT_TAB_NO, PROJECT_TYPE } from "../../../utils/constants"
import ShopifyCompanyDetailsTab from "../../../components/shopifyComponents/shopifyCompanyDetailsTab/ShopifyCompanyDetailsTab"
import { userApi } from "../../../api/user.api"
import { useDispatch, useSelector } from "react-redux"
import { getUser, setUser } from "../../../redux/appSlice"
import ShopifyProductTab from "../../../components/shopifyComponents/shopifyProductsTab/ShopifyProductsTab"
import { createMultiProducts } from "../../../api/product.api"
import { getListProject } from "../../../api/project.api"
import ShopifyProjectTab from "../../../components/shopifyComponents/shopifyProjectTab/ShopifyProjectTab"
import _ from "lodash"
import InstructionIcon from "../../../assets/images/shopify/instruction.png"
import ShopifyStoreFrontTab from "../../../components/shopifyComponents/shopifyStoreFrontTab/ShopifyStoreFrontTab"
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../../utils/storage"
import ReactPlayer from "react-player"
import { getAssetsUrl } from "../../../utils/util"
const ShopifyFirstLoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [activeKey, setActiveKey] = useState(1)
    const [activeKeyProject, setActiveKeyProject] = useState(PROJECT_TAB_NO.TEMPLATES)
    const [isLoading, setIsLoading] = useState(false)
    const yourStoreTabRef = useRef()
    const shopifyCompanyDetailRef = useRef()
    const shopifyProductsRef = useRef()
    const shopifyStoreFrontRef = useRef()
    const user = useSelector(getUser)
    const [ref, bounds] = useMeasure()
    const [isFirstUser, setIsFirstUser] = useState(false)
    const isFirstCheck = useRef(false)
    const [isShowModalInstructionTutorial, setIsShowModalInstructionTutorial] = useState(false)

    useEffect(() => {
        if(!isFirstCheck.current && user){
            isFirstCheck.current = true

            setIsFirstUser(!_.get(user, ['companyName']))
        }
    }, [user])
    useEffect(() => {
        // Query
        if(activeKey == 3){
            let filterData = {
                type: PROJECT_TYPE.TEMPLATE,
                limit: 100
            }
            getListProject(filterData).then(data => {
                if(_.get(data, ['publishTotals'], 0) > 0){
                    setActiveKeyProject(PROJECT_TAB_NO.PUBLISHED)
                } else if(_.get(data, ['draftTotals'], 0) > 0){
                    setActiveKeyProject(PROJECT_TAB_NO.DRAFT)
                } else {
                    setActiveKeyProject(PROJECT_TAB_NO.TEMPLATES)
                }
                
                setIsLoading(false)
            })
        }
    }, [activeKey])

    const onNextClick = () => {
        // Submit company data
        setIsLoading(true)
        if(activeKey == 1){
            const data = shopifyCompanyDetailRef.current.getFormData()

            // if(Object.keys(data).some((key) => !data[key])){
            //     notification.warning({
            //         message: "Please enter all of field!"
            //     })
            //     setIsLoading(false)
            //     return
            // }

            userApi.updateLoggedInUser(data).then(rs => {
                if(rs.user){
                    dispatch(setUser(rs.user))
                }
                setIsLoading(false)
                setActiveKey(+activeKey + 1)
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't save data!`)
                })
            })
        } else {
            setActiveKey(+activeKey + 1)
            setIsLoading(false)
        }
    }

    const onImportProduct = () => {
        if(activeKey == 2) {
            const prods = shopifyProductsRef.current.getSelectedProducts()
            if(!prods && prods.length){
                setActiveKey((+activeKey + 1))
                return
            } else {
                setIsLoading(true)
                createMultiProducts(prods).then(data => {
                    setIsLoading(false)
                    notification.success({
                        message: `Import successfully ${data.length} products!`
                    })
                    setActiveKey((+activeKey + 1))
                }).catch(err => {
                    setIsLoading(false)
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], `Can't get product data from Shopify!`)
                    })
                })
            }
        }
    }

    const getNextButtonText = () => {
        if(activeKey == 1) {
            if(_.get(user, ['companyName'])){
                return 'Save'
            }
            return 'Next'
        }

        return 'Next'
    }

    return <>
        <div className="shopify-first-login-container relative h-full">
            <div 
                className={`py-[clamp(24px,7vh,40px)] px-[48px] overflow-y-auto`}
                style={{
                    height: `calc(100% - ${ref ? bounds.height : 0}px)`
                }}
            >
                <div className="h-full">
                    <div className="header-container">
                        <div className="header-container-tabs">
                            <div className={`header-item ${activeKey == 1 ? 'active' : ''}`} onClick={() => {setActiveKey(1)}}>
                                Company Details
                            </div>
                            <div className={`header-item ${activeKey == 2 ? 'active' : ''}`} onClick={() => {setActiveKey(2)}}>
                                Products
                            </div>
                        </div>
                        <div>
                            <div className="header-container-tabs-project">
                                <div 
                                    className={`header-item ${activeKeyProject == PROJECT_TAB_NO.TEMPLATES ? 'active' : ''}`} 
                                    onClick={() => {
                                            setActiveKey(3)
                                            setActiveKeyProject(PROJECT_TAB_NO.TEMPLATES)
                                        }
                                    }
                                >
                                    Templates
                                </div>
                                <div 
                                    className={`header-item pr-[50px] relative ${activeKeyProject == PROJECT_TAB_NO.PUBLISHED ? 'active' : ''}`} 
                                    onClick={() => {
                                            setActiveKey(3)
                                            setActiveKeyProject(PROJECT_TAB_NO.PUBLISHED)
                                        }
                                    }
                                >
                                    Published
                                    <img 
                                        src={InstructionIcon} 
                                        alt="" 
                                        className="absolute right-0 top-[50%] translate-y-[-50%] w-[24px] h-[24px]" 
                                        onClick={(e) => {
                                            e.stopPropagation()

                                            setIsShowModalInstructionTutorial(true)
                                        }}
                                    />
                                </div>
                                <div 
                                    className={`header-item ${activeKeyProject == PROJECT_TAB_NO.DRAFT ? 'active' : ''}`} 
                                    onClick={() => {
                                            setActiveKey(3)
                                            setActiveKeyProject(PROJECT_TAB_NO.DRAFT)
                                        }
                                    }
                                >
                                    Drafts
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        {activeKey == 1 && <ShopifyCompanyDetailsTab ref={shopifyCompanyDetailRef}/>}
                        {activeKey == 2 && <ShopifyProductTab ref={shopifyProductsRef}/>}
                        {activeKey == 3 && <ShopifyProjectTab activeKeyProject={activeKeyProject}/>}
                    </div>
                </div>
            </div>
            {activeKey < 3 && <div className="sticky bottom-0 py-[18px] bg-[#0D0C0C] flex justify-start w-full px-[48px]" ref={ref}>
                <Spin spinning={isLoading} wrapperClassName="rounded-[10px] overflow-hidden">
                    <div className="flex gap-[16px]">
                        <button 
                            className="w-[160px] h-[44px] bg-[#FFF] outline-none border-none rounded-[10px] flex justify-center items-center font-inter text-[#0D0C0C] text-[16px] font-[700]"
                            onClick={() => {onNextClick()}}
                        >
                            {getNextButtonText()}
                        </button>

                        {activeKey == 2 && isFirstUser && <button 
                            className="w-[160px] h-[44px] bg-[transparent] outline-none border-[1px] rounded-[10px] flex justify-center items-center font-inter text-[#FFF] text-[16px] font-[700]"
                            onClick={() => {onImportProduct()}}
                        >
                            Add product
                        </button>}
                    </div>
                </Spin>
            </div>}
        </div>

        <Modal
            open={isShowModalInstructionTutorial}
            closable={false}
            title={null}
            footer={null}
            onCancel={() => {setIsShowModalInstructionTutorial(false)}}
            centered
            className="modal-app-block-instruction"
            destroyOnClose
            width={900}
        >
            <div className="title mb-[24px]">
                How to add the app blocks on the Shopify storefront?
            </div>
            <ReactPlayer
                url={getAssetsUrl('/default-assets/app-block-tutorials/app-block-tutorial.mp4')}
                width="100%"
                height="100%"
                className="tutorial-video"
                style={{ maxHeight: '90vh' }}
                controls
            />
        </Modal>
    </>
}
export default ShopifyFirstLoginPage