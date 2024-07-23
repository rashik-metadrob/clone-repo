import { Col, Drawer, Input, Row, Select, Spin, Tooltip } from "antd"
import SearchIcon from "../../assets/images/project/search.svg"
import FilterIcon from "../../assets/images/project/filter.svg"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { getListPublicDecorarive, getListPublicDecorariveForViewer } from "../../api/product.api"
import "./styles.scss"
import { productCategoryApi } from "../../api/productCategory.api"
import TriangleIcon from "../../assets/images/products/triangle.svg"
import { MODAL_STORE_EDITOR_WIDTH, PLACEHOLDER_SIZES, PRODUCT_TYPES, USER_ROLE } from "../../utils/constants"
import ExitIcon from "../../assets/images/project/exit.svg"
import DecorIcon from "../../assets/images/project/decor.svg"
import { getAssetsUrl } from "../../utils/util"
import Lottie from "lottie-react"
import loadingAnimation from "../../assets/json/Add Products.json"
import _ from "lodash"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { getIsViewerMode } from "../../redux/modelSlice"
import { getSharedListDecoratives, setSharedListDecoratives } from "../../redux/sharedSlice"
import { useAppDispatch } from "../../redux"
import global from "../../redux/global"
import SearchLibraryInput from "../searchLibraryInput/SearchLibraryInput"

const DrawerDecoratives = forwardRef(({
    open,
    onClose = () => {},
    container,
    handleDragEnd = () => {}
}, ref) => {
    const dispatch = useAppDispatch()
    const sharedListDecoratives = useSelector(getSharedListDecoratives)
    const [listCategoryFilter, setListCategoryFilter] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [loading, setLoading] = useState(false)
    const {editorRole} = useParams()
    const searchValue = useRef("")

    useImperativeHandle(ref, () => ({
        reloadData: () => {loadListDecorative()}
    }));

    useEffect(() => {
        productCategoryApi.getListDecorativeCategories({limit: 1000, page: 1}).then(data => {
            setListCategoryFilter(data.map(el => {return {label: el.name, value: el.id}}))
        }).catch(err => {
        })
    }, [])

    useEffect(() => {
        loadListDecorative()
    }, [selectedCategory])

    const onSearch = (value) => {
        searchValue.current = value
        loadListDecorative()
    }

    const loadListDecorative = () => {
        setLoading(true)
        let filter = {
            page: 1, 
            limit: 1000, 
            types: global.IS_SHOPIFY ? [PRODUCT_TYPES.DECORATIVES].toString() : [PRODUCT_TYPES.DECORATIVES, PRODUCT_TYPES.PLACEHOLDER].toString(),
            search: searchValue.current,
            isOnlyNonDisable: true,
        }
        if(selectedCategory !== "All"){
            filter.categoryId = selectedCategory
        }
        if(editorRole && editorRole === USER_ROLE.VIEWER){
            getListPublicDecorariveForViewer(filter).then(data => {
                dispatch(setSharedListDecoratives(data.results))
                setLoading(false)
            }).catch(err => {
                setLoading(false)
            })
        } else {
            getListPublicDecorarive(filter).then(data => {
                dispatch(setSharedListDecoratives(data.results))
                setLoading(false)
            }).catch(err => {
                setLoading(false)
            })
        }
        
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
            <div className="drawer-library-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={DecorIcon} alt="" />
                            Decoratives
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
                <Row className="library-list !ml-0 !mr-0 my-[24px]" gutter={[24, 24]} style={{flexGrow: "initial"}}>
                    {
                        loading && <Col span={24}>
                            <Spin spinning={true} className="loading-indicator-wrapper-no-translate" indicator={<Lottie animationData={loadingAnimation} />}> 
                            </Spin>
                        </Col>
                    }
                    {
                        !loading && _.get(sharedListDecoratives, ['length'], 0) > 0 && sharedListDecoratives.map((el, index) => (
                            <Col span={12} key={el.id}>
                                <Tooltip arrow={false} overlayClassName="decorative-tooltip-overlay" placement="right" title={_.get(el, ['description'], '')}>
                                    <div className="library-item">
                                        {el.type === PRODUCT_TYPES.PLACEHOLDER && 
                                            <div className="flex h-full w-full items-center justify-center" draggable="true" onDragEnd={(e) => {handleDragEnd(e, el)}}>
                                                <div className="text-[80px] select-none font-[600] text-[#FFFFFF] leading-[100%]">
                                                    {_.get(_.get(_.find(PLACEHOLDER_SIZES, o => o.value === el.placeholderType), ['label'], ""), [0], '')}
                                                </div>
                                            </div>
                                        }
                                        {el.type !== PRODUCT_TYPES.PLACEHOLDER && <img src={getAssetsUrl(el.image)} alt="" draggable="true" onDragEnd={(e) => {handleDragEnd(e, el)}}/>}
                                        <div className="library-name">
                                            {el.name}
                                        </div>
                                    </div>
                                </Tooltip>
                            </Col>
                        ))
                    }
                </Row>
            </div>
        </Drawer>
    </>
})

export default DrawerDecoratives;