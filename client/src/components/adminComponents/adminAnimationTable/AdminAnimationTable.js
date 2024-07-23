import { Modal, Table, Tag, notification } from "antd";

import { useEffect, useRef, useState } from "react";

import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";

import moment from "moment"
import { useNavigate } from "react-router-dom";
import { PRODUCT_TYPES, PROJECT_TYPE, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import { getStorageUserDetail } from "../../../utils/storage";
import EyeIcon from "../../../assets/icons/EyeIcon";
import TrashIcon from "../../../assets/icons/TrashIcon";
import CalendarIcon from "../../../assets/icons/CalendarIcon";

import Animation1Image from "../../../assets/images/project/animation/1.png"
import Animation2Image from "../../../assets/images/project/animation/2.png"
import Animation3Image from "../../../assets/images/project/animation/3.png"
import Animation4Image from "../../../assets/images/project/animation/4.png"
import Animation5Image from "../../../assets/images/project/animation/5.png"
import Animation6Image from "../../../assets/images/project/animation/6.png"
import Animation7Image from "../../../assets/images/project/animation/7.png"
import Animation8Image from "../../../assets/images/project/animation/8.png"

const AdminAnimationTable = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listAnimations, setListAnimations] = useState([
        {
            id: "1",
            image: Animation1Image,
            name: "Animation 1",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        },
        {
            id: "2",
            image: Animation2Image,
            name: "Animation 2",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        },
        {
            id: "3",
            image: Animation3Image,
            name: "Animation 3",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        },
        {
            id: "4",
            image: Animation4Image,
            name: "Animation 4",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        },
        {
            id: "5",
            image: Animation5Image,
            name: "Animation 5",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        },
        {
            id: "6",
            image: Animation6Image,
            name: "Animation 6",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        },
        {
            id: "7",
            image: Animation7Image,
            name: "Animation 7",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        },
        {
            id: "8",
            image: Animation8Image,
            name: "Animation 8",
            size: "20 MB",
            createdAt: "2023-07-26T02:16:50.868Z",
            planName: "Drob Essential"
        }
    ])
    const timeoutRef = useRef()
    const currentUser = getStorageUserDetail();
    const columns = [
      {
        title: 'Thumbnail',
        dataIndex: 'image',
        key: 'image',
        render: (text) => <div className="w-[120px] h-auto">
          <img src={text} alt="" className="rounded-[4px] w-[120px] h-auto" />
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
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
        align: 'left'
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
        title: 'Plan',
        dataIndex: 'planName',
        key: 'planName',
        align: 'left',
        render: (text) => <span style={{ display: 'flex' }}>
          <div className="custom-box"></div> {text}
        </span>,
      },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex flex-col items-center gap-[7px]">
                <button className="btn-action" onClick={() => {}}>
                  <EyeIcon/>
                </button>
                <button className="btn-action" onClick={() => {onDeleteRecord(record)}}>
                  <TrashIcon />
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
    },[pageNum, pageSize])

    const loadData = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
        }, 300)
    }

    const onDeleteRecord = (record) => {
      Modal.confirm({
        title: "Are you sure to delete animation",
        centered: true,
        className: "dialog-confirm",
        onOk: () => {
          
        }
      })
    }

    return (
      <>
        <Table
          loading={{
            spinning: isLoading || !listAnimations,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listAnimations}
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
export default AdminAnimationTable;