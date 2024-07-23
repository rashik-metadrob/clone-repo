import ThreeDotIcon from "../../../../assets/images/project/preview/three-dot.svg"
import MinusIcon from "../../../../assets/images/project/preview/minus.svg"
import PlusIcon from "../../../../assets/images/project/preview/plus.svg"
import { getAssetsUrl, htmlDecode } from "../../../../utils/util"
import { Dropdown, notification } from "antd"
import { useEffect, useState } from "react"
import _ from "lodash"
import { getProductByShopifyVariantMerchandiseId } from "../../../../api/product.api"
import { useDispatch, useSelector } from "react-redux"
import { getShopifyCart, getShopifyCartId, setShopifyAmountInfo, setShopifyCart, setShopifyCartId } from "../../../../redux/shopifySlice"
import shopifyApi from "../../../../api/shopify.api"
import { useParams } from "react-router-dom"
import { userApi } from "../../../../api/user.api"

const ShopifyCartItem = ({
    item,
    setLoading = () => {}
}) => {
    const [product, setProduct] = useState()
    const shopifyCartItems = useSelector(getShopifyCart)
    const savedShopifyCartId = useSelector(getShopifyCartId)
    const {id: projectId, editorRole} = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        const merchandiseId = _.get(item, ["merchandise", "id"], "")
        if(merchandiseId){
            getProductByShopifyVariantMerchandiseId(merchandiseId).then(data => {
                console.log('data', data)
                setProduct(data)
            })
        }
    }, [item])

    const items = [
        {
          key: 'save',
          label: (
            <div className='menu-cart-items'>
                Save for later
            </div>
          ),
        },
        {
          key: 'delete',
          label: (
            <div className='menu-cart-items'>
                Delete from list
            </div>
          ),
        }
    ];

    const onMenuClick = (info, id) => {
        if(info.key === "delete"){
            removeItems()
        }
    }

    const removeItems = () => {
        setLoading(true)
        const data = {
            lineIds: [item.id]
        }
        shopifyApi.removeShopifyCartItemsByStoreFrontAPI(savedShopifyCartId, data, projectId).then(data => {
            setShopifyCartInfo(_.get(data, ["cartLinesRemove", "cart"], null))
            setLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't remove Shopify cart!`)
            })
            setLoading(false)
        })
    }

    const changeItemQuantity = (id, quantity) => {
        if(quantity <= 0){
            removeItems()
        } else {
            setLoading(true)
            const data = {
                product: {
                    lineId: item.id,
                    quantity: quantity
                }
            }
            shopifyApi.updateShopifyCartItemsByStoreFrontAPI(savedShopifyCartId, data, projectId).then(data => {
                setShopifyCartInfo(_.get(data, ["cartLinesUpdate", "cart"], null))
                setLoading(false)
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't update quantity!`)
                })
                setLoading(false)
            })
        }
    }

    const setShopifyCartInfo = (shopifyCart) => {
        if(!shopifyCart){
            dispatch(setShopifyCart([]))
            dispatch(setShopifyAmountInfo(null))
            return
        }
        const shopifyCartId = _.get(shopifyCart, "id", "")
        const shopifyCartItems = _.get(shopifyCart, ["lines", "edges"], []).map(el => el.node)
        const shopifyCartTotalCost = _.get(shopifyCart, ["cost", "totalAmount"], null)

        dispatch(setShopifyCart(shopifyCartItems))
        dispatch(setShopifyAmountInfo(shopifyCartTotalCost))

        if(!savedShopifyCartId){
            userApi.updateLoggedInUser({shopifyCartId: shopifyCartId})
            dispatch(setShopifyCartId(shopifyCartId))
        }
    }

    return <>
    <div className="cart-item">
        <img src={product?.image ? getAssetsUrl(product?.image) : ""} alt="" className="item-image w-[75px] h-[70px]  md:w-[150px] md:h-[137px]"/>
        <div className="items-content">
            <div className="flex justify-between items-center">
                <div className="name">
                    {product?.name}
                </div>
                <Dropdown
                    menu={{
                        items: items,
                        onClick: (info) => {
                            onMenuClick(info, product?.id)
                        }
                    }}
                    placement="bottomLeft"
                    arrow={false}
                    trigger="click"
                    overlayClassName='menu-cart-overlay'
                >
                    <img src={ThreeDotIcon} alt="" className="cursor-pointer"/>
                </Dropdown>
                
            </div>
            <div className="description mt-[9px]" dangerouslySetInnerHTML={{__html: htmlDecode(item.description)}}>
            </div>
            <div className="flex justify-between items-center gap-[10px] mt-[21px]">
                <div className="flex items-center gap-[21px]">
                    <button className="btn-quantity" onClick={() => {changeItemQuantity(product?.id, item.quantity - 1)}}>
                        <img src={MinusIcon} alt="" />
                    </button>
                    <span className="quantity">
                        {item?.quantity}
                    </span>
                    <button className="btn-quantity" onClick={() => {changeItemQuantity(product?.id, item.quantity + 1)}}>
                        <img src={PlusIcon} alt="" />
                    </button>
                </div>
                <div className="price">
                    {`$${((+item?.quantity || 0) * ( +(product?.price || 0))).toFixed(2)}`}
                </div>
            </div>
        </div>
    </div>
    </>
}
export default ShopifyCartItem