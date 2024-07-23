import { Checkbox, Modal, Table, Tag, notification } from "antd";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { useNavigate } from "react-router-dom";
import { ASSET_TYPES, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import TrashIcon from "../../../assets/icons/TrashIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import EditIcon from "../../../assets/icons/EditIcon"
import _ from 'lodash'
import ModalUploadAsset from "../../modalUploadAsset/ModalUploadAsset";
import PreviewAsset from "../../previewAsset/PreviewAsset";
import assetApi from "../../../api/asset.api";

const AdminTutorialVideoTable = forwardRef(({}, ref) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listTexts, setListTexts] = useState([])
    const timeoutRef = useRef()

    const [selectedItem, setSelectedItem] = useState();
    const [isShowModal, setIsShowModal] = useState(false);

    useImperativeHandle(ref, () => ({
        addNewVideo: () => {
            setSelectedItem(null);
            setIsShowModal(true);
        },
    }));

    const columns = [
      {
        title: '',
        dataIndex: 'isShowTutorialVideo',
        key: 'isShowTutorialVideo',
        align: 'left',
        width: "70px",
        render: (text, record) => <Checkbox checked={_.get(record, ['attribute', 'isShowTutorialVideo'], false)} onChange={(e) => {onAssetAtributeChange(record, 'isShowTutorialVideo', e.target.checked)}}/>,
      },
      {
        title: 'Thumbnail',
        dataIndex: 'thumnail',
        key: 'thumnail',
        render: (text) => <div className="w-[120px] h-auto">
          <PreviewAsset fileName={text} className="rounded-[4px] w-[120px] h-auto"/>
        </div>,
      },
      {
        title: 'Feature video',
        dataIndex: 'isFeatureTutorialVideo',
        key: 'isFeatureTutorialVideo',
        align: 'left',
        width: "105px",
        render: (text, record) => <div className="flex justify-center">
          <Checkbox checked={_.get(record, ['attribute', 'isFeatureTutorialVideo'], false)} onChange={(e) => {onAssetAtributeChange(record, 'isFeatureTutorialVideo', e.target.checked)}}/>
        </div>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        render: (text) => <span>
            { `"${text}"` }
        </span>,
      },
      {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
        align: 'left',
        render: (text) => <span>{ text === 0 ? "No data" : `${(text / (1024*1024)).toFixed(2)}MB`}</span>
      },
      {
        title: 'Date of Upload',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'left',
        render: (text) => <span style={{ display: 'flex', alignItems: 'center'}}>
          <span style={{ marginRight: 5 }}><CalendarIcon /></span> { moment(text, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT) }
        </span>,
      },
      {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex flex-col items-center gap-[7px]">
                <button className="btn-action" onClick={() => {
                  setSelectedItem(record);
                  setIsShowModal(true);
                }}>
                  <EditIcon />
                </button>
                <button className="btn-action" onClick={() => {onDeleteRecord(record)}}>
                  <TrashIcon />
                </button>
            </div>
          </>,
        },
    ]
    const itemPaginationRender = (_, type, originalElement) => {
      if (type === 'prev') {
        return <a>Previous</a>;
      }
      if (type === 'next') {
        return <a>Next</a>;
      }
      return originalElement;
    };


    useEffect(() => {
        loadData()
    },[pageNum, pageSize])

    const loadData = () => {
      if(timeoutRef.current){
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        let filterData = {
          limit: pageSize,
          page: pageNum,
          type: ASSET_TYPES.TUTORIAL_VIDEO
        }
        setIsLoading(true)
        assetApi.getPublicAssets(filterData).then((rs) => {
          if(pageNum > 1 && rs.results.length === 0){
            setPageNum(pageNum - 1)
          }
          setListTexts(rs.results)
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

    const onAssetAtributeChange = (record, key, value) => {
      const attribute = _.get(record, ['attribute'], {})

      _.set(attribute, [key], value)
      setIsLoading(true)
      assetApi.updateAsset(record.id, {attribute}).then(rs => {
        setIsLoading(false)
        loadData()
      }).catch(err => {
        setIsLoading(false)
        notification.error({
          message: "Can't update asset!"
        })
      })
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete text?",
        centered: true,
        className: "dialog-confirm",
        onOk: () => {
          assetApi.deleteAsset(record.id).then(() => {
            loadData()
            notification.success({
              message: "Deleted successfully!!"
            })
          }).catch(err => {
            notification.error({
              message: "Delete fail!"
            })
          })
        }
      })
    }
    
    return <>
        <Table
          loading={{
            spinning: isLoading || !listTexts,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listTexts}
          pagination={{
            pageSize: pageSize,
            current: pageNum,
            total: total,
            itemRender: itemPaginationRender,
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              setPageNum(page);
            },
            position: ["bottomCenter"]
          }}
          locale={{
            emptyText: (
                <div className="empty-container">
                    No data can be found.
                </div>
            ),
          }}
          className="admin-shared-table"
          rowClassName="admin-template-table"
        />

        <ModalUploadAsset 
            open={isShowModal}
            item={selectedItem}
            onClose={() => {setIsShowModal(false)}}
            onSuccess={() => {
              setIsShowModal(false)
              loadData()
           }}
            assetType={ASSET_TYPES.TUTORIAL_VIDEO}
        />
      </>
})
export default AdminTutorialVideoTable;