import { Dropdown, Modal, Table, notification } from "antd";
import ArrowDownIcon from "../../assets/images/products/plan-arrow-down.svg"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import loadingAnimation from "../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStorageUserDetail } from "../../utils/storage";
import { userApi } from "../../api/user.api";
import useFetch from "../../hook/useFetch";
import "./styles.scss"
import _ from "lodash";
import { ADMIN_ASSIGN_EXPIRED_DAYS, PAYMENT_STATUS, PERSONAL_QUESTIONS, PRICING_PLAN_FEATURES_KEY, SERVER_DATE_FORMAT, TEMPLATE_TABLE_DATE_FORMAT, USER_MENU_ACTION, USER_SUBCRIPTION_KEY } from "../../utils/constants";
import moment from "moment";
import userSubcriptionApi from "../../api/userSubcription.api";
import EyeIcon from "../../assets/icons/EyeIcon";
import ModalUserInfo from "../adminComponents/modalUserInfo/ModalUserInfo";
import ThreeDotIcon from "../../assets/images/order/three-dot.svg"
import CalendarIcon from "../../assets/icons/CalendarIcon";
import ModalPlanSubcriptionHistory from "../modalPlanSubcriptionHistory/ModalPlanSubcriptionHistory";
import * as XLSX from "xlsx"
import { validateEmail } from "../../utils/regex.util";
import ModalContactUserViaEmail from "../adminComponents/modalContactUserViaEmail/ModalContactUserViaEmail";
import { isShopifyAdminLocation } from "../../utils/util";

const UsersTable = forwardRef(({
  search,
  isShowExceededStorageLimit = false
}, ref) => {
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const listPageSize = [5, 10, 15, 20, 50, 100]
    const [pageSize, setPageSize] = useState(10)
    const [pageNum, setPageNum] = useState(1)
    const [total, setTotal] = useState(1)
    const [listUsers, setListUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const [isShowModalUserInfo, setIsShowModalUserInfo] = useState(false)
    const timeoutRef = useRef()
    const [isShowModalHistory, setIsShowModalHistory] = useState(false)
    const [isShowModalContactUser, setIsShowModalContactUser] = useState(false)
    const [sorter, setSorter] = useState()

    const { apiData: availablePlans } = useFetch('/pricing-plan/all')
    const menuItems = [
      {
        key: USER_MENU_ACTION.VIEW_HISTORY,
        label: "View subcription history"
      },
      {
        key: USER_MENU_ACTION.CONTACT_VIA_EMAIL,
        label: "Contact via Email",
        isValidateEmail: true
      }
    ]

    const columns = [
        {
          title: 'User name',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          render: (text, record) => <span>"{text}"</span>,
          sorter: true,
        },
        {
          title: 'Phone Number',
          dataIndex: 'phone',
          key: 'phone',
          align: 'left',
        },
        {
          title: 'Email',
          dataIndex: 'contact',
          key: 'contact',
          align: 'left',
          render: (text, record) => <span>{record?.email || record?.shopifyShopEmail || record.socialType}</span>
        },
        {
          title: 'Date of Joining',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'left',
          render: (text) => <span style={{ display: 'flex', alignItems: 'center'}}>
            <span style={{ marginRight: 5 }}><CalendarIcon /></span> { moment(text, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT) }
          </span>,
          sorter: true,
        },
        {
          title: 'Plan',
          dataIndex: 'membership',
          key: 'membership',
          align: 'left',
          render: (text, record) => 
            <Dropdown
              menu={{
                items: [],
              }}
              placement="bottom"
              arrow={false}
              trigger="click"
              dropdownRender={() => (
                <>
                  <div className="admin-select-plan rounded-[11px] p-[11px] bg-[#FFF] flex flex-col gap-[12px]">
                    {
                      availablePlans && availablePlans.map((el, index) => (
                        <>
                          <div key={el.id} className={`pricing-plan-text ${_.get(record, ['planId']) === el.id ? 'active' : ''}`} onClick={() => {onChangePricingPlan(record, el)}}>
                            {el.name}
                          </div>
                        </>
                      ))
                    }
                  </div>
                </>
              )}
            >
              <span className="highlight-box flex flex-nowrap items-center gap-[12px] cursor-pointer whitespace-norap">
                <div>
                  <img src={ArrowDownIcon} alt="" />
                </div> 
                <span>
                  {text}
                </span>
              </span>
            </Dropdown>
        },
        {
          title: 'Store Capacity',
          dataIndex: 'userStorageInfo',
          key: 'userStorageInfo',
          align: 'center',
          render: (data, record) => <span>{data ? `${_.round(data.total, 2)}Mb/${data.maximumStorage}Mb` : ``}</span>,
          sorter: true,
        },
        {
          title: 'Store Name',
          dataIndex: 'publishStoreName',
          key: 'publishStoreName',
          align: 'left',
          render: (text, record) => <span>{text ? `"${text}"` : ``}</span>
        },
        {
          title: 'Role',
          dataIndex: 'roleName',
          key: 'roleName',
          align: 'left',
          render: (text, record) => <span>{text}</span>
        },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex flex-col items-center gap-[7px]">
              <button className="btn-action" onClick={() => {onViewUser(record)}}>
                <EyeIcon/>
              </button>
              <Dropdown
                menu={{
                    items: [],
                }}
                dropdownRender={() => {
                    return <div className="dropdown-user-action">
                      {
                        menuItems.filter(el => {
                          if(el.isValidateEmail){
                            return validateEmail(record.email)
                          }
                          return true
                        }).map(el => (
                          <div key={el.key} onClick={() => {onClickMenu({key: el.key, item: record})}} className="flex gap-[7px] px-[6px] py-[6px] dropdown-item">
                            <div className="image-container w-[15px]">
                              <img src={el.icon} alt="" />
                            </div>
                            <div className="text-[#FFF] text-[12px] font-inter flex-auto">
                              {el.label}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                }}
                placement="bottomRight"
                arrow={false}
                trigger="click"
              >
                <button className="btn-action">
                    <img src={ThreeDotIcon} alt="" />
                </button>
              </Dropdown>
            </div>
          </>,
        },
    ];

    const itemPaginationRender = (_, type, originalElement) => {
      if (type === 'prev') {
        return <a>Previous</a>;
      }
      if (type === 'next') {
        return <a>Next</a>;
      }
      return originalElement;
    };

    useEffect(() => {
        loadData()
    },[pageNum, pageSize, search, sorter, isShowExceededStorageLimit])

    useImperativeHandle(ref, () => ({
      exportExcel: () => {
        return new Promise((resolve, reject) => {
          userApi.getListUsers(getFilter(true)).then((rs) => {
            const header = {
              name: "User name",
              phone: "Phone number",
              email: "Email",
              createdAt: "Date of Joining",
              membership: "Plan",
              publishStoreName: "Store Name",
              status: "Status",
            }

            PERSONAL_QUESTIONS.forEach(el => {
              header[el.personalInfoKey] = el.title
            })

            let data = [header]
            rs.results.forEach(el => {
              const row = {
                name: el.name,
                phone: el.phone,
                email: el?.email || el.socialType,
                createdAt: moment(el.createdAt, SERVER_DATE_FORMAT).format(TEMPLATE_TABLE_DATE_FORMAT),
                membership: el.membership,
                publishStoreName: el.publishStoreName,
                status: "None"
              }

              PERSONAL_QUESTIONS.forEach(qe => {
                row[qe.personalInfoKey] = _.get(el, ['personalInfo', qe.personalInfoKey])
              })

              data.push(row)
            })

            // Create a workbook
            const wb = XLSX.utils.book_new()

            const sheet = XLSX.utils.json_to_sheet(data, {
              skipHeader: true
            })

            console.log('sheet', sheet)

            XLSX.utils.book_append_sheet(wb, sheet, 'Metadrob User')

            XLSX.writeFile(wb, "Metadrob user.xlsx")

            resolve()
          }).catch(err => {
            reject()
          })
        })
      },
    }));

    const onClickMenu = (info) => {
      setSelectedUser(info.item)
      if(info.key === USER_MENU_ACTION.VIEW_HISTORY) {
        setIsShowModalHistory(true)
      } else if(info.key === USER_MENU_ACTION.CONTACT_VIA_EMAIL) {
        setIsShowModalContactUser(true)
      }
    }

    const getFilter = (isExport = false) => {
      let filterData = {
        limit: isExport ? 1000 : pageSize,
        page: isExport ? 1 : pageNum,
        statistic: true,
        search: search,
        isShowExceededStorageLimit: isShowExceededStorageLimit ? 1 : 0,
        isShopifyUser: isShopifyAdminLocation(location) ? 1 : 0
      }
      if(sorter){
        let field = _.get(sorter, 'field', '')
        const order = _.get(sorter, 'order', '')
        if(field === "userStorageInfo"){
          field = "userStorageInfo.usedPercent"
        }
        if(field && order){
          if(order === "ascend"){
            filterData.sortBy = `${field}:asc`
          }
          if(order === "descend"){
            filterData.sortBy = `${field}:desc`
          }
        }
      }

      return filterData
    }

    const loadData = () => {
      if(timeoutRef.current){
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsLoading(true)
        userApi.getListUsers(getFilter()).then((rs) => {
          setListUsers(
            rs.results.map(el => {
                el.key = el.id;
                return el
              }
            )
          )
          setTotal(rs.totalResults)
          setIsLoading(false)
        }).catch(err => {
          setIsLoading(false)
        })
      }, 300)
    }

    const onViewUser = (user) => {
      setSelectedUser(user)
      setIsShowModalUserInfo(true)
    }

    const onChangePricingPlan = (record, plan) => {
      if(_.get(record, ['planId']) !== plan.id){
        Modal.confirm({
          title: `Are you sure to assign ${_.get(plan, ['name'])} to User: ${_.get(record, ['name'])}?`,
          centered: true,
          className: "dialog-confirm",
          onOk: () => {
            // const trialDays = _.get(_.find(_.get(plan, ['features'], []), {key: PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], ADMIN_ASSIGN_EXPIRED_DAYS)
            const trialDays = 3650

            const body = {
              userId: _.get(record, ['id']),
              key: USER_SUBCRIPTION_KEY.PRICING_PLAN,
              value: {
                pricingId: _.get(plan, ['id']),
                stripeIntentSecret: null,
                numOfDate: trialDays,
                createdDate: moment(new Date()),
                expiredDate: moment(new Date()).add(trialDays, 'day'),
                isTrial: false,
                isAssignedByAdmin: true,
              },
              paymentStatus: PAYMENT_STATUS.SUCCEEDED,
              active: true,
            }

            setIsLoading(true)
            userSubcriptionApi.assignPricingPlan(body).then(rs => {
              setIsLoading(false)
              notification.success({
                message: "Assign Pricing Plan successfully!"
              })
              loadData()
            }).catch(err => {
              setIsLoading(false)
              notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't assign Pricing Plan!`)
            })
            })
          }
        })
        
      }
    }

    const onTableChange = (pagination, filters, sorter, extra) => {
      setSorter(sorter)
    };

    return (
      <>
        <Table
          loading={{
            spinning: isLoading|| !listUsers,
            indicator: <Lottie animationData={loadingAnimation} />
          }}
          columns={columns}
          dataSource={listUsers}
          pagination={{
            pageSize: pageSize,
            current: pageNum,
            total: total,
            itemRender: itemPaginationRender,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPageNum(page);
              setPageSize(pageSize);
            },
          }}
          locale={{
            emptyText: (
                <div className="empty-container">
                    No data can be found.
                </div>
            ),
          }}
          onChange={onTableChange}
          className="admin-shared-table"
          rowClassName="admin-template-table"
        />

        <ModalUserInfo 
          open={isShowModalUserInfo}
          user={selectedUser}
          onClose={() => {setIsShowModalUserInfo(false)}}
        />
        <ModalPlanSubcriptionHistory
          open={isShowModalHistory}
          onClose={() => {setIsShowModalHistory(false)}}
          item={selectedUser}
        />
        <ModalContactUserViaEmail
          user={selectedUser}
          open={isShowModalContactUser}
          onClose={() => {setIsShowModalContactUser(false)}}
        />
      </>
    );
})
export default UsersTable;