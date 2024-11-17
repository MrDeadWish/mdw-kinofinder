import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from "./store";

interface Movie {
    kinopoiskId: number;
    nameRu: string;
    nameOriginal: string;
    posterUrl: string;
    description: string;
    ratingKinopoisk: number;
    genres: { genre: string }[];
    year: number;
}

interface MoviesState {
    movies: Movie[];
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
    loading: false,
    error: null,
    page: 1,
    total: 0,
    ratingFrom: 1,
    ratingTo: 10,
    yearFrom: 1990,
    yearTo: 2024,
};

const api = axios.create({
    baseURL: `https://kinopoiskapiunofficial.tech/api/v2.2`,
    headers: {
        'X-API-KEY': `c21f5cbd-d457-445d-ae24-8d899fa09727`,
    },
});

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
                console.log(response.data);
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
                state.error = action.error.message || 'Ошибка загрузки данных';
            });
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
