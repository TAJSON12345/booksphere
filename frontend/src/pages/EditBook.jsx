
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [status, setStatus] = useState("suggested");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const getBook = async () => {
            try {
                const response = await api.get(`books/${id}/`);

                const book = response.data;

                setTitle(book.title || "");
                setAuthor(book.author || "");
                setDescription(book.description || "");
                setCoverImage(book.cover_image || "");
                setStatus(book.status || "suggested");

            } catch (error) {
                console.error(
                    "Could not load book:",
                    error
                );

                setError(
                    "Could not load book information."
                );
            } finally {
                setLoading(false);
            }
        };

        getBook();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");

        try {
            await api.put(`books/${id}/`, {
                title,
                author,
                description,
                cover_image: coverImage || null,
                status,
            });

            navigate(`/books/${id}`);

        } catch (error) {
            console.error(
                "Could not update book:",
                error
            );

            if (error.response?.data) {
                const data = error.response.data;

                if (typeof data === "string") {
                    setError(data);
                } else if (data.message) {
                    setError(data.message);
                } else if (data.detail) {
                    setError(data.detail);
                } else if (data.title) {
                    setError(`Title: ${data.title[0]}`);
                } else if (data.author) {
                    setError(`Author: ${data.author[0]}`);
                } else {
                    setError(
                        "Could not update this book."
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
            <div className="container mt-4 mt-md-5">
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="text-muted mb-0">
                        Loading book...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mt-md-5">

            {/* Back Button */}
            <div className="mb-4">

                <Link
                    to={`/books/${id}`}
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Book
                </Link>

            </div>


            {/* Edit Form */}
            <div className="row justify-content-center">

                <div className="col-12 col-md-8 col-lg-7">

                    <div className="card shadow-sm">

                        <div className="card-body p-3 p-md-4">

                            {/* Heading */}
                            <div className="mb-4">

                                <h2 className="mb-2">
                                    <i className="bi bi-pencil-square me-2 text-primary"></i>
                                    Edit Book
                                </h2>

                                <p className="text-muted mb-0">
                                    Update the book information
                                    and status.
                                </p>

                            </div>


                            {/* Error */}
                            {error && (
                                <div className="alert alert-danger">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}


                            <form onSubmit={handleSubmit}>

                                {/* Title */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Book Title
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


                                {/* Author */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Author
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={author}
                                        onChange={(event) =>
                                            setAuthor(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {/* Description */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Description
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* Cover Image */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Cover Image URL
                                    </label>

                                    <input
                                        type="url"
                                        className="form-control"
                                        value={coverImage}
                                        onChange={(event) =>
                                            setCoverImage(
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://example.com/book-cover.jpg"
                                    />

                                    <div className="form-text">
                                        Optional book cover URL.
                                    </div>

                                </div>


                                {/* Status */}
                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Book Status
                                    </label>

                                    <select
                                        className="form-select"
                                        value={status}
                                        onChange={(event) =>
                                            setStatus(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="suggested">
                                            Suggested
                                        </option>

                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                    </select>

                                </div>


                                {/* Buttons */}
                                <div className="d-flex flex-column flex-sm-row gap-2">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>

                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to={`/books/${id}`}
                                        className="btn btn-secondary"
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Cancel
                                    </Link>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EditBook;

