// import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import { Modal, Table, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import loadingAnimation from "../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import TrashIcon from "../../assets/images/products/trash.svg"

const CommonTable = ({data, columns, onRowDeleted, onRowAdded, onPageChanged, onPerPageChanged}) => {
  //const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const listPageSize = [5, 10, 15, 20, 50, 100]
  const [pageSize, setPageSize] = useState(10)
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(1)
  const [listData, setData] = useState([])

  const timeoutRef = useRef()

  useEffect(() => {
    setData(data)
  }, [data])

  const itemPaginationRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

// const loadData = () => {
//     if(timeoutRef.current){
//         clearTimeout(timeoutRef.current)
//     }

//     timeoutRef.current = setTimeout(() => {
//         let filterData = {
//             limit: pageSize,
//             page: pageNum,
//             statistic: true
//         }
//         userApi.getListUsers(filterData).then((rs) => {
//             setListUsers(
//               rs.results.map(el => {
//                   el.key = el.id;
//                   return el
//                 }
//               )
//             )
//             setTotal(rs.totalResults)
//         })
//     }, 300)
// }

  const rowSelection = {
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  const onDeleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure to delete user",
      centered: true,
      className: "dialog-confirm",
      onOk: () => {
        // userApi.deleteUser(record.id).then(() => {
        //   //loadData()
        //   notification.success({
        //     message: "Deleted successfully!!"
        //   })
        // }).catch(err => {
        //   notification.error({
        //     message: "Delete fail!"
        //   })
        // })
      }
    })
  }

  return (
    <>
      <Row
        gutter={[26, 26]}
        className="!ml-0 !mr-0 mt-[12px] add-template-container"
      >
        <Col lg={24} md={24} sm={24} xs={24}>
          <Table
            loading={{
              spinning: isLoading || !listData,
              indicator: <Lottie animationData={loadingAnimation} />,
            }}
            // rowSelection={{
            //   type: "checkbox",
            //   hideSelectAll: true,
            //   ...rowSelection,
            // }}
            columns={columns}
            dataSource={listData}
            pagination={{
              pageSize: pageSize,
              current: pageNum,
              total: total,
              itemRender: itemPaginationRender,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPageNum(page);
                setPageSize(pageSize);
              },
            }}
            locale={{
              emptyText: (
                <div className="empty-container">No data can be found.</div>
              ),
            }}
            className="shared-table"
          />
        </Col>
      </Row>
    </>
  );
};
export default CommonTable;
