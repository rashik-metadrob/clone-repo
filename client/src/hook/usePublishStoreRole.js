import { useSelector } from "react-redux"
import { getUser } from "../redux/appSlice"
import { getStoreInfo } from "../redux/modelSlice"
import { useEffect, useMemo, useState } from "react"
import { PERMISSIONS, PUBLISH_ROLE } from "../utils/constants"
import { store } from "../redux"
import _ from "lodash"
import usePermissions from "./usePermissions"


const usePublishStoreRole = () => {
    const user = useSelector(getUser)
    const storeInfo = useSelector(getStoreInfo)
    const { isStaff, staffOwnerId, requirePermissionOfStaff } = usePermissions()

    const publishRole = useMemo(() => {
        let role = PUBLISH_ROLE.CUSTOMER

        if(user && storeInfo) {
            if(isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON) && staffOwnerId ) {
                role = PUBLISH_ROLE.SALE
            }
        }

        return role

    }, [user, storeInfo, isStaff, requirePermissionOfStaff, staffOwnerId])

    const isLoading = useMemo(() => {
        return !!!storeInfo
    }, [storeInfo])

    return {
        publishRole,
        isLoading
    }
}

export default usePublishStoreRole