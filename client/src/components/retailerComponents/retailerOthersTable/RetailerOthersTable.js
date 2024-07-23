import { Checkbox, Modal, Table, notification } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import moment from "moment";
import { AVAILABLE_ANIMATION, MODEL_BLOCK, PRODUCT_TYPES, RETAILER_TEMPLATE_TABLE_DATE_FORMAT, SERVER_DATE_FORMAT } from "../../../utils/constants";
import _ from "lodash";
import { getAssetsUrl, itemPaginationRender } from "../../../utils/util";
import { deleteProduct, getProducts, updateProduct } from "../../../api/product.api";
import ViewIcon from "../../../assets/images/products/eye.svg"
import EditIcon from "../../../assets/images/products/edit.svg"
import HeartIcon from "../../../assets/images/products/heart.svg"
import TrashIcon from "../../../assets/images/products/trash.svg"
import { useNavigate } from "react-router-dom";
import PictureIcon from "../../../assets/icons/PictureIcon";

const RetailerOthersTable = forwardRef(({
    pageSize = 10,
    blockType = "All",
    search = ""
}, ref) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listDatas, setListDatas] = useState([])
    const [sorter, setSorter] = useState()
    const timeoutRef = useRef()
    const columns = [
      {
        title: '',
        dataIndex: 'isDisabled',
        key: 'isDisabled',
        align: 'left',
        width: "70px",
        render: (text, record) => <Checkbox checked={!_.get(record, ['isDisabled'], false)} onChange={(e) => {onLockOrtherChange(record, !e.target.checked)}}/>,
      },
      {
        title: "",
        dataIndex: "image",
        key: "image",
        render: (text, record) => (
          <div className="w-[231px] h-[130px] relative">
            <img
              src={getAssetsUrl(text)}
              alt=""
              className="rounded-[4px] object-contain h-full w-full"
            />
            {_.get(record, 'block', '') === MODEL_BLOCK["3D"] && <div className="absolute right-[6px] bottom-[6px] w-[40px] h-[40px] bg-[rgba(255,255,255,0.5)] rounded-[8px] flex justify-center items-center">
              <span>3D</span>
            </div>}
            {_.get(record, 'block', '') === MODEL_BLOCK["2D"] && <div className="absolute right-[6px] bottom-[6px] w-[40px] h-[40px] bg-[rgba(255,255,255,0.5)] rounded-[8px] flex justify-center items-center action-icon">
              <PictureIcon />
            </div>}
          </div>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "left",
        sorter: true,
      },
      {
        title: "Product Type",
        dataIndex: "block",
        key: "block",
        align: "left",
      },
      {
        title: 'Animated',
        dataIndex: 'availableAnimation',
        key: 'availableAnimation',
        align: 'center',
        render: (text) => <Checkbox checked={text !== AVAILABLE_ANIMATION.PLAY_NEVER} />
      },
      {
        title: "Date",
        key: "createdAt",
        dataIndex: "createdAt",
        align: "left",
        render: (text) => <span>{moment(text).format("MMMM DD YYYY")}</span>,
      },
      {
        title: "Actions",
        key: "action",
        align: "center",
        render: (text, record, index) => (
          <>
            <div className="flex flex-col items-center gap-[7px]">
              <button className="btn-action">
                <img
                  src={EditIcon}
                  alt=""
                  onClick={() => {
                    navigate(`/dashboard/products/edit/${record.id}`);
                  }}
                />
              </button>
              <button className="btn-action">
                <img
                  src={TrashIcon}
                  alt=""
                  onClick={() => {
                    onDeleteRecord(record);
                  }}
                />
              </button>
            </div>
          </>
        ),
      },
    ];

    useImperativeHandle(ref, () => ({
      reloadData: () => {
        loadData()
      }
    }))

    useEffect(() => {
      setPageNum(1)
    }, [blockType, pageSize])

    useEffect(() => {
        loadData()
    },[pageNum, pageSize, blockType, sorter, search])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          let filterData = {
            limit: pageSize,
            page: pageNum,
            type: PRODUCT_TYPES.ELEMENT,
            search,
            isOnlyNonDisable: false,
          }
          if(blockType !== "All"){
            filterData.block = blockType
          }
          if(sorter){
            const field = _.get(sorter, 'field', '')
            const order = _.get(sorter, 'order', '')
            if(field && order){
              if(order === "ascend"){
                filterData.sortBy = `${field}:asc`
              }
              if(order === "descend"){
                filterData.sortBy = `${field}:desc`
              }
            }
          }
          setIsLoading(true)
          getProducts(filterData).then((rs) => {
            setListDatas(
              rs.results.map(el => {
                  el.key = el.id;
                  return el
                }
              )
            )
            setTotal(rs.totalResults)
            setIsLoading(false)
          }).catch(err => {
            notification.error({
              message: _.get(err, ['response', 'data', 'message'], `Can't get data from server!`)
            })
            setIsLoading(false)
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

    const onLockOrtherChange = (record, value) => {
      setIsLoading(true)
      updateProduct(record.id, { isDisabled: value}).then(rs => {
        setIsLoading(false)
        setListDatas(data => data.map(el => {
          if(el.id === record.id) {
            el.isDisabled = value
          }

          return el
        }))
      }).catch(err => {
        setIsLoading(false)
        notification.error({
          message: "Can't update other!"
        })
      })
    }

    const onTableChange = (pagination, filters, sorter, extra) => {
      setSorter(sorter)
    };

    return (
      <>
        <Table
          loading={{
            spinning: isLoading,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listDatas}
          pagination={{
            pageSize: pageSize,
            current: pageNum,
            total: total,
            itemRender: itemPaginationRender,
            showSizeChanger: false,
            onChange: (page, pageSize, sorter) => {
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
          onChange={onTableChange}
          className="retailer-template-table-with-sort"
          rowClassName="retailer-template-table"
        />
      </>
    );
})
export default RetailerOthersTable;