import { Col, Row } from "antd"
import { useEffect, useState } from "react"
import { getConfigByType } from "../../api/config.api"
import { CONFIG_TYPE } from "../../utils/constants"
import { getAssetsUrl } from "../../utils/util"

const HomeBanner = () => {
    const [bannerData, setBannerData] = useState()

    useEffect(() => {
        getConfigByType(CONFIG_TYPE.BANNER).then(rs => {
            if(rs?.content){
                setBannerData(rs.content)
            }
        }).catch(err => {

        })
    },[])

    return <>
        {bannerData && <Row 
            gutter={[26, 26]} 
            className="!ml-0 !mr-0 rounded-[12px] launch-container"
            style={{
                backgroundImage: `url('${getAssetsUrl(bannerData.image)}')`
            }}
        >
            <Col lg={12} md={12} sm={12} xs={0}>
            </Col>
            <Col  lg={12} md={12} sm={12} xs={24} className="launch-info-container">
                <div  className="text-launch-tittle">
                    {bannerData.title}
                </div>
                {bannerData.description && <div className="text-launch-description mt-[11px]">
                    {bannerData.description}
                </div>}
                {bannerData.buttonTitle && <div className="mt-[14px] flex justify-start">
                    <button className="btn-get">
                        {bannerData.buttonTitle}
                    </button>
                </div>}
            </Col>
        </Row>}
    </>
}
export default HomeBanner