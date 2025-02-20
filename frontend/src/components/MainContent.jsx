import React, { useState, useEffect,} from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { data, Link } from "react-router-dom";

export const MainContent = () => {
    const [topmovies, setMovies] = useState([]);

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
    ]

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    useEffect(() => {
        const fetchtopmovies = async () => {
        fetch('http://localhost:8080/api/top_media', {
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
        fetchtopmovies();
    }, []);


    return (
    
        <Container className="py-4 bs-body-bg bg-black">
            <h1 className="text-3xl font-bold text-light mb-4">{randomGreeting}</h1>
            <p className="mb-4 text-light"> Oto najpopularniejsze filmy i seriale! </p>

            <Row xs={1} md={2} lg={3} className="g-4">
                            {topmovies.map((topmovie) => (
                                <Col key={topmovie.MOVIE_ID}>
                                    <Card className="h-100 shadow-sm" bg="dark" text="light">
                                        <Card.Body>
                                            <Card.Title className="text-xl font-bold mb-2">{topmovie.TITLE}</Card.Title>
                                            <Card.Img variant="top" src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"/>
                                        </Card.Body>
                                        <Card.Body>
                                            <Card.Link as={Link} to={''+ topmovie.MOVIE_ID}> <Button variant="success" className="fw-bold text-light">Szczegółowe informacje</Button> </Card.Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
        </Container>
    );
};

export default MainContent;
