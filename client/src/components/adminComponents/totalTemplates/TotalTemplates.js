import { useEffect, useState } from "react"
import TotalTemplatesIcon from "../../../assets/images/admin/total-template.svg"
import { PROJECT_TYPE } from "../../../utils/constants"
import { getListProject } from "../../../api/project.api"

const TotalTemplates = () => {
    const [total, setTotal] = useState(0)
    useEffect(() => {
        let filterData = {
            search: "",
            type: PROJECT_TYPE.TEMPLATE,
            limit: 100
        }

        getListProject(filterData).then(data => {
            setTotal(data.totalResults)
        })
    },[])

    return <>
        <div className="statistical-card flex justify-between items-center">
            <img src={TotalTemplatesIcon} alt="" />
            <div className="flex flex-col items-end">
                <div className="text-total">
                    {total}
                </div>
                <div className="text-description">
                    Total Templates
                </div>
            </div>
        </div>
    </>
}
export default TotalTemplates