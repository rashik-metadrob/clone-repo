import { useEffect, useState } from "react"
import { userApi } from "../../../api/user.api"
import { Table, notification } from "antd"
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import moment from "moment"
import { PAYMENT_STATUS_TEXT, RETAILER_TEMPLATE_TABLE_IN_CARD_DATE_FORMAT, SERVER_DATE_FORMAT, SHIPMENT_STATUS_TEXT } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import orderApi from "../../../api/order.api";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const RetailerLast5OrdersCard = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [listDatas, setListDatas] = useState([
    ])
    const {t} = useTranslation()

    useEffect(() => {
        loadData()
    },[])

    const loadData = () => {
        setIsLoading(true)
        userApi.getNewUsers().then((rs) => {
            
            setIsLoading(false)
        })
        let filterData = {
            limit: 5,
            page: 1,
            sortBy: "createdAt:desc"
        }
        orderApi.getListOrders(filterData).then((rs) => {
            setListDatas(
              rs.results.map(el => {
                  el.key = el.id;
                  return el
                }
              )
            )
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't get data from server!`)
            })
            setIsLoading(false)
        }) 
    }

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
                { moment(text, SERVER_DATE_FORMAT).format(RETAILER_TEMPLATE_TABLE_IN_CARD_DATE_FORMAT) }
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

    return <>
        <div className="statistical-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    {t('global.last_5_orders')}
                </div>
                <div className="text-show-all" onClick={() => {}}>
                    {t('global.show_all')}
                </div>
            </div>
            <div className="mt-[29px]">
                <Table
                    loading={{
                        spinning: isLoading,
                        indicator: <Lottie animationData={loadingAnimation} />
                    }}
                    columns={columns}
                    dataSource={listDatas}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div className="empty-container">
                                No data can be found.
                            </div>
                        ),
                    }}
                    className="retailer-shared-table-in-card"
                />
            </div>
        </div>
    </>
}
export default RetailerLast5OrdersCard;