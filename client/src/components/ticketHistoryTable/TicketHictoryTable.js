import { Table, Tag } from "antd";
import "./styles.scss"

import ThreeDotIcon from "../../assets/images/support/three-dot.svg"

const TicketHistoryTable = () => {
  const ListTicket = []

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
    },
    {
      title: 'Query',
      dataIndex: 'query',
      key: 'query',
      width: 450
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text, record, index) => (
        <>
              <Tag color={text === 'Solved' ? '#48FF48' : '#FFB648'} className={text === 'Solved' ? "!text-[#0F7000]" : "!text-[#703C00]"} key={index}>
                {text}
              </Tag>
        </>
      ),
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
          columns={columns} 
          dataSource={ListTicket}
          pagination={{
              pageSize: 5,
              // current: 1,
              total: ListTicket.length,
              itemRender: itemPaginationRender
          }}
          locale={{
            emptyText: (
                <div className="empty-container">
                    No data can be found.
                </div>
            ),
          }}
          className="ticket-history-table"
      />
  </>
}
export default TicketHistoryTable;