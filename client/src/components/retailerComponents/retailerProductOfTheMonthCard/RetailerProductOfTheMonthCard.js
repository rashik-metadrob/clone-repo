import { useEffect, useRef, useState } from "react"
import productApi from "../../../api/product.api"
import "./styles.scss"
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { Col, Row } from "antd";
import { getAssetsUrl } from "../../../utils/util";
import { useTranslation } from "react-i18next";

const RetailerProductOfTheMonthCard = () => {
    const containerRef = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const [isDisabledWheel, setIsDisabledWheel] = useState(false)
    const [listDatas, setListDatas] = useState([
    ])
    const {t} = useTranslation()
    useEffect(() => {
        setIsLoading(true)
        productApi.getProductsOfTheMonth().then(data => {
            setIsLoading(false)
            setListDatas(data)
        })
    }, [])

    useEffect(() => {
        containerRef.current.addEventListener("mousewheel", onContainerWheel, {passive: false})
    }, [isDisabledWheel])

    const onContainerWheel = (e) => {
        if(isDisabledWheel){
            e.preventDefault();
        }
    }

    function onWheel(apiObj, ev) {
        // ev.preventDefault();
        // ev.stopPropagation();
        const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
      
        if (isThouchpad) {
          ev.stopPropagation();
          return;
        }
      
        if (ev.deltaY < 0) {
          apiObj.scrollNext();
        } else if (ev.deltaY > 0) {
          apiObj.scrollPrev();
        }
    }

    return <>
        <div className="statistical-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    {t('global.product_of_the_month')}
                </div>
            </div>
            <div className="mt-[29px]">
                <div className="product-of-the-month-container" ref={containerRef} onPointerEnter={() => {setIsDisabledWheel(true)}} onPointerLeave={() => {setIsDisabledWheel(false)}}>
                    <ScrollMenu onWheel={onWheel}>
                        {
                            listDatas && listDatas.map(el => (
                                <div className="product-of-the-month-card" key={`Focus-${el.id}`} tabIndex={0}>
                                    <Row gutter={10}>
                                        <Col span={12}>
                                            <div className="image-container">
                                                <img src={getAssetsUrl(el.image)} alt="" />
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="text-name">
                                                {el.name}
                                            </div>
                                            <div className="text-sku mt-[2px]">
                                                SKU XYZ-12-345
                                            </div>
                                            <div className="product-info mt-[6px]">
                                                <span className="label flex items-center justify-between">
                                                    <span>
                                                        Sold
                                                    </span>
                                                    <span>
                                                        :
                                                    </span>
                                                </span>
                                                <span className="value">
                                                    {el.count} pc
                                                </span>
                                            </div>
                                            <div className="product-info mt-[2px]">
                                                <span className="label flex items-center justify-between">
                                                    <span>
                                                        Viewed
                                                    </span>
                                                    <span>
                                                        :
                                                    </span>
                                                </span>
                                                <span className="value">
                                                    {el.viewed}
                                                </span>
                                            </div>
                                            <div className="product-info mt-[2px]">
                                                <span className="label flex items-center justify-between">
                                                    <span>
                                                        Add to cart
                                                    </span>
                                                    <span>
                                                        :
                                                    </span>
                                                </span>
                                                <span className="value">
                                                    {el.addToCart}
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            ))
                        }
                    </ScrollMenu>
                </div>
            </div>
        </div>
    </>
}
export default RetailerProductOfTheMonthCard