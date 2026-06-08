import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieDetails, getTmdbImageUrl } from '../api/tmdb';
import type { Movie } from '../types/movie';

// 미션 2 요구사항: react-router-dom 으로 /movies/:movieId 라우팅 (디자인은 최소)
function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 라우트 진입마다 컴포넌트가 새로 마운트되므로 초기 상태(로딩=true)로 시작한다.
  // setState는 비동기 콜백 안에서만 호출한다.
  useEffect(() => {
    if (!movieId) return;

    let active = true;

    getMovieDetails(movieId)
      .then((data) => {
        if (active) setMovie(data);
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : '영화 정보를 불러오지 못했습니다.',
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [movieId]);

  const posterUrl = movie ? getTmdbImageUrl(movie.poster_path, 'w500') : null;

  return (
    <div className="min-h-screen bg-[#11100f] px-5 py-8 text-[#f8f4ee]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#43b7a7] hover:underline"
        >
          ← 홈으로
        </Link>

        <p className="text-xs text-[#8d8477]">현재 라우트: /movies/{movieId}</p>

        {isLoading && <p className="text-[#d0c7b8]">불러오는 중…</p>}
        {errorMessage && (
          <p className="rounded-md border border-[#e64646]/50 bg-[#3a1818] px-4 py-3 text-sm text-[#ffd7d7]">
            {errorMessage}
          </p>
        )}

        {movie && (
          <article className="flex flex-col gap-5 sm:flex-row">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={`${movie.title} 포스터`}
                className="w-44 shrink-0 self-start rounded-lg border border-[#3a352f]"
              />
            )}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{movie.title}</h1>
              <p className="text-sm text-[#d0c7b8]">{movie.original_title}</p>
              <p className="text-sm text-[#d0c7b8]">
                평점 {movie.vote_average?.toFixed(1) ?? '-'} · 개봉 {movie.release_date || '미정'}
              </p>
              <p className="mt-2 leading-7 text-[#e3d8cb]">
                {movie.overview || '등록된 줄거리가 없습니다.'}
              </p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

export default MovieDetailPage;
