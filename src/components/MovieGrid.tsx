import { memo, useEffect, useRef } from 'react';
import type { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieGridProps {
  errorMessage: string | null;
  hasMore: boolean;
  isFetchingMore: boolean;
  isLoading: boolean;
  movies: Movie[];
  onLoadMore: () => void;
  onSelectMovie: (movie: Movie) => void;
  summary: string;
}

const MovieGrid = memo(
  ({
    errorMessage,
    hasMore,
    isFetchingMore,
    isLoading,
    movies,
    onLoadMore,
    onSelectMovie,
    summary,
  }: MovieGridProps) => {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // 하단 센티넬이 화면에 들어오면 다음 페이지를 불러온다 (무한 스크롤).
    useEffect(() => {
      const node = sentinelRef.current;
      if (!node || !hasMore) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) onLoadMore();
        },
        { rootMargin: '300px' },
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, [hasMore, onLoadMore]);

    return (
      <section className="flex flex-col gap-5">
        <header className="flex flex-col gap-2 border-b border-[#2e2a26] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#f8f4ee]">영화 검색 결과</h2>
            <p className="mt-1 text-sm text-[#d0c7b8]">{summary}</p>
          </div>
          {isLoading && <p className="text-sm font-semibold text-[#43b7a7]">TMDB에서 불러오는 중</p>}
        </header>

        {errorMessage && (
          <div className="rounded-lg border border-[#e64646]/50 bg-[#3a1818] px-4 py-3 text-sm text-[#ffd7d7]">
            {errorMessage}
          </div>
        )}

        {!isLoading && movies.length === 0 && (
          <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-[#4a433b] text-center text-[#d0c7b8]">
            검색 결과가 없습니다.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} />
          ))}
        </div>

        {/* 무한 스크롤 감지용 센티넬 */}
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />

        {isFetchingMore && (
          <p className="py-2 text-center text-sm font-semibold text-[#43b7a7]">더 불러오는 중…</p>
        )}

        {!hasMore && !isLoading && movies.length > 0 && (
          <p className="py-2 text-center text-sm text-[#8d8477]">마지막 결과까지 모두 불러왔어요.</p>
        )}
      </section>
    );
  },
);

MovieGrid.displayName = 'MovieGrid';

export default MovieGrid;
