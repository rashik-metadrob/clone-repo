import './styles.scss'
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import { Input, Modal, Select, Spin, Steps, notification } from 'antd';
import { CART_TYPES, CSV_FILE_SOURCE, CSV_SHOPIFY_FIELDS, CSV_WOOCOMMERCE_FIELDS, DATA_SOURCE, IMPORT_CSV_STEPS, MODEL_BLOCK, PRODUCT_TYPES } from '../../../utils/constants';
import ArrowIcon from "../../../assets/images/products/arrow-down.svg"
import { useEffect, useRef, useState } from 'react';
import UploadModel from '../../uploadModel/UploadModel';
import CSVIcon from '../../../assets/images/products/csv-icon.png'
import { readString } from 'react-papaparse'
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../redux/appSlice';
import MapCsv from './components/mapCsv/MapCsv';
import MapCsvRepair from './components/mapCsvRepair/MapCsvRepair';

const ModalRetailerImportProductFromCsv = ({
    open, 
    onClose = () => {},
    onSuccess = () => {},
}) => {
    const [currentStep, setCurrentStep] = useState(IMPORT_CSV_STEPS.UPLOAD)
    const [csvArrayData, setCsvArrayData] = useState([])
    const [csvArrayHeaders, setCsvArrayHeaders] = useState([])
    const [mappedRawData, setMappedRawData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [previewData, setPreviewData] = useState([])
    const user = useSelector(getUser)
    const uploadRef = useRef()

    useEffect(() => {
        setCurrentStep(IMPORT_CSV_STEPS.UPLOAD)
    }, [open])
    
    const onReadFile = () => {
        const file = uploadRef.current.getFile()
        if(!file) {
            notification.warning({
                message: "File can't be found!"
            })

            return
        }


        const reader = new FileReader();

        reader.onload = async function (e) {
            const {object, headers} = await CSVtoObject(e.target.result);
            setCsvArrayData(object)
            setCsvArrayHeaders(headers)
            setCurrentStep(IMPORT_CSV_STEPS.MATCH)
        };

        reader.readAsText(file);
    }

    const CSVtoObject = (data) => {
        return new Promise((resolve, reject) => {
            readString(data, {
                download: false,
                complete: (rs) => {
                    const rows = _.get(rs, ['data'], [])
                    
                    if(rows.length > 0) {
                        const headers = rows[0];
                        const object = rows.filter((el, index) => index > 0 && el.length === headers.length).map((row) => {
                            const values = row;
                            return headers.reduce((obj, key, index) => {
                                obj[key] = values[index];
                                return obj;
                            }, {});
                        });

                        resolve({
                            object, headers
                        })
                    }
                }
            })
        })
    };

    const createMapData = (mapResult) => {
        const data = csvArrayData.map(el => {
            const prod = {}
            
            mapResult.forEach(o => {
                let defaultValue = ""
                if(o.field === 'discount' || o.field === 'price') {
                    defaultValue = 0
                }
                prod[o.field] = {
                    isEdit: false,
                    isInitialValue: true,
                    value: !!!o.mapFromField ? defaultValue : (!!el[o.mapFromField] ? el[o.mapFromField] : defaultValue)
                }

                if(o.field === 'image') {
                    prod['gallery'] = {
                        isEdit: false,
                        isInitialValue: true,
                        value: !!!o.mapFromField ? defaultValue : (!!el[o.mapFromField] ? el[o.mapFromField] : defaultValue)
                    }
                }
            })

            return prod
        })

        setMappedRawData(data)
    }

    return <>
        <Modal
            open={open}
            width={1200}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            className="modal-import-product-from-csv"
            onCancel={() => {
                onClose();
            }}
        >
            <div className='modal-import-product-from-csv-container'>
                <div className='content-header flex flex-wrap items-center gap-[16px] justify-between'>
                    <div className='title'>
                        Import your product from CSV file
                    </div>
                    <div>
                        <Steps 
                            className='import-csv-steps'
                            current={currentStep} 
                            items={[
                                {
                                    key: 'upload',
                                    title: 'Upload'
                                },
                                {
                                    key: 'match',
                                    title: 'Match'
                                },
                                {
                                    key: 'repair',
                                    title: 'Repair'
                                }
                            ]} 
                        />
                    </div>
                </div>
                {
                    currentStep === IMPORT_CSV_STEPS.UPLOAD && <>
                        <div className='mt-[16px]'>
                            <UploadModel 
                                ref={uploadRef}
                                title={"Add your product file"}
                                extraText={"Upload your product file (.csv)"}
                                accept={".csv"}
                                icon={CSVIcon}
                            />
                        </div>
                        <div className='flex justify-center mt-[16px]'>
                            <Spin spinning={isLoading}>
                                <button className="btn-continue" onClick={onReadFile}>
                                    <span>Read</span>
                                </button>
                            </Spin>
                        </div>
                    </>
                }
                {
                    currentStep === IMPORT_CSV_STEPS.MATCH && <>
                        <MapCsv 
                            csvArrayData={csvArrayData}
                            csvArrayHeaders={csvArrayHeaders}
                            onBack={() => {
                                setCurrentStep(IMPORT_CSV_STEPS.UPLOAD)
                            }}
                            onContinue={(mapResult) => {
                                createMapData(mapResult)
                                setCurrentStep(IMPORT_CSV_STEPS.REPAIR)
                            }}
                        />
                    </>
                }
                {
                    currentStep === IMPORT_CSV_STEPS.REPAIR && <>
                        <MapCsvRepair 
                            mappedRawData={mappedRawData}
                            onBack={() => {
                                setCurrentStep(IMPORT_CSV_STEPS.MATCH)
                            }}
                            onSuccess={onSuccess}
                        />
                    </>
                }
            </div>
        </Modal>
    </>
}
export default ModalRetailerImportProductFromCsv