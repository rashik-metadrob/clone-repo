import { Checkbox, Modal, Table, Tag, notification } from "antd";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { useNavigate } from "react-router-dom";
import { SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import TrashIcon from "../../../assets/icons/TrashIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import EditIcon from "../../../assets/icons/EditIcon"
import _ from 'lodash'
import { getAssetsUrl } from "../../../utils/util";
import ThumnailImage from "../../../assets/images/admin/hdri-default-thumnail.png"
import textApi from "../../../api/text.api";
import ModalTextEditor from "../../modalTextEditor/ModalTextEditor";

const AdminTextTable = forwardRef(({}, ref) => {
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

    const columns = [
      {
        title: '',
        dataIndex: 'isDisabled',
        key: 'isDisabled',
        align: 'left',
        width: "70px",
        render: (text, record) => <Checkbox checked={!_.get(record, ['isDisabled'], false)} onChange={(e) => {onLockTextChange(record, !e.target.checked)}}/>,
      },
      {
        title: 'Thumbnail',
        dataIndex: 'image',
        key: 'image',
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
        addNewText: () => {
            setSelectedItem(null);
            setIsShowModal(true);
        },
    }));


    useEffect(() => {
        loadData()
    },[pageNum, pageSize])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          let filterData = {
            page: pageNum, 
            limit: pageSize
          }
          textApi.getTexts(filterData).then((rs) => {
            if(pageNum > 1 && rs.results.length === 0){
                setPageNum(pageNum - 1)
            }
            setListTexts(rs.results)
            setTotal(rs.totalResults)
          })
        }, 300)
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete text?",
        centered: true,
        className: "dialog-confirm",
        onOk: () => {
          textApi.deleteText(record.id).then(() => {
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

    const onLockTextChange = (record, value) => {
      setIsLoading(true)
      textApi.updateText(record.id, { isDisabled: value}).then(rs => {
        setIsLoading(false)
        setListTexts(data => data.map(el => {
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

        <ModalTextEditor 
            open={isShowModal}
            item={selectedItem}
            onClose={() => {setIsShowModal(false)}}
            onSuccess={() => {
                setIsShowModal(false)
                loadData()
            }}
        />
      </>
    );
})
export default AdminTextTable;