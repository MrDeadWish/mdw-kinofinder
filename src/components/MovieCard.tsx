import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
    movie: {
        kinopoiskId?: number;
        filmId?: number;
        nameRu?: string;
        nameOriginal?: string;
        posterUrl?: string;
        ratingKinopoisk?: number;
        genres?: { genre?: string }[];
        year?: number;
    };
}


const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const navigate = useNavigate();
    const movieID = movie.kinopoiskId ?? movie.filmId;
    const handleImageClick = () => {

        navigate(`/film/${movieID}`);
    };

    return (
        <div className="w-full p-2 border-4 border-amber-300 rounded-md">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                    src={movie.posterUrl}
                    alt={movie.nameRu || movie.nameOriginal}
                    className="w-full max-h-80 object-cover cursor-pointer"
                    onClick={handleImageClick}
                />
            </div>
            <div className="p-4">
                <h2 className="text-lg font-bold text-center">{movie.nameRu || movie.nameOriginal}</h2>
                <h3 className="font-bold text-center">{movie.year}</h3>
                <h3>Рейтинг - {movie.ratingKinopoisk}</h3>
                <h3>{movie.genres?.map((g) => g.genre).join(', ')}</h3>
            </div>
        </div>
    );
};

export default MovieCard;
