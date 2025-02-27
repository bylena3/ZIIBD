import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./MovieStyles.css";

const MoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/movies', {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error("Network response failed");

                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="movie-content-wrapper">
            <Container className="py-5">
                <div className="movie-header">
                    <h1 className="movie-title text-center mb-4">Lista Filmów</h1>
                    <p className="text-center mb-4">Witaj na stronie z filmami! Wybierz film, aby zobaczyć szczegóły.</p>
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Ładowanie filmów...</p>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {movies.map((movie) => (
                            <Col key={movie.MOVIE_ID}>
                                <div className="movie-poster-card">
                                    <Card className="h-100 shadow-sm movie-card">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="movie-card-title mb-3">{movie.TITLE}</Card.Title>
                                            <div className="movie-card-image-container mb-3">
                                                <Card.Img variant="top" src={movie.URL} className="movie-card-image" />
                                            </div>
                                            <div className="movie-card-details">
                                                <div className="movie-card-info"><strong>Reżyser:</strong> <a href={`https://pl.wikipedia.org/wiki/${movie.DIRECTOR_NAME}_${movie.DIRECTOR_SURNAME}`} className="director-link">{movie.DIRECTOR_NAME} {movie.DIRECTOR_SURNAME}</a></div>
                                                <div className="movie-card-info"><strong>Długość:</strong> {movie.DURATION} min</div>
                                                <div className="movie-card-info"><strong>Gatunek:</strong> <span className="movie-genre">{movie.GENRE_NAME}</span></div>
                                            </div>
                                            <div className="mt-auto pt-3 text-center">
                                                <Link to={`${movie.MOVIE_ID}/${movie.TITLE}`}>
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

export default MoviesPage;