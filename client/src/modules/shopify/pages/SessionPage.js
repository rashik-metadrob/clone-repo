import { useEffect } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import _ from "lodash";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { getStorageRefreshToken, setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../../utils/storage";
import { setUser } from "../../../redux/appSlice";
import routesConstant from "../../../routes/routesConstant";
import { useNavigate } from "react-router-dom";
import { fetchUserStorageInfo } from "../../../redux/userStorageSlice";
import { fetchExceedMaximumCapacityNotifications, fetchPublishedStoresAreSentToDraftNotifications } from "../../../redux/notificationSlice";

const SectionPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const fetch = useAuthenticatedFetch()
    const {
        data,
        refetch: fetchSession,
    } = useAppQuery({
        url: "/shopify/auth/login",
        reactQueryOptions: {
          onSuccess: () => {
          },
        },
    });

    useEffect(() => {
        fetchSession()
    }, [])

    useEffect(() => {
        if(data){
            if(data?.user && data?.tokens){
                setStorageUserDetail(data.user)
                dispatch(setUser(data.user))
                setStorageToken(data.tokens.access.token)
                setStorageRefreshToken(data.tokens.refresh.token)

                dispatch(fetchUserStorageInfo())
                dispatch(fetchExceedMaximumCapacityNotifications())
                dispatch(fetchPublishedStoresAreSentToDraftNotifications())

                navigate(routesConstant.firstLogin.path)
            } else {
                const message = _.get(data, ['message'], `Can't login with Shopify!`)
                notification.error({
                    message
                })
            }
        }
    }, [data])

    return <>
        <div>METADROB</div>
    </>
}
export default SectionPage