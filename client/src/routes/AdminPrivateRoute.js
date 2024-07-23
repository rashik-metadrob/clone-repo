import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { getStorageToken, getStorageUserDetail } from "../utils/storage";
import LayoutAdminTemplate from "../layouts/layoutAdminTemplate/LayoutAdminTemplate";
import routesConstant from "./routesConstant";

const AdminPrivateRoute = ({
    element
}) => {
    const token = getStorageToken();
    const [isAuth, setIsAuth] = useState(!!token || false);
    const currentUser = getStorageUserDetail();
    useEffect(() => {
        //    handle user
    }, []);

    return isAuth && currentUser && currentUser?.role === "admin" ? element : <Navigate to={routesConstant.adminLogin.path} />;
}

export default AdminPrivateRoute