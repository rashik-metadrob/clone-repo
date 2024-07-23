import { useEffect, useState } from "react"
import { userApi } from "../../../api/user.api"
import { Table } from "antd"
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import moment from "moment"
import { DEFAULT_AVATAR, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { getAssetsUrl } from "../../../utils/util";
import { formatTimeToNow, useFormatTimeToNow } from "../../../hook/useFormatTimeToNow";
import { useTranslation } from "react-i18next";

const RetailerActiveUsersCard = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [listUsers, setListUsers] = useState([
    ])
    const {t} = useTranslation()

    useEffect(() => {
        loadData()
    },[])

    const loadData = () => {
        setIsLoading(true)
        userApi.getNewUsers().then((rs) => {
            setListUsers(
              rs.results.map(el => {
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
                    <img className="w-[30px] h-[30px] rounded-[50%]" src={record?.socialAvatar ? record.socialAvatar : getAssetsUrl(record.avatar || DEFAULT_AVATAR)} alt="" />
                    <span>
                        "{text}"
                    </span>
                </div>
            </>,
        },
        {
          title: 'Number',
          dataIndex: 'phone',
          key: 'phone',
          align: 'left',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          align: 'left',
        },
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'left',
          render: (text) => {
            const { timeToNow, unit } = formatTimeToNow(text);
            return <span className="whitespace-nowrap">{timeToNow} {unit}</span>
          }
        },
    ];

    return <>
        <div className="statistical-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    Active User
                </div>
                <div className="text-show-all" onClick={() => {}}>
                    {t('global.show_all')}
                </div>
            </div>
            <div className="mt-[29px]">
                <Table
                    loading={{
                        spinning: isLoading|| !listUsers,
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
                    className="retailer-shared-table-in-card"
                />
            </div>
        </div>
    </>
}
export default RetailerActiveUsersCard;