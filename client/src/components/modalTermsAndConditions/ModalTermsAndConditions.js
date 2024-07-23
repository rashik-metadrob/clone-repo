import { Modal } from "antd"
import "./styles.scss"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"

const ModalTermsAndConditions = ({
    open,
    onClose = () => {},
    onAgree = () => {}
}) => {

    return <>
        <Modal
            open={open}
            width="80%"
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            centered
            className="modal-terms-and-conditions"
            onCancel={() => {onClose()}}
        >
            <div className="modal-terms-and-conditions-content">
                <div className="title">
                    Metadrob Terms and Conditions
                </div>
                <div className="content mt-[24px] py-[24px]">
                    <div className="content-container">
                        <h3>
                            Introduction
                        </h3>
                        <p>
                            These Terms and Conditions (the "Terms") govern your use of the Metadrob website (the "Site") and any services offered by Metadrob (the "Services"). By using the Site or Services, you agree to be bound by these Terms
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Eligibility
                        </h3>
                        <p>
                        The Site and Services are only available to individuals who are 18 years of age or older. By using the Site or Services, you represent and warrant that you are 18 years of age or older
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Account Creation
                        </h3>
                        <p>
                            In order to use certain features of the Site or Services, you may need to create an account. When creating an account, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password. You are also responsible for all activities that occur under your account.
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Intellectual Property
                        </h3>
                        <p>
                            All content on the Site, including text, images, videos, and software, is the property of Metadrob or its licensors and is protected by copyright law. You may not copy, modify, distribute, or create derivative works from any content on the Site without the express written permission of Metadrob.
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Links to Other Sites
                        </h3>
                        <p>
                            The Site may contain links to other websites. These links are provided for convenience only and do not imply any endorsement of the content on those websites. Metadrob is not responsible for the content of any linked websites
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Disclaimer of Warranties
                        </h3>
                        <p>
                        The Site and Services are provided on an "as is" basis. Metadrob makes no representations or warranties of any kind, express or implied, regarding the Site or Services, including but not limited to the accuracy, completeness, or reliability of any content on the Site.
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Limitation of Liability
                        </h3>
                        <p>
                            In no event shall Metadrob be liable to you for any damages, whether direct, indirect, special, incidental, or consequential, arising out of or in connection with your use of the Site or Services, including but not limited to lost profits, lost data, or damage to your computer system.
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Governing Law
                        </h3>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws provisions. Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in the State of California.
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Entire Agreement
                        </h3>
                        <p>
                            These Terms constitute the entire agreement between you and Metadrob regarding the use of the Site and Services. These Terms supersede all prior or contemporaneous communications, representations, or agreements, whether oral or written.
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Changes to Terms
                        </h3>
                        <p>
                            Metadrob may modify these Terms at any time. The most current version of the Terms will be posted on the Site. By continuing to use the Site or Services after any modification to the Terms, you agree to be bound by the modified Terms.
                        </p>
                    </div>
                    <div className="content-container mt-[64px]">
                        <h3>
                            Contact Us
                        </h3>
                        <p>
                            If you have any questions about these Terms, please contact us at <a href="mailto:info@metadrob.com" className="text-[#16F6FE]">info@metadrob.com</a>.
                        </p>
                    </div>
                </div>
                <div className="mt-[32px] flex justify-center">
                    <button className="btn-agree" onClick={() => {onAgree()}}>
                        Agree
                    </button>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalTermsAndConditions