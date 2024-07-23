import { Checkbox, Col, Input, Modal, Row, Select, Spin, notification } from "antd"
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import "./styles.scss"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import TagsInput from "../../tagsInput/TagsInput"
import { useEffect, useRef, useState } from "react"
import UploadImage from "../../uploadImage/UploadImage"
import UploadImageIcon from "../../../assets/icons/UploadImage"
import UploadModel from "../../uploadModel/UploadModel"
import pricingPlanApi from "../../../api/pricingPlan.api"
import { getProductById, updateProduct } from "../../../api/product.api"
import _ from "lodash"
import { uploadFile } from "../../../api/upload.api"
import { useSelector } from "react-redux"
import { getListDecorativeCategories } from "../../../redux/sharedSlice"
import TextArea from "antd/es/input/TextArea"
import { UPLOADS_FOLDER } from "../../../utils/constants"

const ModalEditDecorative = ({
    open,
    onClose = () => {},
    item,
    onSuccess = () => {}
}) => {
    const uploadTemplateImageRef = useRef()
    const uploadTemplateModelRef = useRef()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [planOptions, setPlanOptions] = useState([])

    const [isShowSelectPlan, setIsShowSelectPlan] = useState(false)
    const [isSelectAllPlan, setIsSelectAllPlan] = useState(false)

    const listproductCategories = useSelector(getListDecorativeCategories)

    useEffect(() => {
        pricingPlanApi.getPricingPlans().then(rs => {
            if(rs && rs.length > 0){
                setPlanOptions(rs.map(el => {
                    return {
                        value: el.id,
                        label: el.name
                    }
                }))
            }
        })
    },[])

    useEffect(() => {
        if(open && item){
            const newFormData = _.pick(item, ["image", "objectUrl", "name", "plans", "tags", "categoryId", "description"]);
            newFormData.plans = newFormData?.plans ? _.filter(newFormData.plans.map(el => _.get(el, "id", null)), el => !_.isNull(el)) : []
            setFormData(newFormData)
        }
    }, [open, item])

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const handleSubmit = async () => {
        const itemId = item.id || item._id

        if(!itemId){
            notification.warning({message: "Id can't be found!"})
            return
        }

        if(
            formData.name === undefined
        ){
            notification.warning({message: "Name can't not be null!"})
            return
        }

        if(
            formData.categoryId === undefined
        ){
            notification.warning({message: "Category can't not be null!"})
            return
        }

        const modelFile = uploadTemplateModelRef.current.getFile()
        const imageFile = uploadTemplateImageRef.current.getFile()

        setLoading(true)

        let modelFileName = formData.objectUrl
        if(modelFile){
            const formModelData = new FormData();
            formModelData.append("file", modelFile);
            const modelResult = await uploadFile(formModelData, 0, UPLOADS_FOLDER.DECORTATIVE)
            if(modelResult.status && modelResult.status !== 200){
                notification.error({
                    message: modelResult.data.message
                })
                setLoading(false)
                return
            }
            modelFileName = modelResult.results
        }
        
        let imageFileName = formData.image
        if(imageFile){
            const formImageData = new FormData();
            formImageData.append("file", imageFile);
            const modelImageResult = await uploadFile(formImageData, 1, UPLOADS_FOLDER.DECORATIVE_THUMNAIL)
            if(modelImageResult.status && modelImageResult.status !== 200){
                notification.error({
                    message: modelImageResult.data.message
                })
                setLoading(false)
                return
            }
            imageFileName = modelImageResult.results
        }
        

        let productData = {
            ...formData,
            image: imageFileName,
            objectUrl: modelFileName,
        }

        const product = await updateProduct(itemId, productData);
        if(product && product.id){
            notification.success({
                message: "Update successfully!"
            })
            setLoading(false)
            onSuccess()
        } else {
            notification.success({
                message: "Update failed!"
            })
            setLoading(false)
        }
    }

    const onSelectAllPlanChange = (value) => {
        setIsSelectAllPlan(value)
        if(value){
            handleFormDataChange('plans', planOptions.map(el => el.value))
        } else {
            handleFormDataChange('plans', [])
        }
    }

    const onSelectPlan = (value, checked) => {
        if(checked && (!formData.plans || !formData.plans.includes(value))){
            handleFormDataChange('plans', [...(formData.plans || []), value])
        }

        if(!checked && formData.plans && formData.plans.includes(value)){
            handleFormDataChange('plans', formData.plans.filter(el => el !== value))
        }
    }

    return <>
        <Modal
            open={open}
            width={794}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            centered
            className="modal-admin-edit modal-edit-decorative"
            onCancel={() => {onClose()}}
        >
            <div className="modal-edit-decorative-content">
                <div className="title">
                    Edit decorative
                </div>
                <Spin spinning={loading}>
                    <Row gutter={[22, 8]} className="mt-[16px]">
                        <Col lg={12} md={12} span={24}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Input placeholder={'Name'} className="admin-form-input" value={formData?.name} onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                                </Col>
                                <Col span={24}>
                                    <Select
                                        mode="multiple"
                                        placeholder="Select Plan"
                                        className="admin-form-select w-full"
                                        popupClassName="admin-form-select-popup-plans"
                                        showSearch
                                        suffixIcon={<img src={ArrowIcon} alt="" />}
                                        value={formData?.plans}
                                        options={planOptions}
                                        open={isShowSelectPlan}
                                        onDropdownVisibleChange={(value) => {setIsShowSelectPlan(value)}}
                                        onDeselect={(value) => {onSelectPlan(value, false)}}
                                        dropdownRender={() => (
                                            <>
                                                <div className="popup-content">
                                                    <div className="item">
                                                        <Checkbox checked={isSelectAllPlan} onChange={(e) => {onSelectAllPlanChange(e.target.checked)}}>
                                                            <span className="text">All Plans</span>
                                                        </Checkbox>
                                                    </div>
                                                    {
                                                        planOptions && planOptions.map(el => <>
                                                            <div className="item" key={el.value}>
                                                                <Checkbox checked={formData.plans && formData.plans.includes(el.value)} onChange={(e) => {onSelectPlan(el.value, e.target.checked)}}>
                                                                    <span className="text">{el.label}</span>
                                                                </Checkbox>
                                                            </div>
                                                        </>)
                                                    }
                                                </div>
                                            </>
                                        )}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={12} md={12} span={24}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <TagsInput 
                                        value={formData?.tags} 
                                        onChange={(value) => {handleFormDataChange('tags', value)}} 
                                        className="admin-meta-tags"
                                    />
                                </Col>
                                <Col span={24}>
                                    <Select
                                        placeholder="Select a category"
                                        className="admin-form-select w-full"
                                        popupClassName="admin-form-select-popup"
                                        suffixIcon={<img src={ArrowIcon} alt="" />}
                                        options={listproductCategories}
                                        value={formData.categoryId}
                                        onChange={(value) => {handleFormDataChange('categoryId', value)}}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={8} md={8} span={24}>
                            <UploadImage 
                                ref={uploadTemplateImageRef}
                                title={"Thumnail"}
                                extraText=""
                                className="admin-image-uploader"
                                placeholderFileName={formData?.image}
                                uploadImage={<UploadImageIcon />}
                            />
                        </Col>
                        <Col lg={16} md={16} span={24}>
                            <UploadModel 
                                ref={uploadTemplateModelRef}
                                title={"Add 3d model"}
                                extraText={`Drag & drop your 3d model of Decorative (upload in format .Fbx .Glb .obj)`}
                                accept={".glb,.fbx,.obj"}
                                placeholderFileName={formData?.objectUrl}
                                className="admin-model-uploader"
                            />
                        </Col>
                        <Col span={24}>
                            <TextArea 
                                placeholder={'Description'} 
                                className="admin-form-input" 
                                rows={4} 
                                maxLength={600}
                                value={formData.description}
                                onChange={(e) => {handleFormDataChange('description', e.target.value)}}
                            />
                        </Col>
                    </Row>
                </Spin>
                <div className="flex items-center justify-center mt-[18px]">
                    <div className="btn-save" onClick={handleSubmit}>
                        Save
                    </div>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalEditDecorative