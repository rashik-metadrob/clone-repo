import { Select } from "antd";
import { useTranslation } from "react-i18next";

const RetailerHeatMapCard = () => {
    const {t} = useTranslation()
    return <>
        <div className="statistical-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    {t('global.heatmap')}
                </div>
                <Select
                    className="statistic-by-select"
                    defaultValue={'7day'}
                    options={[{label: "Last 7 days", value: "7day"}]}
                />
            </div>
        </div>
    </>
}
export default RetailerHeatMapCard;