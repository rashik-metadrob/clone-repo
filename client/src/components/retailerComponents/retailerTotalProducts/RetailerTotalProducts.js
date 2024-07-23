import { useEffect, useState } from "react"
import TotalApisIcon from "../../../assets/images/admin/total-api.svg"
import { CART_TYPES, PRODUCT_TYPES } from "../../../utils/constants"
import { getProducts } from "../../../api/product.api"
import global from "../../../redux/global"

const RetailerTotalProducts = () => {
    const [total, setTotal] = useState(0)
    useEffect(() => {
        let filter = {
            page: 1, 
            limit: 5, 
            type: PRODUCT_TYPES.PRODUCTS,
            isOnlyNonDisable: false,
        }
        if(global.IS_DROB_A){
            filter.cartType = CART_TYPES.WEB_LINK
        }
        getProducts(filter).then(data => {
            setTotal(data.totalResults)
        }).catch(err => {
        })
    },[])

    return <>
        <div className="statistical-card flex justify-between items-center flex-col md:flex-row">
            <img src={TotalApisIcon} alt="" />
            <div className="flex flex-col items-center md:items-end mt-[16px] md:mt-0">
                <div className="text-total">
                    {total}
                </div>
                <div className="text-description !text-center md:!text-right">
                    Total Products
                </div>
            </div>
        </div>
    </>
}
export default RetailerTotalProducts