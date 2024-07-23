import { Layout } from 'antd';
import "./styles.scss"

const { Footer } = Layout;

const AdminFooter = () => {

    return <>
        <Footer className='admin-footer'>
            <div className='admin-footer-container'>
                <div className='text-copyright'>
                    © 2024  Metadrob
                </div>
                <div className='group-links'>
                    <div className='link-item'>
                        About
                    </div>
                    <div className='link-item'>
                        Support
                    </div>
                    <div className='link-item'>
                        Contact Us
                    </div>
                </div>
            </div>
        </Footer>
    </>
}
export default AdminFooter