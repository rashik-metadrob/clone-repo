import { Checkbox, Col, Input, Modal, Row, Select, Spin, notification, InputNumber } from "antd"
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import "./styles.scss"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import { useEffect, useRef, useState } from "react"
import UploadImage from "../../uploadImage/UploadImage"
import UploadImageIcon from "../../../assets/icons/UploadImage"
import _ from "lodash"
import { uploadFile } from "../../../api/upload.api"
import TextArea from "antd/es/input/TextArea"
import { DIMENSION_UNITS, PLACEHOLDER_SIZES, PRODUCT_TYPES, UPLOADS_FOLDER } from "../../../utils/constants"
import { createProduct, updateProduct } from "../../../api/product.api"
import SelectCustomerProductCategories from "../selectCustomerProductCategories/SelectCustomerProductCategories"

const ModalAddEditPlaceholder = ({
    open,
    onClose = () => {},
    item,
    onSuccess = () => {}
}) => {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(open){
            if(item){
                const newFormData = _.pick(item, ["name", "placeholderType", "includedCategoriesIds"]);
                newFormData.plans = newFormData?.plans ? _.filter(newFormData.plans.map(el => _.get(el, "id", null)), el => !_.isNull(el)) : []
                setFormData(newFormData)
            } else {
                setFormData({})
            }
        }
    }, [open, item])

    const handleFormDataChange = (path, value) => {
        const clone = _.cloneDeep(formData)
        _.set(clone, path, value)
        setFormData({
            ...clone,
        })
    }

    const validateForm = () => {
        if(
            _.isNil(formData.name)
        ){
            notification.warning({message: "Name can't not be null!"})
            return false
        } else if(
            _.isNil(formData.placeholderType)
        ){
            notification.warning({message: "Type can't not be null!"})
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        const validate = validateForm()
        if(!validate) {
            return
        }

        // Edit
        if(item) {
            const itemId = item.id || item._id
            if(!itemId){
                notification.warning({message: "Id can't be found!"})
                return
            }
            setLoading(true)
            let placeholderData = {
                ...formData
            }
            const placeholder = await updateProduct(itemId, placeholderData);
            if(placeholder && placeholder.id){
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
        } else {
            // Add
            setLoading(true)
            let placeholderData = {
                ...formData,
                type: PRODUCT_TYPES.PLACEHOLDER,
            }
            const placeholder = await createProduct(placeholderData);
            if(placeholder && placeholder.id){
                notification.success({
                    message: "Add placeholder successfully!"
                })
                setLoading(false)
                onSuccess()
            } else {
                notification.success({
                    message: "Add placeholder failed!"
                })
                setLoading(false)
            }
        }
    }

    return <>
        <Modal
            open={open}
            width={500}
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
                    {item ? "Edit placeholder" : "Add placeholder"}
                </div>
                <Spin spinning={loading}>
                    <Row gutter={[22, 8]} className="mt-[16px]">
                        <Col lg={24} md={24} span={24}>
                            <Input placeholder={'Name'} className="admin-form-input" value={formData?.name} onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                        </Col>
                        <Col lg={24} md={24} span={24}>
                            <Select
                                placeholder="Select type"
                                className="admin-form-select w-full"
                                popupClassName="admin-form-select-popup"
                                showSearch
                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                options={PLACEHOLDER_SIZES}
                                value={formData?.placeholderType} 
                                onChange={(e) => {handleFormDataChange('placeholderType', e)}}
                            />
                        </Col>
                        <Col lg={24} md={24} span={24}>
                            <SelectCustomerProductCategories
                                value={formData.includedCategoriesIds}
                                onChange={(e) => {handleFormDataChange('includedCategoriesIds', e)}}
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
export default ModalAddEditPlaceholder