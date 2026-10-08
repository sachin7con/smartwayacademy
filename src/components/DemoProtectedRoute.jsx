import { Navigate } from "react-router-dom";

export default function DemoProtectedRoute({ children }){

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if(!token || role !== "demo"){
        return <Navigate to="/login"  />;
    }

    return children;
}