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
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { page, movies } = state.movies;

        let uniqueMovies: Movie[] = [...movies];
        let currentPage = page;

        // Цикл будет продолжаться до тех пор, пока не наберём 25 уникальных фильмов
        while (uniqueMovies.length < movies.length + 25) {
            try {
                const response = await api.get('/films', {
                    params: {
                        page: currentPage,
                        ratingFrom: 1,
                        ratingTo: 10,
                        yearFrom: 1990,
                        yearTo: 2024,
                    },
                });
                const { items, total } = response.data;
                if (!items || items.length === 0) break;
                const newMovies = items.filter(
                    (item: Movie) => !uniqueMovies.some(movie => movie.kinopoiskId === item.kinopoiskId)
                );

                uniqueMovies = [...uniqueMovies, ...newMovies];
                currentPage += 1;
                if (uniqueMovies.length >= total) break;

            } catch (error: any) {
                console.error("Ошибка при загрузке данных:", error);
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

export const { incrementPage } = moviesSlice.actions;
export default moviesSlice.reducer;
