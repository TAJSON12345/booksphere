
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function DiscussionDetail() {
    const { id } = useParams();
const [user, setUser] = useState(null);
    const [discussion, setDiscussion] = useState(null);
    const [book, setBook] = useState(null);

    const [reply, setReply] = useState("");

    const [loading, setLoading] = useState(true);
    const [replying, setReplying] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getDiscussion = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `discussions/${id}/`
                );

                setDiscussion(response.data);
                const userResponse = await api.get(
    "accounts/me/"
);

setUser(userResponse.data);

                // Get the associated book
                if (response.data.book) {
                    const bookResponse = await api.get(
                        `books/${response.data.book}/`
                    );

                    setBook(bookResponse.data);
                } else {
                    setBook(null);
                }

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

    const handleReply = async (event) => {
        event.preventDefault();

        if (!reply.trim()) {
            return;
        }

        try {
            setReplying(true);
            setMessage("");
            setError("");

            const response = await api.post(
                `discussions/${id}/`,
                {
                    content: reply,
                }
            );

            setDiscussion((previous) => ({
                ...previous,
                replies: [
                    ...previous.replies,
                    response.data,
                ],
            }));

            setReply("");

            setMessage(
                "Reply posted successfully."
            );

        } catch (error) {
            console.error(
                "Could not post reply:",
                error
            );

            if (error.response?.data?.detail) {
                setError(
                    error.response.data.detail
                );
            } else {
                setError(
                    "Could not post reply."
                );
            }
        } finally {
            setReplying(false);
        }
    };
const handleDeleteDiscussion = async () => {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${discussion.title}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await api.delete(
            `discussions/${id}/`
        );

        alert(
            "Discussion deleted successfully."
        );

        if (book) {
            window.location.href =
                `/discussions?book=${book.id}`;
        } else {
            window.location.href =
                "/discussions";
        }

    } catch (error) {
        console.error(
            "Could not delete discussion:",
            error
        );

        setError(
            error.response?.data?.message ||
            "Could not delete this discussion."
        );
    }
};
    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading discussion...</p>
            </div>
        );
    }

    if (error && !discussion) {
        return (
            <div className="container mt-5">

                <div className="alert alert-danger">
                    {error}
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

            {/* Back button */}
            <Link
                to={
                    book
                        ? `/discussions?book=${book.id}`
                        : "/discussions"
                }
                className="btn btn-outline-secondary mb-4"
            >
                ← Back to Discussions
            </Link>


            {/* Discussion */}
            <div className="card shadow-sm mb-4">

                <div className="card-body p-4">

                    {/* Book information */}
                    {book && (
                        <div className="alert alert-primary mb-4">

                            <strong>
                                Book:
                            </strong>{" "}

                            {book.title}

                            <br />

                            <small className="text-muted">
                                Author: {book.author}
                            </small>

                        </div>
                    )}


                    {/* Discussion title */}
                    <h2>
                        {discussion.title}
                    </h2>


                    {/* Author */}
                    <p className="text-muted">
                        Posted by{" "}
                        <strong>
                            {discussion.user_name}
                        </strong>
                    </p>
{user?.role === "admin" && (
    <div className="mt-3">

        <Link
    to={`/discussions/${discussion.id}/edit`}
    className="btn btn-warning me-2"
>
    Edit Discussion
</Link>

        <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteDiscussion}
        >
            Delete Discussion
        </button>

    </div>
)}

                    <hr />


                    {/* Discussion content */}
                    <p className="mb-0">
                        {discussion.content}
                    </p>

                </div>

            </div>


            {/* Messages */}
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


            {/* Replies */}
            <div className="card shadow-sm mb-4">

                <div className="card-body p-4">

                    <h4 className="mb-4">
                        Replies
                    </h4>

                    {discussion.replies.length === 0 ? (

                        <p className="text-muted">
                            No replies yet. Be the first
                            to reply.
                        </p>

                    ) : (

                        discussion.replies.map((item) => (

                            <div
                                key={item.id}
                                className="border rounded p-3 mb-3"
                            >

                                <div className="d-flex justify-content-between">

                                    <strong>
                                        {item.user_name}
                                    </strong>

                                    <small className="text-muted">
                                        {new Date(
                                            item.created_at
                                        ).toLocaleString()}
                                    </small>

                                </div>

                                <p className="mb-0 mt-2">
                                    {item.content}
                                </p>

                            </div>

                        ))

                    )}

                </div>

            </div>


            {/* Reply form */}
            <div className="card shadow-sm">

                <div className="card-body p-4">

                    <h4 className="mb-3">
                        Add a Reply
                    </h4>

                    <form onSubmit={handleReply}>

                        <textarea
                            className="form-control mb-3"
                            rows="5"
                            value={reply}
                            onChange={(event) =>
                                setReply(
                                    event.target.value
                                )
                            }
                            placeholder="Write your reply..."
                            required
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={replying}
                        >
                            {replying
                                ? "Posting..."
                                : "Post Reply"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default DiscussionDetail;

