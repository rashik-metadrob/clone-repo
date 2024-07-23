// import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Space } from "antd";
import { Modal, Table, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import TrashIcon from "../../../assets/images/products/trash.svg"
import API from "../../../api/pricingPlan.api";
import CommonTable from "../../../components/commonTable/CommonTable";
import './styles.scss'
import PricingPlanFormModal from "../../../components/pricingPlanForm/PricingPlanFormModal";
import { useReady } from "../../../utils/hooks";
import EditIcon from "../../../assets/images/products/edit.svg"

const PricingPlanManagement = () => {
  //const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const listPageSize = [5, 10, 15, 20, 50, 100]
  const [pageSize, setPageSize] = useState(10)
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(1)
  const [pricingPlans, setPricingPlans] = useState([])
  const pricingModalRef = useRef();

  const [isShowCreateModal, setIsShowCreateModal] = useState(false)
  const [updateData, setUpdateData] = useState(null)


  const timeoutRef = useRef()

  useReady(() => {
    loadData()
  })
  

  const itemPaginationRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

  function getDisplayVal(key) {
    switch(key) {
      case 'first': {
        return 'First pricing plan';
      }
      case 'second': {
        return 'Second pricing plan';
      }
      case 'third': {
        return 'Third pricing plan';
      }
      default: {
        return 'None'
      }
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'left'
    },
    {
      title: 'Display',
      dataIndex: 'display',
      key: 'display',
      align: 'center',
      render: (text, record) => <span>{getDisplayVal(record?.display)}</span>
    },
    {
      title: 'Monthly price',
      align: 'center',
      render: (text, record) => <span>{record?.pricing?.monthly}</span>
    },
    {
      title: 'Yearly price',
      align: 'center',
      render: (text, record) => <span>{record?.pricing?.yearly}</span>
    },
    {
      title: 'Actions',
      key: 'action',
      align: 'center',
      render: (text, record, index) => <>
        <div className="flex flex-row items-center gap-[7px] justify-center">
        <button className="btn-action">
            <img src={EditIcon} alt="" onClick={() => { 
              setUpdateData(record);
              setIsShowCreateModal(true);
             }} />
          </button>
          <button className="btn-action">
            <img src={TrashIcon} alt="" onClick={() => { onDeleteRecord(record) }} />
          </button>
        </div>
      </>,
    },
  ];

const loadData = () => {
  let filterData = {
    limit: pageSize,
    page: pageNum,
    statistic: true
  }
  API.getPricingPlans(filterData).then((rs) => {
    setPricingPlans(
        rs.map(el => {
            el.key = el.id;
            return el
          }
        )
    )
    setTotal(rs.length)
  })
}

  const onDeleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure to delete this record",
      centered: true,
      className: "dialog-confirm",
      onOk: () => {
        API.deletePricingPlan(record.id).then((rs) => {
          loadData()
          notification.success({
            message: "Deleted successfully!"
          })
        }).catch(() => {
          notification.error({
            message: "Delete fail"
          })
        })
      }
    })
  }

  function onSubmitCreateModal(data) {

    if(updateData) {
      const newData = {
        id: updateData.id,
        ...data,
      }
      API.updatePricingPlan(newData).then((rs) => {
        loadData()
        setIsShowCreateModal(false)
        setUpdateData(null)
        notification.success({
          message: "Update successfully"
        })
      }).catch(() => {
        pricingModalRef.current.closeLoading();
      })
    }
    else {
      API.createPricingPlan(data).then((rs) => {
        loadData()
        setIsShowCreateModal(false)
        notification.success({
          message: "Create success"
        })
      }).catch(() => {
        pricingModalRef.current.closeLoading();
      })
    }
  }

  function onCancelCreateModal() {
    setIsShowCreateModal(false)
    
  }

  function onShowCreateModal() {
    setUpdateData(null)
    setIsShowCreateModal(true)
  }

  return (
    <>
      <Row
        gutter={[26, 26]}
        className="!ml-0 !mr-0 mt-[12px] add-template-container"
      >
        <Col lg={24} md={24} sm={24} xs={24} className="text-right">
          <div className="products-container-header flex justify-between">
            <div className="products-container-tittle">
              Pricing plan
            </div>
            <div className="flex items-end flex-wrap gap-[12px]">
              <div id="addNew" className="ml-[24px] text-add-new" onClick={() => onShowCreateModal()}>
                + Add New
              </div>
            </div>
          </div>
          <CommonTable columns={columns} data={pricingPlans}/>
        </Col>
      </Row>
      <PricingPlanFormModal
        ref={pricingModalRef}
        visible={isShowCreateModal}
        onSubmit={onSubmitCreateModal}
        onClose={onCancelCreateModal}
        updateData={updateData}/>
    </>
  );
};
export default PricingPlanManagement;
