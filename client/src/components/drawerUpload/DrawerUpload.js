import { Col, Drawer, Row, Spin } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import "./styles.scss"
import UploadHeaderIcon from "../../assets/images/project/upload-icon.svg"
import ExitIcon from "../../assets/images/project/exit.svg"
import UploadIcon from "../../assets/images/project/upload-btn.svg"
import { MODAL_STORE_EDITOR_WIDTH, PRODUCT_TYPES } from "../../utils/constants"
import { getProducts } from "../../api/product.api"
import { getAssetsUrl } from "../../utils/util"
import Lottie from "lottie-react"
import loadingAnimation from "../../assets/json/Add Products.json"
import { useSelector } from "react-redux"
import { getIsViewerMode } from "../../redux/modelSlice"
import SearchLibraryInput from "../searchLibraryInput/SearchLibraryInput"
import UserCapacityInfo from "../userCapacityInfo/UserCapacityInfo"

const DrawerUpload = forwardRef(({
    open,
    onClose = () => {},
    container,
    handleDragEnd = () => {},
    onUpload = () => {}
}, ref) => {
    const [ListModel, setListModel] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [loading, setLoading] = useState(false)
    const isViewerMode = useSelector(getIsViewerMode)
    const searchValue = useRef("")

    useImperativeHandle(ref, () => ({
        reloadData: () => {loadListProduct()}
    }));

    useEffect(() => {
        loadListProduct()
    }, [selectedCategory])

    const onSearch = (value) => {
        searchValue.current = value
        loadListProduct()
    }

    const loadListProduct = () => {
        if(isViewerMode){
            return
        }
        setLoading(true)
        let filter = {
            page: 1, 
            limit: 1000, 
            types: [PRODUCT_TYPES.ELEMENT],
            search: searchValue.current,
            isOnlyNonDisable: true,
        }
        if(selectedCategory !== "All"){
            filter.categoryId = selectedCategory
        }
        getProducts(filter).then(data => {
            setListModel(data.results)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }

    return <>
        <Drawer
            title={null}
            placement="left"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-shared"
            width={MODAL_STORE_EDITOR_WIDTH}
            mask={false}
        >
            <div className="drawer-upload-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={UploadHeaderIcon} alt="" />
                            Upload Elements
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                    <div className="search-container mt-[11px]">
                        <SearchLibraryInput onSearch={onSearch}/>
                    </div>
                    {/* <div className="select-cate-container mt-[11px]">
                        <Select
                            className="category-filter-select w-full"
                            value={selectedCategory}
                            suffixIcon={<img src={TriangleIcon} alt="" />}
                            options={[...listCategoryFilter, {label: "All", value: "All"}]}
                            popupClassName="admin-form-select-popup"
                            onChange={(val) => {
                                setSelectedCategory(val);
                            }}
                        />
                    </div> */}
                </div>
                <Row className="upload-list !ml-0 !mr-0 my-[24px]" gutter={[24, 24]}>
                    {
                        loading && <Col span={24}>
                            <Spin spinning={true} className="loading-indicator-wrapper-no-translate" indicator={<Lottie animationData={loadingAnimation} />}> 
                            </Spin>
                        </Col>
                    }
                    {
                        !loading && ListModel && ListModel.map((el, index) => 
                        (
                            <Col span={12} key={el.id} className="h-fit">
                                <div className="upload-item">
                                    <img src={getAssetsUrl(el.image)} alt="" draggable="true" onDragEnd={(e) => {handleDragEnd(e, el)}}/>
                                    <div className="upload-name">
                                        {el.name}
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
                <div className="upload-container justify-between gap-[42px] px-[16px] items-center">
                    <UserCapacityInfo />
                    <button className="btn-upload" onClick={onUpload}>
                        <img src={UploadIcon} alt="" />
                        Upload
                    </button>
                </div>
            </div>
        </Drawer>
    </>
})

export default DrawerUpload;