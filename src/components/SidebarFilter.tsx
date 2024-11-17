import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
    setRatingFrom,
    setRatingTo,
    setYearFrom,
    setYearTo,
    fetchMoviesGroupThunk,
    clearMovies
} from '../store/movieSlice';
import {clear} from "@testing-library/user-event/dist/clear";

const SidebarFilter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [ratingFrom, setLocalRatingFrom] = useState(1);
    const [ratingTo, setLocalRatingTo] = useState(10);
    const [yearFrom, setLocalYearFrom] = useState(1990);
    const [yearTo, setLocalYearTo] = useState(2024);

    const handleApplyFilter = () => {
        dispatch(clearMovies());
        dispatch(setRatingFrom(ratingFrom));
        dispatch(setRatingTo(ratingTo));
        dispatch(setYearFrom(yearFrom));
        dispatch(setYearTo(yearTo));
        dispatch(fetchMoviesGroupThunk());
    };

    return (
        <div className="p-4 border-2 sticky top-1/3 h-full">
            <h2 className="font-bold mb-4">Фильтр</h2>
            <div className="mb-4">
                <label>Рейтинг от:</label>
                <input type="number" value={ratingFrom} onChange={(e) => setLocalRatingFrom(Number(e.target.value))} className="border p-2 w-full" />
            </div>
            <div className="mb-4">
                <label>Рейтинг до:</label>
                <input type="number" value={ratingTo} onChange={(e) => setLocalRatingTo(Number(e.target.value))} className="border p-2 w-full" />
            </div>
            <div className="mb-4">
                <label>Год от:</label>
                <input type="number" value={yearFrom} onChange={(e) => setLocalYearFrom(Number(e.target.value))} className="border p-2 w-full" />
            </div>
            <div className="mb-4">
                <label>Год до:</label>
                <input type="number" value={yearTo} onChange={(e) => setLocalYearTo(Number(e.target.value))} className="border p-2 w-full" />
            </div>
            <button onClick={handleApplyFilter} className="bg-blue-500 text-white p-2 rounded">Применить фильтр</button>
        </div>
    );
};

export default SidebarFilter;
