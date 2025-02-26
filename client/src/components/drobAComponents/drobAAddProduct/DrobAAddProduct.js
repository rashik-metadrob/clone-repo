import { Col, Input, InputNumber, Radio, Row, Select, Spin, notification } from "antd";
import "./styles.scss"

import ArrowLeftIcon from "../../../assets/images/products/arrow-left.svg"
import ArrowIcon from "../../../assets/images/products/arrow-down.svg"
import SaveIcon from "../../../assets/images/products/save.svg"

import UploadModel from "../../../components/uploadModel/UploadModel";
import { useEffect, useRef, useState } from "react";
import { createProduct } from "../../../api/product.api";
import { uploadFile } from "../../../api/upload.api";
import UploadImage from "../../../components/uploadImage/UploadImage";
import { AVAILABLE_ANIMATION, CART_TYPES, CONFIG_TEXT, PRODUCT_TYPES, USER_CONFIG_KEY, PRICING_PLAN_VALUE, UPLOADS_FOLDER } from "../../../utils/constants";
import { getStorageUserDetail } from "../../../utils/storage";
import userConfigApi from "../../../api/userConfig.api";
import { userApi } from "../../../api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { getStepStoreOnboardingIndexForRetailer, getWaitingForAction, setStoreOnboardingRunForRetailer, setWaitingForAction } from "../../../redux/joyrideSlice";
import { getIsUserConnectedStoreFront } from "../../../redux/appSlice";
import RetailerShopifyConfigModal from "../../retailerComponents/retailerShopifyConfigModal/RetailerShopifyConfigModal";
import _ from "lodash";
import TextEditor from "../../textEditor/TextEditor";
import SelectCurrency from "../../selectCurrency/SelectCurrency";
import { fetchUserStorageInfo } from "../../../redux/userStorageSlice";

const DrobAAddProduct = ({
    onBack = () => {},
    onSuccess = () => {},
    isInModal = false,
    type = PRODUCT_TYPES.PRODUCTS,
    footerClassname=""
}) => {
    const dispatch = useDispatch()
    const [loading, setIsLoading] = useState(false)
    const [block, setBlock] = useState()
    const [formData, setFormData] = useState({
        availableAnimation: AVAILABLE_ANIMATION.PLAY_NEVER,
        useThirdPartyCheckout: false,
        cartType: CART_TYPES.WEB_LINK
    })
    const [listUploadBlock, setListUploadBlock] = useState([])

    const userDetail = getStorageUserDetail();

    const uploadModelRef = useRef()
    const uploadImageRef = useRef()

    const isOnboardWaitingForAction = useSelector(getWaitingForAction);
    const stepStoreOnboardingIndexForRetailer = useSelector(getStepStoreOnboardingIndexForRetailer);

    const [uploadLimit, setUploadLimit] = useState({
        file2D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        file3D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        fileMedia: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
    })

    useEffect(() => {
        if(isOnboardWaitingForAction && stepStoreOnboardingIndexForRetailer === 3){
            setTimeout(() => {
                dispatch(setWaitingForAction(false))
                dispatch(setStoreOnboardingRunForRetailer(true))
            }, 500);
        }
    }, [])
    
    useEffect(() => {
        userApi.getListUploadBlocks().then(rs => {
            if(rs && rs.length > 0){
                setBlock(rs[0].value);
            }
            setListUploadBlock(rs || []);
        }).catch(err => {
            // For viewer
        })

        userApi.getUploadLimitSize().then(rs => {
            setUploadLimit({
                file2D: _.get(rs, ['file2D'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
                file3D: _.get(rs, ['file3D'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
                fileMedia: _.get(rs, ['fileMedia'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
            })
        }).catch(err => {
            // For viewer
        })
    }, [])

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const onSave = async () => {
        if(
            formData.name === undefined
        ){
            notification.warning({
                message: "Name can't be null!"
            })
            return
        } else if(
            formData.description === undefined
        ){
            notification.warning({
                message: "Description can't be null!"
            })
            return
        } else if(
            formData.specification === undefined
        ){
            notification.warning({
                message: "Specification can't be null!"
            })
            return
        }
        if(type === PRODUCT_TYPES.PRODUCTS
        ){
            if(
                formData.price === undefined
            ) {
                notification.warning({
                    message: "Price can't be null!"
                })
                return
            } else if(
                formData.discount === undefined
            ) {
                notification.warning({
                    message: "Discount can't be null!"
                })
                return
            } else if(
                formData.displayCurrency === undefined 
            ) {
                notification.warning({
                    message: "Currency can't be null!"
                })
                return
            } else if(
                formData.cartType === CART_TYPES.WEB_LINK
                && !formData.webLink
            ){
                notification.warning({
                    message: "WebLink can't be null!"
                })
                return
            }
            
        }

        if(userDetail?.id){
            const rs = await userApi.checkCanCreateNewProduct(userDetail.id);
            if(!rs.result){
                notification.warning({message: rs?.message || CONFIG_TEXT.REACH_LIMIT})
                return
            }
        }

        const modelFile = uploadModelRef.current.getFile()
        if(!modelFile){
            notification.warning({
                message: "Model can't be null!"
            })
            return
        }

        const imageFile = uploadImageRef.current.getFile()
        if(!imageFile){
            notification.warning({
                message: "Image can't be null!"
            })
            return
        }

        setIsLoading(true)
        const formModelData = new FormData();
        formModelData.append("file", modelFile);
        const modelResult = await uploadFile(formModelData, 0, UPLOADS_FOLDER.PRODUCT)
        if(modelResult.status && modelResult.status !== 200){
            notification.error({
                message: modelResult.data.message
            })
            setIsLoading(false)
            return
        }
        let modelFileName = modelResult.results

        const formImageData = new FormData();
        formImageData.append("file", imageFile);
        const modelImageResult = await uploadFile(formImageData, 1, UPLOADS_FOLDER.PRODUCT_THUMNAIL)
        if(modelImageResult.status && modelImageResult.status !== 200){
            notification.error({
                message: modelImageResult.data.message
            })
            setIsLoading(false)
            return
        }
        let imageFileName = modelImageResult.results

        let productData = {
            ...formData,
            image: imageFileName,
            objectUrl: modelFileName,
            block: block,
            type: type
        }

        createProduct(productData).then(async (data) => {
            notification.success({
                message: "Add product success!"
            })
            if(userDetail?.id){
                const body = {
                    userId: userDetail.id,
                    key: USER_CONFIG_KEY.NUM_OF_PRODUCTS_IN_MONTH
                }
                await userConfigApi.userCreateProduct(body);
            }
            onSuccess(type)
            setIsLoading(false)
            dispatch(fetchUserStorageInfo())
        }).catch(err => {
            setIsLoading(false)
            notification.error({
                message: err.response?.data?.message || "Add product fail!"
            })
        })
    }

    return <>
        <div className="droba-add-product-container relative">
            {!isInModal && <div className="w-full flex items-center gap-[40px]">
                <button className="btn-back" onClick={() => {onBack()}}>
                    <img src={ArrowLeftIcon} alt="" />
                    Back
                </button>
                <div className="text-add-product">
                    Add {type === PRODUCT_TYPES.ELEMENT ? 'Other' : 'Product'}
                </div>
            </div>}
            <Row gutter={[16, 16]} className={`!ml-0 !mr-0 add-product-form ${!isInModal ? 'mt-[18px]' : '!border-0 !p-0'}`}>
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <Select
                            placeholder="Type"
                            value={block}
                            onChange={(value) => {setBlock(value)}}
                            className="retailer-form-select w-full"
                            popupClassName="retailer-form-select-popup"
                            suffixIcon={<img src={ArrowIcon} alt="" />}
                            options={listUploadBlock}
                        />
                    </Col>
                    <Col lg={16} md={12} sm={24} xs={24}>
                        <div className="group-input">
                            <Input 
                                placeholder='Product Title'
                                className="retailer-form-input" 
                                onChange={(e) => {handleFormDataChange('name', e.target.value)}}
                            />
                        </div>
                    </Col>
                </Row>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <div className="group-input !gap-[6px]">
                        <span className="retailer-form-label">Price</span>
                        <SelectCurrency value={formData?.displayCurrency} onChange={(value) => {handleFormDataChange('displayCurrency', value)}}/>
                        <span className="retailer-form-label">-</span>
                        <InputNumber className="retailer-form-input w-full" min={0} onChange={(value) => {handleFormDataChange('price', value)}}/>
                    </div>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <div className="group-input">
                        <span className="retailer-form-label">Offers/Discounts (%)</span>
                        <InputNumber className="retailer-form-input w-full" min={0} max={100} onChange={(value) => {handleFormDataChange('discount', value)}}/>
                    </div>
                </Col>
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <UploadImage 
                            ref={uploadImageRef}
                            title={<span>Thumnail<span className="text-[#FF0000]">*</span></span>}
                            extraText=""
                        />
                    </Col>
                    <Col lg={18} md={12} sm={24} xs={24}>
                        <UploadModel 
                            ref={uploadModelRef}
                            title={block === "2D" ? <span>Add Image<span className="text-[#FF0000]">*</span></span> : <span>Add 3d model<span className="text-[#FF0000]">*</span></span>}
                            extraText={block === "2D" ? <span>Upload your product image (.png, .jpg)</span> : <span>Add 3d model of your product (upload in format .glb, .fbx, .obj)</span>}
                            accept={block === "2D" ? ".jpg,.png" : ".glb,.fbx,.obj"}
                            uploadLimit={block === "2D" ? uploadLimit.file2D : uploadLimit.file3D}
                        />
                    </Col>
                </Row>
                <Col lg={12} md={24} sm={24} xs={24}>
                    <div className="w-full mb-[25px] retailer-form-label">
                        Description
                    </div>
                    <TextEditor 
                        value={formData?.description || ""}
                        onChange={(e) => {handleFormDataChange('description', e)}}
                    />
                </Col>
                <Col lg={12} md={24} sm={24} xs={24}>
                    <div className="w-full mb-[25px] retailer-form-label">
                        Specification
                    </div>
                    <TextEditor 
                        value={formData?.specification || ""}
                        onChange={(e) => {handleFormDataChange('specification', e)}}
                    />
                </Col>
                <div className="cart-type-content-container mt-[8px]">
                    <div className="group-input">
                        <span className="retailer-form-label">Web Link</span>
                        <Input 
                            placeholder="Web link here"
                            className="retailer-form-input min-w-[300px] max-w-[100%]" 
                            onChange={(e) => {handleFormDataChange('webLink', e.target.value)}}
                        />
                    </div>
                </div>

            </Row>
            <Row gutter={[16, 16]} className={`!ml-0 !mr-0 py-[27px] justify-end pr-[30px] z-[10] ${footerClassname} !bg-[var(--droba-add-product-background)]`}>
                <Spin spinning={loading}>
                    <button className="btn-save" onClick={onSave} id="buttonSaveProduct">
                        <img src={SaveIcon} alt="" />
                        Save
                    </button>
                </Spin>
            </Row>
        </div>
    </>
}
export default DrobAAddProduct;