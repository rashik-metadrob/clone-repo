import { Checkbox, Modal, Table, notification } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import moment from "moment";
import { ASSET_TYPES_TEXTS } from "../../../utils/constants";
import _ from "lodash";
import { is3DFile, itemPaginationRender } from "../../../utils/util";
import TrashIcon from "../../../assets/images/products/trash.svg"
import { useNavigate } from "react-router-dom";
import PictureIcon from "../../../assets/icons/PictureIcon";
import assetApi from "../../../api/asset.api";
import PreviewAsset from "../../previewAsset/PreviewAsset";

const RetailerAssetsTable = forwardRef(({
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
        render: (text, record) => <Checkbox checked={!_.get(record, ['isDisabled'], false)} onChange={(e) => {onLockAssetChange(record, !e.target.checked)}}/>,
      },
      {
        title: "",
        dataIndex: "thumnail",
        key: "thumnail",
        render: (text, record) => (
          <div className="w-[231px] h-[130px] relative">
            <PreviewAsset fileName={text} className="rounded-[4px] object-contain h-full w-full"/>
            {is3DFile(_.get(record, 'filePath', '')) && <div className="absolute right-[6px] bottom-[6px] w-[40px] h-[40px] bg-[rgba(255,255,255,0.5)] rounded-[8px] flex justify-center items-center">
              <span>3D</span>
            </div>}
            {!is3DFile(_.get(record, 'filePath', '')) && <div className="absolute right-[6px] bottom-[6px] w-[40px] h-[40px] bg-[rgba(255,255,255,0.5)] rounded-[8px] flex justify-center items-center action-icon">
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
        title: "Asset Type",
        dataIndex: "type",
        key: "type",
        align: "left",
        render: (text) => <span>{_.get(ASSET_TYPES_TEXTS, [text], "Unknown")}</span>
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
              {/* <button className="btn-action">
                    <img src={ViewIcon} alt="" />
                </button> */}
              {/* <button className="btn-action">
                <img
                  src={EditIcon}
                  alt=""
                  onClick={() => {
                    navigate(`/dashboard/products/edit/${record.id}`);
                  }}
                />
              </button> */}
              {/* <button className="btn-action">
                <img src={HeartIcon} alt="" />
              </button> */}
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
          assetApi.getAssets(filterData).then((rs) => {
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
          title: "Are you sure to delete asset",
          centered: true,
          className: "dialog-confirm",
          onOk: () => {
           assetApi.deleteAsset(record.id).then(() => {
            loadData()
           })
          }
        })
    }

    const onTableChange = (pagination, filters, sorter, extra) => {
      setSorter(sorter)
    };

    const onLockAssetChange = (record, value) => {
      setIsLoading(true)
      assetApi.updateAsset(record.id, { isDisabled: value}).then(rs => {
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
          message: "Can't update asset!"
        })
      })
    }

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
export default RetailerAssetsTable;