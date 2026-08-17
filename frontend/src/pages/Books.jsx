import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getBooks = async () => {
            try {
                const response = await api.get("books/");

                setBooks(response.data);

            } catch (error) {
                console.error(
                    "Could not load books:",
                    error
                );

                setError("Could not load books.");

            } finally {
                setLoading(false);
            }
        };

        getBooks();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4 mt-md-5">
                <h2>
                    <i className="bi bi-book me-2"></i>
                    Books
                </h2>

                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4 mt-md-5">

            {/* Page Header */}
            <div className="mb-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                    <div>
                        <h2 className="mb-1">
                            <i className="bi bi-book me-2"></i>
                            Books
                        </h2>

                        <p className="text-muted mb-0">
                            Browse books available in the
                            BookSphere community.
                        </p>
                    </div>

                    {/* Header Buttons */}
                    <div className="d-flex flex-column flex-sm-row gap-2">

                        <Link
                            to="/books/new"
                            className="btn btn-primary"
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Suggest a Book
                        </Link>

                        <Link
                            to="/dashboard"
                            className="btn btn-secondary"
                        >
                            <i className="bi bi-speedometer2 me-2"></i>
                            Dashboard
                        </Link>

                    </div>

                </div>

            </div>


            {/* Error */}
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

                /* Books */
                <div className="row g-3 g-md-4">

                    {books.map((book) => (

                        <div
                            className="col-12 col-md-6"
                            key={book.id}
                        >

                            <div className="card shadow-sm h-100">

                                <div className="card-body d-flex flex-column">

                                    {/* Book Icon */}
                                    <div className="mb-3">
                                        <i className="bi bi-book-half fs-1 text-primary"></i>
                                    </div>


                                    {/* Title */}
                                    <h4 className="card-title">
                                        {book.title}
                                    </h4>


                                    {/* Author */}
                                    <h6 className="text-muted">
                                        <i className="bi bi-person me-1"></i>
                                        {book.author}
                                    </h6>


                                    {/* Description */}
                                    <p className="card-text mt-3">
                                        {book.description ||
                                            "No description provided."}
                                    </p>


                                    {/* Status */}
                                    <p className="mb-2">

                                        <strong>
                                            <i className="bi bi-bookmark-check me-1"></i>
                                            Status:
                                        </strong>{" "}

                                        <span className="badge bg-primary">
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
                                    <div className="mt-auto pt-2">

                                        <div className="d-flex flex-column flex-sm-row gap-2">

                                            <Link
                                                to={`/books/${book.id}`}
                                                className="btn btn-outline-primary"
                                            >
                                                <i className="bi bi-eye me-2"></i>
                                                View Book
                                            </Link>

                                            <Link
                                                to={`/discussions?book=${book.id}`}
                                                className="btn btn-outline-secondary"
                                            >
                                                <i className="bi bi-chat-left-text me-2"></i>
                                                Discussions
                                            </Link>

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