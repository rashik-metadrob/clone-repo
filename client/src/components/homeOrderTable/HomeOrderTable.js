import { Table, Tag } from "antd";
// import ListOrder from "../../assets/json/listOrder.json"

import "./styles.scss"

const HomeOrderTable = () => {
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
    ];

  return <>
      <Table 
          columns={columns} 
          dataSource={[]}
          pagination={false}
          locale={{
            emptyText: (
                <div className="empty-container">
                    No data can be found.
                </div>
            ),
          }}
          className="home-order-table"
      />
  </>
}
export default HomeOrderTable