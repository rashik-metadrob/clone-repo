import { Col, Input, Row, Select } from "antd";
import "./styles.scss";
import { useState } from "react";
import ArrowIcon from "../../assets/images/order/arrow.svg"
import SearchIcon from "../../assets/images/order/search.svg"
import PluginImage from "../../assets/images/plugin/example.png"

const Plugins = () => {
    const [listCategory, setListCategory] = useState([
        {
            text: "Featured",
            value: "Featured"
        },
        {
            text: "Popular",
            value: "Popular"
        },
        {
            text: "Recommended",
            value: "Recommended"
        },
        {
            text: "Faviorates",
            value: "Faviorates"
        }
    ])
    const [selectedCategory, setSelectedCategory] = useState('Featured')

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] plugins-container mb-[120px]">
            <Col lg={17} md={24} sm={24} xs={24}>
                <div className="plugins-container-header">
                    <div className="plugins-container-tittle">
                        Plugins
                    </div>
                </div>
                <div className="plugins-filter-container mt-[9px]">
                    <div className="flex gap-x-[50px] gap-y-[24px] flex-wrap">
                        {
                            listCategory &&
                            listCategory.map((el, index) => {
                                return <>
                                    <div className={`plugins-category-info ${selectedCategory === el.value ? 'active' : ''}`} onClick={() => {setSelectedCategory(el.value)}}>
                                        {el.text}
                                    </div>
                                </>
                            })
                        }
                    </div>
                    <div className="flex gap-[17px]">
                        <Select
                            className="shared-select"
                            showSearch
                            defaultValue={"Keywords"}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            suffixIcon={<img src={ArrowIcon} alt="" />}
                            options={[
                                {
                                    value: 'Keywords',
                                    label: 'Keywords',
                                }
                            ]}
                        />
                        <Input placeholder="Search" className="shared-search-input w-[230px]" prefix={<img src={SearchIcon} alt="" />} />
                    </div>
                </div>
                <div className="mt-[35px]">
                    <Row gutter={[26, 26]} className="card-list-container">
                        <Col lg={12} md={12} sm={24} xs={24} className="h-inherit">
                            <div className="card-container h-full">
                                <div className="image-conatiner">
                                    <img src={PluginImage} alt="" />
                                </div>
                                <div className="content-conatiner">
                                    <div className="card-title">
                                        Virtual Try-On
                                    </div>
                                    <div className="card-description mt-[8px]">
                                        Virtual try-on plugins revolutionize online shopping by allowing customers to virtually try on products using AR or computer vision technology.
                                    </div>
                                    <div className="buttons-container mt-[64px]">
                                        <button className="btn-purchase">
                                            Purchase
                                        </button>
                                        <button className="btn-trial">
                                            3 Days Trial
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24} className="h-inherit">
                            <div className="card-container h-full">
                                <div className="image-conatiner">
                                    <img src={PluginImage} alt="" />
                                </div>
                                <div className="content-conatiner">
                                    <div className="card-title">
                                        Chat-Bot
                                    </div>
                                    <div className="card-description mt-[8px]">
                                        Chatbots allow businesses to connect with customers in a personal way without the expense of human representatives.
                                    </div>
                                    <div className="buttons-container mt-[64px]">
                                        <button className="btn-purchase">
                                            Purchase
                                        </button>
                                        <button className="btn-trial">
                                            3 Days Trial
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    </>
}
export default Plugins;