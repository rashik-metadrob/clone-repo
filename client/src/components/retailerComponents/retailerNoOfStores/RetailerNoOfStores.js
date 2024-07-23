import { useEffect, useState } from "react"
import MoreSquareIcon from "../../../assets/images/admin/more-square.svg"
import { PROJECT_MODE, PROJECT_TYPE } from "../../../utils/constants"
import { getListProject } from "../../../api/project.api"
import { useSelector } from "react-redux"
import { getUser } from "../../../redux/appSlice"
import { useTranslation } from "react-i18next"

const RetailerNoOfStores = () => {
    const user = useSelector(getUser)
    const [total, setTotal] = useState(0)
    const { t } = useTranslation()
    useEffect(() => {
        let filter = {
            page: 1, 
            limit: 5, 
            type: PROJECT_TYPE.PROJECT,
            mode: PROJECT_MODE.PUBLISH,
            createdBy: user?.id
        }
        getListProject(filter).then(data => {
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
                    {t('global.no_of_stores')}
                </div>
            </div>
        </div>
    </>
}
export default RetailerNoOfStores