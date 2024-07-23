import { useEffect, useState } from "react"
import MoreSquareIcon from "../../../assets/images/admin/more-square.svg"
import { PRODUCT_TYPES } from "../../../utils/constants"
import { getListPublicDecorarive } from "../../../api/product.api"

const TotalDecoratives = () => {
    const [total, setTotal] = useState(0)
    useEffect(() => {
        let filter = {
            page: 1, 
            limit: 1, 
            type: PRODUCT_TYPES.DECORATIVES,
            isOnlyNonDisable: false,
        }
        getListPublicDecorarive(filter).then(data => {
            setTotal(data.totalResults)
        }).catch(err => {
        })
    },[])

    return <>
        <div className="statistical-card flex justify-between items-center">
            <img src={MoreSquareIcon} alt="" />
            <div className="flex flex-col items-end">
                <div className="text-total">
                    {total}
                </div>
                <div className="text-description">
                    Total Decoratives
                </div>
            </div>
        </div>
    </>
}
export default TotalDecoratives