import "./styles.scss"
import BackGround1 from "../../../assets/images/first-login/bg.png"
import { PERSONAL_QUESTIONS } from "../../../utils/constants"
import { useEffect, useMemo, useState } from "react"
import { Input, Progress, Radio, Select, Spin, notification } from "antd"
import _ from "lodash"
import { useSelector } from "react-redux"
import { getUser, setUser } from "../../../redux/appSlice"
import ArrowDownIcon from "../../../assets/images/profile/arrow-down.svg"
import { useNavigate } from "react-router-dom"
import routesConstant from "../../../routes/routesConstant"
import { getDefaultHomePage } from "../../../utils/util"
import { userApi } from "../../../api/user.api"
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../../utils/storage"
import { useAppDispatch } from "../../../redux"
import LogoImage from "../../../assets/images/first-login/LOGO.svg"
import SelectCountry from "../../../components/selectCountry/SelectCountry"

const RetailerFirstLoginPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({})
    const user = useSelector(getUser)
    const [isLoading, setIsLoading] = useState(false)

    const question = useMemo(() => {
        return PERSONAL_QUESTIONS.find((el, index) => index + 1 === step)
    }, [step])
    const isDisabledNextButton = useMemo(() => {
        return !_.get(formData, ['personalInfo', question.personalInfoKey])
    }, [question, formData])

    useEffect(() => {
        const newData = _.pick(user, 'personalInfo')
        setFormData(newData)
    }, [user])

    const handleFormDataChange = (path, value) => {
        const clone = _.cloneDeep(formData)
        _.set(clone, path, value)
        setFormData(clone)
    }

    const onNextStep = () => {
        if(step < PERSONAL_QUESTIONS.length){
            setStep(step + 1)
        } else {
            onSave()
        }
    }

    const onBack = () => {
        setStep(step - 1)
    }

    const onSave = async () => {
        const bodyData = {
            ...formData,
            isCompleteEnterProfile: true
        }

        setIsLoading(true)

        userApi.updateLoggedInUser(bodyData).then(data => {
            setStorageUserDetail(data.user)
            dispatch(setUser(data.user))
            setStorageToken(data.tokens.access.token)
            setStorageRefreshToken(data.tokens.refresh.token)
            notification.success({
                message: "Update successfully!"
            })
            setIsLoading(false)
            navigate(getDefaultHomePage(user))
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Update fail!`)
            })
            setIsLoading(false)
        })
    }

    return <>
        <div className='px-[32px] md:px-[73px] min-h-screen flex justify-center items-center w-full relative'>
            <div 
                className={`retailer-login-image-wrapper active`} 
                style={{
                    backgroundImage: `url(${BackGround1})`
                }}
            >
            </div>

            <div className="retailer-first-login-container overflow-y-auto">
                <div className="retailer-first-login-card">
                    <img src={LogoImage} className="h-[clamp(32px,5vh,54px)] absolute top-[clamp(-24px,-2.2vh,-12px)] left-[50%] translate-x-[-50%] translate-y-[-100%]" alt="" />
                    <div className="text-get-start">
                        Let’s Get Started
                    </div>
                    {
                        <div className="question-card mt-[24px]">
                            <div className="title">
                                {question.title}
                            </div>
                            <div className="mt-[16px]">
                                <Progress 
                                    percent={(step / PERSONAL_QUESTIONS.length) * 100} 
                                    showInfo={false} 
                                    className='w-full max-w-[500px] mb-0 flex-auto' 
                                    strokeColor='#FFFFFF'
                                    trailColor='rgba(0, 0, 0, 0.60)'
                                />
                            </div>
                            <div className="sub-title mt-[16px]">
                                {question.subTitle}
                            </div>
                            <div className="mt-[16px]">
                                <Radio.Group 
                                    className="answer-group"
                                    onChange={(e) => {handleFormDataChange(['personalInfo', question.personalInfoKey], e.target.value)}} 
                                    value={_.get(formData, ['personalInfo', question.personalInfoKey])}
                                >
                                    <div className="radio-container">
                                        {
                                            question.answer.map(ans => (
                                                <>
                                                    <Radio value={ans.value} key={ans.id}>
                                                        {ans.text}
                                                    </Radio>
                                                </>
                                            ))
                                        }
                                    </div>
                                </Radio.Group>
                                {
                                    question.personalInfoKey === "tried" && _.get(formData, ['personalInfo', question.personalInfoKey]) === "Yes"
                                    && <>
                                        <div className="question-card-input-label mt-[12px]">
                                            If Yes, please type the name:
                                        </div>
                                        <Input 
                                            className="question-card-input mt-[8px]"  
                                            value={_.get(formData, ['personalInfo', 'triedPlatform'])}
                                            onChange={(e) => {handleFormDataChange(['personalInfo', 'triedPlatform'], e.target.value)}} 
                                        />
                                    </>
                                }
                                {
                                    question.personalInfoKey === "salesArea" && _.get(formData, ['personalInfo', question.personalInfoKey]) === "Specific Region"
                                    && <>
                                        <SelectCountry 
                                            value={_.get(formData, ['personalInfo', 'area'])}
                                            onChange={(e) => {handleFormDataChange(['personalInfo', 'area'], e)}} 
                                        />
                                    </>
                                }
                            </div>
                        </div>
                    }
                    <div className="mt-[48px] flex gap-[24px] flex-nowrap items-center">
                        {step > 1 &&<button className="btn-back" onClick={() => {onBack()}}>
                            Back
                        </button>}
                        
                        <button className="btn-next" disabled={isDisabledNextButton} onClick={() => {onNextStep()}}>
                            <Spin spinning={isLoading} wrapperClassName="py-[17.5px] rounded-[9px] overflow-hidden">
                                Next
                            </Spin>
                        </button>
                        
                    </div>
                    {/* <div className="mt-[24px] text-already-account" onClick={() => {navigate(routesConstant.login.path)}}>
                        Already have an account? <span className="text-login">Login</span>
                    </div> */}
                </div>
            </div>
        </div>
    </>
}
export default RetailerFirstLoginPage