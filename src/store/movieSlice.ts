import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../store/api';
import { RootState } from './store';

interface Movie {
    kinopoiskId: number;
    nameRu: string;
    nameOriginal: string;
    posterUrl: string;
    description: string;
    ratingKinopoisk: number;
    ratingImdb?: number;
    genres: { genre: string }[];
    year: number;
    trailerUrl?: string;
    boxOffice?: number;
}

interface MoviesState {
    movies: Movie[];
    filmDetails: Movie | null;
    similarMovies: Movie[];
    loading: boolean;
    error: string | null;
    page: number;
    total: number;
    ratingFrom: number;
    ratingTo: number;
    yearFrom: number;
    yearTo: number;
}

const initialState: MoviesState = {
    movies: [],
    filmDetails: null,
    similarMovies: [],
    loading: false,
    error: null,
    page: 1,
    total: 0,
    ratingFrom: 1,
    ratingTo: 10,
    yearFrom: 1990,
    yearTo: 2024,
};

// Thunk для загрузки групп фильмов
export const fetchMoviesGroupThunk = createAsyncThunk(
    'movies/fetchMoviesGroup',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { page, movies, ratingFrom, ratingTo, yearFrom, yearTo } = state.movies;

        let uniqueMovies: Movie[] = [...movies];
        let currentPage = page;

        while (uniqueMovies.length < movies.length + 25) {
            try {
                const response = await api.get('/films', {
                    params: {
                        page: currentPage,
                        ratingFrom,
                        ratingTo,
                        yearFrom,
                        yearTo,
                    },
                });
                console.log("Main response:",response.data);
                const { items, total } = response.data;
                if (!items || items.length === 0) break;

                const newMovies = items.filter(
                    (item: Movie) => !uniqueMovies.some(movie => movie.kinopoiskId === item.kinopoiskId)
                );

                uniqueMovies = [...uniqueMovies, ...newMovies];
                currentPage += 1;
                if (uniqueMovies.length >= total) break;
            } catch (error: any) {
                return rejectWithValue(error.message || 'Ошибка загрузки данных');
            }
        }

        return { items: uniqueMovies.slice(movies.length, movies.length + 25), total: uniqueMovies.length };
    }
);




const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        incrementPage(state) {
            state.page += 1;
        },
        setRatingFrom(state, action) {
            state.ratingFrom = action.payload;
        },
        setRatingTo(state, action) {
            state.ratingTo = action.payload;
        },
        setYearFrom(state, action) {
            state.yearFrom = action.payload;
        },
        setYearTo(state, action) {
            state.yearTo = action.payload;
        },
        clearMovies: (state) => {
            state.movies = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Групповые фильмы
            .addCase(fetchMoviesGroupThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMoviesGroupThunk.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const newMovies = action.payload.items.filter(
                        (item) => !state.movies.some(movie => movie.kinopoiskId === item.kinopoiskId)
                    );
                    state.movies = [...state.movies, ...newMovies];
                    state.total = action.payload.total;
                }
            })
            .addCase(fetchMoviesGroupThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

    },
});

export const {
    incrementPage,
    setRatingFrom,
    setRatingTo,
    setYearFrom,
    setYearTo,
    clearMovies,
} = moviesSlice.actions;

export default moviesSlice.reducer;
