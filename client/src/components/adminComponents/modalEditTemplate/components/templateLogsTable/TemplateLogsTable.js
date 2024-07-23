import { Table } from "antd"
import CalendarIcon from "../../../../../assets/icons/CalendarIcon";
import moment from "moment";
import { SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../../../utils/constants";

const TemplateLogsTable = ({
    logs = []
}) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'order',
            key: 'order',
            align: 'left',
            width: 80,
            render: (text, record, index) => <span>{index + 1}</span>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'left',
        },
        {
            title: 'Date of Update',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            align: 'left',
            render: (text) => <span style={{ display: 'flex', alignItems: 'center'}}>
            <span style={{ marginRight: 5 }}><CalendarIcon /></span> { moment(text, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT) }
            </span>,
        }
    ];
    return <>
        <Table
          columns={columns}
          dataSource={logs}
          pagination={false}
          locale={{
            emptyText: (
                <div className="empty-container">
                    No data can be found.
                </div>
            ),
          }}
          className="admin-shared-table max-h-[240px] overflow-y-auto"
          rowClassName="admin-template-table"
        />
    </>
}
export default TemplateLogsTable