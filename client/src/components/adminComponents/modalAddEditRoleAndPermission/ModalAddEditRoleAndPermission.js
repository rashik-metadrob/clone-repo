import { Checkbox, Col, Input, Modal, Row, Select, Spin, notification } from "antd"
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import { useEffect, useMemo, useState } from "react"
import _ from "lodash"
import roleAndPermissionApi from "../../../api/roleAndPermission.api"
import TextArea from "antd/es/input/TextArea"
import { useDispatch, useSelector } from 'react-redux';
import { getListPermissions } from "../../../redux/roleSlice"

const ModalAddEditRoleAndPermission = ({
    open,
    onClose = () => {},
    item,
    onSuccess = () => {},
    isSuperAdminRole = false,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        descriptions: "",
        permissions: []
    })
    const listPermission = useSelector(getListPermissions)
    const isCheckAll = useMemo(() => {
        const permissions = _.get(formData, ['permissions'], [])

        return !_.some(listPermission, el => !permissions.includes(el.code))
    }, [listPermission, formData])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(open) {
            if(item) {
                setFormData(_.pick(item, ['name', 'permissions', 'description']))
            } else {
                setFormData({
                    name: "",
                    descriptions: "",
                    permissions: []
                })
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
            let roleAndPermissionData = {
                ...formData,
                isSuperAdminRole
            }
            roleAndPermissionApi.updateRoleAndPermissionById(itemId, roleAndPermissionData).then(() => {
                notification.success({
                    message: "Update successfully!"
                })
                setLoading(false)
                onSuccess()
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Update failed!`)
                })
                setLoading(false)
            })
        } else {
            // Add
            setLoading(true)
            let roleAndPermissionData = {
                ...formData,
                isSuperAdminRole,
            }
            roleAndPermissionApi.createRoleAndPermission(roleAndPermissionData).then(() => {
                notification.success({
                    message: "Add role successfully!"
                })
                setLoading(false)
                onSuccess()
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Add failed!`)
                })
                setLoading(false)
            })
        }
    }

    const onPermissionChange = (code, value) => {
        let permissions = _.get(formData, 'permissions', [])
        if(value) {
            permissions.push(code)
        } else {
            permissions = permissions.filter(el => el !== code)
        }

        permissions = _.uniq(permissions)

        setFormData({
            ...formData,
            permissions: permissions,
        })
    }

    const onCheckAll = (value) => {
        if(value) {
            const permissions = listPermission.filter(el => el.isForRetailer ).map(el => el.code)
            setFormData({
                ...formData,
                permissions: permissions,
            })
        } else {
            setFormData({
                ...formData,
                permissions: [],
            })
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
                    {item ? "Edit role" : "Add role"}
                </div>
                <Spin spinning={loading}>
                    <Row gutter={[22, 8]} className="mt-[16px]">
                        <Col lg={24} md={24} span={24}>
                            <Input 
                                disabled={item && item.isDefaultRole}
                                roleAndPermission={'Name'} 
                                className="admin-form-input" 
                                value={formData?.name} 
                                onChange={(e) => {handleFormDataChange('name', e.target.value)}
                            }/>
                        </Col>
                        <Col lg={24} md={24} span={24}>
                            <div className="font-inter text-[18px] font-[600] text-[#FFF] flex justify-between gap-[12px] items-center">
                                <span>Permissions</span>
                                <Checkbox
                                    className="shared-checkbox"
                                    checked={isCheckAll}
                                    onChange={(e) => {onCheckAll(e.target.checked)}}
                                />
                            </div>
                            {
                                !isSuperAdminRole && <>
                                    <div className="flex flex-col gap-[12px] mt-[18px]">
                                        {
                                            listPermission.filter(el => el.isForRetailer).map((el) => (
                                                <>
                                                    <div className="flex gap-[12px] justify-between items-center" key={el.code}>
                                                        <span className="font-inter text-[12px] text-[#FFFFFF] font-[500]">
                                                            {el.name}
                                                        </span>
                                                        <Checkbox
                                                            className="shared-checkbox"
                                                            checked={formData?.permissions.includes(el.code)}
                                                            onChange={(e) => {onPermissionChange(el.code, e.target.checked)}}
                                                        />
                                                    </div>
                                                </>
                                            ))
                                        }
                                    </div>
                                </>
                            }
                            {
                                isSuperAdminRole && <>
                                    <div className="flex flex-col gap-[12px] max-h-[250px] overflow-y-auto mt-[18px]">
                                        {
                                            listPermission.filter(el => !el.isForRetailer).map((el) => (
                                                <>
                                                    <div className="flex gap-[12px] justify-between items-center" key={el.code}>
                                                        <span className="font-inter text-[12px] text-[#FFFFFF] font-[500]">
                                                            {el.name}
                                                        </span>
                                                        <Checkbox
                                                            className="shared-checkbox"
                                                            checked={formData?.permissions.includes(el.code)}
                                                            onChange={(e) => {onPermissionChange(el.code, e.target.checked)}}
                                                        />
                                                    </div>
                                                </>
                                            ))
                                        }
                                    </div>
                                </>
                            }
                            
                        </Col>
                        <Col lg={24} md={24} span={24}>
                            <TextArea 
                                disabled={!!item} 
                                roleAndPermission={'Name'} 
                                className="admin-form-input"
                                rows={3}
                                value={formData?.description} 
                                onChange={(e) => {handleFormDataChange('description', e.target.value)}
                            }/>
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

export default ModalAddEditRoleAndPermission