import { Modal, Table, notification } from "antd"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import { useEffect, useState } from "react"
import userSubcriptionApi from "../../api/userSubcription.api"
import _ from "lodash"
import CalendarIcon from "../../assets/icons/CalendarIcon"
import moment from "moment"
import { SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../utils/constants"
import loadingAnimation from "../../assets/json/Add Products.json"
import Lottie from "lottie-react";

const ModalPlanSubcriptionHistory = ({
    open,
    onClose = () => {},
    item = {}
}) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const columns = [
        {
            title: '#',
            dataIndex: 'order',
            key: 'order',
            align: 'left',
            render: (text, record, index) => <span>{index + 1}</span>
        },
        {
            title: 'Plane name',
            dataIndex: 'planeName',
            key: 'planeName',
            align: 'left',
            render: (text, record) => <span>{_.get(record, ['plan', 'name'], '')} {_.get(record, ['value', 'isTrial'], false) ? '(Trial)' : _.get(record, ['plan', 'isFree'], false) ? '' : '(Paid)'}</span>
        },
        {
            title: 'Start Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            align: 'left',
            render: (text) => <span style={{ display: 'flex', alignItems: 'center'}}>
                <span style={{ marginRight: 5 }}><CalendarIcon /></span> { moment(text, SERVER_DATE_FORMAT).format("MMMM DD YYYY") }
            </span>,
        },
        {
            title: 'Assigned By (System or by Superadmin)',
            dataIndex: 'assignedBy',
            key: 'assignedBy',
            align: 'left',
            width: 120
        },
        {
            title: 'Change',
            dataIndex: 'change',
            key: 'change',
            align: 'left',
            render: (text, record, index) => <span>{getChangeOfPricingPlan(record, index)}</span>
        },
    ]

    useEffect(() => {
        if(open && item.id) {
            setData([])
            setIsLoading(true)
            userSubcriptionApi.getPlanSubcriptionHistory(item.id).then(rs => {
                setData(_.isArray(rs) ? rs : [])
                setIsLoading(false)
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't get history data!`)
                })
                setIsLoading(false)
            })
        }
    }, [item, open])

    const getChangeOfPricingPlan = (record, index) => {
        if(_.get(record, ['plan', 'isFree'])) {
            if(index === data.length) {
                return "Initial Account Creation"
            } else {
                return `Downgraded to ${_.get(record, ['plan', 'name'], '')}`
            }
        } else if(_.get(record, ['value', 'isTrial'])) {
            return "Trial period for new features"
        } else {
            if(data[index - 1]){
                if(
                    _.get(data[index - 1], ['plan', 'isFree']) 
                    || _.get(data[index - 1], ['value', 'isTrial'])
                    || getPlanPrice(data[index - 1]) <= getPlanPrice(record)
                ) {
                    return "User upgraded to paid subscription"
                } else {
                    return "User downgraded to paid subscription"
                }
            }
        }

        return ""
    }

    const getPlanPrice = (record) => {
        return _.get(record, ['pricing', 'monthly'], 0)
    }

    return <>
        <Modal
            open={open}
            width={794}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            centered
            className="modal-admin-edit"
            onCancel={() => {onClose()}}
        >
            <div>
                <div className="font-inter leading-[24px] text-[20px] font-[700] text-[#FFF]">
                    View plan subcription history
                </div>
                <div>
                <Table
                    loading={{
                        spinning: isLoading,
                        indicator: <Lottie animationData={loadingAnimation} />
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div className="empty-container">
                                No data can be found.
                            </div>
                        ),
                    }}
                    className="admin-shared-table max-h-[500px] overflow-y-auto"
                    rowClassName="admin-template-table"
                />
                </div>
            </div>
        </Modal>
    </>
}
export default ModalPlanSubcriptionHistory