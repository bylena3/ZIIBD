import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import MoviesPage from './components/MoviesPage';
import SeriesPage from './components/SeriesPage';
import MovieContent from './components/MovieContent';
import MainContent from './components/MainContent';

function App() {
    return (
        <body>
        <BrowserRouter>
            <div className="App">
                <Navigation />
                <Routes>
                    <Route path="" element={<MainContent/>}/>
                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/series" element={<SeriesPage />} />
                    <Route path="/movies/:id" element={<MovieContent />} />    
                </Routes>
            </div>
        </BrowserRouter>
        </body>
    );
}

export default App;