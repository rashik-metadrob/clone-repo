import { Col, Row, Select } from "antd"
import "./styles.scss"
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import { useState } from "react"
import DeleteIcon from "../../../assets/images/admin/delete.svg"
import StarIcon from "../../../assets/images/admin/star.svg"

const AdminApiPage = () => {
    const [listTrendings, setListTrendings] = useState([
        {
            id: '1',
            title: 'Shopify Translate & Adapt',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/1.png`
        },
        {
            id: '2',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/2.png`
        },
        {
            id: '3',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/3.png`
        },
        {
            id: '4',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/4.png`
        },
        {
            id: '5',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/5.png`
        },
        {
            id: '6',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/6.png`
        }
    ])
    const [listApis, setListApis] = useState([
        {
            id: '1',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/7.png`
        },
        {
            id: '2',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/8.png`
        },
        {
            id: '3',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/9.png`
        },
        {
            id: '4',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/10.png`
        },
        {
            id: '5',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/11.png`
        },
        {
            id: '6',
            title: 'Rewind',
            rate: 4.7,
            price: 467,
            from: 'Database',
            description: 'Automatic real-time backups. Easy restore, recover & undo for products, themes, full store, & more.',
            image: `${process.env.REACT_APP_HOMEPAGE}/images/api/12.png`
        }
    ])

    return <>
        <Row gutter={[0, 37]} className="!ml-0 !mr-0 px-[37px] mt-[27px] admin-api-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <Row className="admin-page-content-container">  
                    <Col span={24}>
                        <div className="title">
                            Trending this October
                        </div>
                    </Col>
                    <Col span={24} className="mt-[26px]">
                        <Row gutter={[34, 34]}>
                            {
                                listTrendings && listTrendings.map(el => (
                                    <Col lg={8} md={12} span={24} key={el.id}>
                                        <div className="trending-api-card">
                                            <img src={el.image} alt="" className="w-[115px]"/>
                                            <div className="content">
                                                <div className="flex justify-between items-center gap-[12px]">
                                                    <div className="title">
                                                        {el.title}
                                                    </div>
                                                    <img src={DeleteIcon} alt="" className="cursor-pointer" />
                                                </div>
                                                <div className="mt-[9px] flex items-center gap-[10px] flex-wrap">
                                                    <div className="flex items-center gap-[4px]">
                                                        <div className="normal-text">
                                                            {el.rate}
                                                        </div>
                                                        <img src={StarIcon} alt="" />
                                                    </div>
                                                    <div className="dot">
                                                    </div>
                                                    <div className="normal-text">
                                                        From ${el.price}/month
                                                    </div>
                                                    <div className="dot">
                                                    </div>
                                                    <div className="normal-text">
                                                        {el.from}
                                                    </div>
                                                </div>
                                                <div className="mt-[6px] text-description">
                                                    {el.description}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            }
                            
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
                <Row className="admin-page-content-container">  
                    <Col span={24}>
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="title">
                                API
                            </div>
                            <div className="flex items-center gap-[14px] rounded-[12px]">
                                <div className="filter-container">
                                    <Select
                                        className="filter-select"
                                        defaultValue="Price"
                                        options={[
                                            {
                                                value: 'Price',
                                                label: 'Price',
                                            },
                                        ]}
                                        suffixIcon={<DownArrowIcon/>}
                                    />
                                </div>
                                <div className="filter-container">
                                    <Select
                                        className="filter-select"
                                        defaultValue="Category"
                                        options={[
                                            {
                                                value: 'Category',
                                                label: 'Category',
                                            },
                                        ]}
                                        suffixIcon={<DownArrowIcon/>}
                                    />
                                </div>
                            </div>
                        </div>
                        
                    </Col>
                    <Col span={24} className="mt-[26px]">
                        <Row gutter={[34, 34]}>
                            {
                                listApis && listApis.map(el => (
                                    <Col lg={8} md={12} span={24} key={el.id}>
                                        <div className="normal-api-card">
                                            <img src={el.image} alt="" className="w-[115px] rounded-[12px]"/>
                                            <div className="content">
                                                <div className="flex justify-between items-center gap-[12px]">
                                                    <div className="title">
                                                        {el.title}
                                                    </div>
                                                    <img src={DeleteIcon} alt="" className="cursor-pointer" />
                                                </div>
                                                <div className="mt-[9px] flex items-center gap-[10px] flex-wrap">
                                                    <div className="flex items-center gap-[4px]">
                                                        <div className="normal-text">
                                                            {el.rate}
                                                        </div>
                                                        <img src={StarIcon} alt="" />
                                                    </div>
                                                    <div className="dot">
                                                    </div>
                                                    <div className="normal-text">
                                                        From ${el.price}/month
                                                    </div>
                                                    <div className="dot">
                                                    </div>
                                                    <div className="normal-text">
                                                        {el.from}
                                                    </div>
                                                </div>
                                                <div className="mt-[6px] text-description">
                                                    {el.description}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            }
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}

export default AdminApiPage