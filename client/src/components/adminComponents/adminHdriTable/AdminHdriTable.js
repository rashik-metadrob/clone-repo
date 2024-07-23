import { Checkbox, Modal, Table, Tag, notification } from "antd";

import { useEffect, useRef, useState } from "react";

import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { useNavigate } from "react-router-dom";
import { SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import { getStorageUserDetail } from "../../../utils/storage";
import TrashIcon from "../../../assets/icons/TrashIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import EditIcon from "../../../assets/icons/EditIcon"
import _ from 'lodash'
import { getAssetsUrl } from "../../../utils/util";
import hdriApi from "../../../api/hdri.api";
import ThumnailImage from "../../../assets/images/admin/hdri-default-thumnail.png"
import ModalAddEditHdri from "../modalAddEditHdri/ModalAddEditHdri";

const AdminHdriTable = ({
  search = ""
}) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listHdris, setListHdris] = useState([])
    const timeoutRef = useRef()

    const [selectedItem, setSelectedItem] = useState();
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);

    const columns = [
      {
        title: '',
        dataIndex: 'isDisabled',
        key: 'isDisabled',
        align: 'left',
        width: "70px",
        render: (text, record) => <Checkbox checked={!_.get(record, ['isDisabled'], false)} onChange={(e) => {onLockHdriChange(record, !e.target.checked)}}/>,
      },
      {
        title: 'Thumbnail',
        dataIndex: 'thumnail',
        key: 'thumnail',
        render: (text) => <div className="w-[120px] h-auto">
          <img src={text ? getAssetsUrl(text) : ThumnailImage} alt="" className="rounded-[4px] w-[120px] h-auto" />
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
                {/* <button className="btn-action" onClick={() => {}}>
                  <EyeIcon/>
                </button> */}
                <button className="btn-action" onClick={() => {
                  setSelectedItem(record);
                  setIsShowModalEdit(true);
                }}>
                  <EditIcon />
                </button>
                <button className="btn-action" onClick={() => {onDeleteRecord(record)}}>
                  <TrashIcon />
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

    useEffect(() => {
        loadData()
    },[pageNum, pageSize, search])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          let filterData = {
            page: pageNum, 
            limit: pageSize,
            search
          }
          setIsLoading(true)
          hdriApi.getHdris(filterData).then((rs) => {
            setListHdris(rs.results)
            setTotal(rs.totalResults)
            setIsLoading(false)
          }).catch(err => {
            setIsLoading(false)
          })
        }, 300)
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete hdri?",
        centered: true,
        className: "dialog-confirm",
        onOk: () => {
          hdriApi.deleteHdri(record.id).then(() => {
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

    const onLockHdriChange = (record, value) => {
      setIsLoading(true)
      hdriApi.updateHdri(record.id, { isDisabled: value}).then(rs => {
        setIsLoading(false)
        setListHdris(data => data.map(el => {
          if(el.id === record.id) {
            el.isDisabled = value
          }

          return el
        }))
      }).catch(err => {
        setIsLoading(false)
        notification.error({
          message: "Can't update hdri!"
        })
      })
    }

    return (
      <>
        <Table
          loading={{
            spinning: isLoading || !listHdris,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listHdris}
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
        <ModalAddEditHdri 
          open={isShowModalEdit}
          onClose={() => {setIsShowModalEdit(false)}}
          item={selectedItem}
          onSuccess={() => {
            setIsShowModalEdit(false)
            loadData()
          }}
        />
      </>
    );
}
export default AdminHdriTable;