import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./MovieStyles.css";

export const MainContent = () => {
    const [topMovies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const greetings = [
        "Witaj, niebywały kinomanie! Światła, kamera… akcja!",
        "Witaj, mistrzu binge-watchingu! Czas na kolejną filmową ucztę.",
        "Witaj, wytrawny krytyku! Mamy nadzieję, że nie będziesz tak surowy jak Jigsaw.",
        "Witaj, poszukiwaczu filmowych perełek! Nadchodzi seans życia.",
        "Witaj, bohaterze maratonów filmowych! Twoja misja: obejrzeć je wszystkie.",
        "Witaj, kinowy podróżniku! Niech Moc filmów będzie z Tobą.",
        "Halo, krytyku filmowy! Sprawdź, co dla Ciebie mamy.",
        "Szanowny kinomaniaku, zapraszamy do świata filmów!",
        "Redrum… czyli czas na coś mrocznego w naszym katalogu.",
        "Hakuna Matata! Niech to będzie filmowy dzień bez zmartwień.",
        "Toto, mam wrażenie, że nie jesteśmy już w Kansas… tylko w świecie filmów!",
        "This is the way… do oglądania najlepszych filmów!",
        "Houston, mamy problem... który film obejrzeć najpierw?",
        "Niech Moc filmów będzie z Tobą, młody padawanie.",
        "Powrót do przyszłości? A może raczej powrót do ulubionych klasyków?",
        "Czy to ptak? Czy to samolot? Nie, to kolejny świetny film do obejrzenia!",
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    const fetchTopMovies = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/top_media', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error("Network response failed");

            const data = await response.json();
            const dataWithIndex = data.map((item, index) => ({
                ...item,
                uniqueIndex: index
            }));
            setMovies(dataWithIndex);
        } catch (error) {
            console.error('Error fetching top media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopMovies();
    }, []);

    function createPath(topMovie) {
        if (topMovie.MOVIE_ID != null) {
            return `movies/${topMovie.MOVIE_ID}/${encodeURIComponent(topMovie.TITLE)}`;
        } else if (topMovie.SERIES_ID != null) {
            return `series/${topMovie.SERIES_ID}/${encodeURIComponent(topMovie.TITLE)}`;
        }
        return "/";
    }

    return (
        <div className="movie-content-wrapper">
            <Container className="py-5">
                <div className="movie-header">
                    <h1 className="greeting-title text-center">{randomGreeting}</h1>
                    <div className="golden-line"></div>
                    <p className="text-center highlight-text mb-4">Oto najpopularniejsze filmy i seriale!</p>
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Ładowanie najlepszych pozycji...</p>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {topMovies.map((topMovie) => (
                            <Col key={`media_${topMovie.uniqueIndex}`}>
                                <div className="featured-poster-card">
                                    <Card className="h-100 shadow-lg featured-card">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="featured-title mb-3">
                                                {topMovie.TITLE}
                                                </Card.Title>
                                            <div className="featured-image-container">
                                                <Card.Img variant="top" src={topMovie.URL} className="featured-image" />
                                                <div className="featured-badge">
                                                    <span>TOP</span>
                                                </div>
                                            </div>
                                            <div className="mt-auto pt-3 text-center">
                                                <Link to={createPath(topMovie)}>
                                                    <Button variant="primary" className="featured-details-btn">
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

export default MainContent;