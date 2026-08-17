import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function NewDiscussion() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const bookId = searchParams.get("book");

    const [book, setBook] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const getBook = async () => {
            if (!bookId) {
                setError(
                    "You must select a book before starting a discussion."
                );

                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `books/${bookId}/`
                );

                setBook(response.data);

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
    }, [bookId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");

        try {
            const response = await api.post(
                "discussions/",
                {
                    title,
                    content,
                    book: Number(bookId),
                }
            );

            navigate(
                `/discussions/${response.data.id}`
            );

        } catch (error) {
            console.error(
                "Could not create discussion:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
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
                } else if (data.book) {
                    setError(
                        `Book: ${data.book[0]}`
                    );
                } else {
                    setError(
                        "Could not create discussion."
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
                <p>Loading book...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container mt-5">

                <div className="alert alert-danger">
                    {error}
                </div>

                <Link
                    to="/books"
                    className="btn btn-secondary"
                >
                    Back to Books
                </Link>

            </div>
        );
    }

    return (
        <div className="container mt-5">

            <Link
                to={`/books/${book.id}`}
                className="btn btn-outline-secondary mb-4"
            >
                ← Back to Book
            </Link>

            <div className="row justify-content-center">

                <div className="col-md-8">

                    <div className="card shadow-sm">

                        <div className="card-body p-4">

                            <h2 className="mb-2">
                                Start a Discussion
                            </h2>

                            <p className="text-muted mb-4">
                                Start a discussion about:
                                <br />

                                <strong>
                                    {book.title}
                                </strong>

                                <br />

                                <small>
                                    by {book.author}
                                </small>
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

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
                                        placeholder="Enter discussion title"
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
                                        placeholder="Write your thoughts or question about this book..."
                                        required
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Creating..."
                                        : "Start Discussion"}
                                </button>

                                <Link
                                    to={`/books/${book.id}`}
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

export default NewDiscussion;