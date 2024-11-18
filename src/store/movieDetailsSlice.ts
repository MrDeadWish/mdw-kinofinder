import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../store/api';
import { RootState } from './store';

interface MovieDetails {
    kinopoiskId: number;
    nameRu: string;
    nameOriginal: string;
    description: string;
    posterUrl: string;
    ratingKinopoisk: number;
    ratingImdb: number;
    genres: { genre: string }[];
    year: number;
    trailerUrl: string;
    boxOffice: { grossWorldwide: number };
}

interface MovieDetailsState {
    movie: MovieDetails | null;
    loading: boolean;
    error: string | null;
}

const initialState: MovieDetailsState = {
    movie: null,
    loading: false,
    error: null,
};

// Thunk для получения данных о конкретном фильме
export const fetchMovieDetailsThunk = createAsyncThunk(
    'movieDetails/fetchMovieDetails',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.get(`/films/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при загрузке данных о фильме');
        }
    }
);

const movieDetailsSlice = createSlice({
    name: 'movieDetails',
    initialState,
    reducers: {
        clearMovieDetails: (state) => {
            state.movie = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieDetailsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovieDetailsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.movie = action.payload;
            })
            .addCase(fetchMovieDetailsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMovieDetails } = movieDetailsSlice.actions;
export default movieDetailsSlice.reducer;
