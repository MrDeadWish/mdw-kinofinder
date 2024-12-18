import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMoviesGroupThunk, incrementPage } from '../store/movieSlice';
import { RootState, AppDispatch } from '../store/store';
import MovieCard from '../components/MovieCard';
import SidebarFilter from "../components/SidebarFilter";

const HomeScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { movies, loading, error, page, total } = useSelector((state: RootState) => state.movies);

    //Фетчинг при запуске
    useEffect(() => {
        if (movies.length === 0) {
            dispatch(fetchMoviesGroupThunk());
        }
    }, [dispatch, movies.length]);

    //Фетчинг при изменении номера страницы
    useEffect(() => {
        if (page > 1) {
            dispatch(fetchMoviesGroupThunk());
        }
    }, [dispatch, page]);

    const handleShowMore = () => {
        dispatch(incrementPage());
    };

    return (
        <div className="flex">
            <SidebarFilter></SidebarFilter>
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Главная страница</h1>
            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">Ошибка: {error}</p>}
            <div className="grid grid-cols-5 gap-4">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.kinopoiskId}
                        movie={movie}
                    />
                ))}
            </div>

            {movies.length < total ? (
                <button
                    className="mt-6 p-2 bg-blue-500 text-white rounded"
                    onClick={handleShowMore}
                >
                    Показать ещё
                </button>
            ) : (
                <p className="mt-6 text-center text-gray-500">
                    Не нашли то, что нужно? Попробуйте изменить фильтры!
                </p>
            )}
        </div>
        </div>
    );
};

export default HomeScreen;
