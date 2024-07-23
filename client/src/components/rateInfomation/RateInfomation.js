import { useEffect } from "react";
import "./styles.scss";

const RateInfomation = ({
    rate,
    isSelected = false,
    onSelect = () => {}
}) => {

    return <>
        <div className={`rate-infomation-wrapper ${isSelected ? 'selected' : ''}`} onClick={() => {onSelect(rate.courier_id)}}>
            <div className="rate-logo">
                <img src={`https://assets.easyship.com/app/courier-logos/${rate.logo_url}-mini.svg`} alt="" />
            </div>
            <div className="rate-time mt-[8px]">
                {rate.min_delivery_time} - {rate.max_delivery_time} days
            </div>
        </div>
    </>
}
export default RateInfomation;