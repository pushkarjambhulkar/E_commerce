import React from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
const PrivateComponent=()=>{
    const auth=localStorage.getItem("user");

    return auth ? <Outlet/> :<Navigate to="Signup" />
}
export default PrivateComponent