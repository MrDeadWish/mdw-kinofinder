import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovieDetailsThunk, fetchSimilarMoviesThunk, clearMovieDetails } from '../store/movieDetailsSlice';
import { RootState, AppDispatch } from '../store/store';
import MovieCard from '../components/MovieCard';

const FilmDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { movie, similarMovies, loading, error } = useSelector((state: RootState) => state.movieDetails);

    useEffect(() => {
        if (id) {
            dispatch(fetchMovieDetailsThunk(id));
            dispatch(fetchSimilarMoviesThunk(id));
        }


        return () => {
            dispatch(clearMovieDetails());
        };
    }, [id, dispatch]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error}</p>;

    if (!movie) return <p>Фильм не найден</p>;

    return (
        <div className="flex-grow container mx-auto p-6">
            <nav className="text-sm mb-4">
                <Link to="/" className="text-blue-500">Главная</Link> / {movie.nameRu || movie.nameOriginal}
            </nav>

            <div className="flex flex-col md:flex-row items-start mb-8">
                <img src={movie.posterUrl} alt={movie.nameRu} className="w-80 rounded-lg shadow-lg" />

                <div className="ml-6">
                    <h2 className="text-3xl font-bold mb-2">{movie.nameRu || movie.nameOriginal}</h2>
                    <p className="mb-2">Год выпуска: {movie.year}</p>
                    <p className="mb-2">Жанр: {movie.genres.map(g => g.genre).join(', ')}</p>
                    <p className="mb-2">Рейтинг Кинопоиск: {movie.ratingKinopoisk}</p>
                    <p className="mb-2">Рейтинг IMDb: {movie.ratingImdb}</p>
                    <p className="mt-4">{movie.description}</p>
                    {movie.boxOffice && <p className="text-gray-500 mt-4">Сборы в прокате: ${movie.boxOffice.grossWorldwide}</p>}
                </div>
            </div>

            {/* Трейлер */}
            {movie.trailerUrl && (
                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Трейлер</h3>
                    <iframe
                        width="100%"
                        height="400"
                        src={movie.trailerUrl}
                        title="Фильм Трейлер"
                        allowFullScreen
                        className="rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Похожие фильмы */}
            {similarMovies.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold mb-4">Похожие фильмы</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {similarMovies.map(movie => (
                            <MovieCard key={movie.kinopoiskId} movie={movie} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilmDetails;
