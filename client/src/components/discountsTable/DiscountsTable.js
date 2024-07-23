import { Input, Select, Table, Tag } from "antd";
import "./styles.scss"

import ViewIcon from "../../assets/images/products/eye.svg"
import EditIcon from "../../assets/images/products/edit.svg"
import HeartIcon from "../../assets/images/products/heart.svg"
import TrashIcon from "../../assets/images/products/trash.svg"
import TriangleIcon from "../../assets/images/products/triangle.svg"
import ArrowIcon from "../../assets/images/products/arrow.svg"
import SearchIcon from "../../assets/images/order/search.svg"

import { useState } from "react";

const DiscountsTable = () => {
    const [ListDiscounts, setListDiscounts] = useState([])
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <div className="w-[180px] h-[180px]">
                <img src={text} alt="" className="rounded-[12px] w-[180px] h-[180px]" />
            </div>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            align: 'center'
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            align: 'center'
        },
        {
          title: 'Draft',
          dataIndex: 'draft',
          key: 'draft',
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
          title: 'Date',
          key: 'date',
          dataIndex: 'date',
          align: 'center',
        },
        {
            title: 'Store',
            key: 'store',
            dataIndex: 'store',
            align: 'center',
        },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex flex-col items-center gap-[7px]">
                <button className="btn-action">
                    <img src={ViewIcon} alt="" />
                </button>
                <button className="btn-action">
                    <img src={EditIcon} alt="" />
                </button>
                <button className="btn-action">
                    <img src={HeartIcon} alt="" />
                </button>
                <button className="btn-action">
                    <img src={TrashIcon} alt="" />
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
    return <>
        <Table 
            columns={columns} 
            dataSource={ListDiscounts}
            pagination={{
                pageSize: pageSize,
                // current: 1,
                total: ListDiscounts.length,
                itemRender: itemPaginationRender,
                showSizeChanger: false
            }}
            title={() => <>
                <div className="discount-table-header">
                    <div className="group-filter-left">
                        <div className="group-page-size">
                            Show
                            <Select
                                className="filter-select"
                                value={pageSize}
                                suffixIcon={<img src={TriangleIcon} alt="" />}
                                options={listPageSize.map(el => {return {value: el, label: el}})}
                                onChange={(val) => {setPageSize(val)}}
                            />
                            Entries
                        </div>
                        <Select
                            placeholder="Choose Store"
                            className="filter-select"
                            suffixIcon={<img src={ArrowIcon} alt="" />}
                            options={[]}
                        />
                        <Select
                            placeholder="Product Type"
                            className="filter-select"
                            suffixIcon={<img src={ArrowIcon} alt="" />}
                            options={[]}
                        />
                        <Select
                            placeholder="Sort By"
                            className="filter-select"
                            suffixIcon={<img src={ArrowIcon} alt="" />}
                            options={[]}
                        />
                    </div>
                    <Input placeholder="Search" className="product-search-input" prefix={<img src={SearchIcon} alt="" />} />
                </div>
            </>}
            className="discount-table"
      />
    </>
}
export default DiscountsTable;