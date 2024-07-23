import { Col, Row } from "antd";
import "./styles.scss"
import TutorialVideo from "../../components/tutorialVideo/TutorialVideo";
import { useEffect, useState } from "react";
import assetApi from "../../api/asset.api";
import { ASSET_TYPES } from "../../utils/constants";
import { getAssetsUrl } from "../../utils/util";
import _ from "lodash";

const Tutorial = () => {
    const [featureVideos, setFeatureVideos] = useState([])
    const [trendingVideos, setTrendingVideos] = useState([])

    useEffect(() => {
        assetApi.getPublicAssets(
            {
                type: ASSET_TYPES.TUTORIAL_VIDEO,
                'attribute_isShowTutorialVideo': 1,
                'attribute_isFeatureTutorialVideo': 1
            }
        ).then(rs => {
            setFeatureVideos(_.get(rs, ['results'], []), [])
        })

        assetApi.getPublicAssets(
            {
                type: ASSET_TYPES.TUTORIAL_VIDEO,
                'attribute_isShowTutorialVideo': 1,
                'attribute_isFeatureTutorialVideo': 0
            }
        ).then(rs => {
            setTrendingVideos(_.get(rs, ['results'], []), [])
        })
    }, [])

    return <>
        <Row gutter={[64, 42]} className="!ml-0 !mr-0 mt-[12px] tutorial-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <Row gutter={[64, 42]}>
                    <Col span={24} className="!p-0">
                        <Row gutter={[64, 42]}  className="!ml-0 !mr-0 justify-center">
                            {
                                featureVideos &&
                                featureVideos.map(el => (
                                    <Col lg={12} md={12} sm={24} xs={24} key={el.id}>
                                        {el?.filePath && <TutorialVideo 
                                            url={getAssetsUrl(el?.filePath)} 
                                            name={_.get(el, ['name'], '')}
                                        />}
                                    </Col>
                                ))
                            }
                        </Row>
                    </Col>
                    <Col span={24} className="p-0 !px-[32]">
                        <div className="text-trending">
                            Trending this Month
                        </div>
                    </Col>
                    <Col span={24} className="!p-0">
                        <Row gutter={[64, 42]}  className="!ml-0 !mr-0">
                            {
                                trendingVideos &&
                                trendingVideos.map(el => (
                                    <Col lg={8} md={12} sm={24} xs={24} key={el.id}>
                                        {el?.filePath && <TutorialVideo 
                                            url={getAssetsUrl(el?.filePath)} 
                                            name={_.get(el, ['name'], '')}
                                            fontSize={16}
                                        />}
                                    </Col>
                                ))
                            }
                            
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}
export default Tutorial;