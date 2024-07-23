import { useTranslation } from "react-i18next"
import AdminUploadChart from "../adminUploadChart/AdminUploadChart"

const UploadAnalysisCard = () => {
    const {t} = useTranslation()
    return <>
        <div className="statistical-card flex flex-col">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    Uploads
                </div>
                <div className="text-show-all">
                    {t('global.show_all')}
                </div>
            </div>
            <div className="mt-[29px] flex-auto flex items-center gap-[31px]">
                <AdminUploadChart />
            </div>
        </div>
    </>
}
export default UploadAnalysisCard