import React, { useState, useEffect} from "react";
import { Card, Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { useParams } from "react-router";
import "./MovieStyles.css";

export const renderStars = (score) => {
    const totalStars = 10;
    let stars = [];

    for (let i = 0; i < totalStars; i++) {
        if (i < score) {
            stars.push("★"); // Pełna gwiazdka
        } else {
            stars.push("☆"); // Pusta gwiazdka
        }
    }

    return stars.join(" ");
};

export const MovieContent = () => {
    const [reviews, setReviews] = useState([]);
    const [movieInfo, setMovieInfo] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(6);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(6);

    let params = useParams();
    const movieId = parseInt(params.id)

    const fetchMoviesInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie_info`);
            if (!response.ok) throw new Error("Network response failed");

            const data = await response.json();
            const movie = data.find(s => s.MOVIE_ID == params.id);
            setMovieInfo(movie);
        } catch (error) {
            console.error("Error fetching series info:", error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie_reviews`);
            if (!response.ok) throw new Error("Network response failed");

            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Failed to delete review");

            // Refresh reviews after deletion
            fetchReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleEditReview = (review) => {
        setEditingReviewId(review.REVIEW_ID);
        setEditContent(review.CONTENT);
        setEditRating(review.SCORE);
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditContent("");
        setEditRating(6);
    };

    const handleUpdateReview = async (reviewId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score: editRating,
                    content: editContent,
                }),
            });

            if (!response.ok) throw new Error("Failed to update review");

            setEditingReviewId(null);
            fetchReviews();
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    useEffect(() => {
        fetchMoviesInfo();
        fetchReviews();
    }, []);

    const movieReviews = Array.isArray(reviews)
        ? reviews.filter(rev => rev.MOVIE_ID == params.id)
        : [];

    const handleFormSubmit = async (e) => {
        fetchReviews();

        const sendToDatabase=  await fetch("http://localhost:8080/api/reviews/addm", {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: rating,
                author: 'Anonymus' ,
                movieId: movieId,
                content:reviewContent,
            })
        }).catch(e=>console.log(e))
        console.log(sendToDatabase);
    }

    const calculateAverageRating = () => {
        if (!movieReviews.length) return 0;
        const sum = movieReviews.reduce((acc, review) => acc + review.SCORE, 0);
        return (sum / movieReviews.length).toFixed(1);
    };

    return (
        <div className="movie-content-wrapper">
            <Container className="py-5">
                {movieInfo ? (
                    <div className="movie-header">
                        <Row>
                            <Col md={4} className="poster-col">
                                <div className="movie-poster">
                                    <img src={movieInfo.URL} alt={movieInfo.TITLE} />
                                    <div className="movie-rating">
                                        <div className="rating-circle">
                                            <span className="rating-value">{calculateAverageRating()}</span>
                                            <span className="rating-max">/10</span>
                                        </div>
                                        <div className="reviews-count">{movieReviews.length} reviews</div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="movie-details">
                                    <h1 className="movie-title">{movieInfo.TITLE}</h1>
                                    <div className="movie-metadata">
                                        <span className="movie-genre">{movieInfo.GENRE}</span>
                                        <span className="movie-duration">{movieInfo.DURATION} min</span>
                                    </div>
                                    <div className="movie-director">
                                        <strong>Reżyser:</strong> {movieInfo.DIRECTOR}
                                    </div>
                                    <div className="movie-cast">
                                        <strong>Główni Aktorzy:</strong> {movieInfo.ACTORS}
                                    </div>
                                    <div className="movie-description">
                                        <h3>Opis</h3>
                                        <p>{movieInfo.DESCRIPTION}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Ładowanie danych filmu...</p>
                    </div>
                )}

                <div className="reviews-section">
                    <h2 className="section-title">Opinie widzów</h2>
                    {submitSuccess && (
                        <div className="alert alert-success fade-out">
                            Recenzja została dodana pomyślnie!
                        </div>
                    )}

                    {submitError && (
                        <div className="alert alert-danger">
                            {submitError}
                        </div>
                    )}

                    <div className="add-review-card">
                        <h3 className="add-review-title">Dodaj swoją recenzję</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group rating-group">
                                <label className="rating-label">Twoja ocena:</label>
                                <div className="rating-select-container">
                                    <Form.Select
                                        className="rating-select"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </Form.Select>
                                    <div className="selected-rating">
                                        <span className="stars">{renderStars(rating)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group review-content-group">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    className="review-textarea"
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    placeholder="Podziel się swoją opinią o filmie..."
                                />
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                className="submit-review-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Wysyłanie...' : 'Wyślij recenzję'}
                            </Button>
                        </form>
                    </div>

                    <div className="reviews-list">
                        <h3 className="reviews-list-title">
                            {movieReviews.length
                                ? `Wszystkie recenzje (${movieReviews.length})`
                                : "Brak recenzji dla tego filmu"}
                        </h3>

                        {movieReviews.length > 0 && (
                            <div className="reviews-container">
                                {movieReviews.map(thisReview => (
                                    <div key={thisReview.REVIEW_ID} className="review-card">
                                        {editingReviewId === thisReview.REVIEW_ID ? (
                                            <div className="review-edit-form">
                                                <div className="review-header">
                                                    <div className="review-author">
                                                        <strong>{thisReview.AUTHOR}</strong>
                                                    </div>
                                                </div>

                                                <div className="form-group rating-group">
                                                    <label>Edytuj ocenę:</label>
                                                    <Form.Select
                                                        className="edit-rating-select"
                                                        value={editRating}
                                                        onChange={(e) => setEditRating(Number(e.target.value))}
                                                    >
                                                        {[...Array(10)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                        ))}
                                                    </Form.Select>
                                                </div>

                                                <div className="form-group">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={4}
                                                        className="edit-review-textarea"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                    />
                                                </div>

                                                <div className="edit-actions">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleUpdateReview(thisReview.REVIEW_ID)}
                                                        className="save-btn"
                                                    >
                                                        Zapisz
                                                    </Button>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={handleCancelEdit}
                                                        className="cancel-btn"
                                                    >
                                                        Anuluj
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="review-header">
                                                    <div className="review-meta">
                                                        <div className="review-author">{thisReview.AUTHOR}</div>
                                                        <div className="review-rating">{renderStars(thisReview.SCORE)}</div>
                                                    </div>
                                                    <div className="review-actions">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditReview(thisReview)}
                                                            className="edit-btn"
                                                        >
                                                            <i className="fas fa-edit"></i> Edytuj
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteReview(thisReview.REVIEW_ID)}
                                                            className="delete-btn"
                                                        >
                                                            <i className="fas fa-trash"></i>Usuń
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="review-content">
                                                    <p>{thisReview.CONTENT}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default MovieContent;