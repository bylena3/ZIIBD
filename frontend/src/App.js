import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import MoviesPage from './components/MoviesPage';
import SeriesPage from './components/SeriesPage';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navigation />
                <Routes>
                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/series" element={<SeriesPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;