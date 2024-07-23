import { useEffect, useState } from "react";
import { getListFeaturedItems, getStayInStoreData } from "../../api/tracking.api";
import { Col, Row, Select, Table } from "antd";
import { getListPublishProject } from "../../api/project.api";
import ArrowIcon from "../../assets/images/analytics/arrow.svg"
import { getAssetsUrl } from "../../utils/util";

const StatisticalFeaturedItems = () => {
    const [listFeaturedItem, setListFeaturedItems] = useState([])
    const [storeId, setStoreId] = useState()
    const [listPublishProject, setListPublishProject] = useState([])
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
          title: 'Total click (time)',
          dataIndex: 'totalClick',
          key: 'totalClick',
          align: 'center'
        }
    ];

    useEffect(() => {
        getListPublishProject().then(rs => {
            setListPublishProject(rs.results)

            if(rs.results.length > 0){
                setStoreId(rs.results[0].value)
            }
        })
    }, [])

    useEffect(() => {
        if(storeId){
            getListFeaturedItems({storeId: storeId}).then(rs => {
                setListFeaturedItems(rs.results)
            })
        } else {
            setListFeaturedItems([])
        }
    },[storeId])

    return <Row gutter={[26, 26]} className="!ml-0 !mr-0 rounded-[12px] last-order-container items-center">
    <Col span={24} className="w-full flex justify-between items-center">
        <div className="last-order-tittle">
            Featured Items
        </div>
        <div>
            <Select
                className="select-filter"
                showSearch
                style={{
                    width: 200
                }}
                value={storeId}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => {setStoreId(value)}}
                suffixIcon={<img src={ArrowIcon} alt="" />}
                options={listPublishProject}
            />
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
            dataSource={listFeaturedItem}
            pagination={false}
            className="statistic-items-table"
        />
    </Col>
</Row>
}

export default StatisticalFeaturedItems