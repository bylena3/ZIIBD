import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';

const MoviesPage = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchmovies = async () => {
        fetch('http://localhost:8080/api/movies', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error('Error fetching movies:', error));
        }
        fetchmovies();
    }, []);


    return (
        <Container className="py-4">
            <h1 className="text-3xl font-bold mb-4">Lista Filmów</h1>
            <p className="mb-4">Witaj na stronie z filmami! </p>

            <Row xs={1} md={2} lg={3} className="g-4">
                {movies.map((movie) => (
                    <Col key={movie.MOVIE_ID}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title className="text-xl font-bold mb-2">{movie.TITLE}</Card.Title>
                                <Card.Text>
                                    <p><strong>Reżyser:</strong> {movie.DIRECTOR_SURNAME}</p>
                                    <p><strong>Długość:</strong> {movie.DURATION} min</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MoviesPage;
