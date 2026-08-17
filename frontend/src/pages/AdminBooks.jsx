
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getSuggestedBooks = async () => {
            try {
                const response = await api.get("books/");

                const suggestedBooks = response.data.filter(
                    (book) => book.status === "suggested"
                );

                setBooks(suggestedBooks);

            } catch (error) {
                console.error(
                    "Could not load suggested books:",
                    error
                );

                setError(
                    "Could not load suggested books."
                );

            } finally {
                setLoading(false);
            }
        };

        getSuggestedBooks();
    }, []);

    const handleApprove = async (bookId) => {
        try {
            setApproving(bookId);
            setMessage("");
            setError("");

            const response = await api.post(
                `books/${bookId}/approve/`
            );

            setMessage(response.data.message);

            // Remove the approved book from the pending list
            setBooks((previousBooks) =>
                previousBooks.filter(
                    (book) => book.id !== bookId
                )
            );

        } catch (error) {
            console.error(
                "Could not approve book:",
                error
            );

            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else if (error.response?.data?.detail) {
                setError(
                    error.response.data.detail
                );
            } else {
                setError(
                    "Could not approve this book."
                );
            }

        } finally {
            setApproving(null);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h2>Book Approvals</h2>
                <p>Loading suggested books...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2>Book Approvals</h2>

                    <p className="text-muted mb-0">
                        Review and approve books suggested
                        by BookSphere members.
                    </p>
                </div>

                <Link
                    to="/books"
                    className="btn btn-secondary"
                >
                    Back to Books
                </Link>

            </div>

            {/* Success message */}
            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* No pending books */}
            {books.length === 0 ? (

                <div className="card shadow-sm">

                    <div className="card-body text-center py-5">

                        <h4>
                            No Pending Book Suggestions
                        </h4>

                        <p className="text-muted mb-0">
                            There are currently no suggested
                            books waiting for approval.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="row g-4">

                    {books.map((book) => (

                        <div
                            className="col-md-6"
                            key={book.id}
                        >

                            <div className="card shadow-sm h-100">

                                <div className="card-body d-flex flex-column">

                                    <h4 className="card-title">
                                        {book.title}
                                    </h4>

                                    <h6 className="text-muted">
                                        {book.author}
                                    </h6>

                                    <p className="card-text mt-3">
                                        {book.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="mb-3">

                                        <p className="mb-1">
                                            <strong>
                                                Suggested by:
                                            </strong>{" "}
                                            {book.suggested_by_name ||
                                                "Unknown"}
                                        </p>

                                        <p className="mb-0">
                                            <strong>
                                                Status:
                                            </strong>{" "}

                                            <span className="badge bg-warning text-dark">
                                                {book.status}
                                            </span>
                                        </p>

                                    </div>

                                    <div className="mt-auto pt-3">

                                        <Link
                                            to={`/books/${book.id}`}
                                            className="btn btn-outline-primary me-2"
                                        >
                                            View Book
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() =>
                                                handleApprove(book.id)
                                            }
                                            disabled={
                                                approving === book.id
                                            }
                                        >
                                            {approving === book.id
                                                ? "Approving..."
                                                : "Approve Book"}
                                        </button>

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

export default AdminBooks;

