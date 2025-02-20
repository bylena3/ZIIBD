import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { data, Link } from "react-router-dom";

const SeriesPage = () => {
    const [series, setSeries] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/series')
            .then(response => response.json())
            .then(data => setSeries(data))
            .catch(error => console.error('Error fetching series:', error));
    }, []);

    return (
        <Container className="py-4">
            <h1 className="text-3xl font-bold text-light mb-4">Lista Seriali</h1>
            <p className="mb-4 text-light">Witaj na stronie z serialami!</p>

            <Row xs={1} md={2} lg={3} className="g-4">
                {series.map((show) => (
                    <Col key={show.SERIES_ID}>
                        <Card className="h-100 shadow-sm" bg="dark" text="light">
                            <Card.Body>
                                <Card.Title className="text-xl font-bold mb-2">{show.TITLE}</Card.Title>
                                <Card.Text>
                                    <Card.Img variant="top" src={show.URL}  style={{ width: '200px', height: '300px', objectFit: 'cover' }}/>
                                    <p><strong>Reżyser:</strong> <a href={"https://pl.wikipedia.org/wiki/" + show.DIRECTOR_NAME + "_" + show.DIRECTOR_SURNAME}>{show.DIRECTOR_NAME} {show.DIRECTOR_SURNAME}</a></p>
                                    <p><strong>Liczba sezonów:</strong> {show.SEASONS}</p>
                                </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Link as={Link} to={'' + show.TITLE} > <Button variant="success" className="fw-bold text-light">Szczegółowe informacje</Button> </Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SeriesPage;