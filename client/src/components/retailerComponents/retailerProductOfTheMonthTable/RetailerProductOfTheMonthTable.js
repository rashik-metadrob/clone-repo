import { Progress, Table } from "antd"
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import productApi from "../../../api/product.api";
import { useTranslation } from "react-i18next";

const RetailerProductOfTheMonthTable = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [listDatas, setListDatas] = useState([
    ])
    const {t} = useTranslation()

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            align: 'id',
            render: (text, record) => <span>#{text}</span>
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            align: 'sku',
        },
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            align: 'left',
        },
        {
            title: 'Sold',
            dataIndex: 'sold',
            key: 'sold',
            align: 'left',
            render: (text) => <Progress percent={0} key={0} showInfo={false} strokeColor="#BAEDBD" trailColor="rgba(255, 255, 255, 0.20)"/>
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
            align: 'center',
            render: (text) => <div className="flex justify-center">
                <div className="px-[8px] py-[5px] bg-[rgba(252,184,89,0.12)] rounded-[4px] w-fit border-[#FCB859] border-[1px]">
                    <span className="text-[#FCB859]">0%</span>
                </div>
            </div>
        }
    ];

    useEffect(() => {
        setIsLoading(true)
        productApi.getProductsOfTheMonth().then(data => {
            setListDatas(data)
            setIsLoading(false)
        })
    }, [])

    return <>
        <div className="statistical-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    {t('global.product_of_the_month')}
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
export default RetailerProductOfTheMonthTable