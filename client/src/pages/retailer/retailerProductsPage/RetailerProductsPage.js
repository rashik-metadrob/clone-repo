import { Col, Input, Row, Select, Spin, notification } from "antd"
import ArrowLeftIcon from "../../../assets/images/products/arrow-left.svg"
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import "./styles.scss"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProductTabType, setProductTabType } from "../../../redux/uiSlice"
import { MODEL_BLOCK_OPTIONS, PRODUCT_TAB_TYPES, PRODUCT_TYPES } from "../../../utils/constants"
import PlusIcon from "../../../assets/icons/PlusIcon"
import RetailerProductsTable from "../../../components/retailerComponents/retailerProductsTable/RetailerProductsTable"
import { useNavigate } from "react-router-dom"
import ImportShopifyProductModal from "../../../components/importProductModal/ImportProductModal"
import shopifyApi from "../../../api/shopify.api"
import { getUser } from "../../../redux/appSlice"
import _ from "lodash"
import RetailerMediasTable from "../../../components/retailerComponents/retailerMediasTable/RetailerMediasTable"
import RetailerOthersTable from "../../../components/retailerComponents/retailerOthersTable/RetailerOthersTable"
import RetailerShopifyConfigModal from "../../../components/retailerComponents/retailerShopifyConfigModal/RetailerShopifyConfigModal"
import RetailerAssetsTable from "../../../components/retailerComponents/retailerAssetsTable/RetailerAssetsTable"
import global from "../../../redux/global"
import { useAuthenticatedFetch } from "../../../modules/shopify/hooks"
import SearchIcon from "../../../assets/images/layout/search.svg"
import ExitIcon from "../../../assets/images/drob-a/exit.svg"
import SearchSuffixIcon from "../../../assets/images/layout/admin/search-suffix.svg"
import ModalRetailerImportProductFromCsv from "../../../components/retailerComponents/modalRetailerImportProductFromCsv/ModalRetailerImportProductFromCsv"
import ModalRetailerOdooConfig from "../../../components/retailerComponents/modalRetailerOdooConfig/ModalRetailerOdooConfig"

const RetailerProductsPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const productRef = useRef()
    const [searchValue, setSearchValue] = useState("")
    const [pageSize, setPageSize] = useState(15)
    const productTabType = useSelector(getProductTabType)
    const [blockType, setBlockType] = useState("All")
    const [shopifyProducts, setShopifyProducts] = useState([])
    const [isShowModalImportProduct, setIsShowModalImportProduct] = useState(false)
    const [loading, setIsLoading] = useState(false)
    const [isShowModalConfigShopify, setIsShowModalConfigShopify] = useState(false)
    const [isShowModalConfigOdoo, setIsShowModalConfigOdoo] = useState(false)
    const [isShowModalImportCsv, setIsShowModalImportCsv] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState('Shopify')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetch = global.IS_SHOPIFY ? useAuthenticatedFetch() : null
    const onBack = () => {

    }

    const onImportProductFromShopify = async () => {
        // if(!window.shopifyHost || !window.shopifyShop){
        //     notification.error({
        //         message: "Can't connect to Shopify! Please press F5 and try again!"
        //     })
        //     return
        // }
        setIsLoading(true)
        // Used Shopify session via @shopify/shopify-app-express
        const response = await fetch( "/shopify/product/get-all", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json()
        setShopifyProducts(
            _.get(data, 'data', []).map((el, index) => {
                return {
                    key: index,
                    ...el
                }
            })
        )
        setIsShowModalImportProduct(true)
        setIsLoading(false)

        // shopifyApi.importProductsFromShopify({host: window.shopifyHost, shop: window.shopifyShop}).then(data => {
        //     setIsLoading(false)
        //     setShopifyProducts(
        //         _.get(data, 'data', []).map((el, index) => {
        //             return {
        //                 key: index,
        //                 ...el
        //             }
        //         })
        //     )
        //     setIsShowModalImportProduct(true)
        // }).catch(err => {
        //     notification.error({
        //         message: _.get(err, ['response', 'data', 'message'], `Can't get product data from Shopify!`)
        //     })
        //     setIsLoading(false)
        // })
    }

    const onImportProductFromShopifyByStoreFront = () => {
        if(!user?.shopifyAccessToken || !user?.shopifyStoreName){
            notification.warning({
                message: "Your shopify store isn't set up!"
            })
            return
        }

        setIsLoading(true)
        shopifyApi.getProductsByStoreFrontAPI({
        }).then(data => {
            setShopifyProducts(
                _.get(data, 'data', []).map((el, index) => {
                    return {
                        key: index,
                        ...el
                    }
                })
            )
            setIsShowModalImportProduct(true)
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't get product data from Shopify!`)
            })
            setIsLoading(false)
        })
    }

    const onUploadSuccess = () => {
        setIsShowModalImportProduct(false)
        if(productRef.current && productRef.current.reloadData){
            productRef.current.reloadData()
        }
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 px-[7px] mt-[23.7px] retailer-products-page mb-[41px] template-page">
            <Col span={24} className="retailer-products-page-top-container">
                <div className="back-container">
                    <button className="btn-back" onClick={() => {onBack()}}>
                        <img src={ArrowLeftIcon} alt="" />
                        Back
                    </button>
                </div>
                {!global.IS_SHOPIFY && !global.IS_DROB_A && <div className="mt-[20px] import-product-container">
                    <div className="text-import">
                        Import Products from
                    </div>
                    <div className="flex gap-[21px] flex-wrap items-center">
                        <div className="retailer-filter-container">
                            <Select
                                className="filter-select-with-icon !min-w-[217px] max-w-[100%]"
                                value={selectedPlatform}
                                onChange={(e) => {setSelectedPlatform(e)}}
                                options={[
                                    {
                                        value: 'Shopify',
                                        label: 'Shopify',
                                    },
                                    {
                                        value: 'Odoo',
                                        label: 'Odoo',
                                    }
                                ]}
                                popupClassName="retailer-form-select-popup"
                                suffixIcon={<DownArrowIcon/>}
                            />
                        </div>
                        <button className="btn-connect" onClick={() => {
                            if(selectedPlatform === "Shopify") {
                                setIsShowModalConfigShopify(true)
                            } else if(selectedPlatform === "Odoo") {
                                setIsShowModalConfigOdoo(true)
                            }
                        }}>
                            Connect
                        </button>
                    </div>
                </div>}
            </Col>
            <Col span={24}>
                <Row gutter={[26, 26]} className="mt-[41px] retailer-products-page-container">
                    <Col span={24}>
                        <div className="container-header retailer-container-header">
                            <div className="left-side__template">
                                <div className="flex gap-[24px] items-center flex-nowrap">
                                    <div className="retailer-filter-container">
                                        <Select
                                            className="filter-select"
                                            value={blockType}
                                            placeholder="Product Type"
                                            onChange={(e) => {setBlockType(e)}}
                                            options={[
                                                {
                                                    value: 'All',
                                                    label: 'All',
                                                },
                                                ...MODEL_BLOCK_OPTIONS
                                            ]}
                                            popupClassName="retailer-form-select-popup"
                                            suffixIcon={<DownArrowIcon/>}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Search"
                                        className='retailer-shared-search'
                                        prefix={<img src={SearchIcon} alt="" />}
                                        value={searchValue}
                                        onChange={(e) => {
                                            setSearchValue(e.target.value)
                                        }}
                                        suffix={
                                            <>
                                                {
                                                    searchValue && <img 
                                                        src={ExitIcon} 
                                                        alt="Clear" 
                                                        className="w-[24px] h-[24px] opacity-30 hover:opacity-100 cursor-pointer transition-all"
                                                        onClick={() => {setSearchValue("")}}
                                                    />
                                                }
                                                {
                                                    !searchValue && <img 
                                                        src={SearchSuffixIcon}
                                                        alt=""
                                                    />
                                                }
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                            <div className="right-side__template">
                                <span className="text">
                                    Show
                                </span>
                                <div className="retailer-filter-container">
                                    <Select
                                        className="filter-page-size"
                                        value={pageSize}
                                        onChange={(e) => {setPageSize(e)}}
                                        options={[5, 10, 15, 20, 25, 50].map(el => {return {label: el, value: el}})}
                                        popupClassName="retailer-form-select-popup"
                                        suffixIcon={<DownArrowIcon/>}
                                    />
                                </div>
                                <span className="text">
                                    Entries
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="flex items-end justify-between gap-[16px] flex-wrap">
                            <div className="flex items-center flex-nowrap gap-[32px] lg:gap-[76px]">
                                <div className={`product-type-title ${productTabType === PRODUCT_TAB_TYPES.PRODUCTS ? 'active' : ''}`} onClick={() => {dispatch(setProductTabType(PRODUCT_TAB_TYPES.PRODUCTS))}}>
                                    Products
                                </div>
                                <div className={`product-type-title ${productTabType === PRODUCT_TAB_TYPES.MEDIA ? 'active' : ''}`} onClick={() => {dispatch(setProductTabType(PRODUCT_TAB_TYPES.MEDIA))}}>
                                    Media
                                </div>
                                <div className={`product-type-title ${productTabType === PRODUCT_TAB_TYPES.ELEMENT ? 'active' : ''}`} onClick={() => {dispatch(setProductTabType(PRODUCT_TAB_TYPES.ELEMENT))}}>
                                    Others
                                </div>
                                {!global.IS_DROB_A && <div className={`product-type-title ${productTabType === PRODUCT_TAB_TYPES.ASSETS ? 'active' : ''}`} onClick={() => {dispatch(setProductTabType(PRODUCT_TAB_TYPES.ASSETS))}}>
                                    Assets
                                </div>}
                            </div>
                            <div className="flex gap-[12px] items-center flex-wrap">
                                {productTabType !== PRODUCT_TAB_TYPES.ASSETS && <button className="btn-add-new" onClick={() => {navigate("/dashboard/products/create")}}>
                                    <PlusIcon />
                                    <span>Add new</span>
                                </button>}
                                {!global.IS_DROB_A && productTabType === PRODUCT_TAB_TYPES.PRODUCTS && <button className="btn-add-new" onClick={() => {
                                    setIsShowModalImportCsv(true)
                                }}>
                                    <PlusIcon />
                                    <span>Import</span>
                                </button>}
                                {!global.IS_DROB_A && productTabType === PRODUCT_TAB_TYPES.PRODUCTS && global.IS_SHOPIFY && <Spin spinning={loading}>
                                    <button className="btn-add-new" onClick={onImportProductFromShopify}>
                                        <PlusIcon />
                                        <span>Import product from Shopify</span>
                                    </button>
                                </Spin>}
                                {!global.IS_DROB_A && productTabType === PRODUCT_TAB_TYPES.PRODUCTS && !global.IS_SHOPIFY && <Spin spinning={loading}>
                                    <button className="btn-add-new" onClick={onImportProductFromShopifyByStoreFront}>
                                        <PlusIcon />
                                        <span>Import product from Shopify</span>
                                    </button>
                                </Spin>}
                            </div>
                            
                        </div>
                        <div className="mt-[22px]">
                            {
                                productTabType === PRODUCT_TAB_TYPES.PRODUCTS && <RetailerProductsTable ref={productRef} pageSize={pageSize} blockType={blockType} search={searchValue}/>
                            }
                            {
                                productTabType === PRODUCT_TAB_TYPES.MEDIA && <RetailerMediasTable ref={productRef} pageSize={pageSize} blockType={blockType} search={searchValue}/>
                            }
                            {
                                productTabType === PRODUCT_TAB_TYPES.ELEMENT && <RetailerOthersTable ref={productRef} pageSize={pageSize} blockType={blockType} search={searchValue}/>
                            }
                            {
                                productTabType === PRODUCT_TAB_TYPES.ASSETS && <RetailerAssetsTable ref={productRef} pageSize={pageSize} blockType={blockType} search={searchValue}/>
                            }
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <ImportShopifyProductModal 
            open={isShowModalImportProduct} 
            listProducts={shopifyProducts} 
            onClose={() => {setIsShowModalImportProduct(false)}} 
            onSuccess={() => {onUploadSuccess()}}
        />
        <RetailerShopifyConfigModal 
            open={isShowModalConfigShopify} 
            onClose={() => {setIsShowModalConfigShopify(false)}}
            onSuccess={() => {setIsShowModalConfigShopify(false)}}
        />
        <ModalRetailerOdooConfig 
            open={isShowModalConfigOdoo} 
            onClose={() => {setIsShowModalConfigOdoo(false)}}
            onSuccess={() => {setIsShowModalConfigOdoo(false)}}
        />
        <ModalRetailerImportProductFromCsv
            open={isShowModalImportCsv}
            onClose={() => {setIsShowModalImportCsv(false)}}
            onSuccess={() => {
                if(productRef.current && productRef.current.reloadData){
                    productRef.current.reloadData()
                }
                setIsShowModalImportCsv(false)
            }}
        />
    </>
}

export default RetailerProductsPage