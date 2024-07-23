import { Modal, Table, Tag, notification } from "antd";

import { useEffect, useRef, useState } from "react";

import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { useLocation, useNavigate } from "react-router-dom";
import { deleteProject, getListProject, getListProjectByAdmin } from "../../../api/project.api";
import { PROJECT_MODE, PROJECT_MODE_TEXT, PROJECT_TYPE, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT, USER_ROUTE_PREFIX } from "../../../utils/constants";
import EyeIcon from "../../../assets/icons/EyeIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";
import _ from "lodash"
import { getAssetsUrl, isShopifyAdminLocation } from "../../../utils/util";

const AdminStoreTableTable = ({
  search = ""
}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listTemplates, setListTemplates] = useState([])
    const timeoutRef = useRef()

    const columns = [
      {
        title: 'Thumbnail',
        dataIndex: 'image',
        key: 'image',
        render: (text) => <div className="w-[120px] h-auto">
        <img src={getAssetsUrl(text)} alt="" className="rounded-[4px] w-[120px] h-auto" />
        </div>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        render: (text) => <span>
            { `"${text}"` }
        </span>,
      },
      {
        title: 'Date of Upload',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'left',
        render: (text) => <span style={{ display: 'flex', alignItems: 'center'}}>
        <span style={{ marginRight: 5 }}><CalendarIcon /></span> { moment(text, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT) }
        </span>,
      },
      {
        title: 'Owner',
        dataIndex: 'ownerName',
        key: 'ownerName',
        align: 'left',
        render: (text, record) => <span>
            { `"${text}"` }
        </span>,
      },
      {
        title: 'Email',
        dataIndex: 'ownerEmail',
        key: 'ownerEmail',
        align: 'left',
      },
      {
        title: 'Role',
        dataIndex: 'mode',
        key: 'mode',
        align: 'left',
        render: (text, record) => <span>
            { PROJECT_MODE_TEXT[text] }
        </span>,
      },
      {
        title: 'Actions',
        key: 'action',
        align: 'center',
        render: (text, record, index) => <>
          <div className="flex flex-col items-center gap-[7px]">
              <button className="btn-action" onClick={() => {navigate(`${USER_ROUTE_PREFIX.ADMIN_EDIT_PROJECT}${record.id}`)}}>
                <EyeIcon/>
              </button>
          </div>
        </>,
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

    useEffect(() => {
        loadData()
    },[pageNum, pageSize, search])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          let filterData = {
            limit: pageSize,
            page: pageNum,
            type: PROJECT_TYPE.PROJECT,
            search,
            isShopifyStore: isShopifyAdminLocation(location) ? 1 : 0
          }
          getListProjectByAdmin(filterData).then((rs) => {
            setListTemplates(rs.results)
            setTotal(rs.totalResults)
          })
        }, 300)
    }

    return (
      <>
        <Table
          loading={{
            spinning: isLoading|| !listTemplates,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listTemplates}
          pagination={{
            pageSize: pageSize,
            current: pageNum,
            total: total,
            itemRender: itemPaginationRender,
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              setPageNum(page);
            },
            position: ["bottomCenter"]
          }}
          locale={{
            emptyText: (
                <div className="empty-container">
                    No data can be found.
                </div>
            ),
          }}
          className="admin-shared-table"
          rowClassName="admin-template-table"
        />
      </>
    );
}
export default AdminStoreTableTable;