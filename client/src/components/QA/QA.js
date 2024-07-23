import { Col, Row } from "antd";
import "./styles.scss"

import ListQAQuestion from "../../assets/json/listQAQuestion.json"
import { useState } from "react";

const QA = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)

    return <Row className="qa-content">
        <Col lg={7} md={8} sm={24} xs={24} className="qa-question-container">
            {
                ListQAQuestion
                && ListQAQuestion.map((el, index) => {
                    return <>
                        <div className={`qa-question-item ${currentQuestion === index ? "active" : ""}`} key={`question-${index}`} onClick={() => {setCurrentQuestion(index)}}>
                            {el.question}
                        </div>
                    </>
                })
            }
        </Col>
        <Col lg={17} md={16} sm={24} xs={24} className="qa-answer-container">
            {
                ListQAQuestion[currentQuestion].answer
            }
        </Col>
    </Row>
}
export default QA;