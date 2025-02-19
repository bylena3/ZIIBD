import React, { useState, useEffect,} from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { data, Link } from "react-router-dom";

export const MainContent = () => {
    const [movies, setMovies] = useState([]);

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
            <h1 className="text-3xl font-bold text-light mb-4">{randomGreeting}</h1>
            <p className="mb-4 text-light"> KrytykUŚ to platforma do recenzowania filmów i seriali. </p>
            <p className="mb-4 text-light"> Strona główna -> top filmy i seriale? </p>
        </Container>
    );
};

export default MainContent;
