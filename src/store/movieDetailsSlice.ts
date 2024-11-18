import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../store/api';
import { RootState } from './store';

interface Movie {
    kinopoiskId: number;
    nameRu: string;
    nameOriginal: string;
    description: string;
    posterUrl: string;
    ratingKinopoisk: number;
    ratingImdb: number;
    genres: { genre: string }[];
    year: number;
    trailerUrl?: string;
    boxOffice?: { grossWorldwide: number };
}

interface MovieDetailsState {
    movie: Movie | null;
    similarMovies: Movie[];
    loading: boolean;
    error: string | null;
}

const initialState: MovieDetailsState = {
    movie: null,
    similarMovies: [],
    loading: false,
    error: null,
};

export const fetchMovieDetailsThunk = createAsyncThunk(
    'movieDetails/fetchMovieDetails',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/films/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при загрузке данных о фильме');
        }
    }
);

export const fetchSimilarMoviesThunk = createAsyncThunk(
    'movieDetails/fetchSimilarMovies',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/films/${id}/similars`);
            console.log("Detail response:",response.data);
            return response.data.items;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при загрузке похожих фильмов');
        }
    }
);

const movieDetailsSlice = createSlice({
    name: 'movieDetails',
    initialState,
    reducers: {
        clearMovieDetails: (state) => {
            state.movie = null;
            state.similarMovies = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Детальная информация о фильме
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
            })

            // Похожие фильмы
            .addCase(fetchSimilarMoviesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarMoviesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.similarMovies = action.payload;
            })
            .addCase(fetchSimilarMoviesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMovieDetails } = movieDetailsSlice.actions;
export default movieDetailsSlice.reducer;
