import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getCSRFToken } from "../api/axios";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password_confirm: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.password_confirm) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        try {
            setLoading(true);

            await getCSRFToken();

            await api.post(
                "accounts/register/",
                formData
            );

            setSuccess(
                "Registration successful. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(
                "Registration failed:",
                error
            );

            if (error.response?.data) {
                const data = error.response.data;

                if (typeof data === "object") {
                    const messages = Object.entries(data)
                        .flatMap(([field, errors]) => {
                            if (Array.isArray(errors)) {
                                return errors.map(
                                    (message) =>
                                        `${field}: ${message}`
                                );
                            }

                            return `${field}: ${errors}`;
                        });

                    setError(
                        messages.join(" ")
                    );
                } else {
                    setError(
                        "Registration failed."
                    );
                }
            } else {
                setError(
                    "Could not connect to the server."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-7 col-lg-6">

                    <div className="card shadow-sm">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-2">
                                Create Your BookSphere Account
                            </h2>

                            <p className="text-center text-muted mb-4">
                                Join the BookSphere community
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-control"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength="8"
                                        required
                                    />

                                    <small className="text-muted">
                                        Password must be at least 8 characters.
                                    </small>

                                </div>


                                <div className="mb-4">

                                    <label className="form-label">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password_confirm"
                                        className="form-control"
                                        value={formData.password_confirm}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </button>

                            </form>


                            <div className="text-center mt-4">

                                <span className="text-muted">
                                    Already have an account?
                                </span>{" "}

                                <Link to="/login">
                                    Login
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;