import { Checkbox, Modal, Table, Tag, notification } from "antd";

import { useEffect, useRef, useState } from "react";

import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PRODUCT_TYPES, PROJECT_TYPE, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import { getStorageUserDetail } from "../../../utils/storage";
import EyeIcon from "../../../assets/icons/EyeIcon";
import TrashIcon from "../../../assets/icons/TrashIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import { deleteProduct, getListPublicDecorarive, getListPublicDecorariveByAdmin, updateProduct } from "../../../api/product.api";
import EditIcon from "../../../assets/icons/EditIcon"
import ModalEditDecorative from "../modalEditDecorative/ModalEditDecorative"
import _ from 'lodash'
import { getAssetsUrl, isShopifyAdminLocation } from "../../../utils/util";

const AdminDecorativeTable = ({
  search = ""
}) => {
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listDecoratives, setListDecoratives] = useState([])
    const timeoutRef = useRef()
    const currentUser = getStorageUserDetail();

    const [selectedItem, setSelectedItem] = useState();
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);

    const columns = [
      {
        title: '',
        dataIndex: 'isDisabled',
        key: 'isDisabled',
        align: 'left',
        width: "70px",
        render: (text, record) => <Checkbox checked={!_.get(record, ['isDisabled'], false)} onChange={(e) => {onLockDecorativeChange(record, !e.target.checked)}}/>,
      },
      {
        title: 'Thumbnail',
        dataIndex: 'image',
        key: 'image',
        render: (text) => <div className="w-[120px] h-auto">
          <img src={getAssetsUrl(text)} alt="" className="rounded-[4px] w-[120px] h-auto" />
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
        render: (text) => <span>{ (!text || text === 0) ? "No data" : `${(text / (1024*1024)).toFixed(2)}MB`}</span>
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
        title: 'Plan',
        dataIndex: 'plans',
        key: 'plans',
        align: 'left',
        render: (plans, record) => <span className="flex flex-col gap-[4px]">
          {
            !_.isEmpty(plans) && _.orderBy(plans, ['isFree'], ['desc']).map(el => (
              <div className="flex gap-[8px]">
                {!el.isFree && <div className="custom-box"></div>}
                <span>
                  {el.name}
                </span>
              </div>
            ))
          }
        </span>,
      },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex flex-col items-center gap-[7px]">
                {!isShopifyAdminLocation(location) && <Link className="btn-action" to={`/admin/decorative/edit/${record.id}`} target="_blank">
                  <EyeIcon/>
                </Link>}
                {isShopifyAdminLocation(location) && <Link className="btn-action" to={`/admin-shopify/decorative/edit/${record.id}`} target="_blank">
                  <EyeIcon/>
                </Link>}
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
            type: PRODUCT_TYPES.DECORATIVES,
            search,
            isOnlyNonDisable: false,
          }
          setIsLoading(true)
          getListPublicDecorarive(filterData).then((rs) => {
            setListDecoratives(rs.results)
            setTotal(rs.totalResults)
            setIsLoading(false)
          }).catch(err => {
            setIsLoading(false)
          })
        }, 300)
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete decorative?",
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

    const onLockDecorativeChange = (record, value) => {
      setIsLoading(true)
      updateProduct(record.id, { isDisabled: value}).then(rs => {
        setIsLoading(false)
        setListDecoratives(data => data.map(el => {
          if(el.id === record.id) {
            el.isDisabled = value
          }

          return el
        }))
      }).catch(err => {
        setIsLoading(false)
        notification.error({
          message: "Can't update decorative!"
        })
      })
    }

    return (
      <>
        <Table
          loading={{
            spinning: isLoading|| !listDecoratives,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listDecoratives}
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
          rowClassName={(record, index) => {
            return `admin-template-table ${record.isCompressing ? 'admin-template-row-processing': ''}`
          }}
        />
        <ModalEditDecorative 
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
export default AdminDecorativeTable;