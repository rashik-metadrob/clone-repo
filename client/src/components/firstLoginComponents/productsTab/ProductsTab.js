import { Table } from "antd";
import Lottie from "lottie-react";
import { useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import { getAssetsUrl, itemPaginationRender } from "../../../utils/util";
import "./styles.scss"
import DefaultThumnailImage from "../../../assets/images/admin/hdri-default-thumnail.png"

const ProductsTab = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [listDatas, setListDatas] = useState([
        {
            "name": "Virtual Try-on",
            "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
        },
        {
            "name": "Virtual Try-on",
            "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
        },
        {
            "name": "Virtual Try-on",
            "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
        }
    ])
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [sorter, setSorter] = useState()

    const onTableChange = (pagination, filters, sorter, extra) => {
        setSorter(sorter)
    };

    const columns = [
      {
        title: "",
        dataIndex: "image",
        key: "image",
        render: (text, record) => (
          <div className="w-[73px] h-[73px] relative">
            {/* <img
              src={getAssetsUrl(text)}
              alt=""
              className="rounded-[4px] object-contain h-full w-full"
            /> */}
            <img
              src={DefaultThumnailImage}
              alt=""
              className="rounded-[4px] object-contain w-[73px] h-[73px]"
            />
          </div>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "left",
        sorter: true,
        width: 180,
      },
      {
        title: "Description",
        key: "description",
        dataIndex: "description",
        align: "left",
        render: (text) => <span className="text-description">{text}</span>,
      },
    ];

    return <>
        <div className="pt-[30px] pb-[17px] px-[23px]">
            <Table
                loading={{
                    spinning: isLoading,
                    indicator: <Lottie animationData={loadingAnimation} />
                }}
                columns={columns}
                dataSource={listDatas}
                pagination={{
                    pageSize: 10,
                    current: pageNum,
                    total: total,
                    itemRender: itemPaginationRender,
                    showSizeChanger: false,
                    onChange: (page, pageSize, sorter) => {
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
                onChange={onTableChange}
                className="product-tab-table-with-sort"
            />
        </div>
    </>
}
export default ProductsTab