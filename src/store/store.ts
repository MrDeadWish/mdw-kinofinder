import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './movieSlice';
import movieDetailsReducer from "./movieDetailsSlice";
import {useDispatch} from "react-redux";

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        movieDetails: movieDetailsReducer,
    },
});

// Типизация для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
