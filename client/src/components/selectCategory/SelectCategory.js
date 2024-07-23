import { Col, Input, Modal, Row, Select, Spin, notification } from "antd"
import { useEffect, useState } from "react"
import ArrowIcon from "../../assets/images/products/arrow-down.svg"
import { productCategoryApi } from "../../api/productCategory.api"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import SaveIcon from "../../assets/images/products/save.svg"

import "./styles.scss"
import _ from "lodash"
import { CATEGORY_TYPE } from "../../utils/constants"

const SelectCategory = ({
    value,
    onChange = () => {}
}) => {
    const [isShowSelected, setIsShowSelected] = useState(false)
    const [listCategories, setListCategories] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)
    const [categoryName, setCategoryName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        productCategoryApi.getListProductCategories({
            page: 1,
            limit: 100,
            type: CATEGORY_TYPE.PRODUCT
        }).then(rs => {
            setListCategories(rs.results.map(el => {return {label: el.name, value: el.id}}))
        })
    }

    const onCategoryChange = (value) => {
        setIsShowSelected(false)
        onChange(value)
    }

    const onSave = () => {
        if(!categoryName){
            notification.warning({
                message: "Category name can't be null!"
            })

            return
        }

        setIsLoading(true)
        productCategoryApi.createProductCategory({
            name: categoryName,
            type: CATEGORY_TYPE.PRODUCT
        }).then(rs => {
            setIsLoading(false)
            setIsShowModal(false)
            loadData()
        }).catch(err => {
            setIsLoading(false)

            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't create category!`)
            })
        })
    }

    return <>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Select
                    placeholder="Select"
                    className="retailer-form-select w-full"
                    popupClassName="retailer-form-select-category-popup"
                    dropdownRender={() => (
                        <>
                            <div className="popup-content">
                                <div className="item-new">
                                    <span>
                                        New Collection
                                    </span>
                                    <button className="btn-add" onClick={() => {setIsShowModal(true)}}>
                                        + Add
                                    </button>
                                </div>
                                {
                                    listCategories.map(el => (
                                        <div className="item" onClick={(e) => {onCategoryChange(el.value)}}>
                                            <span>
                                                {el.label}
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )}
                    suffixIcon={<img src={ArrowIcon} alt="" />}
                    options={listCategories}
                    value={value}
                    open={isShowSelected}
                    onDropdownVisibleChange={(open) => {setIsShowSelected(open)}}
                />
            </Col>
        </Row>

        <Modal
            open={isShowModal}
            width={400}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            className="modal-add-category"
            centered
            onCancel={() => {setIsShowModal(false)}}
        >
            <div className="modal-add-category-content">
                <div className="modal-add-category-title">
                    Enter category name
                </div>
                <Input 
                    placeholder="Category name" 
                    className="retailer-form-input mt-[16px]" 
                    value={categoryName}
                    onChange={(e) => {setCategoryName(e.target.value)}}
                />
                <Row gutter={[16, 16]} className={`!ml-0 !mr-0 mt-[14px] justify-end pr-[30px]`}>
                    <Spin spinning={isLoading}>
                        <button className="btn-save" onClick={() => {onSave()}}>
                            <img src={SaveIcon} alt="" />
                            Save
                        </button>
                    </Spin>
                </Row>
            </div>
        </Modal>
    </>
}

export default SelectCategory