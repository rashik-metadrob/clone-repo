import { useEffect, useState } from "react";
import { getListMostAddedItem } from "../../api/tracking.api";
import { Col, Row, Select, Table } from "antd";
import { getListPublishProject } from "../../api/project.api";
import ArrowIcon from "../../assets/images/analytics/arrow.svg"
import { getAssetsUrl } from "../../utils/util";

const StatisticalMostAddedItems = () => {
    const [listMostAddedItem, setListMostAddedItems] = useState([])
    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <div className="w-[64px] h-[64px]">
                <img src={getAssetsUrl(text)} alt="" className="rounded-[12px] w-[64px] h-[64px]" />
            </div>,
        },
        {
          title: 'Product name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Total added (time)',
          dataIndex: 'totalClick',
          key: 'totalClick',
          align: 'center'
        }
    ];

    useEffect(() => {
        getListMostAddedItem().then(rs => {
            setListMostAddedItems(rs.results)
        })
    },[])

    return <Row gutter={[26, 26]} className="!ml-0 !mr-0 rounded-[12px] last-order-container items-center">
    <Col span={24} className="w-full flex justify-between items-center">
        <div className="last-order-tittle">
            Most added to the cart
        </div>
    </Col>
    <Col span={24}>
        <Table
            locale={{
                emptyText: (
                    <div className="empty-container">
                        No data can be found.
                    </div>
                ),
            }} 
            columns={columns} 
            dataSource={listMostAddedItem}
            pagination={false}
            className="statistic-items-table"
        />
    </Col>
</Row>
}

export default StatisticalMostAddedItems