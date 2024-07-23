import { useEffect, useMemo, useState } from 'react'
import './styles.scss'
import { IMPORT_CSV_PRODUCT_FIELD } from '../../../../../utils/constants'
import { Col, Row, Select, notification } from 'antd'
import ArrowIcon from "../../../../../assets/images/products/arrow-down.svg"
import _ from 'lodash'
import WarningIcon from "../../../../../assets/images/products/warning-icon.png"
import IIcon from "../../../../../assets/images/products/i-icon.png"
import TickIcon from "../../../../../assets/images/products/tick-icon.png"
import ModalExitIcon from "../../../../../assets/images/project/modal-exit.svg"

const MapCsv = ({
    csvArrayData = [],
    csvArrayHeaders = [],
    onBack = () => {},
    onContinue = () => {}
}) => {
    const [mappingInfo, setMappingInfo] = useState([])
    const productFields = useMemo(() => {
        return IMPORT_CSV_PRODUCT_FIELD.map(el => {
            return {
                value: el.field,
                label: el.label
            }
        })
    }, [])

    const mapResult = useMemo(() => {
        return IMPORT_CSV_PRODUCT_FIELD.map(el => {
            return {
                field: el.field,
                fieldName: el.label,
                mapFromField: _.get(_.find(mappingInfo, o => o.isConfirm && o.mapField === el.field), ['field']),
                isRequired: el.isRequired
            }
        })
    }, [mappingInfo])

    const isAllRequiredFieldIsMapped = useMemo(() => {
        return !_.some(mapResult, el => el.isRequired && !el.mapFromField)
    }, [mapResult])

    useEffect(() => {
        // Find default map field
        const defaultMap = IMPORT_CSV_PRODUCT_FIELD.map(el => {
            let defaultMap = ''
            if(el.field === 'uniqueId'){
                // Shopify
                defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'handle')
                // Magento
                if(!defaultMap) {
                    defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'sku')
                }
                // Woocommerce
                if(!defaultMap) {
                    defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'id')
                }
            } else if(el.field === 'price'){
                // Woocommerce
                defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'regular price')
                // Shopify
                if(!defaultMap) {
                    defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'variant price')
                }
                // Woocommerce
                if(!defaultMap) {
                    defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'price')
                }
                if(!defaultMap) {
                    defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).includes(el.field))
                }
            } else if(el.field === 'name'){
                defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'name')
                // Shopify
                if(!defaultMap) {
                    defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).trim() === 'title')
                }
                if(!defaultMap) {
                    defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).includes('name') || _.toLower(o).includes('title'))
                }
            } else {
                defaultMap = _.find(csvArrayHeaders, o => _.toLower(o).includes(el.field))
            }
            
            return {
                field: el.field,
                defaultMapFromField: defaultMap
            }
        })
        // Init mapping field
        const info = csvArrayHeaders.map(el => {
            return {
                field: el,
                mapField: _.get(_.find(defaultMap, o => o.defaultMapFromField === el), ['field'], null),
                isConfirm: !!_.get(_.find(defaultMap, o => o.defaultMapFromField === el), ['field'], null)
            }
        })
        for (let i = 0; i < info.length; i++){
            if(_.find(_.cloneDeep(info).slice(0, i), o => o.mapField && o.mapField === info[i].mapField)) {
                info[i].mapField = null
                info[i].isConfirm = false
            }
        }

        setMappingInfo(info)
    }, [])

    const onContinueMapCsv = () => {
        if(!isAllRequiredFieldIsMapped) {
            const notMappedFields = mapResult.filter(el => el.isRequired && !el.mapFromField).map(el => el.fieldName).join(', ')

            notification.warning({
                message: `Sorry, there are one or more required fields unmatched: ${notMappedFields}.`
            })

            return
        }

        onContinue(mapResult)
    }

    const onMapFieldChange = (field, mapField) => {
        setMappingInfo(info => info.map(el => {
            if(el.field === field){
                el.mapField = mapField
            }

            return el
        }))
    }

    const onConfirmMapping = (field, value) => {
        setMappingInfo(info => info.map(el => {
            if(el.field === field){
                el.isConfirm = value
            }

            return el
        }))
    }
    
    return <>
        <div className='map-csv-container mt-[24px]'>
            {
                mappingInfo.map((el, index) => {
                    const someData = csvArrayData.map(o => _.get(o, [el.field], '')).slice(0, 3);
                    const valueRate = _.round(someData.filter(o => !!o).length / someData.length * 100, 1)
                    const fieldName = _.get(_.find(IMPORT_CSV_PRODUCT_FIELD, o => o.field === el.mapField), ['label'], '')
                    const mappedField = _.get(_.find(mappingInfo, o => o.field !== el.field && o.mapField === el.mapField), ['field'], '')

                    return <>
                        <div key={el.field} className='map-csv-item'>
                            <Row gutter={[16, 16]}>
                                <Col span={24} lg={12}>
                                    <table className='csv-field-table-info'>
                                        <thead>
                                            <tr>
                                                <th className='header-index'>
                                                    #{index + 1}
                                                </th>
                                                <th className='header-field-name'>
                                                    {el.field}
                                                </th>
                                                <th className='header-field-select-map-field'>
                                                    <Select
                                                        placeholder="Lookup matching fields"
                                                        value={el.mapField}
                                                        onChange={(value) => {onMapFieldChange(el.field, value)}}
                                                        className="select-map-field w-full"
                                                        popupClassName="retailer-form-select-popup"
                                                        suffixIcon={<img src={ArrowIcon} alt="" />}
                                                        options={productFields}
                                                        allowClear={true}
                                                        disabled={el.isConfirm}
                                                        clearIcon={() => (<img src={ModalExitIcon} alt="" />)}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        {!el.isConfirm && <tbody>
                                            {
                                                someData.map((content, idx) => (
                                                    <tr key={idx}>
                                                        <th className='header-index'>
                                                            {idx + 1}
                                                        </th>
                                                        {content && <td className='header-field-content' colSpan={2}>
                                                            {content}
                                                        </td>}
                                                        {!content && <td className='header-field-no-content' colSpan={2}>
                                                            No data
                                                        </td>}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>}
                                    </table>
                                </Col>
                                <Col span={24} lg={12}>
                                    <div className='csv-field-map-info'>
                                        {
                                            !el.isConfirm && !el.mapField && <>
                                                <div className='csv-field-map-item'>
                                                    <div className='flex items-center justify-center'>
                                                        <img src={WarningIcon} alt="" className='item-icon'/>
                                                    </div>
                                                    <span className='content-bold'>
                                                        Unable to automatically match
                                                    </span>
                                                </div>
                                                <div className='csv-field-map-item mt-[4px]'>
                                                    <div className='flex items-center justify-center'>
                                                        <img src={IIcon} alt="" className='item-icon'/>
                                                    </div>
                                                    <span className='content-description'>
                                                        {valueRate}% of your rows have a value for this column
                                                    </span>
                                                </div>
                                            </>
                                        }
                                        {
                                            !el.isConfirm && el.mapField && <>
                                                <div className='csv-field-map-item'>
                                                    <div className='flex items-center justify-center'>
                                                        <img src={TickIcon} alt="" className='item-icon'/>
                                                    </div>
                                                    <span className='content-bold'>
                                                        Matched to the {fieldName} field.
                                                    </span>
                                                </div>
                                                <div className='csv-field-map-item mt-[4px]'>
                                                    <div className='flex items-center justify-center'>
                                                        <img src={IIcon} alt="" className='item-icon'/>
                                                    </div>
                                                    <span className='content-description'>
                                                        {valueRate}% of your rows have a value for this column
                                                    </span>
                                                </div>
                                                {mappedField && <>
                                                    <div className='csv-field-map-item mt-[4px]'>
                                                        <div className='flex items-center justify-center'>
                                                            <img src={WarningIcon} alt="" className='item-icon'/>
                                                        </div>
                                                        <span className='content-bold'>
                                                            {mappedField} has already been matched to {fieldName}.
                                                        </span>
                                                    </div>
                                                </>}
                                                {!mappedField && <div className='mt-[16px]'>
                                                    <button className="btn-confirm" onClick={() => {onConfirmMapping(el.field, true)}}>
                                                        <span>Confirm mapping</span>
                                                    </button>
                                                </div>}
                                            </>
                                        }
                                        {
                                            el.isConfirm && el.mapField && <>
                                                <div className='flex items-center justify-between gap-[12px]'>
                                                    <div className='csv-field-map-item'>
                                                        <div className='flex items-center justify-center'>
                                                            <img src={TickIcon} alt="" className='item-icon'/>
                                                        </div>
                                                        <span className='content-bold'>
                                                            Confirmed mapping
                                                        </span>
                                                    </div>
                                                    <button className="btn-confirm" onClick={() => {onConfirmMapping(el.field, false)}}>
                                                        <span>Edit</span>
                                                    </button>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </Col>
                            </Row> 
                        </div>
                    </>
                })
            }
            <div className='mt-[20px] flex justify-between items-center'>
                <button className="btn-back" onClick={() => {onBack()}}>
                    <span>Back</span>
                </button>
                <button className="btn-continue" onClick={() => {onContinueMapCsv()}}>
                    <span>Review</span>
                </button>
            </div>
        </div>
    </>
}
export default MapCsv