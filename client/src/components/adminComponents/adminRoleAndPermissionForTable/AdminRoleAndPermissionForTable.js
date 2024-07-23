import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import roleAndPermissionApi from "../../../api/roleAndPermission.api"
import loadingAnimation from "../../../assets/json/Add Products.json"
import { Modal, Table, notification } from "antd"
import Lottie from "lottie-react"
import ModalAddEditRoleAndPermission from "../modalAddEditRoleAndPermission/ModalAddEditRoleAndPermission"
import { useAppDispatch } from "../../../redux"
import { fetchAllPermissions } from "../../../redux/roleSlice"
import _ from "lodash"
import EditIcon from "../../../assets/icons/EditIcon"
import TrashIcon from "../../../assets/icons/TrashIcon"
import InviteUserIcon from "../../../assets/images/admin/invite-user-icon.png"
import ModalAdminInvite from "../modalAdminInvite/ModalAdminInvite"

const AdminRoleAndPermissionForTable = forwardRef(({
    search = "",
    isSuperAdminRole = false
}, ref) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [data, setData] = useState([])
    const timeoutRef = useRef()
    const [selectedItem, setSelectedItem] = useState(null)
    const [isShowModal, setIsShowModal] = useState(false)
    const [isShowModalInvite, setIsShowModalInvite] = useState(false)

    const columns = [
        {
          title: 'Role name',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          width: 220,
          render: (text) => <span>
              { `"${text}"` }
          </span>,
        },
        {
          title: 'Permission',
          dataIndex: 'mode',
          key: 'mode',
          align: 'left',
          render: (text, record) => <div className="one-row-text">
              { _.get(record, ['permissions'], []).join(', ') }
          </div>,
        },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          width: 140,
          render: (text, record, index) => <>
            <div className="flex flex-row items-center justify-center gap-[7px]">
                {
                  isSuperAdminRole && <>
                    <button className="btn-action" onClick={() => {
                      setSelectedItem(record);
                      setIsShowModal(true);
                    }}>
                      <EditIcon />
                    </button>
                  </>
                }
                {!record.isDefaultRole && <button className="btn-action" onClick={() => {onDeleteRecord(record)}}>
                  <TrashIcon />
                </button>}
                {
                  isSuperAdminRole && <>
                    <button className="btn-action" onClick={() => {
                      setSelectedItem(record);
                      setIsShowModalInvite(true);
                    }}>
                      <img src={InviteUserIcon} alt="" />
                    </button>
                  </>
                }
            </div>
          </>,
        },
    ];

    useImperativeHandle(ref, () => ({
        addNewRole: () => {
            setSelectedItem(null);
            setIsShowModal(true);
        },
    }));

    useEffect(() => {
        dispatch(fetchAllPermissions())
    }, [])

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

    const onDeleteRecord = (record) => {
        Modal.confirm({
          title: "Are you sure to delete role?",
          centered: true,
          className: "dialog-confirm",
          onOk: () => {
            roleAndPermissionApi.deleteRoleAndPermissionById(record.id).then(() => {
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
  
    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            let filterData = {
              limit: pageSize,
              page: pageNum,
              search,
              isSuperAdminRole
            }

            setIsLoading(true)
            roleAndPermissionApi.getRoleAndPermissions(filterData).then((rs) => {
              setData(rs.results)
              setTotal(rs.totalResults)
              setIsLoading(false)
            }).catch(err => {
              notification.error({
                  message: _.get(err, ['response', 'data', 'message'], `Can't get role data!`)
              })
              setIsLoading(false)
            })
        }, 300)
    }

    return <>
        <Table
            loading={{
                spinning: isLoading,
                indicator: <Lottie animationData={loadingAnimation} />
            }}
            columns={columns}
            dataSource={data}
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

        <ModalAddEditRoleAndPermission
            open={isShowModal}
            onClose={() => {setIsShowModal(false)}}
            onSuccess={() => {
                loadData()
                setIsShowModal(false)
            }}
            item={selectedItem}
            isSuperAdminRole={isSuperAdminRole}
        />

        <ModalAdminInvite
          open={isShowModalInvite}
          onClose={() => {setIsShowModalInvite(false)}}
          item={selectedItem}
        />
    </>
})
export default AdminRoleAndPermissionForTable