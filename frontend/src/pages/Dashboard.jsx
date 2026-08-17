import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await api.get(
                    "accounts/me/"
                );

                setUser(response.data);

            } catch (error) {
                console.error(
                    "Could not get current user:",
                    error
                );

            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4 mt-md-5">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-4 mt-md-5">
                <div className="alert alert-danger">
                    Could not load your account information.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mt-md-5">

            {/* Welcome */}
            <div className="mb-4">
                <h1 className="h2">
                    BookSphere Dashboard
                </h1>

                <p className="text-muted">
                    Welcome back,{" "}
                    <strong>
                        {user.first_name || user.username}
                    </strong>
                    !
                </p>
            </div>


            {/* Quick Actions */}
            <div className="row g-3 g-md-4 mb-4">

                {/* Discussions */}
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">

                            <div className="mb-3">
                                <i className="bi bi-chat-left-text fs-1 text-primary"></i>
                            </div>

                            <h5 className="card-title">
                                Discussions
                            </h5>

                            <p className="card-text">
                                Browse discussions and
                                participate in conversations
                                with other users.
                            </p>

                            <div className="mt-auto pt-2">
                                <Link
                                    to="/discussions"
                                    className="btn btn-primary w-100"
                                >
                                    <i className="bi bi-chat-dots me-2"></i>
                                    View Discussions
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>


                {/* Books */}
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">

                            <div className="mb-3">
                                <i className="bi bi-book fs-1 text-primary"></i>
                            </div>

                            <h5 className="card-title">
                                Books
                            </h5>

                            <p className="card-text">
                                Browse books available for
                                discussion in the BookSphere
                                community.
                            </p>

                            <div className="mt-auto pt-2">
                                <Link
                                    to="/books"
                                    className="btn btn-primary w-100"
                                >
                                    <i className="bi bi-book me-2"></i>
                                    View Books
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>


                {/* Profile */}
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">

                            <div className="mb-3">
                                <i className="bi bi-person-circle fs-1 text-secondary"></i>
                            </div>

                            <h5 className="card-title">
                                My Profile
                            </h5>

                            <p className="card-text">
                                View and update your BookSphere
                                account information.
                            </p>

                            <div className="mt-auto pt-2">
                                <Link
                                    to="/profile"
                                    className="btn btn-secondary w-100"
                                >
                                    <i className="bi bi-person me-2"></i>
                                    View Profile
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div>


            {/* Account Information */}
            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h5 className="card-title mb-4">
                        <i className="bi bi-person-vcard me-2"></i>
                        Account Information
                    </h5>

                    <div className="row">

                        {/* Left column */}
                        <div className="col-12 col-md-6">

                            <p className="mb-3">
                                <strong>
                                    <i className="bi bi-person me-2"></i>
                                    Username:
                                </strong>{" "}
                                {user.username}
                            </p>

                            <p className="mb-3">
                                <strong>
                                    <i className="bi bi-envelope me-2"></i>
                                    Email:
                                </strong>{" "}
                                {user.email}
                            </p>

                        </div>


                        {/* Right column */}
                        <div className="col-12 col-md-6">

                            <p className="mb-3">
                                <strong>
                                    <i className="bi bi-shield-check me-2"></i>
                                    Role:
                                </strong>{" "}
                                {user.role}
                            </p>

                            <p className="mb-0">
                                <strong>
                                    <i className="bi bi-circle-fill me-2"></i>
                                    Status:
                                </strong>{" "}

                                <span className="badge bg-success">
                                    {user.status}
                                </span>
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;