import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilmDetailsThunk, fetchSimilarMoviesThunk } from '../store/movieSlice';
import { RootState, AppDispatch } from '../store/store';
import MovieCard from '../components/MovieCard';

const FilmDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { filmDetails, similarMovies, loading, error } = useSelector((state: RootState) => state.movies);

    useEffect(() => {
        if (id) {
            dispatch(fetchFilmDetailsThunk(id));
            dispatch(fetchSimilarMoviesThunk(id));
        }
    }, [id, dispatch]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error}</p>;

    if (!filmDetails) return <p>Фильм не найден</p>;

    return (
        <div className="flex-grow container mx-auto p-6">
            <nav className="text-sm mb-4">
                <Link to="/" className="text-blue-500">Главная</Link> / {filmDetails.nameRu || filmDetails.nameOriginal}
            </nav>

            <div className="flex flex-col md:flex-row items-start mb-8">
                <img src={filmDetails.posterUrl} alt={filmDetails.nameRu} className="w-80 rounded-lg shadow-lg" />


                <div className="ml-6">
                    <h2 className="text-3xl font-bold mb-2">{filmDetails.nameRu || filmDetails.nameOriginal}</h2>
                    <p className="text-gray-500 mb-2">Год выпуска: {filmDetails.year}</p>
                    <p className="text-gray-500 mb-2">Жанр: {filmDetails.genres.map(g => g.genre).join(', ')}</p>
                    <p className="text-gray-500 mb-2">Рейтинг Кинопоиск: {filmDetails.ratingKinopoisk}</p>
                    <p className="text-gray-500 mb-2">Рейтинг IMDb: {filmDetails.ratingImdb}</p>
                    <p className="mt-4">{filmDetails.description}</p>
                    <p className="text-gray-500 mt-4">Сборы в прокате: ${filmDetails.boxOffice}</p>
                </div>
            </div>

            {/* Трейлер */}
            {filmDetails.trailerUrl && (
                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Трейлер</h3>
                    <iframe
                        width="100%"
                        height="400"
                        src={filmDetails.trailerUrl}
                        title="Фильм Трейлер"
                        allowFullScreen
                        className="rounded-lg shadow-lg"
                    />
                </div>
            )}

            {similarMovies.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold mb-4">Похожие фильмы</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {similarMovies.map(movie => (
                            <MovieCard
                                key={movie.kinopoiskId}
                                movie={movie}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilmDetails;
