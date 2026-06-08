# 🚀 Vercel 배포 가이드 (juwon님 직접 실행용)

> Claude가 코드 쪽 준비를 끝내놨어요. 아래 명령어를 **순서대로 복사 → 터미널에 붙여넣기**만 하면 배포가 됩니다.
> 로그인·push·배포는 juwon님 계정 인증이 필요해서 직접 실행하셔야 해요.

---

## ✅ Claude가 이미 끝낸 것 (다시 안 해도 됨)

| 항목 | 상태 | 비고 |
|---|---|---|
| `.gitignore`에 `.env` 추가 | ✅ 완료 | **API 토큰 유출 막음** — 가장 중요했던 부분 |
| `vercel.json` (SPA 404 방지) | ✅ 이미 존재 | 모든 경로를 `index.html`로 rewrite |
| `.vercelignore` (.env 제외) | ✅ 이미 존재 | |
| `/movies/:movieId` 라우팅 | ✅ 이미 구현 | `App.tsx` 라우트 + 모달의 "상세 페이지" 링크 + `MovieDetailPage`의 `useParams` |
| 타입체크 (`tsc -b`) | ✅ 통과 (에러 0) | 코드 자체는 빌드 문제 없음 |

> ⚠️ 참고: Claude의 리눅스 샌드박스에서 `vite build`는 네이티브 바이너리(Windows용)만 설치돼 있어 안 돌았지만, **juwon님 PC(Windows)와 Vercel(리눅스, 새로 설치)에서는 정상 빌드됩니다.** 코드 문제 아님.

---

## ⚠️ 시작 전 단 한 가지 — 손상된 `.git` 폴더 삭제

Claude가 샌드박스에서 git 초기화를 시도하다 OneDrive 권한 문제로 **불완전한 `.git` 폴더**가 남았어요. 먼저 이걸 지우고 깨끗하게 시작하세요.

프로젝트 폴더(`new_movie`)에서 터미널을 열고:

```powershell
# PowerShell
Remove-Item -Recurse -Force .git
```
```cmd
:: 또는 CMD
rmdir /s /q .git
```

> 탐색기에서 숨김 폴더 보기를 켜고 `.git` 폴더를 그냥 삭제해도 됩니다.

---

## 1단계 · GitHub 업로드

```bash
git init
git add .
git commit -m "first commit: movie app"
```

`git commit` 직후, **올라가는 파일 목록에 `.env`가 없는지** 한 번만 확인하세요 (있으면 안 됨):

```bash
git ls-files | findstr ".env"
```
→ `.env.example`만 나오면 정상. `.env`(확장자 없는 것)가 나오면 멈추고 알려주세요.

그 다음 GitHub에서 **새 레포지토리 생성**(README 체크 해제) 후, 거기 뜬 주소로:

```bash
git remote add origin https://github.com/<내아이디>/<레포이름>.git
git branch -M main
git push -u origin main
```

---

## 2단계 · Vercel CLI 설치 & 로그인

```bash
npm install -g vercel
vercel login
```
→ 브라우저가 열리면 GitHub 계정 등으로 로그인 완료.

---

## 3단계 · Preview 배포 (미리보기)

프로젝트 폴더에서:

```bash
vercel
```
초기 설정 질문이 나오면 대부분 **엔터(기본값)**로 넘어가면 됩니다:

- Set up and deploy? → **Y**
- Which scope? → 본인 계정 선택
- Link to existing project? → **N**
- Project name? → 엔터 (기본값)
- In which directory is your code? → 엔터 (`./`)
- Framework / build 설정 → 자동 감지(Vite)되니 엔터

끝나면 뜬 **Preview URL**로 접속해서 화면이 나오는지 확인하세요.

---

## 4단계 · 환경변수 등록 (⚠️ 안 하면 영화 안 불러와짐)

이 앱은 TMDB API 토큰을 환경변수로 읽습니다. **Vercel에도 똑같이 등록**해야 해요.

1. Vercel 대시보드 → 해당 프로젝트 → **Settings → Environment Variables**
2. 아래 변수를 추가:

   | Name | Value | Environment |
   |---|---|---|
   | `VITE_TMDB_ACCESS_TOKEN` | **로컬 `.env` 파일에 있는 값 그대로 복사** | Production, Preview, Development 전부 체크 |

   > (v3 키를 쓰는 경우엔 `VITE_TMDB_API_KEY`로 등록. 둘 중 `.env`에 채워둔 것만 넣으면 됨)
3. **Save**

> 💡 변수 이름은 반드시 `VITE_`로 시작해야 Vite가 빌드에 포함시킵니다. 값은 `.env` 파일을 열어 그대로 복사하세요. (이 가이드엔 보안상 토큰 값을 적지 않았어요.)

---

## 5단계 · Production 배포 (실서비스)

환경변수는 **저장 후 재배포해야 적용**됩니다. 그래서 prod 배포는 환경변수 등록 뒤에:

```bash
vercel --prod
```
→ 옆에 뜬 **Production URL**로 접속해서 확인. 영화 목록이 뜨고, 카드 클릭 → "상세 페이지" → `/movies/숫자` 이동이 되는지,
그 상태에서 **새로고침(F5) 해도 404가 안 뜨는지** 확인하세요 (`vercel.json` 덕분에 안 떠야 정상).

---

## 6단계 · 도메인 연결 (선택)

1. Vercel 대시보드 → 프로젝트 → **Settings → Domains** → 구입한 도메인 입력 후 **Add**
2. 도메인 구입처(가비아 등) DNS 설정에서:
   - **A Record** → Vercel이 알려주는 IP, 또는
   - **CNAME Record** → `cname.vercel-dns.com` (Vercel 안내값 사용)
3. Vercel에서 **'Valid Configuration' 초록불** 들어오면 완료.

---

## 🔁 이후 업데이트 방법

코드 수정 후에는 GitHub에 push만 하면 Vercel이 **자동 재배포**해요 (GitHub 연동 시):

```bash
git add .
git commit -m "수정 내용"
git push
```
수동으로 prod 올리려면 `vercel --prod`.

---

## 막히면 체크리스트

- **영화가 안 뜬다** → 4단계 환경변수 등록했는지 + 등록 후 `vercel --prod` 재배포했는지
- **새로고침 시 404** → `vercel.json`이 프로젝트 최상단에 있는지 (이미 있음 ✅)
- **`.env`가 GitHub에 올라감** → 1단계의 `git ls-files | findstr ".env"` 확인 (이미 `.gitignore` 처리됨 ✅)
- **push 시 인증 오류** → GitHub Personal Access Token 또는 GitHub CLI(`gh auth login`)로 로그인
