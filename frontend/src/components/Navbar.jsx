import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const csrfResponse = await api.get(
                "accounts/csrf/"
            );

            const csrfToken =
                csrfResponse.data.csrfToken;

            await api.post(
                "accounts/logout/",
                {},
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                }
            );

            navigate("/login");

        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">

                {/* Brand */}
                <Link
                    to="/dashboard"
                    className="navbar-brand fw-bold"
                >
                    BookSphere
                </Link>

                {/* Mobile menu button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation */}
                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link
                                to="/dashboard"
                                className="nav-link"
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/books"
                                className="nav-link"
                            >
                                Books
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/discussions"
                                className="nav-link"
                            >
                                Discussions
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/profile"
                                className="nav-link"
                            >
                                Profile
                            </Link>
                        </li>

                    </ul>

                    {/* Logout */}
                    <div className="d-flex">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="btn btn-outline-light w-100"
                        >
                            Logout
                        </button>
                    </div>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;