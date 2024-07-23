import { useEffect, useState } from "react"
import { userApi } from "../../../api/user.api"
import { Table } from "antd"
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import moment from "moment"
import userSubcriptionApi from "../../../api/userSubcription.api";
import { DEFAULT_AVATAR, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import { getAssetsUrl } from "../../../utils/util";
import { useTranslation } from "react-i18next";

const LastPlanPurchased = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [listUsers, setListUsers] = useState([
    ])
    const {t} = useTranslation()

    useEffect(() => {
        loadData()
    },[])

    const loadData = () => {
        setIsLoading(true)
        // Get new users
        userSubcriptionApi.getLastPlanPurchased().then((rs) => {
            setListUsers(
              rs.map(el => {
                  el.key = el.id;
                  return el
                }
              )
            )
            setIsLoading(false)
        })
    }

    const columns = [
        {
          title: 'Profile',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          width: 120,
        //   ellipsis: true,
          render: (text, record, index) => <>
                <div className="flex items-center gap-[8px]">
                    <img className="w-[30px] h-[30px] rounded-[50%]" src={getAssetsUrl(record.avatar || DEFAULT_AVATAR)} alt="" />
                    <span>
                        "{record?.user?.name}"
                    </span>
                </div>
            </>,
        },
        {
          title: 'Plan',
          dataIndex: 'planName',
          key: 'planName',
          align: 'left',
          render: (text, record) => <>
            <div className="flex items-center gap-[6px]">
                <div className="w-[19px] h-[19px] bg-[#D9D9D9]">
                </div>
                <span>{text}</span>
            </div>
          </>
        },
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'left',
          render: (text) => <span>{ moment(text, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT)}</span>
        },
    ];

    return <>
        <div className="statistical-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    Last Plan Purchased
                </div>
                <div className="text-show-all">
                    {t('global.show_all')}
                </div>
            </div>
            <div className="mt-[29px]">
                <Table
                    loading={{
                        spinning: isLoading,
                        indicator: <Lottie animationData={loadingAnimation} />
                    }}
                    columns={columns}
                    dataSource={listUsers}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div className="empty-container">
                                No data can be found.
                            </div>
                        ),
                    }}
                    className="admin-shared-table"
                />
            </div>
        </div>
    </>
}
export default LastPlanPurchased;