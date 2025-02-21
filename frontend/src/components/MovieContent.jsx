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
    let params = useParams();

    useEffect(() => {
        // Fetch reviews
        fetch(`http://localhost:8080/api/movie_reviews`)
            .then(response => response.json())
            .then(data => setReviews(data))
            .catch(error => console.error("Error fetching reviews:", error));

        // Fetch movie info
        fetch(`http://localhost:8080/api/movie_info`)
            .then(response => response.json())
            .then(data => {
                // Find the movie that matches the current title parameter
                const movie = data.find(m => m.MOVIE_ID == params.id);
                setMovieInfo(movie);
            })
            .catch(error => console.error("Error fetching movie info:", error));
    }, [params.id]);

    const greviews = Array.isArray(reviews)
        ? reviews.filter(rev => rev.MOVIE_ID == params.id)
        : [];

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

            <InputGroup className="mt-4">
                <InputGroup.Text className="bg-dark text-light">Podziel się swoją opinią!</InputGroup.Text>
                <Form.Control as="textarea" aria-label="With textarea" className="bg-dark text-light" />
                <Button variant="success" id="button-addon2">Wyślij</Button>
            </InputGroup>

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