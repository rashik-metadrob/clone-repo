import { Table, notification } from "antd";
import Lottie from "lottie-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import { getAssetsUrl, itemPaginationRender } from "../../../utils/util";
import "./styles.scss"
import DefaultThumnailImage from "../../../assets/images/admin/hdri-default-thumnail.png"
import global from "../../../redux/global";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/appSlice";
import shopifyApi from "../../../api/shopify.api";
import { useAuthenticatedFetch } from "../../../modules/shopify/hooks";
import _ from "lodash";

const ShopifyProductTab = forwardRef(({}, ref) => {
  const user = useSelector(getUser)
  const [isLoading, setIsLoading] = useState(false)
  const [listDatas, setListDatas] = useState([
  ])

  const [selectedProductRows, setSelectedProductRows] = useState([])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = global.IS_SHOPIFY ? useAuthenticatedFetch() : null

  useImperativeHandle(ref, () => ({
    getSelectedProducts: () => {
      return selectedProductRows
    }
  }));

  useEffect(() => {
    getProductsData()
  }, [])

  const getProductsData = async () => {
    if(global.IS_SHOPIFY){
      setIsLoading(true)
        // Used Shopify session via @shopify/shopify-app-express
      const response = await fetch("/shopify/product/get-all", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await response.json()
      setListDatas(
        _.get(data, 'data', []).map((el, index) => {
            return {
              key: index,
              ...el
            }
        })
      )
      setIsLoading(false)
    } else {
      if(!user?.shopifyAccessToken || !user?.shopifyStoreName){
        notification.warning({
            message: "Your shopify store isn't set up!"
        })
        return
      }

      setIsLoading(true)
      shopifyApi.getProductsByStoreFrontAPI({
      }).then(data => {
        setListDatas(
          _.get(data, 'data', []).map((el, index) => {
            return {
              key: index,
              ...el
            }
          })
        )
        setIsLoading(false)
      }).catch(err => {
          notification.error({
              message: _.get(err, ['response', 'data', 'message'], `Can't get product data from Shopify!`)
          })
          setIsLoading(false)
      })
    }
  }

  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div className="w-[73px] h-[73px] relative">
          <img
            src={getAssetsUrl(text)}
            alt=""
            className="rounded-[4px] object-contain h-full w-full"
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
    <div className="">
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
        dataSource={listDatas}
        pagination={{
          pageSize: 10,
        }}
        locale={{
          emptyText: (
            <div className="empty-container">No data can be found.</div>
          ),
        }}
        className="product-tab-table-with-sort"
      />
    </div>
  </>
})
export default ShopifyProductTab