import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./MovieStyles.css";

const SeriesPage = () => {
    const [series, setSeries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSeries = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/series');

                if (!response.ok) throw new Error("Network response failed");

                const data = await response.json();
                setSeries(data);
            } catch (error) {
                console.error('Error fetching series:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeries();
    }, []);

    return (
        <div className="movie-content-wrapper">
            <Container className="py-5">
                <div className="movie-header">
                    <h1 className="movie-title text-center mb-4">Lista Seriali</h1>
                    <p className="text-center mb-4">Witaj na stronie z serialami! Odkryj seriale, które wciągną Cię na długie godziny.</p>
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Ładowanie seriali...</p>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {series.map((show) => (
                            <Col key={show.SERIES_ID}>
                                <div className="movie-poster-card">
                                    <Card className="h-100 shadow-sm movie-card">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="movie-card-title mb-3">{show.TITLE}</Card.Title>
                                            <div className="movie-card-image-container mb-3">
                                                <Card.Img variant="top" src={show.URL} className="movie-card-image" />
                                            </div>
                                            <div className="movie-card-details">
                                                <div className="movie-card-info"><strong>Twórca/główny reżyser:</strong> <a href={`https://pl.wikipedia.org/wiki/${show.DIRECTOR_NAME}_${show.DIRECTOR_SURNAME}`} className="director-link">{show.DIRECTOR_NAME} {show.DIRECTOR_SURNAME}</a></div>
                                                <div className="movie-card-info"><strong>Liczba sezonów:</strong> <span className="series-seasons">{show.SEASONS}</span></div>
                                                <div className="movie-card-info"><strong>Gatunek:</strong> <span className="movie-genre">{show.GENRE_NAME}</span></div>
                                            </div>
                                            <div className="mt-auto pt-3 text-center">
                                                <Link to={`${show.SERIES_ID}/${show.TITLE}`}>
                                                    <Button variant="primary" className="movie-details-btn">
                                                        Szczegółowe informacje
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default SeriesPage;