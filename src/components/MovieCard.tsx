import React from 'react';

interface MovieCardProps {
    title: string;
    imageUrl: string;
    ratingKinopoisk: number;
    genres: string[];
    year: number;
}

const MovieCard: React.FC<MovieCardProps> = (
    {title, imageUrl,ratingKinopoisk,genres,year }) => {
    return (
        <div className="w-full p-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-90 object-cover"
                />
                <div className="p-4">
                    <h2 className="text-lg font-bold text-center">{title}</h2>
                    <h3 className="font-bold text-center">{year}</h3>
                    <h3>Рейтинг - {ratingKinopoisk}</h3>
                    <h3>{genres.join(', ')}</h3>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;