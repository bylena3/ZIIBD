import React, { useState, useEffect} from "react";
import { Card, Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { data, Link } from "react-router-dom";
import { useParams } from "react-router"
import { renderStars } from "./MovieContent";




export const SeriesContent = () => {
    const [reviews, setReviews] = useState([]);

    let params = useParams();
    

    useEffect(() => {
        fetch(`http://localhost:8080/api/series_reviews`)
            .then(response => response.json())
            .then(data => setReviews(data))
            .catch(error => console.error("Error fetching reviews:", error));
    }, []);
    
    const series_reviews = Array.isArray(reviews) 
    ? reviews.filter(rev => rev.TITLE.trim().toLowerCase() === params.id.trim().toLowerCase()) 
    : [];

    return (
    
        <Container className="py-4 bs-body-bg bg-black">
            <h1 className="text-3xl font-bold text-light mb-4">Szczegółowe informacje</h1>
            <p className="mb-4 text-light"> </p>
            <Card className="h-100 shadow-sm" bg="dark" text="light">
                <Card.Body>
                    <Card.Title className="text-xl font-bold mb-2">XXX</Card.Title>
                    <Card.Img variant="top" src={URL}  style={{ width: '200px', height: '300px', objectFit: 'cover' }}/>
                    <Card.Text>
                        <p><strong>Reżyser:</strong> XXX</p>
                        <p><strong>Długość:</strong> X min</p>
                        <p><strong>Głowni Aktorzy:</strong> X </p>
                        <p><strong>gatunek:</strong> Xxxx</p>
                    </Card.Text>
                </Card.Body>
            </Card>
            <InputGroup>
                <InputGroup.Text className="bg-dark text-light">Podziel się swoją opinią!</InputGroup.Text>
                <Form.Control as="textarea" aria-label="With textarea" className="bg-dark text-light" />
                <Button variant="success" id="button-addon2">Wyślij</Button>
            </InputGroup>

            <Row className="g-4">
            <div>
            <h3 className="text-light">Recenzje</h3>
                {series_reviews.length > 0 ? (
                    series_reviews.map(thisReviews => (
                        <Card className="h-100 shadow-sm" bg="dark" text="light">
                            <Card.Body>
                                <Card.Title className="text-xl font-bold mb-2 text-light"><strong>{thisReviews.AUTHOR}</strong></Card.Title>
                                <Card.Header>{renderStars(thisReviews.SCORE)}</Card.Header>
                                <div key={thisReviews.REVIEW_ID} className="review">
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

export default SeriesContent;
