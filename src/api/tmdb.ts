import type { LanguageCode, Movie, SearchRequest } from '../types/movie';

interface TmdbSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieListResult {
  results: Movie[];
  page: number;
  totalPages: number;
}

const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_POPULAR_URL = 'https://api.themoviedb.org/3/movie/popular';
const TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/movie';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p';

// .env.example 의 예시 값이 그대로 남아 있으면 미설정으로 간주한다.
const PLACEHOLDER_VALUES = new Set(['your_tmdb_read_access_token', 'your_tmdb_v3_api_key']);

const sanitizeEnv = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  if (!trimmed || PLACEHOLDER_VALUES.has(trimmed)) return undefined;
  return trimmed;
};

const accessToken = sanitizeEnv(import.meta.env.VITE_TMDB_ACCESS_TOKEN as string | undefined);
const apiKey = sanitizeEnv(import.meta.env.VITE_TMDB_API_KEY as string | undefined);

export const getTmdbImageUrl = (
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500',
) => {
  if (!path) return null;

  return `${TMDB_IMAGE_URL}/${size}${path}`;
};

// 인증 정보를 params(api_key) 또는 headers(Bearer)에 적용한다.
// Access Token(Bearer) 우선, 없으면 v3 api_key 로 폴백.
const applyAuth = (params: URLSearchParams): HeadersInit => {
  if (!accessToken && !apiKey) {
    throw new Error('TMDB 환경 변수가 없습니다. VITE_TMDB_ACCESS_TOKEN 또는 VITE_TMDB_API_KEY를 설정해주세요.');
  }

  const headers: HeadersInit = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else if (apiKey) {
    params.set('api_key', apiKey);
  }

  return headers;
};

const fetchMovieList = async (
  baseUrl: string,
  params: URLSearchParams,
  errorLabel: string,
): Promise<MovieListResult> => {
  const headers = applyAuth(params);

  const response = await fetch(`${baseUrl}?${params.toString()}`, { headers });

  if (!response.ok) {
    throw new Error(`${errorLabel} 실패: ${response.status}`);
  }

  const data = (await response.json()) as TmdbSearchResponse;

  return { results: data.results, page: data.page, totalPages: data.total_pages };
};

export const searchMovies = async (
  { query, includeAdult, language }: SearchRequest,
  page = 1,
): Promise<MovieListResult> => {
  const params = new URLSearchParams({
    include_adult: String(includeAdult),
    language,
    page: String(page),
    query,
  });

  return fetchMovieList(TMDB_SEARCH_URL, params, 'TMDB 검색 요청');
};

export const getPopularMovies = async (
  language: LanguageCode = 'ko-KR',
  page = 1,
): Promise<MovieListResult> => {
  const params = new URLSearchParams({
    language,
    page: String(page),
  });

  return fetchMovieList(TMDB_POPULAR_URL, params, 'TMDB 인기 영화 요청');
};

// 단일 영화 상세 조회 (/movies/:movieId 라우트에서 새로고침/딥링크로도 동작하도록 id 기준 조회)
export const getMovieDetails = async (
  movieId: string | number,
  language: LanguageCode = 'ko-KR',
): Promise<Movie> => {
  const params = new URLSearchParams({ language });
  const headers = applyAuth(params);

  const response = await fetch(`${TMDB_MOVIE_URL}/${movieId}?${params.toString()}`, { headers });

  if (!response.ok) {
    throw new Error(`TMDB 영화 상세 요청 실패: ${response.status}`);
  }

  return (await response.json()) as Movie;
};
