import React, { useState, useEffect} from "react";
import { Card, Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router";
import { renderStars } from "./MovieContent";
import { onSubmit } from "../service/onSubmit";

export const SeriesContent = () => {
    const [reviews, setReviews] = useState([]);
    const [seriesInfo, setSeriesInfo] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(6);
    
    let params = useParams();

    console.log(params.id)
 

 

    const handleSubmit = () => {
        let reviewData = {
            score: 5,  
            author: "Anonim", 
            movie_ID: null, 
            series_ID: params.id,  
            content: reviewContent
        };

        if (!reviewContent.trim()) {
            alert("Wpisz treść recenzji!");
            return;
        }

        onSubmit({ content: reviewContent, score: rating }); // Przekazujemy dane do funkcji onSubmit
        setReviewContent(""); // Czyścimy pole tekstowe
        setRating(5); // Resetujemy ocenę
    };
    

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
                const series = data.find(s => s.SERIES_ID == params.id);
                setSeriesInfo(series);
            })
            .catch(error => console.error("Error fetching series info:", error));
    }, [params.title]);

    const series_reviews = Array.isArray(reviews)
        ? reviews.filter(rev => rev.SERIES_ID == params.id)
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
            <Form.Group className="d-flex align-items-center">
            <Form.Select 
                className="bg-dark text-light w-auto h-100" 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
            >
                {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </Form.Select>
            </Form.Group>
                <Form.Control as="textarea" aria-label="With textarea" className="bg-dark text-light" onChange={(e) => setReviewContent(e.target.value)} />
                <Button variant="success" id="button-addon2" onClick={handleSubmit}>Wyślij</Button>
            </InputGroup>

            <Row className="g-4 mt-2">
                <div>
                    <h3 className="text-light">Recenzje</h3>
                    {series_reviews.length > 0 ? (
                        series_reviews.map(thisReviews => (
                            <Card key={thisReviews.REVIEW_ID} className="h-50 shadow-sm mb-3" bg="dark" text="light">
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