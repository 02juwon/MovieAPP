import { CalendarDays, ExternalLink, Film, Star, X } from 'lucide-react';
import { memo, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getTmdbImageUrl } from '../api/tmdb';
import type { Movie } from '../types/movie';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = memo(({ movie, onClose }: MovieModalProps) => {
  const posterUrl = useMemo(() => getTmdbImageUrl(movie.poster_path, 'w780'), [movie.poster_path]);

  const backdropUrl = useMemo(() => getTmdbImageUrl(movie.backdrop_path, 'w780'), [movie.backdrop_path]);

  const imdbSearchUrl = useMemo(
    () => `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`,
    [movie.title],
  );

  const voteAverage = useMemo(() => movie.vote_average.toFixed(1), [movie.vote_average]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
    >
      <article
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#3a352f] bg-[#1b1917] shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-[#2b2722] px-5 pb-5 pt-6">
          <div className="absolute inset-0 opacity-30">
            {backdropUrl ? (
              <img
                alt={`${movie.title} 배경 이미지`}
                className="h-full w-full object-cover blur-sm"
                src={backdropUrl}
              />
            ) : (
              <div className="h-full bg-[#2b2722]" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#1b1917]/40 to-[#1b1917]" />
          <button
            aria-label="모달 닫기"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-md bg-black/60 text-white transition hover:bg-[#e64646]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>

          <div className="relative mx-auto aspect-[2/3] w-44 overflow-hidden rounded-lg border border-[#4a433b] bg-[#11100f] shadow-[0_16px_50px_rgba(0,0,0,0.48)] sm:w-52">
            {posterUrl ? (
              <img alt={`${movie.title} 포스터`} className="h-full w-full object-cover" src={posterUrl} />
            ) : (
              <div className="grid h-full place-items-center px-4 text-center text-sm font-semibold text-[#d0c7b8]">
                포스터 준비 중
              </div>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mx-auto flex max-w-xl min-w-0 flex-col gap-4 text-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[#f8f4ee]">{movie.title}</h2>
              <p className="mt-1 text-sm text-[#d0c7b8]">{movie.original_title}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#2b2722] px-3 py-2 text-[#f8f4ee]">
                <Star size={16} className="fill-[#f2c94c] text-[#f2c94c]" />
                {voteAverage}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#2b2722] px-3 py-2 text-[#f8f4ee]">
                <CalendarDays size={16} className="text-[#43b7a7]" />
                {movie.release_date || '개봉일 미정'}
              </span>
              {movie.adult && <span className="rounded-md bg-[#e64646] px-3 py-2 text-white">Adult</span>}
            </div>

            <p className="text-left text-base leading-7 text-[#e3d8cb]">
              {movie.overview || '등록된 줄거리가 없습니다.'}
            </p>

            <div className="flex flex-col gap-3 border-t border-[#3a352f] pt-4 sm:flex-row sm:justify-center">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#e64646] px-4 text-sm font-bold text-white transition hover:bg-[#ff5a5a]"
                href={imdbSearchUrl}
                rel="noreferrer"
                target="_blank"
              >
                IMDb에서 검색하기
                <ExternalLink size={17} />
              </a>
              <Link
                to={`/movies/${movie.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#4a433b] bg-[#11100f] px-4 text-sm font-bold text-[#f8f4ee] transition hover:border-[#43b7a7]"
              >
                상세 페이지
                <Film size={17} />
              </Link>
              <button
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#4a433b] bg-[#11100f] px-4 text-sm font-bold text-[#f8f4ee] transition hover:border-[#43b7a7]"
                onClick={onClose}
                type="button"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
});

MovieModal.displayName = 'MovieModal';

export default MovieModal;
