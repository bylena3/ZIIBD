import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

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
            <h1 className="text-3xl font-bold mb-4">Lista Seriali</h1>
            <p className="mb-4">Witaj na stronie z serialami!</p>

            <Row xs={1} md={2} lg={3} className="g-4">
                {series.map((show) => (
                    <Col key={show.SERIES_ID}>
                        <Card className="h-100 shadow-sm" bg="dark" text="light">
                            <Card.Body>
                                <Card.Title className="text-xl font-bold mb-2">{show.TITLE}</Card.Title>
                                <Card.Text>
                                    <Card.Img variant="top" src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"/>
                                    <p><strong>Reżyser:</strong> {show.SURNAME}</p>
                                    <p><strong>Liczba sezonów:</strong> {show.SEASONS}</p>
                                </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Link href="#"> <Button variant="warning">Szczegółowe informacje</Button> </Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SeriesPage;