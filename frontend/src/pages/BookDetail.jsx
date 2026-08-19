import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [votes, setVotes] = useState(0);
    const [voting, setVoting] = useState(false);

    const [deleting, setDeleting] = useState(false);

    // Get current logged-in user
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        loadBook();
        loadVotes();
        loadCurrentUser();
    }, [id]);

    // -----------------------------
    // LOAD BOOK
    // -----------------------------
    const loadBook = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`books/${id}/`);

            setBook(response.data);
        } catch (error) {
            console.error("Could not load book:", error);

            if (error.response?.status === 404) {
                setError("Book not found.");
            } else {
                setError("Could not load this book.");
            }
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // LOAD VOTES
    // -----------------------------
    const loadVotes = async () => {
        try {
            const response = await api.get(`books/${id}/vote/`);

            setVotes(response.data.votes || 0);
        } catch (error) {
            console.error("Could not load votes:", error);
        }
    };

    // -----------------------------
    // LOAD CURRENT USER
    // -----------------------------
    const loadCurrentUser = async () => {
        try {
            const response = await api.get("accounts/me/");

            setCurrentUser(response.data);
        } catch (error) {
            console.error("Could not load current user:", error);
        }
    };

    // -----------------------------
    // VOTE
    // -----------------------------
    const handleVote = async () => {
        try {
            setVoting(true);
            setError("");

            const response = await api.post(
                `books/${id}/vote/`
            );

            setVotes(response.data.votes);

        } catch (error) {
            console.error("Could not vote:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Could not record your vote.");
            }
        } finally {
            setVoting(false);
        }
    };

    // -----------------------------
    // DELETE BOOK
    // -----------------------------
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await api.delete(`books/${id}/`);

            navigate("/books");

        } catch (error) {
            console.error("Could not delete book:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Could not delete this book.");
            }

            setDeleting(false);
        }
    };

    // -----------------------------
    // LOADING
    // -----------------------------
    if (loading) {
        return (
            <div className="container mt-5">
                <h2>
                    <i className="bi bi-book me-2"></i>
                    Book Details
                </h2>

                <p className="text-muted">
                    Loading book...
                </p>
            </div>
        );
    }

    // -----------------------------
    // ERROR / NOT FOUND
    // -----------------------------
    if (!book) {
        return (
            <div className="container mt-5">

                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error || "Book not found."}
                </div>

                <Link
                    to="/books"
                    className="btn btn-secondary"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Books
                </Link>

            </div>
        );
    }

    const isAdmin =
        currentUser?.role === "admin";

    return (
        <div className="container mt-4 mt-md-5">

            {/* -------------------------------- */}
            {/* PAGE HEADER */}
            {/* -------------------------------- */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <div>
                    <h2>
                        <i className="bi bi-book me-2"></i>
                        Book Details
                    </h2>

                    <p className="text-muted mb-0">
                        View information and interact with this book.
                    </p>
                </div>

                <Link
                    to="/books"
                    className="btn btn-secondary"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Books
                </Link>

            </div>


            {/* -------------------------------- */}
            {/* ERROR */}
            {/* -------------------------------- */}

            {error && (
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}


            {/* -------------------------------- */}
            {/* BOOK CARD */}
            {/* -------------------------------- */}

            <div className="card shadow-sm">

                <div className="card-body p-4">

                    <div className="row">

                        {/* BOOK COVER */}
                        <div className="col-12 col-md-4 mb-4 mb-md-0">

                            {book.cover_image ? (

                                <img
                                    src={book.cover_image}
                                    alt={book.title}
                                    className="img-fluid rounded shadow-sm"
                                    style={{
                                        width: "100%",
                                        maxHeight: "450px",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div
                                    className="bg-light rounded d-flex align-items-center justify-content-center"
                                    style={{
                                        height: "350px"
                                    }}
                                >

                                    <i
                                        className="bi bi-book text-primary"
                                        style={{
                                            fontSize: "100px"
                                        }}
                                    ></i>

                                </div>

                            )}

                        </div>


                        {/* BOOK INFORMATION */}
                        <div className="col-12 col-md-8">

                            <h1 className="mb-2">
                                {book.title}
                            </h1>

                            <h5 className="text-muted mb-4">
                                <i className="bi bi-person me-2"></i>
                                {book.author}
                            </h5>


                            {/* STATUS */}

                            <div className="mb-3">

                                <strong>
                                    <i className="bi bi-bookmark-check me-2"></i>
                                    Status:
                                </strong>

                                <span className="badge bg-primary ms-2">
                                    {book.status}
                                </span>

                            </div>


                            {/* SUGGESTED BY */}

                            <div className="mb-3">

                                <strong>
                                    <i className="bi bi-person-circle me-2"></i>
                                    Suggested By:
                                </strong>

                                <span className="ms-2">
                                    {book.suggested_by_name ||
                                        "Unknown"}
                                </span>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="mb-4">

                                <h5>
                                    Description
                                </h5>

                                <p className="text-muted">
                                    {book.description ||
                                        "No description provided."}
                                </p>

                            </div>


                            {/* VOTES */}

                            <div className="card bg-light mb-4">

                                <div className="card-body">

                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">

                                        <div>

                                            <h5 className="mb-1">
                                                <i className="bi bi-hand-thumbs-up me-2"></i>
                                                Community Votes
                                            </h5>

                                            <p className="mb-0 text-muted">
                                                {votes}{" "}
                                                {votes === 1
                                                    ? "vote"
                                                    : "votes"}
                                            </p>

                                        </div>

                                        {book.status ===
                                            "suggested" && (

                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleVote}
                                                disabled={voting}
                                            >

                                                <i className="bi bi-hand-thumbs-up me-2"></i>

                                                {voting
                                                    ? "Voting..."
                                                    : "Vote for this Book"}

                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* ACTIONS */}
                            

                            <div className="d-flex flex-column flex-sm-row flex-wrap gap-2">

                                <Link
                                    to={`/discussions?book=${book.id}`}
                                    className="btn btn-outline-secondary"
                                >
                                    <i className="bi bi-chat-dots me-2"></i>
                                    Discussions
                                </Link>


                                {isAdmin && (
                                    <>
                                        <Link
                                            to={`/books/${book.id}/edit`}
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="bi bi-pencil me-2"></i>
                                            Edit Book
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={handleDelete}
                                            disabled={deleting}
                                        >
                                            <i className="bi bi-trash me-2"></i>

                                            {deleting
                                                ? "Deleting..."
                                                : "Delete Book"}
                                        </button>
                                    </>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* -------------------------------- */}
            {/* ADMIN APPROVAL */}
            {/* -------------------------------- */}

            {isAdmin &&
                book.status === "suggested" && (

                    <div className="card shadow-sm mt-4">

                        <div className="card-body">

                            <h5>
                                <i className="bi bi-shield-check me-2"></i>
                                Administrator Actions
                            </h5>

                            <p className="text-muted">
                                This book is currently waiting for
                                administrator approval.
                            </p>

                            <Link
                                to="/admin/books"
                                className="btn btn-success"
                            >
                                <i className="bi bi-check-circle me-2"></i>
                                Go to Book Approvals
                            </Link>

                        </div>

                    </div>
                )}

        </div>
    );
}

export default BookDetail;