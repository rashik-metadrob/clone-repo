import { Checkbox, Modal, Row, Table, Tag, notification } from "antd";
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import "./styles.scss"

import {
  forwardRef, useState,
} from "react";

import moment from "moment";
import { getAssetsUrl } from "../../utils/util";
import { createMultiProducts } from "../../api/product.api";
import _ from "lodash";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/json/Add Products.json"
import { CURRENCY_LIST, MODEL_BLOCK } from "../../utils/constants";
import PictureIcon from "../../assets/icons/PictureIcon";

const ImportShopifyProductModal = forwardRef((
  {
    open, 
    onClose = () => {}, 
    listProducts,
    onSuccess = () => {}
  }, 
  ref
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProductRows, setSelectedProductRows] = useState([])
  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div className="w-[231px] h-[130px] relative">
            <img
              src={getAssetsUrl(text)}
              alt=""
              className="rounded-[4px] object-contain h-full w-full"
            />
            {_.get(record, 'block', '') === MODEL_BLOCK["3D"] && <div className="absolute right-[6px] bottom-[6px] w-[40px] h-[40px] bg-[rgba(255,255,255,0.5)] rounded-[8px] flex justify-center items-center">
              <span>3D</span>
            </div>}
            {_.get(record, 'block', '') === MODEL_BLOCK["2D"] && <div className="absolute right-[6px] bottom-[6px] w-[40px] h-[40px] bg-[rgba(255,255,255,0.5)] rounded-[8px] flex justify-center items-center action-icon">
              <PictureIcon />
            </div>}
          </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Draft",
      dataIndex: "draft",
      key: "draft",
      align: "center",
      render: (text, record, index) => (
        <>
          <Tag
            color={"rgba(165, 255, 174, 0.48)"}
            className="!text-[#11FF00]"
            key={index}
          >
            Published
          </Tag>
        </>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text, record) => <span>{`${_.get(CURRENCY_LIST.find(el => el.code === record?.displayCurrency), ['symbol'], '')}${text}`}</span>,
    },
    {
      title: "Date",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      render: (text) => <span>{moment(text).format("MMMM DD YYYY")}</span>,
    },
  ];

  const onImport = () => {
    if(!selectedProductRows || selectedProductRows.length === 0){
      notification.warning({
        message: "Please select product!"
     })
     return
    }
    setIsLoading(true)
    createMultiProducts(selectedProductRows).then(data => {
      setIsLoading(false)
      notification.success({
        message: `Import successfully ${data.length} products!`
      })
      onSuccess()
    }).catch(err => {
      setIsLoading(false)
      notification.error({
         message: _.get(err, ['response', 'data', 'message'], `Can't get product data from Shopify!`)
      })
    })
  }

  return (
    <>
      <Modal
        open={open}
        width={794}
        footer={null}
        closeIcon={<img src={ModalExitIcon} alt="" />}
        destroyOnClose={true}
        closable={true}
        className="modal-import-product"
        onCancel={() => {
          onClose();
        }}
      >
        <div className="modal-import-product-content">
          <Table
            loading={{
              spinning: isLoading,
              indicator: <Lottie animationData={loadingAnimation} />
            }}
            rowSelection={{
              type: "checkbox",
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedProductRows(selectedRows)
              },
              getCheckboxProps: (record) => ({
                name: record.key,
              }),
            }}
            columns={columns}
            dataSource={listProducts}
            pagination={{
              pageSize: 10,
            }}
            locale={{
              emptyText: (
                <div className="empty-container">No data can be found.</div>
              ),
            }}
            className="retailer-template-table-with-sort"
            rowClassName="retailer-template-table"
          />
          <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] justify-center pr-[30px]">
            <button className="btn-save" onClick={() => {onImport()}}>
                Import
            </button>
          </Row>
        </div>
      </Modal>
    </>
  );
});
export default ImportShopifyProductModal;
