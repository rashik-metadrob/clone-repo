import { Input, Modal, Select, Table, Tag } from "antd";
import "./styles.scss"
// import ListProducts from "../../assets/json/listProducts.json"

import ViewIcon from "../../assets/images/products/eye.svg"
import EditIcon from "../../assets/images/products/edit.svg"
import HeartIcon from "../../assets/images/products/heart.svg"
import TrashIcon from "../../assets/images/products/trash.svg"
import TriangleIcon from "../../assets/images/products/triangle.svg"
import ArrowIcon from "../../assets/images/products/arrow.svg"
import SearchIcon from "../../assets/images/order/search.svg"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { deleteProduct, getListProductTypes, getProducts } from "../../api/product.api";

import loadingAnimation from "../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { useNavigate } from "react-router-dom";
import { getAssetsUrl } from "../../utils/util";
import _ from "lodash";
import { CURRENCY_LIST } from "../../utils/constants";

const ProductsTable = forwardRef(({}, ref) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listProducts, setListProducts] = useState([])
    const [search, setSearch] = useState("")
    const [curentType, setCurrentType] = useState(-1)
    const [optionsProductTypes, setOptionsProductTypes] = useState([])
    const timeoutRef = useRef()
    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <div className="w-[180px] h-[180px]">
                <img src={getAssetsUrl(text)} alt="" className="rounded-[12px] w-[180px] h-[180px]" />
            </div>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            align: 'center'
        },
        {
          title: 'Draft',
          dataIndex: 'draft',
          key: 'draft',
          align: 'center',
          render: (text, record, index) => (
            <>
                  <Tag color={'rgba(165, 255, 174, 0.48)'} className="!text-[#11FF00]" key={index}>
                    Published
                  </Tag>
            </>
          ),
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          align: 'center',
          render: (text, record) => <span>{`${_.get(CURRENCY_LIST.find(el => el.code === record?.displayCurrency), ['symbol'], '')}${text}`}</span>,
        },
        {
            title: 'Date',
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            render: (text) => <span>{moment(text).format('MMMM DD YYYY')}</span>
        },
        {
            title: 'Store',
            key: 'store',
            dataIndex: 'store',
            align: 'center',
        },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex flex-col items-center gap-[7px]">
                {/* <button className="btn-action">
                    <img src={ViewIcon} alt="" />
                </button> */}
                <button className="btn-action">
                    <img src={EditIcon} alt="" onClick={() => {navigate(`/dashboard/products/edit/${record.id}`)}}/>
                </button>
                <button className="btn-action">
                    <img src={HeartIcon} alt="" />
                </button>
                <button className="btn-action">
                    <img src={TrashIcon} alt="" onClick={() => {onDeleteRecord(record)}}/>
                </button>
            </div>
          </>,
        },
    ];
    const itemPaginationRender = (_, type, originalElement) => {
      if (type === 'prev') {
        return <a>Previous</a>;
      }
      if (type === 'next') {
        return <a>Next</a>;
      }
      return originalElement;
    };

    useImperativeHandle(ref, () => ({
      reloadData: () => {
        loadData()
      }
    }))

    useEffect(() => {
      setIsLoading(true)
      getListProductTypes().then(data => {
        setOptionsProductTypes(data.results)
        setIsLoading(false)
      }).catch(err => {
        setIsLoading(false)
      })
    }, [])

    useEffect(() => {
        loadData()
    },[pageNum, pageSize, search, curentType])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            let filterData = {
                limit: pageSize,
                page: pageNum,
                search: search,
                isOnlyNonDisable: false,
            }
            if(curentType >= 0){
                filterData = Object.assign(filterData, {type: curentType})
            }
            getProducts(filterData).then((rs) => {
                setListProducts(rs.results)
                setTotal(rs.totalResults)
            })
        }, 300)
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete product",
        centered: true,
        className: "dialog-confirm",
        onOk: () => {
         deleteProduct(record.id).then(() => {
          loadData()
         })
        }
      })
    }

    return (
      <>
        <Table
          loading={{
            spinning: isLoading|| !listProducts,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listProducts}
          pagination={{
            pageSize: pageSize,
            current: pageNum,
            total: total,
            itemRender: itemPaginationRender,
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              setPageNum(page);
            },
          }}
          locale={{
            emptyText: (
                <div className="empty-container">
                    No data can be found.
                </div>
            ),
          }}
          title={() => (
            <>
              <div className="products-table-header">
                <div className="group-filter-left">
                  <div className="group-page-size">
                    Show
                    <Select
                      className="filter-select"
                      value={pageSize}
                      suffixIcon={<img src={TriangleIcon} alt="" />}
                      options={listPageSize.map((el) => {
                        return { value: el, label: el };
                      })}
                      onChange={(val) => {
                        setPageSize(val);
                      }}
                    />
                    Entries
                  </div>
                  <Select
                    placeholder="Choose Store"
                    className="filter-select"
                    suffixIcon={<img src={ArrowIcon} alt="" />}
                    options={[]}
                  />
                  <Select
                    placeholder="Product Type"
                    className="filter-select"
                    style={{minWidth: 100}}
                    suffixIcon={<img src={ArrowIcon} alt="" />}
                    value={curentType}
                    options={[...optionsProductTypes, {value: -1, label: "All"}]}
                    onChange={(value) => {setCurrentType(value)}}
                  />
                  <Select
                    placeholder="Sort By"
                    className="filter-select"
                    suffixIcon={<img src={ArrowIcon} alt="" />}
                    options={[]}
                  />
                </div>
                <Input
                  placeholder="Search"
                  className="product-search-input"
                  prefix={<img src={SearchIcon} alt="" />}
                  onChange={(e) => {setSearch(e.target.value)}}
                />
              </div>
            </>
          )}
          className="products-table"
        />
      </>
    );
})
export default ProductsTable;