import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [voting, setVoting] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        loadBooks();
        loadCurrentUser();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);

            const response = await api.get("books/");

            setBooks(response.data);
        } catch (error) {
            console.error("Could not load books:", error);

            setError("Could not load books.");
        } finally {
            setLoading(false);
        }
    };

    const loadCurrentUser = async () => {
        try {
            const response = await api.get("accounts/me/");

            setCurrentUser(response.data);
        } catch (error) {
            console.error(
                "Could not load current user:",
                error
            );
        }
    };

    const handleVote = async (bookId) => {
        try {
            setVoting(bookId);
            setMessage("");
            setError("");

            const response = await api.post(
                `books/${bookId}/vote/`
            );

            setMessage(
                `${response.data.message} Votes: ${response.data.votes}`
            );
        } catch (error) {
            console.error("Could not vote:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Could not record your vote.");
            }
        } finally {
            setVoting(null);
        }
    };

    const handleDelete = async (bookId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(bookId);
            setMessage("");
            setError("");

            const response = await api.delete(
                `books/${bookId}/`
            );

            setMessage(response.data.message);

            setBooks((previousBooks) =>
                previousBooks.filter(
                    (book) => book.id !== bookId
                )
            );
        } catch (error) {
            console.error(
                "Could not delete book:",
                error
            );

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Could not delete this book.");
            }
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 mt-md-5">
                <h2>
                    <i className="bi bi-book me-2"></i>
                    Books
                </h2>

                <p className="text-muted">
                    Loading books...
                </p>
            </div>
        );
    }

    return (
        <div className="container mt-4 mt-md-5">

            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-4 gap-3">

                <div>
                    <h2 className="mb-1">
                        <i className="bi bi-book me-2"></i>
                        Books
                    </h2>

                    <p className="text-muted mb-0">
                        Browse books and join the BookSphere community.
                    </p>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2">

                    <Link
                        to="/books/new"
                        className="btn btn-primary"
                    >
                        <i className="bi bi-plus-circle me-1"></i>
                        Suggest a Book
                    </Link>

                    {currentUser?.role === "admin" && (
                        <Link
                            to="/admin/books"
                            className="btn btn-warning"
                        >
                            <i className="bi bi-check-circle me-1"></i>
                            Approve Books
                        </Link>
                    )}

                    <Link
                        to="/dashboard"
                        className="btn btn-secondary"
                    >
                        <i className="bi bi-speedometer2 me-1"></i>
                        Dashboard
                    </Link>

                </div>

            </div>

            {/* Success Message */}
            {message && (
                <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    {message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {/* No Books */}
            {books.length === 0 ? (

                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    No books have been added yet.
                </div>

            ) : (

                <div className="row g-4">

                    {books.map((book) => (

                        <div
                            className="col-12 col-md-6"
                            key={book.id}
                        >

                            <div className="card shadow-sm h-100">

                                <div className="card-body d-flex flex-column">

                                    {/* Title */}
                                    <h4 className="card-title">
                                        <i className="bi bi-bookmark me-2 text-primary"></i>
                                        {book.title}
                                    </h4>

                                    {/* Author */}
                                    <h6 className="text-muted mb-3">
                                        <i className="bi bi-person me-1"></i>
                                        {book.author}
                                    </h6>

                                    {/* Description */}
                                    <p className="card-text">
                                        {book.description ||
                                            "No description provided."}
                                    </p>

                                    {/* Status */}
                                    <p className="mb-2">

                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        <span
                                            className={
                                                book.status === "active"
                                                    ? "badge bg-success"
                                                    : book.status === "suggested"
                                                    ? "badge bg-warning text-dark"
                                                    : "badge bg-secondary"
                                            }
                                        >
                                            {book.status}
                                        </span>

                                    </p>

                                    {/* Suggested By */}
                                    <small className="text-muted mb-3">

                                        <i className="bi bi-person-circle me-1"></i>

                                        Suggested by{" "}

                                        {book.suggested_by_name ||
                                            "Unknown"}

                                    </small>

                                    {/* Buttons */}
                                    <div className="mt-auto">

                                        <div className="d-grid gap-2">

                                            {/* VIEW */}
                                            <Link
                                                to={`/books/${book.id}`}
                                                className="btn btn-outline-primary"
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                View Book
                                            </Link>

                                            {/* VOTE */}
                                            {book.status === "suggested" && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success"
                                                    onClick={() =>
                                                        handleVote(book.id)
                                                    }
                                                    disabled={
                                                        voting === book.id
                                                    }
                                                >
                                                    <i className="bi bi-hand-thumbs-up me-1"></i>

                                                    {voting === book.id
                                                        ? "Voting..."
                                                        : "Vote for this Book"}
                                                </button>
                                            )}

                                            {/* DISCUSSIONS */}
                                            <Link
                                                to={`/discussions?book=${book.id}`}
                                                className="btn btn-outline-secondary"
                                            >
                                                <i className="bi bi-chat-dots me-1"></i>
                                                Discussions
                                            </Link>

                                            {/* ADMIN CONTROLS */}
                                            {currentUser?.role === "admin" && (
                                                <div className="d-flex gap-2">

                                                    <Link
                                                        to={`/books/${book.id}/edit`}
                                                        className="btn btn-outline-warning flex-fill"
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger flex-fill"
                                                        onClick={() =>
                                                            handleDelete(
                                                                book.id
                                                            )
                                                        }
                                                        disabled={
                                                            deleting === book.id
                                                        }
                                                    >
                                                        <i className="bi bi-trash me-1"></i>

                                                        {deleting === book.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Books;