import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
}

const initialState: MoviesState = {
    movies: [],
    loading: false,
    error: null,
    page: 1,
    total: 0,
};

const api = axios.create({
    baseURL: `https://kinopoiskapiunofficial.tech/api/v2.2`,
    headers: {
        'X-API-KEY': `c21f5cbd-d457-445d-ae24-8d899fa09727`,
    },
});

export const fetchMoviesGroupThunk = createAsyncThunk(
    'movies/fetchMoviesGroup',
    async (page: number, { getState }) => {
        const response = await api.get('/films', {
            params: {
                page,
                ratingFrom: 1,
                ratingTo: 10,
                yearFrom: 1990,
                yearTo: 2024,
            },
        });
        console.log("Responce data: ", response.data);
        const { items, total } = response.data;
        return { items, total };
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        incrementPage(state) {
            state.page += 1;
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
                state.movies = [...state.movies, ...action.payload.items];
                state.total = action.payload.total;
            })
            .addCase(fetchMoviesGroupThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка загрузки данных';
            });
    },
});

export const { incrementPage } = moviesSlice.actions;
export default moviesSlice.reducer;
