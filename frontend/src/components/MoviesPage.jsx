import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { data, Link } from "react-router-dom";

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
        <Container className="py-4 bs-body-bg bg-black">
            <h1 className="text-3xl font-bold text-light mb-4">Lista Filmów</h1>
            <p className="mb-4 text-light">Witaj na stronie z filmami! </p>

            <Row xs={1} md={2} lg={3} className="g-4">
                {movies.map((movie) => (
                    <Col key={movie.MOVIE_ID}>
                        <Card className="h-100 shadow-sm" bg="dark" text="light">
                            <Card.Body>
                                <Card.Title className="text-xl font-bold mb-2">{movie.TITLE}</Card.Title>
                                <Card.Img variant="top" src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"/>
                                <Card.Text>
                                    <p><strong>Reżyser:</strong> <a href={"https://pl.wikipedia.org/wiki/" + movie.DIRECTOR_NAME + "_" + movie.DIRECTOR_SURNAME}>{movie.DIRECTOR_NAME} {movie.DIRECTOR_SURNAME}</a></p>
                                    <p><strong>Długość:</strong> {movie.DURATION} min</p>
                                </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Link as={Link} to={''+ movie.MOVIE_ID}> <Button variant="success" className="fw-bold text-light">Szczegółowe informacje</Button> </Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MoviesPage;
