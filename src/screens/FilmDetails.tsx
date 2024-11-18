import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovieDetailsThunk, fetchSimilarMoviesThunk, fetchMovieTrailerThunk, fetchBoxOfficeThunk, clearMovieDetails } from '../store/movieDetailsSlice';
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
            dispatch(fetchMovieTrailerThunk(id));
            dispatch(fetchBoxOfficeThunk(id));
        }

        return () => {
            dispatch(clearMovieDetails());
        };
    }, [id, dispatch]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error}</p>;

    if (!movie) return <p>Фильм не найден</p>;
    console.log("Ссылка на видео", movie.trailerUrl);
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
                    {movie.boxOffice && `Сборы в прокате: ${movie.currencyChar}${movie.boxOffice}`}
                </div>
            </div>

            {/* Трейлер */}
            {movie.trailerUrl && (
                <iframe
                    width="560"
                    height="315"
                    src={movie.trailerUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
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
