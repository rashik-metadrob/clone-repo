
import { useEffect, useState } from "react"
import TotalTemplatesIcon from "../../../assets/images/admin/total-template.svg"

const RetailerTotalNumberOfUsers = () => {
    const [total, setTotal] = useState(0)
    useEffect(() => {
    },[])

    return <>
        <div className="statistical-card flex justify-between items-center flex-col md:flex-row">
            <img src={TotalTemplatesIcon} alt="" />
            <div className="flex flex-col items-center md:items-end mt-[16px] md:mt-0">
                <div className="text-total">
                    {total}
                </div>
                <div className="text-description !text-center md:!text-right">
                    Total Number of Users
                </div>
            </div>
        </div>
    </>
}
export default RetailerTotalNumberOfUsers