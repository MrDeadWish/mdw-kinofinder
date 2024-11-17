import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMoviesGroupThunk, incrementPage } from '../store/movieSlice';
import { RootState, AppDispatch } from '../store/store';
import MovieCard from '../components/MovieCard';

const HomeScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { movies, loading, error, page, total } = useSelector((state: RootState) => state.movies);

    useEffect(() => {
            console.log("Fetching for page:",{page});
            dispatch(fetchMoviesGroupThunk(page));
    }, [dispatch, page]);

    const handleShowMore = () => {
        console.log("Click");
        dispatch(incrementPage());
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Главная страница</h1>
            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">Ошибка: {error}</p>}
            <div className="grid grid-cols-5 gap-4">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.kinopoiskId}
                        title={movie.nameRu || movie.nameOriginal}
                        imageUrl={movie.posterUrl}
                        ratingKinopoisk={movie.ratingKinopoisk}
                        /*Обработать массив через стрелку*/
                        genres={movie.genres.map((g) => g.genre)}
                        year={movie.year}
                    />
                ))}
            </div>

            {/* Кнопка "Показать ещё" или сообщение */}
            {page * 20 < total ? (
                <button
                    className="mt-6 p-2 bg-blue-500 text-white rounded"
                    onClick={handleShowMore}
                >
                    Показать ещё
                </button>
            ) : (
                <p className="mt-6 text-center text-gray-500">
                    Не нашли то, что нужно? Попробуйте изменить фильтр!
                </p>
            )}
        </div>
    );
};

export default HomeScreen;