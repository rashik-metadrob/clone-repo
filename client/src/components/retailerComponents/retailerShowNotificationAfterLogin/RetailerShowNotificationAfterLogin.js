import { useSelector } from "react-redux"
import ModalRetailerCapacityRemind from "../modalRetailerCapacityRemind/ModalRetailerCapacityRemind"
import { getExceedMaximumCapacityNotifications, getPublishedStoresAreSentToDraftNotifications, viewNotification } from "../../../redux/notificationSlice"
import { useEffect, useMemo, useState } from "react"
import _ from "lodash"
import { useAppDispatch } from "../../../redux"
import { NOTIFICATION_TYPES } from "../../../utils/constants"
import notificationApi from "../../../api/notification.api"

const RetailerShowNotificationAfterLogin = () => {
    const dispath = useAppDispatch()
    const exceedMaximumCapacityNotifications = useSelector(getExceedMaximumCapacityNotifications)
    const publishedStoresAreSentToDraftNotifications = useSelector(getPublishedStoresAreSentToDraftNotifications)
    const [isShowModalNotification, setIsShowModalNotification] = useState(false)

    const notViewedNotification = useMemo(() => {
        if(_.get(exceedMaximumCapacityNotifications, [0], null)){
            return _.get(exceedMaximumCapacityNotifications, [0], null)
        } else if(_.get(publishedStoresAreSentToDraftNotifications, [0], null)){
            return _.get(publishedStoresAreSentToDraftNotifications, [0], null)
        }
        return null
    }, [exceedMaximumCapacityNotifications, publishedStoresAreSentToDraftNotifications])

    useEffect(() => {
        if(notViewedNotification?.id){
            setIsShowModalNotification(true)
        }
    }, [notViewedNotification?.id])

    const onCloseNotification = () => {
        setIsShowModalNotification(false)

        dispath(viewNotification(notViewedNotification?.id))

        if(notViewedNotification?.type === NOTIFICATION_TYPES.PUBLISHED_STORE_BE_SENT_TO_DRAFT){
            notificationApi.viewNotification(notViewedNotification.id)
        }
    }

    return <>
        <ModalRetailerCapacityRemind 
            open={isShowModalNotification && notViewedNotification}
            type={notViewedNotification?.type}
            onClose={() => {onCloseNotification()}}
            subject={notViewedNotification?.subject}
            content={notViewedNotification?.content}
        />
    </>
}

export default RetailerShowNotificationAfterLogin