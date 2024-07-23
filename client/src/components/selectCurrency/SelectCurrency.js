import { Col, Row, Select } from "antd"
import CurrencyArrowIcon from "../../assets/images/products/currency-arrow-down.svg"
import "./styles.scss"
import { CURRENCY_LIST } from "../../utils/constants"
import _ from "lodash"

const SelectCurrency = ({
    value,
    onChange = () => {}
}) => {

    return <>
        <Row gutter={[16, 16]} className="min-w-[147px]">
            <Col span={24}>
                <Select
                    placeholder="Select currency"
                    value={value ? `${_.get(CURRENCY_LIST.find(el => el.code === value), ['symbol'], '')} ${value}`: value}
                    onChange={(value) => {onChange(value)}}
                    className="retailer-form-select w-full"
                    popupClassName="retailer-form-select-popup"
                    suffixIcon={<img src={CurrencyArrowIcon} alt="" />}
                    fieldNames={{label: 'name', value: 'code'}}
                    options={CURRENCY_LIST}
                />
            </Col>
        </Row>
    </>
}

export default SelectCurrency