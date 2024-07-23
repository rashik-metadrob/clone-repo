import { Collapse, Select } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import ArrowIcon from "../../../../assets/images/products/select-a-product-arrow-down.svg"
import "./styles.scss"
import { useMemo } from "react"
import _ from "lodash"
import { setAttributeOfPlaceholder } from "../../../../redux/modelSlice"

const SelectPlaceholderProductCollapse = ({
    objectDetail,
    allProducts,
    dispatch
}) => {
    const options = useMemo(() => {
        const includedCategoriesIds = _.get(objectDetail, ['includedCategoriesIds'], [])
        return allProducts.filter(el => includedCategoriesIds.includes(el.categoryId)).map(el => {
            return {
                label: el.name,
                value: el.id
            }
        })
    }, [allProducts, objectDetail])

    const selectedProductToShowId = useMemo(() => {
        const selectedProductToShow = _.get(objectDetail, ['selectedProductToShow', 'id'], '')

        if(selectedProductToShow){
            if(_.find(options, {value: selectedProductToShow})){
                return selectedProductToShow
            } else {
                return null
            }
        } else {
            return null
        }
    }, [objectDetail, options])

    const onProductChange = (id) => {
        const prod = _.find(allProducts, {id})
        if(prod) {
            dispatch(setAttributeOfPlaceholder({
                attribute: 'selectedProductToShow',
                value: prod,
                id: objectDetail.id
            }))
        }
    }

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="select-product-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Select a product</div>,
                    children: <>
                        <div className="select-product-collapse-content">
                            <Select
                                placeholder="Select a product"
                                value={selectedProductToShowId}
                                onChange={(value) => {onProductChange(value)}}
                                className="select-placeholder-product w-full"
                                popupClassName="retailer-form-select-popup"
                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                options={options}
                            />
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default SelectPlaceholderProductCollapse