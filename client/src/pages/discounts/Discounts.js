import { Col, Row } from "antd";
import "./styles.scss"
import { useState } from "react";
import DiscountsTable from "../../components/discountsTable/DiscountsTable";

const Discounts = () => {
    const [listCategory, setListCategory] = useState([
        {
            text: "All",
            value: "07"
        }, 
        {
            text: "Published",
            value: "07"
        },
        {
            text: "Archived",
            value: "00"
        }
    ])
    const [selectedCategory, setSelectedCategory] = useState(0)

    return <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] discount-container mb-[120px]">
        <Col lg={17} md={24} sm={24} xs={24}>
            <div className="discount-container-header">
                <div className="discount-container-tittle">
                    Discounts
                </div>
                <div className="flex items-center flex-wrap gap-[12px]">
                    {
                        listCategory &&
                        listCategory.map((el, index) => {
                            return <>
                                <div className={`discount-category-info ${selectedCategory === index ? 'active' : ''}`} onClick={() => {setSelectedCategory(index)}}>
                                    {`${el.text} (${el.value})`}
                                </div>
                            </>
                        })
                    }
                    <div className="ml-[24px] text-add-new">
                        + Add New
                    </div>
                </div>
            </div>
            <div className="mt-[18px]">
                <DiscountsTable />
            </div>
        </Col>
    </Row>
}
export default Discounts;