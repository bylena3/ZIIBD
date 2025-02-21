import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { renderStars } from "./MovieContent";

export const SeriesContent = () => {
    const [reviews, setReviews] = useState([]);
    const [seriesInfo, setSeriesInfo] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(6);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

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
            series_id: seriesId,
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
                fetchReviews(); // Odświeżamy listę recenzji
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

    return (
        <Container className="py-4 bs-body-bg bg-black">
            <h1 className="text-3xl font-bold text-light mb-4">Szczegółowe informacje</h1>

            {seriesInfo ? (
                <Card className="h-100 shadow-sm" bg="dark" text="light">
                    <Card.Body>
                        <Card.Title className="text-xl font-bold mb-2">{seriesInfo.TITLE}</Card.Title>
                        <Card.Img variant="top" src={seriesInfo.URL} style={{ width: '250px', height: '400px', objectFit: 'cover' }}/>
                        <Card.Text>
                            <p><strong>Reżyser:</strong> {seriesInfo.DIRECTOR}</p>
                            <p><strong>Ilość sezonów:</strong> {seriesInfo.SEASONS}</p>
                            <p><strong>Średnia długośc odcinka:</strong> {seriesInfo.AVGDURATION} min</p>
                            <p><strong>Głowni Aktorzy:</strong> {seriesInfo.ACTORS}</p>
                            <p><strong>Gatunek:</strong> {seriesInfo.GENRE}</p>
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

            {/* Lista recenzji */}
            <Card className="mt-4" bg="dark" text="light">
                <Card.Body>
                    <Card.Title>Recenzje</Card.Title>

                    {seriesReviews.length > 0 ? (
                        seriesReviews.map(review => (
                            <Card key={review.REVIEW_ID} className="mb-3" bg="secondary" text="light">
                                <Card.Header>
                                    <strong>{review.AUTHOR}</strong> - {renderStars(review.SCORE)}
                                </Card.Header>
                                <Card.Body>
                                    <p>{review.CONTENT}</p>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>Brak recenzji dla tego serialu.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SeriesContent;