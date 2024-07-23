import { Select } from "antd"
import ArrowDownIcon from "../../assets/images/profile/arrow-down.svg"
import countriesJson from "../../assets/json/countries.json"
import "./styles.scss"

const SelectCountry = ({
    value,
    onChange = () => {}
}) => {

    return <>
        <Select
            showSearch
            className="select-area mt-[12px]"
            placeholder="Select Country"
            optionFilterProp="children"
            value={value}
            onChange={(e) => {onChange(e)}} 
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            suffixIcon={<img src={ArrowDownIcon} alt="" />}
            options={countriesJson}
        />
    </>
}

export default SelectCountry