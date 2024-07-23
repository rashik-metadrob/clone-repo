import { Row, Spin, Tabs } from "antd"
import "./styles.scss"
import { useRef, useState } from "react"
import CompanyDetailsTab from "../../components/firstLoginComponents/companyDetailsTab/CompanyDetailsTab"
import ProductsTab from "../../components/firstLoginComponents/productsTab/ProductsTab"
import ThemeTab from "../../components/firstLoginComponents/themeTab/ThemeTab"
import YourStoreTab from "../../components/firstLoginComponents/yourStoreTab/YourStoreTab"
import { useNavigate } from "react-router-dom"
import routesConstant from "../../routes/routesConstant"
import useMeasure from "react-use-measure"
const FirstLoginPage = () => {
    const navigate = useNavigate()
    const [activeKey, setActiveKey] = useState("1")
    const [isLoading, setIsLoading] = useState(false)
    const yourStoreTabRef = useRef()
    const [ref, bounds] = useMeasure()

    const onChange = (key) => {
        setActiveKey(key.toString())
    };

    const items = [
        {
          key: "1",
          label: `Company Details`,
          children: <><CompanyDetailsTab /></>,
        },
        {
            key: "2",
            label: `Products`,
            children: <><ProductsTab /></>,
        },
        {
            key: "3",
            label: `Theme`,
            children: <><ThemeTab /></>,
        },
        {
            key: "4",
            label: `Your Store`,
            children: <><YourStoreTab ref={yourStoreTabRef}/></>,
        }
    ];

    const onNextClick = () => {
        if(+activeKey < 4){
            setActiveKey((+activeKey + 1).toString())
        } else {
            const data = Object.assign(yourStoreTabRef.current.getData(), {isFromFirstLogin: true})
            const queryParams = new URLSearchParams(data);
            navigate(`${routesConstant.dashboardStore.path}?${queryParams}`)
        }
    }

    return <>
        <div className="first-login-container relative h-full">
            <div className={`py-[clamp(24px,10vh,60px)] px-[24px] h-[calc(100%-${bounds.height}px)] overflow-y-auto`}>
                <div className="first-login-tabs-container px-[20px] lg:px-[40px] pt-[clamp(12px,5vh,36px)] pb-[clamp(12px,7vh,47px)] max-w-[985px] mx-auto h-full min-h-[400px]">
                    <Tabs
                        activeKey={activeKey}
                        className="first-login-tabs"
                        onChange={onChange}
                    >
                        {items.map((tab) => {
                            const { key, label, children } = tab;
                            return (
                                <Tabs.TabPane
                                key={key}
                                tab={label}
                                >
                                    <>{children}</>
                                </Tabs.TabPane>
                            );
                        })}
                    </Tabs>
                </div>
            </div>
            <div className="sticky bottom-0 py-[clamp(12px,5vh,36px)] bg-[#0D0C0C] flex justify-center w-full" ref={ref}>
                <Spin spinning={isLoading}>
                    <button 
                        className="w-[160px] h-[44px] bg-[#FFF] outline-none border-none rounded-[10px] flex justify-center items-center font-inter text-[#0D0C0C] text-[16px] font-[700]"
                        onClick={() => {onNextClick()}}
                    >
                        Next
                    </button>
                </Spin>
            </div>
        </div>
    </>
}
export default FirstLoginPage