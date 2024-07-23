import { Col, Drawer, Row, Select, Spin } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { getProducts } from "../../api/product.api"
import "./styles.scss"
import { CART_TYPES, CATEGORY_TYPE, MODAL_STORE_EDITOR_WIDTH, PRODUCT_TYPES } from "../../utils/constants"
import ProdIcon from "../../assets/images/project/prod.svg"
import ExitIcon from "../../assets/images/project/exit.svg"
import TriangleIcon from "../../assets/images/products/triangle.svg"
import { productCategoryApi } from "../../api/productCategory.api"
import UploadIcon from "../../assets/images/project/upload-btn.svg"
import loadingAnimation from "../../assets/json/Add Products.json"
import { getAssetsUrl } from "../../utils/util"
import Lottie from "lottie-react"
import { useDispatch, useSelector } from "react-redux"
import { getStepStoreOnboardingIndexForRetailer, getWaitingForAction, setStoreOnboardingRunForRetailer, setWaitingForAction } from "../../redux/joyrideSlice"
import { getIsViewerMode } from "../../redux/modelSlice"
import global from "../../redux/global"
import SearchLibraryInput from "../searchLibraryInput/SearchLibraryInput"
import UserCapacityInfo from "../userCapacityInfo/UserCapacityInfo"
import _ from "lodash"
import { getUser } from "../../redux/appSlice"
import usePermissions from "../../hook/usePermissions"

const DrawerProducts = forwardRef(({
    open,
    onClose = () => {},
    container,
    handleDragEnd = () => {},
    onUpload = () => {}
}, ref) => {
    const dispatch = useDispatch()
    const [ListModel, setListModel] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [loading, setLoading] = useState(false)
    const [listCategoryFilter, setListCategoryFilter] = useState([])
    const isOnboardWaitingForAction = useSelector(getWaitingForAction);
    const stepStoreOnboardingIndexForRetailer = useSelector(getStepStoreOnboardingIndexForRetailer);
    const isViewerMode = useSelector(getIsViewerMode)
    const searchValue = useRef("")
    const isStaff = usePermissions()

    useImperativeHandle(ref, () => ({
        reloadData: () => {loadListProduct(true)}
    }));

    useEffect(() => {
        productCategoryApi.getListProductCategories({limit: 1000, page: 1, type: CATEGORY_TYPE.PRODUCT}).then(data => {
            setListCategoryFilter(data.results.map(el => {return {label: el.name, value: el.id}}))
        }).catch(err => {
            
        })
    }, [])

    useEffect(() => {
        loadListProduct()
    }, [selectedCategory])

    const onSearch = (value) => {
        searchValue.current = value
        loadListProduct(false)
    }

    const loadListProduct = (isFromRef = false) => {
        if(isViewerMode){
            return
        }
        setLoading(true)
        let filter = {
            page: 1, 
            limit: 1000, 
            type: PRODUCT_TYPES.PRODUCTS,
            search: searchValue.current,
            isOnlyNonDisable: true,
        }
        if(selectedCategory !== "All"){
            filter.categoryId = selectedCategory
        }
        if(global.IS_DROB_A){
            filter.cartType = CART_TYPES.WEB_LINK
        }
        getProducts(filter).then(data => {
            setListModel(data.results)
            setLoading(false)
            if(isOnboardWaitingForAction && stepStoreOnboardingIndexForRetailer === 4 && isFromRef){
                setTimeout(() => {
                    dispatch(setWaitingForAction(false))
                    dispatch(setStoreOnboardingRunForRetailer(true))
                }, 1000);
            }
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
            <div className="drawer-product-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={ProdIcon} alt="" />
                            Products
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                    <div className="search-container mt-[11px]">
                        <SearchLibraryInput onSearch={onSearch}/>
                    </div>
                    <div className="select-cate-container mt-[11px]">
                        <Select
                            className="category-filter-select w-full"
                            value={selectedCategory}
                            suffixIcon={<img src={TriangleIcon} alt="" />}
                            options={[...listCategoryFilter, {label: "All", value: "All"}]}
                            popupClassName="admin-form-select-popup"
                            onChange={(val) => {
                                setSelectedCategory(val);
                            }}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </div>
                </div>
                <Row className="product-list !ml-0 !mr-0 my-[24px]" gutter={[24, 24]}>
                    {
                        loading && <Col span={24}>
                            <Spin spinning={true} className="loading-indicator-wrapper-no-translate" indicator={<Lottie animationData={loadingAnimation} />}> 
                            </Spin>
                        </Col>
                    }
                    {
                        !loading && ListModel && ListModel.map((el, index) => (
                            <Col span={12} key={el.id} className="h-fit">
                                <div className="product-item">
                                    <img src={getAssetsUrl(el.image)} alt="" draggable="true" onDragEnd={(e) => {handleDragEnd(e, el)}}/>
                                    <div className="product-name">
                                        {el.name}
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
                <div className="upload-container justify-between gap-[42px] px-[16px] items-center">
                    <UserCapacityInfo />
                    {!isStaff && <button className="btn-upload" onClick={onUpload} id="btnUploadProduct">
                        <img src={UploadIcon} alt="" />
                        Upload
                    </button>}
                </div>
            </div>
        </Drawer>
    </>
})

export default DrawerProducts;