import { Navigate } from "react-router-dom"
import { useState } from "react";
import { getStorageToken, getStorageUserDetail } from "../utils/storage";
import routesConstant from "./routesConstant";
import { USER_ROLE } from "../utils/constants";
import LayoutShopifyAdmin from "../layouts/layoutShopifyAdmin/LayoutShopifyAdmin";

const ShopifyAdminRoute = ({}) => {
    const token = getStorageToken();
    const [isAuth] = useState(!!token || false);
    const currentUser = getStorageUserDetail();

    return isAuth && currentUser && currentUser?.role === USER_ROLE.ADMIN ? <LayoutShopifyAdmin /> : <Navigate to={routesConstant.shopifyAdminLogin.path} />;
}

export default ShopifyAdminRoute