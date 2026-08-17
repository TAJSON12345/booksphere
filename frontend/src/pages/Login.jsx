import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            // Get CSRF token first
            const csrfResponse = await api.get("accounts/csrf/");

            const csrfToken = csrfResponse.data.csrfToken;

            // Login
            const response = await api.post(
                "accounts/login/",
                {
                    username,
                    password,
                },
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                }
            );

            console.log("Login successful:", response.data);

            // Go to home page
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);

            if (error.response?.data) {
                const data = error.response.data;

                if (typeof data === "string") {
                    setError(data);
                } else if (data.non_field_errors) {
                    setError(data.non_field_errors[0]);
                } else {
                    setError("Invalid username or password.");
                }
            } else {
                setError("Could not connect to Django.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">
                                BookSphere
                            </h2>

                            <h4 className="text-center mb-4">
                                Login
                            </h4>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Logging in..."
                                        : "Login"}
                                </button>

                            </form>
                            <div className="text-center mt-4">
    <span className="text-muted">
        Don't have an account?
    </span>{" "}

    <Link to="/register">
        Sign Up
    </Link>
</div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;