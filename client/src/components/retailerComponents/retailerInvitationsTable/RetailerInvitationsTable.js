import { Table, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import _ from "lodash";
import { userApi } from "../../../api/user.api";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/appSlice";

const RetailerInvitationsTable = ({
    pageSize = 10
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listOrders, setListOrders] = useState([])
    const user = useSelector(getUser)
    const timeoutRef = useRef()
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          align: 'name',
          render: (text, record) => <span>{text}</span>
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          align: 'email',
          render: (text, record) => <span>{text}</span>
        },
        {
          title: 'Role',
          dataIndex: 'roleName',
          key: 'roleName',
          align: 'roleName',
          render: (text, record) => <span>{text}</span>
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
      setPageNum(1)
    }, [pageSize])

    useEffect(() => {
        if(user?.id) {
            loadData()
        }
    },[pageNum, pageSize, user?.id])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            let filterData = {
              limit: pageSize,
              page: pageNum,
              invitedBy: user.id
            }
            setIsLoading(true)
            userApi.getListUsers(filterData).then((rs) => {
              setListOrders(
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

    return (
      <>
        <Table
          loading={{
            spinning: isLoading,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listOrders}
          pagination={{
            pageSize: pageSize,
            current: pageNum,
            total: total,
            itemRender: itemPaginationRender,
            showSizeChanger: false,
            onChange: (page, pageSize, sorter) => {
                console.log('sorter', sorter)
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
          className="retailer-shared-table"
          rowClassName="retailer-template-table"
        />
      </>
    );
}
export default RetailerInvitationsTable;