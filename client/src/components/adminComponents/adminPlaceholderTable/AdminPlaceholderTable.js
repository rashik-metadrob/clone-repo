import { Modal, Table, Tag, notification } from "antd";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { useNavigate } from "react-router-dom";
import { PLACEHOLDER_SIZES, PRODUCT_TYPES, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import TrashIcon from "../../../assets/icons/TrashIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import EditIcon from "../../../assets/icons/EditIcon"
import _ from 'lodash'
import { getAssetsUrl } from "../../../utils/util";
import ModalAddEditPlaceholder from "../modalAddEditPlaceholder/ModalAddEditPlaceholder";
import { deleteProduct, getListPublicDecorarive } from "../../../api/product.api";

const AdminPlaceholderTable = forwardRef(({}, ref) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listPlaceholders, setListPlaceholders] = useState([])
    const timeoutRef = useRef()

    const [selectedItem, setSelectedItem] = useState();
    const [isShowModal, setIsShowModal] = useState(false);

    useImperativeHandle(ref, () => ({
      addNewPlaceholder: () => {
          setSelectedItem(null);
          setIsShowModal(true);
      },
  }));

    const columns = [
      {
        title: 'Thumbnail',
        dataIndex: 'image',
        key: 'image',
        render: (text, record) => <div className="w-[120px] h-auto text-center">
            <div className="text-[50px] select-none font-[600]">
              {_.get(_.get(_.find(PLACEHOLDER_SIZES, el => el.value === record.placeholderType), ['label'], ""), [0], '')}
            </div>
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
        title: 'Type',
        dataIndex: 'placeholderType',
        key: 'placeholderType',
        align: 'left',
        render: (text) => <span>
          {_.get(_.find(PLACEHOLDER_SIZES, el => el.value === text), ['label'], "No data")}
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
            limit: pageSize,
            type: PRODUCT_TYPES.PLACEHOLDER,
            isOnlyNonDisable: false,
          }
          getListPublicDecorarive(filterData).then((rs) => {
            setListPlaceholders(rs.results)
            setTotal(rs.totalResults)
          })
      }, 300)
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete placeholder?",
        centered: true,
        className: "dialog-confirm",
        onOk: () => {
          deleteProduct(record.id).then(() => {
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

    return (
      <>
        <Table
          loading={{
            spinning: isLoading|| !listPlaceholders,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listPlaceholders}
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
        <ModalAddEditPlaceholder 
          open={isShowModal}
          onClose={() => {setIsShowModal(false)}}
          item={selectedItem}
          onSuccess={() => {
            setIsShowModal(false)
            loadData()
          }}
        />
      </>
    );
})
export default AdminPlaceholderTable;