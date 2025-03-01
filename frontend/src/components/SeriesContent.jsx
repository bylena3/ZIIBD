import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { renderStars } from "./MovieContent";
import "./MovieStyles.css";

export const SeriesContent = () => {
    const [reviews, setReviews] = useState([]);
    const [seriesInfo, setSeriesInfo] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(6);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(6);

    let params = useParams();
    const seriesId = parseInt(params.id);

    const fetchSeriesInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/series_info`);
            if (!response.ok) throw new Error("Network response failed");

            const data = await response.json();
            const series = data.find(s => s.SERIES_ID == seriesId);
            setSeriesInfo(series);
        } catch (error) {
            console.error("Error fetching series info:", error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/series_reviews`);
            if (!response.ok) throw new Error("Network response failed");

            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        fetchSeriesInfo();
        fetchReviews();
    }, [seriesId]);

    const seriesReviews = Array.isArray(reviews)
        ? reviews.filter(rev => rev.SERIES_ID == seriesId)
        : [];

    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Failed to delete review");

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

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("http://localhost:8080/api/reviews/add", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score: rating,
                    author: 'Anonymus',
                    seriesId: seriesId,
                    content: reviewContent,
                })
            });

            if (!response.ok) throw new Error("Failed to submit review");

            setReviewContent("");
            setRating(6);
            setSubmitSuccess(true);
            fetchReviews();

            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error("Error submitting review:", error);
            setSubmitError("Failed to submit your review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateAverageRating = () => {
        if (!seriesReviews.length) return 0;
        const sum = seriesReviews.reduce((acc, review) => acc + review.SCORE, 0);
        return (sum / seriesReviews.length).toFixed(1);
    };

    return (
        <div className="movie-content-wrapper">
            <Container className="py-5">
                {seriesInfo ? (
                    <div className="movie-header">
                        <Row>
                            <Col md={4} className="poster-col">
                                <div className="movie-poster">
                                    <img src={seriesInfo.URL} alt={seriesInfo.TITLE} />
                                    <div className="movie-rating">
                                        <div className="rating-circle">
                                            <span className="rating-value">{calculateAverageRating()}</span>
                                            <span className="rating-max">/10</span>
                                        </div>
                                        <div className="reviews-count">{seriesReviews.length} reviews</div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="movie-details">
                                    <h1 className="movie-title">{seriesInfo.TITLE}</h1>
                                    <div className="movie-metadata">
                                        <span className="movie-genre">{seriesInfo.GENRE}</span>
                                        <span className="movie-duration"> ~{seriesInfo.AVGDURATION} min/odc.</span>
                                        <span className="series-info">{seriesInfo.SEASONS} sezonów</span>
                                    </div>
                                    <div className="movie-director">
                                        <strong>Reżyser:</strong> {seriesInfo.DIRECTOR}
                                    </div>
                                    <div className="movie-cast">
                                        <strong>Główni Aktorzy:</strong> {seriesInfo.ACTORS}
                                    </div>
                                    <div className="movie-description">
                                        <h3>Opis</h3>
                                        <p>{seriesInfo.DESCRIPTION}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Ładowanie danych serialu...</p>
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
                                    placeholder="Podziel się swoją opinią o serialu..."
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
                            {seriesReviews.length
                                ? `Wszystkie recenzje (${seriesReviews.length})`
                                : "Brak recenzji dla tego serialu"}
                        </h3>

                        {seriesReviews.length > 0 && (
                            <div className="reviews-container">
                                {seriesReviews.map(thisReview => (
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
                                                            <i className="fas fa-trash"></i> Usuń
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

export default SeriesContent;