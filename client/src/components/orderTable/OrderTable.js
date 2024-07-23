import { Table, Tag } from "antd";
// import ListOrder from "../../assets/json/listOrder.json"
import ThreeDotIcon from "../../assets/images/order/three-dot.svg"

import "./styles.scss"
import { useState } from "react";
import loadingAnimation from "../../assets/json/Add Products.json"
import Lottie from "lottie-react";

const OrderTable = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [listOrder, setListOrder] = useState([])
  const columns = [
      {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <span>{`#${text}`}</span>,
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
      },
      {
        title: 'Products',
        dataIndex: 'products',
        key: 'products',
        align: 'center'
      },
      {
        title: 'Payments',
        key: 'payments',
        dataIndex: 'payments',
        align: 'center',
        render: (text, record, index) => (
          <>
                <Tag color={'rgba(165, 255, 174, 0.48)'} className="!text-[#11FF00]" key={index}>
                  {text}
                </Tag>
          </>
        ),
      },
      {
          title: 'Fulfillment',
          dataIndex: 'fulfillment',
          key: 'fulfillment',
          render: (text) => <>
              <span className="flex flex-nowrap gap-[4px] items-center">
                  <div className="rounded-[50%] w-[4px] h-[4px] bg-[#11FF00]">
                  </div>
                  {text}
              </span>
          </>,
      },
      {
          title: 'Total',
          dataIndex: 'total',
          key: 'total',
          align: 'center',
          render: (text) => <span className="whitespace-nowrap">{`$ ${text}`}</span>,
      },
      {
        title: '',
        key: 'action',
        align: 'center',
        render: (text) => <div className="filter-theme-img"><img src={ThreeDotIcon} alt="" /></div>,
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

  return <>
      <Table 
          loading={{
            spinning: isLoading || !listOrder || listOrder.length === 0,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns} 
          dataSource={listOrder}
          pagination={{
            pageSize: 10,
            // current: 1,
            total: listOrder.length,
            itemRender: itemPaginationRender
          }}
          className="order-table"
      />
  </>
}
export default OrderTable