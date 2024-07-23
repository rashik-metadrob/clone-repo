import { useSelector } from "react-redux"
import { getUser, getUserPermissons } from "../redux/appSlice"
import { useCallback, useMemo } from "react"
import _ from "lodash"
import { ACCOUNT_VISIBLE_FOR, LIST_PERMISSIONS_OPTIONS, PERMISSIONS, STAFF_ACCOUNT_FOR, USER_ROLE } from "../utils/constants"

const usePermissions = () => {
    const user = useSelector(getUser)
    const userPermissions = useSelector(getUserPermissons)
    const selectedRole = useMemo(() => {
        const staffAccountFor = _.get(user, ['staffAccountFor'])
        const role = _.find(_.get(userPermissions, ['roles'], []), el => el.invitedBy === staffAccountFor)
        return role
    }, [user, userPermissions])
    const staffOwnerId = useMemo(() => {
        return _.get(selectedRole, ['invitedBy'], null)
    }, [selectedRole])
    const isStaff = useMemo(() => {
        return selectedRole && !selectedRole.isSuperAdminRole
    }, [selectedRole])
    const isHasStaffAccount = useMemo(() => {
        return _.filter(_.get(userPermissions, ['roles'], []), el => !el.isSuperAdminRole).length > 0
    }, [userPermissions])

    const staffRoleOptions = useMemo(() => {
        if(!isHasStaffAccount) {
            return [{
                label: "Metadrob account",
                value: STAFF_ACCOUNT_FOR.METADROB
            }]
        } else {
            return [
                {
                    label: "Metadrob account",
                    value: STAFF_ACCOUNT_FOR.METADROB
                },
                ..._.filter(_.get(userPermissions, ['roles'], []), el => !el.isSuperAdminRole).map(el => {
                    return {
                        label: `Staff account of "${_.get(el, ['invitedByUser', 'name'])}"`,
                        value: _.get(el, ['invitedByUser', 'id'])
                    }
                })
            ]
        }
    }, [isHasStaffAccount, userPermissions])

    const retailerPermissions = useMemo(() => {
        let permissionRetailer = []

        if(userPermissions.roles){
            const staffAccountFor = _.get(user, ['staffAccountFor'], null)
            const staffAccountRole = _.find(userPermissions.roles, el => _.get(el, ['invitedBy']) === staffAccountFor)
            if(staffAccountFor && staffAccountRole) {
              permissionRetailer = _.get(staffAccountRole, ['role', 'permissions'], []).filter(el => LIST_PERMISSIONS_OPTIONS.filter(o => o.isForRetailer).map(o => o.code).includes(el))
            }
        }

        if(permissionRetailer.length === 0) {
            permissionRetailer = [PERMISSIONS.ALL]
        }

        return permissionRetailer
    }, [user, userPermissions])

    const superAdminPermissions = useMemo(() => {
        let permissionSuperAdmin = []

        if(userPermissions.userRoles){
            const adminAccountRole = _.find(userPermissions.roles, el => el.isSuperAdminRole)
            if(adminAccountRole) {
                permissionSuperAdmin = _.get(adminAccountRole, ['role', 'permissions'], []).filter(el => LIST_PERMISSIONS_OPTIONS.filter(o => !o.isForRetailer).map(o => o.code).includes(el))
            }
        }

        if(_.get(user, ['role']) === USER_ROLE.ADMIN && permissionSuperAdmin.length === 0) {
            permissionSuperAdmin = [PERMISSIONS.ALL]
        }

        return permissionSuperAdmin
    }, [user, userPermissions])

    const requirePermissionOfStaff = useCallback((permission) => {
        return !isStaff || !_.isArray(retailerPermissions) || retailerPermissions.includes(PERMISSIONS.ALL) || retailerPermissions.includes(permission)
    }, [retailerPermissions, isStaff])

    const requirePermissionOfSuperAdmin = useCallback((permission) => {
        return  _.get(user, ['role']) === USER_ROLE.ADMIN && (!_.isArray(superAdminPermissions) || superAdminPermissions.includes(PERMISSIONS.ALL) || superAdminPermissions.includes(permission))
    }, [superAdminPermissions, user])

    return {
        isStaff,
        isHasStaffAccount,
        staffRoleOptions,
        userPermissions,
        staffOwnerId,
        requirePermissionOfStaff,
        requirePermissionOfSuperAdmin
    }
}

export default usePermissions