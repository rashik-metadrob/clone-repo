import { Table } from "antd"
import Lottie from "lottie-react"
import loadingAnimation from "../../../assets/json/Add Products.json"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import moment from "moment"
import { RETAILER_TEMPLATE_TABLE_IN_CARD_DATE_FORMAT, SERVER_DATE_FORMAT } from "../../../utils/constants"
import TwoDotIcon from "../../../assets/icons/TwoDotIcon"
import zohoApi from "../../../api/zoho.api"
import _ from "lodash"
import { useSelector } from "react-redux"
import { getUser } from "../../../redux/appSlice"

const RetailerTicketHistoryTable = forwardRef(({}, ref) => {
    const [isLoading, setIsLoading] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [data, setData] = useState([])
    const user = useSelector(getUser)
    const timeoutRef = useRef()

    useImperativeHandle(ref, () => ({
        loadData: () => {
            loadData()
        }
    }))

    useEffect(() => {
        loadData()
    },[pageNum, pageSize, user?.id])

    const itemPaginationRender = (_, type, originalElement) => {
        if (type === 'prev') {
          return <a>Previous</a>;
        }
        if (type === 'next') {
          return <a>Next</a>;
        }
        return originalElement;
    };

    const loadData = () => {
        if(timeoutRef.current){
          clearTimeout(timeoutRef.current)
        }
  
        const filter = {
          limit: pageSize,
          from: (pageNum - 1) * pageSize,
          email: _.get(user, [['email']]) || user?.shopifyShopEmail
        }
  
        timeoutRef.current = setTimeout(() => {
          setIsLoading(true)
          zohoApi.getTickets(filter).then((rs) => {
            setData(_.get(rs, ['data'], []))
            setTotal(_.get(rs, ['count'], 0))
            setIsLoading(false)
          }).catch(err => {
            setIsLoading(false)
          })
        }, 300)
    }

    const columns = [
        {
            title: 'Track Id',
            dataIndex: 'id',
            key: 'id',
            align: 'id',
            render: (text, record) => <span>#{text}</span>
        },
        {
            title: 'Date',
            dataIndex: 'createdTime',
            key: 'createdTime',
            align: 'createdTime',
            render: (text) => <span className="whitespace-nowrap">
                { moment(text, SERVER_DATE_FORMAT).format(RETAILER_TEMPLATE_TABLE_IN_CARD_DATE_FORMAT) }
            </span>,
        },
        {
            title: 'Query',
            dataIndex: 'subject',
            key: 'subject',
            align: 'left',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'left'
        },
        // {
        //     title: 'Actions',
        //     dataIndex: 'actions',
        //     key: 'actions',
        //     align: 'center',
        //     render:(text) => <div className="action-icon flex justify-center cursor-pointer">
        //         <TwoDotIcon />
        //     </div>
        // },
    ]

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
            className="retailer-shared-table-in-card"
        />
    </>
})
export default RetailerTicketHistoryTable