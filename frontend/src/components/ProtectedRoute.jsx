import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await api.get("accounts/me/");

                console.log("AUTH CHECK:", response.data);

                setAuthenticated(true);
            } catch (error) {
                console.log("AUTH CHECK FAILED:", error.response?.status);

                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;