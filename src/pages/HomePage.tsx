import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPopularMovies, searchMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import MovieModal from '../components/MovieModal';
import MovieSearchForm from '../components/MovieSearchForm';
import Navbar from '../components/Navbar';
import type { LanguageCode, Movie, SearchRequest } from '../types/movie';

const POPULAR_LANGUAGE: LanguageCode = 'ko-KR';

function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // null이면 인기 영화 피드, 값이 있으면 검색 피드
  const [searchRequest, setSearchRequest] = useState<SearchRequest | null>(null);

  const [lastQuery, setLastQuery] = useState('인기 영화');
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>(POPULAR_LANGUAGE);
  const [adultFilter, setAdultFilter] = useState(false);
  // 로고 클릭 시 검색 폼 입력값까지 초기화하기 위한 리마운트 키
  const [formKey, setFormKey] = useState(0);

  const resultSummary = useMemo(() => {
    const count = movies.length.toLocaleString('ko-KR');
    const adultText = adultFilter ? '성인 콘텐츠 포함' : '성인 콘텐츠 제외';

    return `${lastQuery} · ${count}편 · ${activeLanguage} · ${adultText}`;
  }, [activeLanguage, adultFilter, lastQuery, movies.length]);

  // 같은 영화가 페이지 간 중복으로 와도 id 기준으로 한 번만 누적한다.
  const appendMovies = useCallback((incoming: Movie[]) => {
    setMovies((prev) => {
      const seen = new Set(prev.map((movie) => movie.id));
      const merged = [...prev];

      for (const movie of incoming) {
        if (!seen.has(movie.id)) merged.push(movie);
      }

      return merged;
    });
  }, []);

  const fetchPage = useCallback(
    (request: SearchRequest | null, targetPage: number) =>
      request === null
        ? getPopularMovies(POPULAR_LANGUAGE, targetPage)
        : searchMovies(request, targetPage),
    [],
  );

  // 첫 페이지 로드 (마운트 시 인기 영화 / 검색 시 검색 결과)
  const loadFirstPage = useCallback(
    async (request: SearchRequest | null) => {
      setSearchRequest(request);
      setIsLoading(true);
      setErrorMessage(null);
      setMovies([]);
      setPage(1);

      try {
        const data = await fetchPage(request, 1);
        setMovies(data.results);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '영화를 불러오는 중 문제가 발생했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPage],
  );

  // 마운트 시 인기 영화 첫 페이지 로드. setState는 비동기 콜백 안에서만 호출한다.
  useEffect(() => {
    let active = true;

    getPopularMovies(POPULAR_LANGUAGE, 1)
      .then((data) => {
        if (!active) return;
        setMovies(data.results);
        setPage(data.page);
        setTotalPages(data.totalPages);
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : '영화를 불러오는 중 문제가 발생했습니다.',
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const hasMore = page < totalPages;

  // 무한 스크롤: 다음 페이지를 이어서 불러온다.
  const handleLoadMore = useCallback(async () => {
    if (isLoading || isFetchingMore || !hasMore) return;

    const nextPage = page + 1;
    setIsFetchingMore(true);

    try {
      const data = await fetchPage(searchRequest, nextPage);
      appendMovies(data.results);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '다음 페이지를 불러오지 못했습니다.',
      );
    } finally {
      setIsFetchingMore(false);
    }
  }, [appendMovies, fetchPage, hasMore, isFetchingMore, isLoading, page, searchRequest]);

  const handleSearch = useCallback(
    (request: SearchRequest) => {
      const query = request.query.trim();

      if (!query) {
        setErrorMessage('검색할 영화 제목을 입력해주세요.');
        return;
      }

      setLastQuery(query);
      setActiveLanguage(request.language);
      setAdultFilter(request.includeAdult);
      void loadFirstPage({ ...request, query });
    },
    [loadFirstPage],
  );

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // 로고 클릭: 검색/모달 상태를 초기화하고 인기 영화 시작 화면으로 돌아간다.
  const handleGoHome = useCallback(() => {
    setSelectedMovie(null);
    setLastQuery('인기 영화');
    setActiveLanguage(POPULAR_LANGUAGE);
    setAdultFilter(false);
    setFormKey((key) => key + 1);
    void loadFirstPage(null);
  }, [loadFirstPage]);

  return (
    <div className="min-h-screen bg-[#11100f] text-[#f8f4ee]">
      <Navbar onHome={handleGoHome} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-20 pt-8">
        <MovieSearchForm key={formKey} isLoading={isLoading} onSearch={handleSearch} />
        <MovieGrid
          errorMessage={errorMessage}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
          isLoading={isLoading}
          movies={movies}
          onLoadMore={handleLoadMore}
          onSelectMovie={handleSelectMovie}
          summary={resultSummary}
        />
      </main>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}

export default HomePage;
