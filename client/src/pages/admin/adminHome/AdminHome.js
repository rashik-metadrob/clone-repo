import { Col, Row } from "antd";
import "./styles.scss"
import GrossIncome from "../../../components/adminComponents/grossIncome/GrossIncome";
import TotalDecoratives from "../../../components/adminComponents/totalDecoratives/TotalDecoratives";
import TotalTemplates from "../../../components/adminComponents/totalTemplates/TotalTemplates";
import TotalApis from "../../../components/adminComponents/totalApis/TotalApis";
import NewUsers from "../../../components/adminComponents/newUsers/NewUsers";
import PremiumUsers from "../../../components/adminComponents/premiumUsers/PremiumUsers";
import TimeSpentToBuildStore from "../../../components/adminComponents/timeSpentToBuildStore/TimeSpentToBuildStore";
import TimeSpentOnExploringStore from "../../../components/adminComponents/timeSpentOnExploringStore/TimeSpentOnExploringStore";
import NewUsersTableCard from "../../../components/adminComponents/newUsersTableCard/NewUsersTableCard";
import LastPlanPurchased from "../../../components/adminComponents/lastPlanPurchased/LastPlanPurchased";
import MostUsedAnimation from "../../../components/adminComponents/mostUsedAnimation/MostUsedAnimation";
import CollaborateTableCard from "../../../components/adminComponents/collaborateTableCard/CollaborateTableCard";
import UploadAnalysisCard from "../../../components/adminComponents/uploadAnalysisCard/UploadAnalysisCard";
import { useTranslation } from 'react-i18next';

const AdminHome = () => {
    const { t } = useTranslation();
    return <>
        <div className="admin-home-page-container">
            <Row className="px-[18px] md:px-[47px] pb-[40px]">
                <Col span={24}>
                    <div className="text-welcome mt-[32px] mb-[16px] md:mt-[45px] md:mb-[45px] text-[20px] leading-[45px] md:text-[40px] md:leading-[48px]">
                        {t('global.welcome_to_dashboard')}
                    </div>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 28]}>
                        <Col lg={6} md={12} span={24}>
                            <GrossIncome />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <TotalDecoratives />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <TotalTemplates />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <TotalApis />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <NewUsers />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <PremiumUsers />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <TimeSpentToBuildStore />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <TimeSpentOnExploringStore />
                        </Col>

                        <Col lg={9} span={24}>
                            <NewUsersTableCard />
                        </Col>
                        <Col lg={8} span={24}>
                            <LastPlanPurchased />
                        </Col>
                        <Col lg={7} span={24}>
                            <MostUsedAnimation />
                        </Col>

                        <Col lg={9} span={24}>
                            <UploadAnalysisCard />
                        </Col>
                        <Col lg={12} span={24}>
                            <CollaborateTableCard />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    </>
}
export default AdminHome;