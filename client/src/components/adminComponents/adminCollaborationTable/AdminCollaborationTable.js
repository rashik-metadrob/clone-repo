import { Modal, Table, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { getStorageUserDetail } from "../../../utils/storage";
import { userApi } from "../../../api/user.api";
import TickIcon from "../../../assets/images/admin/tick.svg"
import ExitIcon from "../../../assets/images/admin/exit.svg"

const AdminCollaborationTable = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listUsers, setListUsers] = useState([])
    const timeoutRef = useRef()
    const currentUser = getStorageUserDetail();
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          render: (text, record) => <span>"{text}"</span>
        },
        {
          title: 'Phone Number',
          dataIndex: 'phone',
          key: 'phone',
          align: 'left',
        },
        {
          title: 'Email',
          dataIndex: 'contact',
          key: 'contact',
          align: 'left',
          render: (text, record) => <span>{record?.email || record.socialType}</span>
        },
        {
            title: 'Collaborate for',
            dataIndex: 'collaborateFor',
            key: 'collaborateFor',
            align: 'left',
            render: (text, record) => <span>3D Decorative</span>
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center',
            render: (text, record, index) => <>
              <div className="flex items-center justify-center gap-[12px]">
                  <button className="btn-new-action">
                      <img src={TickIcon} alt="" onClick={() => {}}/>
                  </button>
                  <button className="btn-new-action">
                      <img src={ExitIcon} alt="" onClick={() => {}}/>
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
                limit: pageSize,
                page: pageNum,
                statistic: true,
                isShowExceededStorageLimit: 0
            }
            userApi.getListUsers(filterData).then((rs) => {
                setListUsers(
                  rs.results.map(el => {
                      el.key = el.id;
                      return el
                    }
                  )
                )
                setTotal(rs.totalResults)
            })
        }, 300)
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete user",
        centered: true,
        className: "dialog-confirm",
        onOk: () => {
          userApi.deleteUser(record.id).then(() => {
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
            spinning: isLoading|| !listUsers,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listUsers}
          pagination={{
            pageSize: pageSize,
            current: pageNum,
            total: total,
            itemRender: itemPaginationRender,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPageNum(page);
              setPageSize(pageSize);
            },
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
      </>
    );
}
export default AdminCollaborationTable;