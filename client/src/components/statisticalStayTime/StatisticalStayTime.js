import { useEffect, useState } from "react";
import "./styles.scss"
import { getStayInStoreData } from "../../api/tracking.api";
import { Col, Row, Table } from "antd";

const StatisticalStayTime = () => {
    const [listStayTime, setListStayTime] = useState([])
    const columns = [
        {
          title: 'Store',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Total time (h)',
          dataIndex: 'totalTime',
          key: 'totalTime',
          align: 'center',
          render: (text) => <span>{(text / 3600).toFixed(0)}</span>
        }
    ];

    useEffect(() => {
        getStayInStoreData().then(rs => {
            setListStayTime(rs.results)
        })
    },[])

    return <Row gutter={[26, 26]} className="!ml-0 !mr-0 rounded-[12px] last-order-container items-center">
    <Col span={24} className="w-full flex justify-between items-center">
        <div className="last-order-tittle">
            Total time stay in store
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
            dataSource={listStayTime}
            pagination={false}
            className="statistic-items-table"
        />
    </Col>
</Row>
}

export default StatisticalStayTime