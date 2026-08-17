import { useEffect, useState } from "react";
import api, { getCSRFToken } from "../api/axios";

function Profile() {
    const [user, setUser] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await api.get("accounts/me/");

                setUser(response.data);

                setFirstName(response.data.first_name || "");
                setLastName(response.data.last_name || "");
                setEmail(response.data.email || "");
            } catch (error) {
                console.error("Could not load profile:", error);

                setError("Could not load your profile.");
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
           await getCSRFToken();

const response = await api.patch("accounts/me/", {
                first_name: firstName,
                last_name: lastName,
                email: email,
            });

            setUser(response.data.user);

            setMessage("Profile updated successfully.");
        } catch (error) {
            console.error("Could not update profile:", error);

            if (error.response?.data) {
                setError(
                    error.response.data.message ||
                    JSON.stringify(error.response.data)
                );
            } else {
                setError("Could not update your profile.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    Could not load your profile.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-8">

                    <h2 className="mb-4">
                        My Profile
                    </h2>

                    {message && (
                        <div className="alert alert-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.username}
                                        disabled
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={firstName}
                                        onChange={(event) =>
                                            setFirstName(event.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={lastName}
                                        onChange={(event) =>
                                            setLastName(event.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Role
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.role}
                                        disabled
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Status
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.status}
                                        disabled
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;