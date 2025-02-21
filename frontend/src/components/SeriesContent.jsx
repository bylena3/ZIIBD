import React, { useState, useEffect} from "react";
import { Card, Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { renderStars } from "./MovieContent";

export const SeriesContent = () => {
    const [reviews, setReviews] = useState([]);
    const [seriesInfo, setSeriesInfo] = useState(null);

    let params = useParams();

    useEffect(() => {
        // Fetch reviews
        fetch(`http://localhost:8080/api/series_reviews`)
            .then(response => response.json())
            .then(data => setReviews(data))
            .catch(error => console.error("Error fetching reviews:", error));

        // Fetch series information
        fetch(`http://localhost:8080/api/series_info`)
            .then(response => response.json())
            .then(data => {
                // Find the series that matches the current title parameter
                const series = data.find(s => s.TITLE.trim().toLowerCase() === params.id.trim().toLowerCase());
                setSeriesInfo(series);
            })
            .catch(error => console.error("Error fetching series info:", error));
    }, [params.id]);

    const series_reviews = Array.isArray(reviews)
        ? reviews.filter(rev => rev.TITLE.trim().toLowerCase() === params.id.trim().toLowerCase())
        : [];

    return (
        <Container className="py-4 bs-body-bg bg-black">
            <h1 className="text-3xl font-bold text-light mb-4">Szczegółowe informacje</h1>
            <p className="mb-4 text-light"> </p>

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

            <InputGroup className="mt-4">
                <InputGroup.Text className="bg-dark text-light">Podziel się swoją opinią!</InputGroup.Text>
                <Form.Control as="textarea" aria-label="With textarea" className="bg-dark text-light" />
                <Button variant="success" id="button-addon2">Wyślij</Button>
            </InputGroup>

            <Row className="g-4 mt-2">
                <div>
                    <h3 className="text-light">Recenzje</h3>
                    {series_reviews.length > 0 ? (
                        series_reviews.map(thisReviews => (
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
                        <p className="text-light">Brak recenzji dla tego serialu.</p>
                    )}
                </div>
            </Row>
        </Container>
    );
};

export default SeriesContent;