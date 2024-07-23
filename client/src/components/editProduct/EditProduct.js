import { Col, Input, InputNumber, Radio, Row, Select, Spin, notification } from "antd";
import "./styles.scss"

import ArrowLeftIcon from "../../assets/images/products/arrow-left.svg"

import { useNavigate, useParams } from "react-router-dom";
import UploadModel from "../uploadModel/UploadModel";
import { useEffect, useRef, useState } from "react";
import { getListProductTypes, getProductById, updateProduct } from "../../api/product.api";
import { uploadFile } from "../../api/upload.api";
import UploadImage from "../uploadImage/UploadImage";
import { CART_TYPES, CONFIG_TEXT, CURRENCY_LIST, MODEL_BLOCK, PRICING_PLAN_VALUE, PRODUCT_TYPES, UPLOADS_FOLDER } from "../../utils/constants"
import SaveIcon from "../../assets/images/products/save.svg";
import _ from "lodash";
import TagsInput from "../tagsInput/TagsInput";
import { useDispatch, useSelector } from "react-redux";
import { getIsUserConnectedStoreFront, getUser } from "../../redux/appSlice";
import ShopifyIcon from "../../assets/images/products/shopify.svg"
import RetailerShopifyConfigModal from "../retailerComponents/retailerShopifyConfigModal/RetailerShopifyConfigModal";
import { userApi } from "../../api/user.api";
import TextEditor from "../textEditor/TextEditor";
import { htmlDecode } from "../../utils/util";
import SelectCurrency from "../selectCurrency/SelectCurrency";
import global from "../../redux/global";
import SelectCategory from "../selectCategory/SelectCategory";
import { useAppDispatch } from "../../redux";
import { fetchUserStorageInfo } from "../../redux/userStorageSlice";
const { TextArea } = Input;


const EditProduct = ({
    footerClassname=""
}) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setIsLoading] = useState(false)
    const {id: productId} = useParams()
    const [optionsProductTypes, setOptionsProductTypes] = useState([])
    const [formData, setFormData] = useState({})

    const uploadModelRef = useRef()
    const uploadImageRef = useRef()
    const [isShowModalConfigShopify, setIsShowModalConfigShopify] = useState(false)
    const isUserConnectedStoreFront = useSelector(getIsUserConnectedStoreFront)
    const user = useSelector(getUser)

    const [uploadLimit, setUploadLimit] = useState({
        file2D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        file3D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        fileMedia: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
    })
    
    useEffect(() => {
        getListProductTypes().then(data => {
            setOptionsProductTypes(data.results)
        }).catch(err => {

        })
    }, [])

    useEffect(() => {
        if(!user?.id){
            return
        }
        userApi.getUploadLimitSize().then(rs => {
            setUploadLimit({
                file2D: _.get(rs, ['file2D'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
                file3D: _.get(rs, ['file3D'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
                fileMedia: _.get(rs, ['fileMedia'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
            })
        }).catch(err => {
            // For viewer
        })
    }, [user?.id])

    useEffect(() => {
        if(productId){
            getProductById(productId).then(rs => {
                const newFormData = _.pick(rs, ["image", "block", "objectUrl", "name", "price", "discount", "categoryId", "description", "specification", "type", "tags", "displayCurrency", "useThirdPartyCheckout", "webLink", "shopifyVariantMerchandiseId", "cartType"]);
                
                if(newFormData.description){
                    newFormData.description = htmlDecode(newFormData.description)
                }
                if(newFormData.specification){
                    newFormData.specification = htmlDecode(newFormData.specification)
                }
                if(!newFormData.cartType){
                    // Hanle for old product
                    if(newFormData.useThirdPartyCheckout && newFormData.shopifyVariantMerchandiseId){
                        newFormData.cartType = CART_TYPES.SHOPIFY_CART
                    } else {
                        newFormData.cartType = CART_TYPES.METADROB_CART
                    }
                }
                
                setFormData(newFormData)
            })
        }
    }, [productId])

    const handleFormDataChange = (type, value) => {
        setFormData((data) => {
            return {
                ...data,
                [type]: value
            }
        })
    }

    const onSave = async () => {
        if(formData.type === PRODUCT_TYPES.PRODUCTS && formData.cartType === CART_TYPES.SHOPIFY_CART){
            if(!formData.shopifyVariantMerchandiseId){
                notification.warning({
                    message: CONFIG_TEXT.SHOPIFY_PRODUCT_CAN_ONLY_BE_IMPORTED_FROM_SHOPIFY
                })
                return
            }
        }
        if(
            formData.name === undefined
        ){
            notification.warning({
                message: "Data is invalid!"
            })
            return
        }
        if(formData.type === PRODUCT_TYPES.PRODUCTS){
            if(_.isNil(formData, ['price'])){
                notification.warning({
                    message: "Price can't be null!"
                })
                return
            } else if(_.isNil(formData, ['discount'])){
                notification.warning({
                    message: "Discount can't be null!"
                })
                return
            } else if(!formData.categoryId && !global.IS_DROB_A) {
                notification.warning({
                    message: "Category can't be null!"
                })
                return
            }
        }

        const modelFile = uploadModelRef.current.getFile()
        const imageFile = uploadImageRef.current.getFile()

        setIsLoading(true)

        let productData = {
            ...formData
        }

        if(modelFile){
            const formModelData = new FormData();
            formModelData.append("file", modelFile);
            const modelResult = await uploadFile(formModelData, 2, UPLOADS_FOLDER.PRODUCT)
            if(modelResult.status && modelResult.status !== 200){
                notification.error({
                    message: modelResult.data.message
                })
                setIsLoading(false)
                return
            }
            let modelFileName = modelResult.results
            productData.objectUrl = modelFileName
        }
        

        if(imageFile){
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
            productData.image = imageFileName
        }

        updateProduct(productId, productData).then((data) => {
            notification.success({
                message: "Update product success!"
            })
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
        <div className="edit-product-container relative">
            <div className="w-full flex items-center gap-[40px]">
                <button className="btn-back" onClick={() => {navigate("/dashboard/products")}}>
                    <img src={ArrowLeftIcon} alt="" />
                    Back
                </button>
                <div className="text-add-product">
                    Edit Product
                </div>
            </div>
            <Row gutter={[16, 16]} className="!ml-0 !mr-0 mt-[27px] add-product-form">
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Input 
                            placeholder={formData.type === PRODUCT_TYPES.PRODUCTS ? 'Product Title' : 'Element Title'} 
                            className="retailer-form-input" 
                            value={formData.name} 
                            onChange={(e) => {handleFormDataChange('name', e.target.value)}}
                        />
                    </Col>
                </Row>
                {formData.type === PRODUCT_TYPES.PRODUCTS && <Col lg={12} md={12} sm={24} xs={24}>
                    <div className="group-input">
                        <span className="retailer-form-label">Price<span className="text-[#FF0000]">*</span></span>
                        <SelectCurrency value={formData?.displayCurrency} onChange={(value) => {handleFormDataChange('displayCurrency', value)}}/>
                        <span className="retailer-form-label">-</span>
                        <InputNumber className="retailer-form-input w-full" min={0} value={formData.price} onChange={(value) => {handleFormDataChange('price', value)}}/>
                    </div>
                </Col>}
                {formData.type === PRODUCT_TYPES.PRODUCTS && <Col lg={12} md={12} sm={24} xs={24}>
                    <div className="group-input">
                        <span className="retailer-form-label">Offers/Discounts (%)</span>
                        <InputNumber className="retailer-form-input w-full" min={0} max={100} value={formData.discount} onChange={(value) => {handleFormDataChange('discount', value)}}/>
                    </div>
                </Col>}
                {!global.IS_DROB_A && formData.type === PRODUCT_TYPES.PRODUCTS && <Col lg={12} md={12} sm={24} xs={24}>
                    <div className="group-input">
                        <span className="retailer-form-label">Tag/Collection<span className="text-[#FF0000]">*</span></span>
                        <div className="w-full">
                            <SelectCategory 
                                value={formData?.categoryId}
                                onChange={(value) => {handleFormDataChange('categoryId', value)}}
                            />
                        </div>
                    </div>
                </Col>}
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <UploadImage 
                            ref={uploadImageRef} 
                            placeholderFileName={formData.image}
                        />
                    </Col>
                    <Col lg={18} md={12} sm={24} xs={24}>
                        <UploadModel 
                            ref={uploadModelRef} 
                            placeholderFileName={formData.objectUrl}
                            title={formData?.block === MODEL_BLOCK["2D"] ? "Add Image" : "Add 3d model"}
                            accept={formData?.block === MODEL_BLOCK["2D"] ? ".jpg,.png" : ".glb,.fbx,.obj"}
                            uploadLimit={formData?.block === "2D" ? uploadLimit.file2D : uploadLimit.file3D}
                        />
                    </Col>
                </Row>
                <Col lg={12} md={24} sm={24} xs={24}>
                    <div className="w-full mb-[25px] retailer-form-label">
                        Description
                    </div>
                    <TextEditor 
                        value={formData.description || ""}
                        onChange={(e) => {handleFormDataChange('description', e)}}
                    />
                </Col>
                <Col lg={12} md={24} sm={24} xs={24}>
                    <div className="w-full mb-[25px] retailer-form-label">
                        Specification<span className="text-[#FF0000]">*</span>
                    </div>
                    <TextEditor 
                        value={formData?.specification || ""}
                        onChange={(e) => {handleFormDataChange('specification', e)}}
                    />
                </Col>
                {formData.type === PRODUCT_TYPES.PRODUCTS && <Col span={24}>
                    <div className="group-input">
                        <Radio.Group 
                            onChange={(e) => {handleFormDataChange('cartType', e.target.value)}} 
                            value={formData?.cartType} 
                            className='retailer-form-radio flex-auto text-left'
                        >
                            {!global.IS_DROB_A && <Radio value={CART_TYPES.METADROB_CART}><span className='text-radio'>Metadrob Cart</span></Radio>}
                            {!global.IS_DROB_A && <Radio value={CART_TYPES.SHOPIFY_CART}><span className='text-radio'>Shopify Cart</span></Radio>}
                            <Radio value={CART_TYPES.WEB_LINK}><span className='text-radio'>Web Link</span></Radio>
                        </Radio.Group>
                    </div>
                    {
                        (formData.cartType == CART_TYPES.SHOPIFY_CART || formData.cartType == CART_TYPES.WEB_LINK) && 
                        <div className="cart-type-content-container mt-[8px]">
                            {
                                formData.cartType == CART_TYPES.SHOPIFY_CART && <>
                                    {
                                        isUserConnectedStoreFront && <div className="text-shopify-connected">
                                            Shopify store is connected.
                                        </div>
                                    }
                                    {
                                        !isUserConnectedStoreFront && <div className="flex justify-between items-center gap-[24px] w-full">
                                            <div className="text-import-product">
                                                {CONFIG_TEXT.SHOPIFY_PRODUCT_CAN_ONLY_BE_IMPORTED_FROM_SHOPIFY}
                                            </div>
                                            <button className="btn-connect" onClick={() => {setIsShowModalConfigShopify(true)}}>
                                                <img src={ShopifyIcon} alt="" />
                                                Connect
                                            </button>
                                        </div>
                                    }
                                </>
                            }
                            {
                                formData.cartType == CART_TYPES.WEB_LINK && <>
                                    <div className="group-input">
                                        <span className="retailer-form-label">Web Link</span>
                                        <Input 
                                            placeholder="Enter URL here"
                                            className="retailer-form-input" 
                                            value={formData?.webLink}
                                            onChange={(e) => {handleFormDataChange('webLink', e.target.value)}}
                                        />
                                    </div>
                                    <div className="text-left mt-[4px] text-[10px] text-[var(--dark-blue-text)] font-inter">
                                        {
                                            CONFIG_TEXT.CUSTOMERS_WILL_BE_REDIRECTED_HERE_WHEN_THEY_CLICK_BUY
                                        }
                                    </div>
                                </>
                            }
                        </div>
                    }
                </Col>}
            </Row>
            <Row gutter={[16, 16]} className={`!ml-0 !mr-0 py-[27px] justify-end pr-[30px] ${footerClassname}`}>
                <Spin spinning={loading}>
                    <button className="btn-save" onClick={onSave}>
                        <img src={SaveIcon} alt="" />
                        Save
                    </button>
                </Spin>
            </Row>
        </div>

        <RetailerShopifyConfigModal 
            open={isShowModalConfigShopify} 
            onClose={() => {setIsShowModalConfigShopify(false)}}
            onSuccess={() => {setIsShowModalConfigShopify(false)}}
        />
    </>
}
export default EditProduct;