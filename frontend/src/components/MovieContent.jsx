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

     useEffect(() => {
            fetchMoviesInfo();
            fetchReviews();
        }, []);

    const greviews = Array.isArray(reviews)
        ? reviews.filter(rev => rev.MOVIE_ID == params.id)
        : [];

        //////////////////////////////////////////////////////////////////////////////////////
        const handleFormSubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
    
            if (!reviewContent.trim()) {
                setSubmitError("Wpisz treść recenzji!");
                return;
            }
    
            setIsSubmitting(true);
            setSubmitError("");
            setSubmitSuccess(false);
    
            const reviewData = {
                score: rating,
                author: "anonymus",
                series_id: params.id,
                content: reviewContent
            };
    
            try {
                console.log("Sending review data:", reviewData);
                console.log("Request URL: http://localhost:8080/api/reviews/add");
                console.log("JSON payload:", JSON.stringify(reviewData));
    
                const response = await fetch('http://localhost:8080/api/reviews/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewData)
                });
    
    
                console.log("Response status:", response.status);
                const responseText = await response.text();
                console.log("Response body:", responseText);
    
                if (response.ok) {
                    setSubmitSuccess(true);
                    setReviewContent("");
                    setRating(6);
                    
                } else {
                    setSubmitError(`Błąd: ${responseText}`);
                }
            } catch (error) {
                console.error("Request error:", error);
                setSubmitError(`Błąd połączenia: ${error.message}`);
            } finally {
                setIsSubmitting(false);
            }
        };
        /////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <Container className="py-4 bs-body-bg bg-black">
            <h1 className="text-3xl font-bold text-light mb-4">Szczegółowe informacje</h1>
            <p className="mb-4 text-light"> </p>

            {movieInfo ? (
                <Card className="h-100 shadow-sm" bg="dark" text="light">
                    <Card.Body>
                        <Card.Title className="text-xl font-bold mb-2">{movieInfo.TITLE}</Card.Title>
                        <Card.Img variant="top" src={movieInfo.URL} style={{ width: '250px', height: '400px', objectFit: 'cover' }}/>
                        <Card.Text>
                            <p><strong>Reżyser:</strong> {movieInfo.DIRECTOR}</p>
                            <p><strong>Długość:</strong> {movieInfo.DURATION} min</p>
                            <p><strong>Głowni Aktorzy:</strong> {movieInfo.ACTORS}</p>
                            <p><strong>Gatunek:</strong> {movieInfo.GENRE}</p>
                        </Card.Text>
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

                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Twoja ocena:</Form.Label>
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
                                placeholder="Wpisz swoją recenzję..."
                            />
                        </Form.Group>

                        <Button type="submit">Wyślij recenzję</Button>

                    </Form>
                </Card.Body>
            </Card>

            <Row className="g-4 mt-2">
                <div>
                    <h3 className="text-light">Recenzje</h3>
                    {greviews.length > 0 ? (
                        greviews.map(thisReviews => (
                            <Card key={thisReviews.REVIEW_ID} className="h-100 shadow-sm mb-3" bg="dark" text="light">
                                <Card.Body>
                                    <Card.Title className="text-xl font-bold mb-2 text-light"><strong>{thisReviews.AUTHOR}</strong></Card.Title>
                                    <Card.Header>{renderStars(thisReviews.SCORE)}</Card.Header>
                                    <div className="review">
                                        <p className="text-light">{thisReviews.CONTENT}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="text-light">Brak recenzji dla tego filmu.</p>
                    )}
                </div>
            </Row>
        </Container>
    );
};

export default MovieContent;