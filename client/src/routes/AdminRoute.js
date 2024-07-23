import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { getStorageToken, getStorageUserDetail } from "../utils/storage";
import LayoutAdmin from "../layouts/layoutAdmin/LayoutAdmin";
import routesConstant from "./routesConstant";
import { USER_ROLE } from "../utils/constants";

const AdminRoute = ({}) => {
    const token = getStorageToken();
    const [isAuth, setIsAuth] = useState(!!token || false);
    const currentUser = getStorageUserDetail();

    return isAuth && currentUser && currentUser?.role === USER_ROLE.ADMIN ? <LayoutAdmin /> : <Navigate to={routesConstant.adminLogin.path} />;
}

export default AdminRoute