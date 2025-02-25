import React, { useState, useEffect} from "react";
import { Card, Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from "react-router";

export const renderStars = (score) => {
    const totalStars = 10; // Zakładając, że maksymalna ocena to 5 gwiazdek
    let stars = [];

    for (let i = 0; i < totalStars; i++) {
        if (i < score) {
            stars.push("★"); // Pełna gwiazdka
        } else {
            stars.push("☆"); // Pusta gwiazdka
        }
    }

    return stars.join(" "); // Łączy wszystkie gwiazdki w jeden ciąg
};

export const MovieContent = () => {
    const [reviews, setReviews] = useState([]);
    const [movieInfo, setMovieInfo] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(6);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
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


    return (
        <Container className="py-4 bs-body-bg bg-black">
            <h1 className="text-3xl font-bold text-light mb-4">Szczegółowe informacje</h1>
            <p className="mb-4 text-light"> </p>

            {movieInfo ? (
                <Card className="h-100 shadow-sm" bg="dark" text="light">
                    <Card.Body>
                        <Card.Title className="text-xl font-bold mb-2">{movieInfo.TITLE}</Card.Title>
                        <Card.Img variant="top" src={movieInfo.URL} style={{ width: '250px', height: '400px', objectFit: 'cover' }}/>
                        <div className="card-text">
                            <div><strong>Reżyser:</strong> {movieInfo.DIRECTOR}</div>
                            <div><strong>Długość:</strong> {movieInfo.DURATION} min</div>
                            <div><strong>Głowni Aktorzy:</strong> {movieInfo.ACTORS}</div>
                            <div><strong>Gatunek:</strong> {movieInfo.GENRE}</div>
                            <div className="mt-3"><strong>Opis:</strong></div>
                            <div className="mt-1">{movieInfo.DESCRIPTION}</div>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="h-100 shadow-sm" bg="dark" text="light">
                    <Card.Body>
                        <Card.Title className="text-xl font-bold mb-2">Ładowanie danych...</Card.Title>
                    </Card.Body>
                </Card>
            )}
            <Card className="mt-4" bg="dark" text="light">
                <Card.Body>
                    <Card.Title>Dodaj swoją recenzję</Card.Title>

                    {submitSuccess && (
                        <div className="alert alert-success">
                            Recenzja została dodana pomyślnie!
                        </div>
                    )}

                    {submitError && (
                        <div className="alert alert-danger">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3">
                            <label>Twoja ocena:</label>
                            <Form.Select
                                className="bg-dark text-light"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Twoja recenzja:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                className="bg-dark text-light"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                placeholder="Treść"
                            />
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            disabled={isSubmitting}

                        >
                            {isSubmitting ? 'Wysyłanie...' : 'Wyślij recenzję'}
                        </Button>

                    </form>
                </Card.Body>
            </Card>
            {/* Lista recenzji */}
            <Card className="mt-4" bg="dark" text="light">
                <Card.Body>
                    <Card.Title>Recenzje</Card.Title>

                    {movieReviews.length > 0 ? (
                        movieReviews.map(thisReviews => (
                            <Card key={thisReviews.REVIEW_ID} className="mb-3" bg="secondary" text="light">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <Card.Title className="text-xl font-bold mb-2 text-light">
                                            <strong>{thisReviews.AUTHOR}</strong>
                                        </Card.Title>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteReview(thisReviews.REVIEW_ID)}
                                            className="ms-2"
                                        >
                                            X
                                        </Button>
                                    </div>
                                    <Card.Header>{renderStars(thisReviews.SCORE)}</Card.Header>
                                    <div className="review">
                                        <p className="text-light">{thisReviews.CONTENT}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <div className="text-light">Brak recenzji dla tego filmu.</div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MovieContent;