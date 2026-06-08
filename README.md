# UMC Week10 Mission 1 - Movie Finder

TMDB 영화 검색 API를 사용하는 React 미션 앱입니다.

## 실행

```bash
npm install
npm run dev
```

## TMDB 환경 변수

`.env` 파일에 아래 둘 중 하나를 설정하면 실제 검색 API가 동작합니다.

```bash
VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
# or
VITE_TMDB_API_KEY=your_tmdb_v3_api_key
```

## 적용한 최적화 정리

- `React.memo`: `Navbar`, `MovieSearchForm`, `MovieGrid`, `MovieCard`, `MovieModal`에 적용해 props가 같을 때 재렌더링을 줄였습니다.
- `useCallback`: 검색 제출, 카드 선택, 모달 닫기, 폼 입력 핸들러를 안정적인 함수 참조로 유지했습니다.
- `useMemo`: 검색 요약 문구, 포스터 URL, 평점 포맷, 정렬된 영화 목록처럼 계산 결과를 재사용했습니다.

## LP 페이지 성능 개선 포인트

- 리스트 아이템 컴포넌트를 `memo`로 감싸 동일한 장바구니 항목의 불필요한 재렌더링을 줄일 수 있습니다.
- Zustand selector를 잘게 나눠 필요한 상태만 구독하면 상위 컨테이너 리렌더링 범위를 줄일 수 있습니다.
- `hero.png` 같은 큰 이미지는 `loading`, 명확한 크기, 압축 포맷을 적용해 초기 로딩 비용을 낮출 수 있습니다.

React DevTools Profiler 캡처는 로컬 브라우저 확장 프로그램 설치 후 검색 전후 커밋을 비교하면 됩니다.
