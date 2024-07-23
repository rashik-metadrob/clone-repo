import { useSelector } from "react-redux"
import { getShopifyAmountInfo, getShopifyCart, getShopifyCartId } from "../../../../redux/shopifySlice"
import _ from "lodash"
import { useNavigate, useParams } from "react-router-dom"
import shopifyApi from "../../../../api/shopify.api"
import { Spin, notification } from "antd"
import { encodeUrl } from "../../../../utils/util"
import { useState } from "react"
import ShopifyCartItem from "../shopifyCartItem/ShopifyCartItem"
import loadingAnimation from "../../../../assets/json/Add Products.json"
import Lottie from "lottie-react"
import { getUser } from "../../../../redux/appSlice"

const MyShopifyOrders = ({
}) => {
    const navigate = useNavigate()
    const savedShopifyCartId = useSelector(getShopifyCartId)
    const shopifyCatyAmountInfo = useSelector(getShopifyAmountInfo)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingContent, setIsLoadingContent] = useState(false)
    const shopifyCartItems = useSelector(getShopifyCart)
    const {id: projectId} = useParams()
    const user = useSelector(getUser)

    const onShopifyCheckout = () => {
        if(!savedShopifyCartId || +_.get(shopifyCatyAmountInfo, "amount", 0) === 0){
            notification.warning({
                "message": "Can't checkput with shopify cart!"
            })
            return
        }
        if(user?.id){
            setIsLoading(true)
            shopifyApi.getCheckoutUrlByStoreFrontAPI(savedShopifyCartId, projectId).then(data => {
                const checkOutUrl = _.get(data, ["cart", "checkoutUrl"], "")
                if(checkOutUrl){
                    console.log("redirect to checkout")
                    const a = document.createElement("a")
                    a.href = checkOutUrl
                    a.target = "_blank"
                    a.click()
                } else {
                    notification.error({
                        message: _.get(`Can't checkout Shopify Cart!`)
                    })
                }
                setIsLoading(false)
            }).catch(err => {
                setIsLoading(false)
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't checkout Shopify Cart!`)
                })
            })
        } else {
            navigate(`/register?returnUrl=${encodeUrl(window.location.href)}`)
        }
    }
    return <>
        <Spin spinning={isLoadingContent} className="loading-indicator-wrapper-center" wrapperClassName="flex-auto" indicator={<Lottie animationData={loadingAnimation} />}>
            <div className="content">
                {
                    shopifyCartItems && shopifyCartItems.map(el => (
                        <ShopifyCartItem item={el} key={el.id} setLoading={setIsLoadingContent}/>
                    ))
                }
            </div>
        </Spin>
        <div className="drawer-bag-footer gap-[12px] md:gap-[35px]">
            <Spin spinning={isLoading} className="loading-indicator-wrapper-center" indicator={<Lottie animationData={loadingAnimation} />}>
                <button className="button-checkout text-[14px] sm:text-[16px] md:text-[20px] md:text-[20px] px-[21px] py-[8px] md:px-[42px] md:py-[13px]" disabled={!savedShopifyCartId || +_.get(shopifyCatyAmountInfo, "amount", 0) === 0} onClick={() => {onShopifyCheckout()}}>
                    Check Out
                </button>
            </Spin>
        </div>
    </>
}
export default MyShopifyOrders