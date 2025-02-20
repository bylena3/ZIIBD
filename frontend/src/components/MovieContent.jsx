import React, { useState, useEffect} from "react";
import { Card, Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { data, Link } from "react-router-dom";
import { useParams } from "react-router"


export const MovieContent = () => {
    const [reviews, setReviews] = useState([]);

    // let params = useParams();
    

    // useEffect(() => {
    //     fetch(`/api/reviews/${params.id}`)
    //         .then(response => response.json())
    //         .then(data => setReviews(data))
    //         .catch(error => console.error("Error fetching reviews:", error));
    // }, []);

    // const thisReviews = reviews.filter((rev) => rev.review_id == params.id);


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

            {/* <Row className="g-4">
            <div>
            <h3 className="text-light">Recenzje</h3>
                {reviews.length > 0 ? (
                    reviews.map(thisReviews => (
                        <div key={thisReviews.review_id} className="review">
                            <p><strong>{thisReviews.author}</strong> – {thisReviews.score}/10</p>
                            <p>{thisReviews.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-light">Brak recenzji dla tego filmu.</p>
                )}
            </div>
            </Row> */}
        </Container>
    );
};

export default MovieContent;
