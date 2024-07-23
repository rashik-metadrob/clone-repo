import { Col, Row } from "antd";
import "./styles.scss"

const NotFound = () => {

    return <>
        <Row className="not-found-page">
            <Col span={24} className="not-found-container">
                <div className="text-404">
                    404
                </div>
                <div className="not-found-text mt-[24px]">
                    Not found
                </div>
                <div className="sorry-text mt-[12px]">
                    Sorry, we were unable to find that page.
                </div>
                <div className="please-text mt-[8px]">
                    Please click app icon to redirect to main page.
                </div>
            </Col>
        </Row>
    </>
}
export default NotFound;