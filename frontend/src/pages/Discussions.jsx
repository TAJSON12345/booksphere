
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function Discussions() {
    const [discussions, setDiscussions] = useState([]);
    const [book, setBook] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("book");

    useEffect(() => {
        const getDiscussions = async () => {
            try {
                setLoading(true);
                setError("");

                // Get discussions
                const discussionResponse = await api.get(
                    bookId
                        ? `discussions/?book=${bookId}`
                        : "discussions/"
                );

                setDiscussions(discussionResponse.data);

                // If a book was selected, get its information
                if (bookId) {
                    const bookResponse = await api.get(
                        `books/${bookId}/`
                    );

                    setBook(bookResponse.data);
                } else {
                    setBook(null);
                }

            } catch (error) {
                console.error(
                    "Could not load discussions:",
                    error
                );

                setError(
                    "Could not load discussions."
                );
            } finally {
                setLoading(false);
            }
        };

        getDiscussions();
    }, [bookId]);

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
                        Loading discussions...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mt-md-5">

            {/* Page Header */}
            <div className="mb-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">

                    <div>

                        <h2 className="mb-1">
                            <i className="bi bi-chat-square-text me-2 text-primary"></i>
                            Discussions
                        </h2>

                        {book ? (
                            <p className="text-muted mb-0">
                                Discussions about{" "}
                                <strong>
                                    {book.title}
                                </strong>
                            </p>
                        ) : (
                            <p className="text-muted mb-0">
                                Share ideas and join the conversation.
                            </p>
                        )}

                    </div>

                    {bookId && (
                        <Link
                            to={`/discussions/new?book=${bookId}`}
                            className="btn btn-primary w-100 w-md-auto"
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Start Discussion
                        </Link>
                    )}

                </div>

            </div>


            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}


            {/* No Discussions */}
            {discussions.length === 0 ? (

                <div className="card shadow-sm">

                    <div className="card-body text-center py-5 px-3">

                        <div className="mb-3">
                            <i
                                className="bi bi-chat-square-dots text-primary"
                                style={{ fontSize: "3rem" }}
                            ></i>
                        </div>

                        <h4>
                            No discussions yet
                        </h4>

                        <p className="text-muted">
                            Be the first person to start
                            a discussion.
                        </p>

                        <Link
                            to={
                                bookId
                                    ? `/discussions/new?book=${bookId}`
                                    : "/discussions/new"
                            }
                            className="btn btn-primary"
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Start Discussion
                        </Link>

                    </div>

                </div>

            ) : (

                <div className="row g-3 g-md-4">

                    {discussions.map((discussion) => (

                        <div
                            className="col-12 col-md-6"
                            key={discussion.id}
                        >

                            <div className="card shadow-sm h-100">

                                <div className="card-body d-flex flex-column p-3 p-md-4">

                                    {/* Discussion Icon */}
                                    <div className="mb-3">

                                        <span className="badge bg-light text-primary border">
                                            <i className="bi bi-chat-left-text me-1"></i>
                                            Discussion
                                        </span>

                                    </div>


                                    {/* Discussion Title */}
                                    <h4 className="card-title">
                                        {discussion.title}
                                    </h4>


                                    {/* Discussion Content */}
                                    <p className="card-text text-muted">
                                        {discussion.content}
                                    </p>


                                    {/* Author */}
                                    <div className="mt-auto">

                                        <hr />

                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">

                                            <small className="text-muted">

                                                <i className="bi bi-person me-1"></i>

                                                Posted by{" "}

                                                <strong>
                                                    {discussion.user_name}
                                                </strong>

                                            </small>

                                            <Link
                                                to={`/discussions/${discussion.id}`}
                                                className="btn btn-outline-primary btn-sm w-100 w-sm-auto"
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                View Discussion
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

export default Discussions;

