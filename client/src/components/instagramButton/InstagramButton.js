import Ins from '../../assets/images/login/INSTAGRAM.png';
import InsLight from '../../assets/images/login/INSTAGRAM-light.png';
import { useSelector } from 'react-redux';
import { getTheme } from '../../redux/appSlice';

const InstagramButton = ({
    onSuccess = () => {},
}) => {
    const theme = useSelector(getTheme)
    return <>
        <div className='other-login-btn'>
            <img src={theme === 'dark' ? Ins : InsLight} alt='Ins'/>
        </div>
    </>
}

export default InstagramButton