import TotalApisIcon from "../../../assets/images/admin/total-api.svg"

const TotalApis = () => {

    return <>
        <div className="statistical-card flex justify-between items-center">
            <img src={TotalApisIcon} alt="" />
            <div className="flex flex-col items-end">
                <div className="text-total">
                    0
                </div>
                <div className="text-description">
                    Total API’s
                </div>
            </div>
        </div>
    </>
}
export default TotalApis