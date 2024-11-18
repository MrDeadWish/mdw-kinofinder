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
    trailerUrl?: any;
    boxOffice?: { grossWorldwide: number };
    currencyChar?: string;
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

interface BoxOfficeItem {
    type: string;
    amount: number;
    currencyCode: string;
    name: string;
    symbol: string;
}


export const fetchMovieDetailsThunk = createAsyncThunk(
    'movieDetails/fetchMovieDetails',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/films/${id}`);
            console.log("Details response:",response.data);
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
            console.log("Similar response:",response.data);
            return response.data.items;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при загрузке похожих фильмов');
        }
    }
);

export const fetchMovieTrailerThunk = createAsyncThunk(
    'movieDetails/fetchMovieTrailer',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/films/${id}/videos`);
            console.log("Video response:",response.data);
            const youtubeTrailer = response.data.items.find(
                (item: { site: string }) => item.site === 'YOUTUBE'
            );
            if (youtubeTrailer && youtubeTrailer.url) {
                const videoId = youtubeTrailer.url.split('v=')[1];
                return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
            }
            return  null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при загрузке трейлера');
        }
    }
);

export const fetchBoxOfficeThunk = createAsyncThunk(
    'movieDetails/fetchBoxOffice',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/films/${id}/box_office`);
            console.log("BoxOffice response:", response.data);
            // Найдем item с типом 'BUDGET' и вернем amount и symbol
            const boxOfficeItem = response.data.items.find((item: BoxOfficeItem) => item.type === 'BUDGET');
            return boxOfficeItem ? { amount: boxOfficeItem.amount, symbol: boxOfficeItem.symbol } : { amount: 0, symbol: '' };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Ошибка при загрузке данных о сборах');
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

            .addCase(fetchMovieTrailerThunk.fulfilled, (state, action) => {
                if (state.movie) {
                    state.movie.trailerUrl = action.payload;
                }
            })

            .addCase(fetchBoxOfficeThunk.fulfilled, (state, action) => {
                if (state.movie) {
                    state.movie.boxOffice = action.payload.amount;
                    state.movie.currencyChar = action.payload.symbol;
                }
            })
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
