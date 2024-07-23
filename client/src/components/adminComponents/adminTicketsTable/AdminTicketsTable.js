import { Dropdown, Modal, Table, notification } from "antd";
import ArrowDownIcon from "../../../assets/images/products/plan-arrow-down.svg"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import { useLocation } from "react-router-dom";
import { userApi } from "../../../api/user.api";
import useFetch from "../../../hook/useFetch";
import "./styles.scss"
import _ from "lodash";
import { PAYMENT_STATUS, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT, USER_MENU_ACTION, USER_SUBCRIPTION_KEY } from "../../../utils/constants";
import moment from "moment";
import userSubcriptionApi from "../../../api/userSubcription.api";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import { isShopifyAdminLocation } from "../../../utils/util";
import zohoApi from "../../../api/zoho.api";
import EyeIcon from "../../../assets/icons/EyeIcon";
import ModalTicketDetail from "../modalTicketDetail/ModalTicketDetail";

const AdminTicketsTable = forwardRef(({
  status
}, ref) => {
    const [isLoading, setIsLoading] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [data, setData] = useState([])
    const timeoutRef = useRef()
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [isShowModalTicketDetail, setIsShowModalTicketDetail] = useState(false)

    const columns = [
        {
          title: 'Ticket number',
          dataIndex: 'ticketNumber',
          key: 'ticketNumber',
          align: 'left',
          render: (text, record) => <span>#{text}</span>,
        },
        {
          title: 'Subject',
          dataIndex: 'subject',
          key: 'subject',
          align: 'left',
        },
        {
          title: 'Email',
          dataIndex: 'contact',
          key: 'contact',
          align: 'left',
          render: (text, record) => <span>{_.get(record, ['contact', 'email'], '')}</span>
        },
        {
          title: 'Date of Created',
          dataIndex: 'createdTime',
          key: 'createdTime',
          align: 'left',
          render: (text) => <span style={{ display: 'flex', alignItems: 'center'}}>
            <span style={{ marginRight: 5 }}><CalendarIcon /></span> { moment(text, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT) }
          </span>,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          render: (data, record) => <span>{data}</span>,
        },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex gap-[12px] justify-center">
              <div className="flex flex-col items-center gap-[7px]">
                <button className="btn-action" onClick={() => {
                  setSelectedTicket(record)
                  setIsShowModalTicketDetail(true)
                }}>
                  <EyeIcon/>
                </button>
              </div>
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
      setPageNum(1)
    }, [status])

    useEffect(() => {
      loadData()
    },[status, pageNum, pageSize])

    useImperativeHandle(ref, () => ({
    }));

    const loadData = () => {
      if(timeoutRef.current){
        clearTimeout(timeoutRef.current)
      }

      const filter = {
        limit: pageSize,
        from: (pageNum - 1) * pageSize
      }
      if(status !== 'All'){
        filter.status = status
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

    return (
      <>
        <Table
          loading={{
            spinning: isLoading|| !data,
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
          className="admin-shared-table"
          rowClassName="admin-template-table"
        />

        <ModalTicketDetail 
          open={isShowModalTicketDetail}
          onClose={() => {setIsShowModalTicketDetail(false)}}
          item={selectedTicket}
        />
      </>
    );
})
export default AdminTicketsTable;