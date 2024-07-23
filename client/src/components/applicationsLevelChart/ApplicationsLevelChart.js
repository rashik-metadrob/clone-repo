import "./styles.scss"

import ArrowIcon from "../../assets/images/analytics/arrow.svg"
import { useEffect, useRef, useState } from "react"

const ApplicationsLevelChart = () => {
    let refInfo = useRef()
    let colors = ["#232940", "#FE6528", "#FEE622"]
    const [pageSize, setPageSize] = useState(13)

    useEffect(() => {
        let n = 1;

        while((n + 1) * 6 + n * 15 < refInfo.current.clientWidth){
            n++
        }
        console.log("ref", n)
        setPageSize(n - 1)
    }, [])

    return <>
        <div className="h-full application-level-container">
            <div className="flex items-center justify-between">
                <div className="text-tittle">
                    Application Level 
                    <div className="text-tittle-des">
                        ({pageSize * pageSize} of 1024)
                    </div>
                </div>
                <div className="page-control">
                    <img src={ArrowIcon} alt="" className="cursor-pointer" style={{transform: "rotate(90deg)"}}/>
                    1 / {Math.ceil(1024 / (pageSize * pageSize))}
                    <img src={ArrowIcon} alt="" className="cursor-pointer" style={{transform: "rotate(-90deg)"}}/>
                </div>
            </div>
            <div className="level-info mt-[12px]" ref={refInfo}>
                {
                    pageSize && new Array(pageSize * pageSize).fill(null).map((el, index) => {
                        const random = Math.floor(Math.random() * colors.length);
                        return <>
                            {/* <div className="level-item" style={{background: colors[random]}}> */}
                            <div className="level-item" style={{background: "rgb(35, 41, 64)"}}>

                            </div>
                        </>
                    })
                }
            </div>
        </div>
    </>
}
export default ApplicationsLevelChart