
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getCSRFToken } from "../api/axios";

function NewBook() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            // Get CSRF token before making the POST request
            await getCSRFToken();

            const response = await api.post("books/", {
                title,
                author,
                description,
                cover_image: coverImage || null,
            });

            console.log("Book suggested:", response.data);

            navigate(`/books/${response.data.id}`);

        } catch (error) {
            console.error(
                "Could not suggest book:",
                error
            );

            if (error.response?.data) {
                const data = error.response.data;

                if (typeof data === "string") {
                    setError(data);
                } else if (data.detail) {
                    setError(data.detail);
                } else if (data.title) {
                    setError(`Title: ${data.title[0]}`);
                } else if (data.author) {
                    setError(`Author: ${data.author[0]}`);
                } else if (data.description) {
                    setError(`Description: ${data.description[0]}`);
                } else {
                    setError(
                        "Could not suggest this book."
                    );
                }

            } else {
                setError(
                    "Could not connect to Django."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 mt-md-5">

            {/* Back Button */}
            <div className="mb-4">

                <Link
                    to="/books"
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Books
                </Link>

            </div>


            {/* Form */}
            <div className="row justify-content-center">

                <div className="col-12 col-md-8 col-lg-7">

                    <div className="card shadow-sm">

                        <div className="card-body p-3 p-md-4">

                            {/* Heading */}
                            <div className="mb-4">

                                <h2 className="mb-2">
                                    <i className="bi bi-plus-circle me-2 text-primary"></i>
                                    Suggest a Book
                                </h2>

                                <p className="text-muted mb-0">
                                    Suggest a book for the
                                    BookSphere community to discuss.
                                </p>

                            </div>


                            {/* Error */}
                            {error && (
                                <div className="alert alert-danger">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}


                            {/* Form */}
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
                                        placeholder="Enter book title"
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
                                        placeholder="Enter author name"
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
                                        placeholder="Briefly describe the book..."
                                    />

                                </div>


                                {/* Cover Image */}
                                <div className="mb-4">

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
                                        <i className="bi bi-info-circle me-1"></i>
                                        Optional. This is only a link to
                                        the book cover, not the book itself.
                                    </div>

                                </div>


                                {/* Buttons */}
                                <div className="d-flex flex-column flex-sm-row gap-2">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send me-2"></i>
                                                Suggest Book
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to="/books"
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

export default NewBook;

