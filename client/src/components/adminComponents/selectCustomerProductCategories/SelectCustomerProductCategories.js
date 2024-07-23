import { Checkbox, Select } from "antd"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import { useEffect, useMemo, useState } from "react"
import { productCategoryApi } from "../../../api/productCategory.api"

const SelectCustomerProductCategories = ({
    value,
    onChange = () => {}
}) => {
    const [isShowDropdown, setIsShowDropdown] = useState(false)
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState([])

    useEffect(() => {
        setIsLoading(true)

        productCategoryApi.getAllCustomerCategories().then(rs => {
            setOptions(rs.map(el => {
                return {
                    label: el.name,
                    value: el.id
                }
            }))
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
        })
    }, [])

    const selectedValues = useMemo(() => {
        return value || []
    },[value])

    const onSelectPlan = (value, checked) => {
        if(checked && (!selectedValues.includes(value))){
            onChange([...selectedValues, value])
        }

        if(!checked && selectedValues.includes(value)){
             onChange(selectedValues.filter(el => el !== value))
        }
    }

    const onSelectAllPlanChange = (value) => {
        setIsSelectAll(value)
        if(value){
            onChange(options.map(el => el.value))
        } else {
            onChange([])
        }
    }

    return <>
        <Select
            mode="multiple"
            placeholder="Select Categories"
            className="admin-form-select w-full"
            popupClassName="admin-form-select-popup-plans"
            showSearch
            suffixIcon={<img src={ArrowIcon} alt="" />}
            value={value || []}
            options={options}
            open={isShowDropdown}
            onDropdownVisibleChange={(value) => {setIsShowDropdown(value)}}
            onDeselect={(value) => {onSelectPlan(value, false)}}
            dropdownRender={() => (
                <>
                    <div className="popup-content">
                        <div className="item">
                            <Checkbox checked={isSelectAll} onChange={(e) => {onSelectAllPlanChange(e.target.checked)}}>
                                <span className="text">All Categories</span>
                            </Checkbox>
                        </div>
                        {
                            options && options.map(el => <>
                                <div className="item" key={el.value}>
                                    <Checkbox checked={selectedValues.includes(el.value)} onChange={(e) => {onSelectPlan(el.value, e.target.checked)}}>
                                        <span className="text">{el.label}</span>
                                    </Checkbox>
                                </div>
                            </>)
                        }
                    </div>
                </>
            )}
        />
    </>
}

export default SelectCustomerProductCategories