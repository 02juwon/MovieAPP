import { CalendarDays, Star } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { getTmdbImageUrl } from '../api/tmdb';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
}

const MovieCard = memo(({ movie, onSelectMovie }: MovieCardProps) => {
  const posterUrl = useMemo(() => getTmdbImageUrl(movie.poster_path, 'w500'), [movie.poster_path]);

  const voteAverage = useMemo(() => movie.vote_average.toFixed(1), [movie.vote_average]);

  const releaseYear = useMemo(() => {
    if (!movie.release_date) return '개봉일 미정';

    return movie.release_date.slice(0, 4);
  }, [movie.release_date]);

  const handleClick = useCallback(() => {
    onSelectMovie(movie);
  }, [movie, onSelectMovie]);

  return (
    <button
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#3a352f] bg-[#1b1917] text-left transition hover:-translate-y-1 hover:border-[#43b7a7] hover:shadow-[0_20px_55px_rgba(0,0,0,0.35)]"
      onClick={handleClick}
      type="button"
    >
      <div className="aspect-[2/3] w-full bg-[#2b2722]">
        {posterUrl ? (
          <img
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover"
            loading="lazy"
            src={posterUrl}
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center text-sm font-semibold text-[#d0c7b8]">
            포스터 준비 중
          </div>
        )}
      </div>

      <div className="flex min-h-36 flex-1 flex-col justify-between gap-3 p-3">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-[#f8f4ee]">{movie.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-[#d0c7b8]">{movie.original_title}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#d0c7b8]">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#2b2722] px-2 py-1">
            <Star size={14} className="fill-[#f2c94c] text-[#f2c94c]" />
            {voteAverage}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#2b2722] px-2 py-1">
            <CalendarDays size={14} className="text-[#43b7a7]" />
            {releaseYear}
          </span>
        </div>
      </div>
    </button>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
