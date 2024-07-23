import { Navigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { getStorageToken, getStorageUserDetail } from "../utils/storage";
import LayoutAdminTemplate from "../layouts/layoutAdminTemplate/LayoutAdminTemplate";
import routesConstant from "./routesConstant";
import { isShopifyAdminLocation } from "../utils/util";
import { USER_ROLE } from "../utils/constants";

const AdminTemplateRoute = ({}) => {
    const token = getStorageToken();
    const location = useLocation()
    const [isAuth] = useState(!!token || false);
    const currentUser = getStorageUserDetail();

    return isAuth && currentUser && currentUser?.role === USER_ROLE.ADMIN ? <LayoutAdminTemplate /> : <Navigate to={isShopifyAdminLocation(location) ? routesConstant.shopifyAdminLogin.path : routesConstant.adminLogin.path} />;
}

export default AdminTemplateRoute