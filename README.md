# UMC Movie Finder

TMDB API로 영화를 검색하고 둘러보는 React 단일 페이지 앱입니다.

## 주요 기능

- **인기 영화 피드**: 첫 진입 시 TMDB 인기 영화를 보여줍니다.
- **영화 검색**: 제목으로 검색하며 언어(한/영/일)와 성인 콘텐츠 포함 여부를 선택할 수 있습니다.
- **무한 스크롤**: `IntersectionObserver`로 하단에 도달하면 다음 페이지를 이어서 불러옵니다. (id 기준 중복 제거)
- **상세 모달**: 카드를 누르면 포스터·평점·줄거리·IMDb 검색 링크를 모달로 보여줍니다. (Esc/배경 클릭으로 닫기)
- **상세 라우트**: `/movies/:movieId` 로 이동하면 새로고침·딥링크에도 동작하는 상세 페이지가 열립니다.

## 기술 스택

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router v7
- lucide-react (아이콘)

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입 체크 + 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint
```

## TMDB 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 아래 둘 중 하나를 채우면 됩니다.
Access Token(Bearer)이 있으면 우선 사용하고, 없으면 v3 API Key로 폴백합니다.

```bash
VITE_TMDB_ACCESS_TOKEN=...   # TMDB Read Access Token
# 또는
VITE_TMDB_API_KEY=...        # TMDB v3 API Key
```

> `.env` 는 커밋되지 않습니다. 키가 노출됐다면 TMDB에서 재발급하세요.

## 폴더 구조

```
src/
├─ api/tmdb.ts            # TMDB 검색·인기·상세 요청, 인증/이미지 URL 헬퍼
├─ components/
│  ├─ Navbar.tsx          # 상단 바 (로고 클릭 시 홈 초기화)
│  ├─ MovieSearchForm.tsx # 제목/언어/성인 필터 검색 폼
│  ├─ MovieGrid.tsx       # 결과 그리드 + 무한 스크롤 센티넬
│  ├─ MovieCard.tsx       # 개별 영화 카드
│  └─ MovieModal.tsx      # 상세 모달
├─ pages/
│  ├─ HomePage.tsx        # 검색·피드·무한 스크롤 상태 관리
│  └─ MovieDetailPage.tsx # /movies/:movieId 상세
└─ types/movie.ts         # 공용 타입
```

## 렌더링 최적화

- **`React.memo`**: `Navbar`, `MovieSearchForm`, `MovieGrid`, `MovieCard`, `MovieModal` — props가 같으면 재렌더링을 건너뜁니다.
- **`useCallback`**: 검색 제출, 카드 선택, 모달 닫기, 무한 스크롤 로더 등 자식에 넘기는 핸들러를 안정적인 참조로 유지합니다.
- **`useMemo`**: 결과 요약 문구, 포스터/배경 이미지 URL, 평점 포맷, IMDb 검색 URL 등 파생 값을 캐싱합니다.

## 배포

Vercel용 SPA 라우팅 리라이트(`vercel.json`)가 포함되어 있어, 직접 URL 접근 시에도 `index.html` 로 폴백합니다.
