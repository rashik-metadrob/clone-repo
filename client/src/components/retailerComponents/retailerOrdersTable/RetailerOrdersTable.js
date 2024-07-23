import { Table, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import orderApi from "../../../api/order.api";
import moment from "moment";
import { PAYMENT_STATUS_TEXT, RETAILER_TEMPLATE_TABLE_DATE_FORMAT, SERVER_DATE_FORMAT, SHIPMENT_STATUS, SHIPMENT_STATUS_TEXT } from "../../../utils/constants";
import _ from "lodash";

const RetailerOrdersTable = ({
    pageSize = 10,
    shipmentStatus = "All",
    selectedDate = ""
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listOrders, setListOrders] = useState([])
    const timeoutRef = useRef()
    const columns = [
        {
          title: 'Order Id',
          dataIndex: 'id',
          key: 'id',
          align: 'id',
          render: (text, record) => <span>#{text}</span>
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'createdAt',
            render: (text) => <span className="whitespace-nowrap">
                { moment(text, SERVER_DATE_FORMAT).format(RETAILER_TEMPLATE_TABLE_DATE_FORMAT) }
            </span>,
        },
        {
          title: 'Products',
          dataIndex: 'items',
          key: 'items',
          align: 'left',
          render: (text) => <span className="whitespace-nowrap">{_.get(text, [0, 'name'], '')}{text.length > 0 ? ', ...' : ''}</span>
        },
        {
          title: 'Payment',
          dataIndex: 'paymentStatus',
          key: 'paymentStatus',
          align: 'left',
          render: (text) => <span className="whitespace-nowrap">{_.get(PAYMENT_STATUS_TEXT, text, '')}</span>
        },
        {
          title: 'Status',
          dataIndex: 'shipmentStatus',
          key: 'shipmentStatus',
          align: 'left',
          render:(text) => <div className="flex gap-[5px] items-center flex-nowrap">
            <div className="w-[5px] h-[5px] rounded-[50%]" style={{background: _.get(SHIPMENT_STATUS_TEXT, [text, 'color'], "#000")}}>

            </div>
            <span>{_.get(SHIPMENT_STATUS_TEXT, [text, 'text'], '')}</span>
          </div>
        },
        {
          title: 'Total',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          align: 'left',
          render: (text, record) => <span className="whitespace-nowrap">$ {_.round(_.toNumber(text), 2)}</span>
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
    }, [shipmentStatus, selectedDate, pageSize])

    useEffect(() => {
        loadData()
    },[pageNum, pageSize, shipmentStatus, selectedDate])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            let filterData = {
                limit: pageSize,
                page: pageNum
            }
            if(shipmentStatus !== 'All'){
                filterData.shipmentStatus = shipmentStatus
            }
            if(selectedDate){
                filterData.createdAt = selectedDate
            }
            setIsLoading(true)
            orderApi.getListOrders(filterData).then((rs) => {
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
export default RetailerOrdersTable;