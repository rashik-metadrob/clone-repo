import { useEffect, useState } from "react"
import { userApi } from "../../../api/user.api"
import { Table } from "antd"
import loadingAnimation from "../../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import moment from "moment"
import TickIcon from "../../../assets/images/admin/tick.svg"
import ExitIcon from "../../../assets/images/admin/exit.svg"
import { useTranslation } from "react-i18next";

const CollaborateTableCard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [listUsers, setListUsers] = useState([
        {
            id: '1',
            name: 'James',
            phone: '8354672001',
            email: 'vision@gmail.com',
            createdAt: '1 Oct23 12:00 P.M',
            collaborateFor: '3D Decorative'
        },
        {
            id: '2',
            name: 'James',
            phone: '8354672001',
            email: 'vision@gmail.com',
            createdAt: '1 Oct23 12:00 P.M',
            collaborateFor: 'Showroom Template'
        },
        {
            id: '3',
            name: 'James',
            phone: '8354672001',
            email: 'vision@gmail.com',
            createdAt: '1 Oct23 12:00 P.M',
            collaborateFor: 'Showroom Template'
        },
        {
            id: '4',
            name: 'James',
            phone: '8354672001',
            email: 'vision@gmail.com',
            createdAt: '1 Oct23 12:00 P.M',
            collaborateFor: 'Animations'
        },
        {
            id: '5',
            name: 'James',
            phone: '8354672001',
            email: 'vision@gmail.com',
            createdAt: '1 Oct23 12:00 P.M',
            collaborateFor: 'Showroom Template'
        }
    ])
    const {t} = useTranslation()

    useEffect(() => {
        // loadData()
    },[])

    const loadData = () => {
        setIsLoading(true)
        let filterData = {
            limit: 5,
            page: 1,
            statistic: true
        }
        // Get new users
        userApi.getListUsers(filterData).then((rs) => {
            console.log(" rs.results",  rs.results)
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
                <span>
                    "{text}"
                </span>
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
        },
        {
            title: 'Collaborate for',
            dataIndex: 'collaborateFor',
            key: 'collaborateFor',
            align: 'left',
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center',
            render: (text, record, index) => <>
              <div className="flex items-center gap-[12px]">
                  <button className="btn-new-action">
                      <img src={TickIcon} alt="" onClick={() => {}}/>
                  </button>
                  <button className="btn-new-action">
                      <img src={ExitIcon} alt="" onClick={() => {}}/>
                  </button>
              </div>
            </>,
          },
    ];

    return <>
        <div className="statistical-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    New Users
                </div>
                <div className="text-show-all">
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
                    className="admin-shared-table"
                />
            </div>
        </div>
    </>
}
export default CollaborateTableCard;