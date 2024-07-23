import { useEffect, useState } from "react"
import "./styles.scss"
import _ from "lodash"
import { Input, InputNumber, Modal, Spin, Table, notification } from "antd"
import TextArea from "antd/es/input/TextArea"
import TextEditor from "../../../../textEditor/TextEditor"
import { htmlDecode, uuidv4 } from "../../../../../utils/util"
import productApi from "../../../../../api/product.api"
import { useSelector } from "react-redux"
import { getUser } from "../../../../../redux/appSlice"
import { DATA_SOURCE, MODEL_BLOCK, PRODUCT_TYPES } from "../../../../../utils/constants"

const MapCsvRepair = ({
    mappedRawData = [],
    onBack = () => {},
    onSuccess = () => {}
}) => {
    const [rawData, setRawData] = useState([])
    const user = useSelector(getUser)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setRawData(_.cloneDeep(mappedRawData))
    }, [])

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            align: "left",
            width: 400,
            isRequired: true,
            render: (text) => <div>
                <span style={{wordBreak: 'break-all'}}>{text}</span>
            </div>,
            validate: (text) => {
                if(_.isNil(text) || _.isEmpty(text)) {
                    return false
                }
                const numOfUrls = text.split(",")
                if(numOfUrls.length > 1) {
                    return false
                }
                const reg = new RegExp('(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}', 'g');
                return reg.test(text.toString())
            }
        },
        {
            title: "UniqueId",
            dataIndex: "uniqueId",
            key: "uniqueId",
            align: "left",
            width: 200,
            isRequired: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            align: "left",
            width: 200,
            isRequired: true,
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            align: "center",
            width: 200,
            isRequired: true,
            validate: (text) => {
                if(_.isNil(text)) {
                    return false
                }
                return !_.isNaN(+text)
            }
        },
        {
            title: "Discount (%)",
            dataIndex: "discount",
            key: "discount",
            align: "center",
            width: 200,
            validate: (text) => {
                if(_.isNil(text)) {
                    return true
                }
                return !_.isNaN(+text) && (+text >= 0 && +text < 100)
            }
        },
        {
            title: "Gallery",
            dataIndex: "gallery",
            key: "gallery",
            align: "left",
            width: 400,
            validate: (text) => {
                if(_.isNil(text) || _.isEmpty(text)) {
                    return true
                }
                const numOfUrls = text.split(",")
                let validateValue = true
                _.forEach(numOfUrls, el => {
                    const reg = new RegExp('(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}', 'g');
                    if(!reg.test(el.toString())){
                        validateValue = false
                    }
                })
                return validateValue
            }
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            align: "left",
            width: 200,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            align: "left",
            width: 400
        },
    ];

    const onStartEditMode = (index, key) => {
        setRawData(raw => raw.map((el, idx) => {
            if(idx === index) {
                el[key].isEdit = true
            }
            return el
        }))
    }
    const onEndValueChange = (index, key, value) => {
        setRawData(raw => raw.map((el, idx) => {
            if(idx === index) {
                el[key].value = value
                el[key].isEdit = false
            }
            return el
        }))
    }

    const checkValueIsNotNull = (key, value) => {
        if(key === 'price' || key === 'discount') {
            if(_.isNil(value)) {
                return false
            }
            return value.toString().length > 0
        } else {
            return !!value
        }
    }

    const onSubmitCsv = () => {
        const invalidRows = _.filter(rawData, (el) => {
            const isInValidFieldRow = _.some(columns, o => (o.isRequired && (!checkValueIsNotNull(o.key, el[o.key].value))) || (_.has(o, ['validate']) && !o.validate(el[o.key].value)))

            return isInValidFieldRow
        })

        const validRows = _.filter(rawData, (el) => {
            const isValidFieldRow = !_.some(columns, o => (o.isRequired && (!checkValueIsNotNull(o.key, el[o.key].value))) || (_.has(o, ['validate']) && !o.validate(el[o.key].value)))

            return isValidFieldRow
        })

        if(validRows.length === 0) {
            notification.warning({
                message: "No valid data!"
            })
            return
        }

        const validData = validRows.map(el => {
            const prod = {}
            columns.forEach(o => {
                prod[o.key] =  el[o.key].value
            })

            if(prod.tags) {
                prod.tags = prod.tags.toString().split(',').map(el => el.trim()).filter(el => !!el)
            }

            if(prod.gallery) {
                prod.gallery = prod.gallery.toString().split(',').map(el => el.trim()).filter(el => !!el).map(o => {
                    return {
                        image: o,
                        id: uuidv4(),
                        source: DATA_SOURCE.IMPORT,
                    }
                })
            }

            prod.createdBy = user.id
            prod.objectUrl = prod.image
            prod.type = PRODUCT_TYPES.PRODUCTS
            prod.block = MODEL_BLOCK["2D"]

            return prod
        })

        if(invalidRows.length > 0) {
            Modal.confirm({
                title: `You have ${invalidRows.length} rows with unresolved format issues.`,
                content: <>
                    <div>
                        <p>Continue to submit your data anyways (errors may occur).</p>
                        <p>Back to review and fix the format issues..</p>
                    </div>
                </>,
                centered: true,
                className: "dialog-confirm",
                okText: "Continue",
                cancelText: "Back",
                onOk: () => {
                    onSubmitProducts(validData)
                }
            })
        } else {
            onSubmitProducts(validData)
        }
    }

    const onSubmitProducts = (validData) => {
        setIsSaving(true)
        productApi.importProductFromCsvFile(validData).then(rs => {
            notification.success({
                message: "Import successfully!"
            })
            onSuccess()
            setIsSaving(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Import fail!`)
            })
            setIsSaving(false)
        })
    }

    const renderTd = (record, index) => {
        console.log('index',index)
        return <tr key={index}>
            {
                columns.map(o => (
                    <td 
                        key={o.key} 
                        style={{textAlign: o.align || 'left'}} 
                        className={
                            parseClassObjectToString({
                                'field-is-required': !record[o.key].isEdit && o.isRequired && (!checkValueIsNotNull(o.key, record[o.key].value)),
                                'field-is-not-valid': !record[o.key].isEdit && (_.has(o, ['validate']) ? !o.validate(record[o.key].value) : false)
                            })
                        }
                        onDoubleClick={() => {
                            onStartEditMode(index, o.key)
                        }}
                    >
                        {
                            !record[o.key].isEdit && <>
                                <span
                                    style={{
                                        wordBreak: (o.key === 'image' || o.key === 'gallery') ? "break-all" : "inherit"
                                    }}
                                >
                                    {record[o.key].value}
                                </span>
                            </>
                        }
                        {
                            record[o.key].isEdit && <>
                                {
                                   ( o.key === 'price' || o.key === 'discount') && <>
                                        <InputNumber
                                            className="map-csv-repair-input-number"
                                            defaultValue={record[o.key].value}
                                            onPressEnter={(e) => {
                                                onEndValueChange(index, o.key, e.target.value)
                                            }}
                                            onKeyDown={(e) => {
                                                if(e.code === "Escape"){
                                                    e.stopPropagation()
                                                }
                                            }}
                                        />
                                    </>
                                }
                                {
                                   ( o.key === 'image' || o.key === 'gallery' ) && <>
                                        <TextArea
                                            className="map-csv-repair-input-text"
                                            defaultValue={record[o.key].value}
                                            rows={3}
                                            onPressEnter={(e) => {
                                                onEndValueChange(index, o.key, e.target.value)
                                            }}
                                            onKeyDown={(e) => {
                                                if(e.code === "Escape"){
                                                    e.stopPropagation()
                                                }
                                            }}
                                        />
                                    </>
                                }
                                {
                                   ( o.key === 'name' || o.key === 'tags' || o.key === 'uniqueId') && <>
                                        <Input
                                            className="map-csv-repair-input-text"
                                            defaultValue={record[o.key].value}
                                            rows={3}
                                            onPressEnter={(e) => {
                                                onEndValueChange(index, o.key, e.target.value)
                                            }}
                                            onKeyDown={(e) => {
                                                if(e.code === "Escape"){
                                                    e.stopPropagation()
                                                }
                                            }}
                                        />
                                    </>
                                }
                                {
                                    ( o.key === 'description') && <>
                                        <div className="w-[400px]">
                                            <TextEditor 
                                                value={htmlDecode(record[o.key].value)}
                                                onBlur={(e) => { onEndValueChange(index, o.key, e)}}
                                            />
                                        </div>
                                    </>
                                }
                            </>
                        }
                    </td>
                ))
            }
        </tr>
    }

    const parseClassObjectToString = (object) => {
        console.log('object', object)
        return Object.entries(object).map(([key, value]) => {
            if(value) {
                return key
            }
            return null
        }).filter(el => !!el).join(' ')
    }

    return <>
        <div className="map-csv-repair-wrapper mt-[20px]">
            <table className="map-csv-repair-table">
                <colgroup>
                    {
                        columns.map(el => (
                            <col key={el.key} style={el.width ? {width: el.width} : {}}></col>
                        ))
                    }
                </colgroup>
                <thead>
                    <tr>
                        {
                            columns.map(el => (
                                <th key={el.key} style={{textAlign: el.align || 'left'}}>{el.title}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        rawData.map((el, index) => renderTd(el, index))
                    }
                </tbody>
            </table>
        </div>
        <div className='mt-[20px] flex justify-between items-center'>
            <button className="btn-back" onClick={() => {onBack()}}>
                <span>Back</span>
            </button>
            <Spin spinning={isSaving}>
                <button className="btn-continue" onClick={() => {onSubmitCsv()}}>
                    <span>Continue</span>
                </button>
            </Spin>
        </div>
    </>
}
export default MapCsvRepair