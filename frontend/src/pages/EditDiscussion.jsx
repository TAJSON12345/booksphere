import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditDiscussion() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [discussion, setDiscussion] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getDiscussion = async () => {
            try {
                const response = await api.get(
                    `discussions/${id}/`
                );

                setDiscussion(response.data);
                setTitle(response.data.title || "");
                setContent(response.data.content || "");

            } catch (error) {
                console.error(
                    "Could not load discussion:",
                    error
                );

                setError(
                    "Could not load discussion."
                );
            } finally {
                setLoading(false);
            }
        };

        getDiscussion();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setMessage("");

        try {
            const response = await api.patch(
                `discussions/${id}/`,
                {
                    title,
                    content,
                }
            );

            setMessage(
                "Discussion updated successfully."
            );

            setDiscussion(response.data);

            setTimeout(() => {
                navigate(`/discussions/${id}`);
            }, 1000);

        } catch (error) {
            console.error(
                "Could not update discussion:",
                error
            );

            if (error.response?.data) {
                const data = error.response.data;

                if (data.message) {
                    setError(data.message);
                } else if (data.title) {
                    setError(
                        `Title: ${data.title[0]}`
                    );
                } else if (data.content) {
                    setError(
                        `Content: ${data.content[0]}`
                    );
                } else {
                    setError(
                        "Could not update discussion."
                    );
                }
            } else {
                setError(
                    "Could not connect to Django."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading discussion...</p>
            </div>
        );
    }

    if (!discussion) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    {error ||
                        "Discussion could not be found."}
                </div>

                <Link
                    to="/discussions"
                    className="btn btn-secondary"
                >
                    Back to Discussions
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            <Link
                to={`/discussions/${id}`}
                className="btn btn-outline-secondary mb-4"
            >
                ← Back to Discussion
            </Link>

            <div className="row justify-content-center">

                <div className="col-md-8">

                    <div className="card shadow-sm">

                        <div className="card-body p-4">

                            <h2 className="mb-4">
                                Edit Discussion
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

                            <form
                                onSubmit={handleSubmit}
                            >

                                <div className="mb-3">

                                    <label className="form-label">
                                        Discussion Title
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="mb-4">

                                    <label className="form-label">
                                        Discussion Content
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="7"
                                        value={content}
                                        onChange={(event) =>
                                            setContent(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <Link
                                    to={`/discussions/${id}`}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </Link>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EditDiscussion;