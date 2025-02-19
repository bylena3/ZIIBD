import React, { useState, useEffect,} from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { data, Link } from "react-router-dom";

export const MovieContent = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchmovies = async () => {
        fetch('http://localhost:8080/api/movies/', {
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
            <h1 className="text-3xl font-bold text-light mb-4">Szczegółowe informacje</h1>
            <p className="mb-4 text-light"> </p>

            <Row xs={1} md={2} lg={3} className="g-4">
                
                    <Col>
                        
                    </Col>
            </Row>
        </Container>
    );
};

export default MovieContent;
