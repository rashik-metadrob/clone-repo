import { Col, Row } from "antd";
import "./styles.scss"

const NewAndFeeds = ({className}) => {
    const items = [
        {
            image: `${process.env.REACT_APP_HOMEPAGE}/images/feeds/img1.png`,
            tittle: "Adding Products to Your Virtual Store",
            time: "15 Aug 2022"
        },
        {
            image: `${process.env.REACT_APP_HOMEPAGE}/images/feeds/img2.png`,
            tittle: "Early Access to Benefits To NEW User",
            time: "15 Aug 2022"
        },
        {
            image: `${process.env.REACT_APP_HOMEPAGE}/images/feeds/img1.png`,
            tittle: "Early Access to Benefits To NEW User",
            time: "15 Aug 2022"
        }
    ]
    return <div className={`new-and-feeds-container ${className}`}>
        <div className="new-and-feeds-tittle">
            News & Feeds
        </div>
        <div className="new-feed-list mt-[10px]">
            {
                items && items.map((el, index) => {
                    return <>
                        <Row key={`items-${index}`} className="feed-item">
                            <Col span={8}>
                                <img src={el.image} alt="" className="feed-item-img"/>
                            </Col>
                            <Col span={16} className="feed-item-content">
                                <div className="text-feed-tittle">
                                    {el.tittle}
                                </div>
                                <div className="text-feed-time mt-[35px]">
                                    {el.time}
                                </div>
                            </Col>
                        </Row>
                    </>
                })
            }
            
        </div>
    </div>
}
export default NewAndFeeds;