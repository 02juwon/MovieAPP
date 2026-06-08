import { Languages, Search, ShieldAlert } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { LanguageCode, SearchRequest } from '../types/movie';

interface MovieSearchFormProps {
  isLoading: boolean;
  onSearch: (request: SearchRequest) => void;
}

const languageOptions: Array<{ code: LanguageCode; label: string }> = [
  { code: 'ko-KR', label: '한국어' },
  { code: 'en-US', label: '영어' },
  { code: 'ja-JP', label: '일본어' },
];

const MovieSearchForm = memo(({ isLoading, onSearch }: MovieSearchFormProps) => {
  const [title, setTitle] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('ko-KR');

  const trimmedTitle = useMemo(() => title.trim(), [title]);

  const handleTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, []);

  const handleAdultChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIncludeAdult(event.target.checked);
  }, []);

  const handleLanguageChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as LanguageCode);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSearch({ includeAdult, language, query: trimmedTitle });
    },
    [includeAdult, language, onSearch, trimmedTitle],
  );

  return (
    <section className="border-b border-[#2e2a26] pb-8">
      <form
        className="grid gap-4 rounded-lg border border-[#3a352f] bg-[#1b1917] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.26)] md:grid-cols-2 md:items-end lg:grid-cols-[minmax(240px,1fr)_auto_auto_auto]"
        onSubmit={handleSubmit}
      >
        <label className="flex min-w-0 flex-col gap-2">
          <span className="text-sm font-semibold text-[#f8f4ee]">영화 제목</span>
          <span className="flex h-12 items-center gap-2 rounded-md border border-[#4a433b] bg-[#11100f] px-3">
            <Search size={19} className="shrink-0 text-[#43b7a7]" />
            <input
              className="h-full min-w-0 flex-1 bg-transparent text-base text-[#f8f4ee] placeholder:text-[#8d8477]"
              onChange={handleTitleChange}
              placeholder="영화 제목을 입력하세요"
              type="text"
              value={title}
            />
          </span>
        </label>

        <label className="flex h-12 items-center gap-3 rounded-md border border-[#4a433b] bg-[#11100f] px-3">
          <input
            checked={includeAdult}
            className="h-4 w-4 accent-[#e64646]"
            onChange={handleAdultChange}
            type="checkbox"
          />
          <ShieldAlert size={18} className="text-[#f2c94c]" />
          <span className="whitespace-nowrap text-sm font-semibold">성인 콘텐츠 포함</span>
        </label>

        <label className="flex h-12 items-center gap-2 rounded-md border border-[#4a433b] bg-[#11100f] px-3">
          <Languages size={18} className="text-[#43b7a7]" />
          <select
            className="h-full min-w-32 bg-transparent text-sm font-semibold text-[#f8f4ee]"
            onChange={handleLanguageChange}
            value={language}
          >
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code} className="bg-[#1b1917] text-[#f8f4ee]">
                {option.label} ({option.code})
              </option>
            ))}
          </select>
        </label>

        <button
          className="h-12 rounded-md bg-[#e64646] px-6 text-sm font-bold text-white transition hover:bg-[#ff5a5a] disabled:cursor-not-allowed disabled:bg-[#6d3a36]"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? '검색 중' : '검색'}
        </button>
      </form>
    </section>
  );
});

MovieSearchForm.displayName = 'MovieSearchForm';

export default MovieSearchForm;
