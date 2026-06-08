import { Clapperboard } from 'lucide-react';
import { memo } from 'react';

interface NavbarProps {
  onHome: () => void;
}

const Navbar = memo(({ onHome }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-20 border-b border-[#2e2a26] bg-[#11100f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center px-5">
        <button
          type="button"
          onClick={onHome}
          aria-label="홈으로 이동"
          className="flex items-center gap-2.5 rounded-md transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#43b7a7]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e64646] text-white">
            <Clapperboard size={23} />
          </span>
          <span className="text-xl font-bold">
            UMC <span className="font-medium text-[#d0c7b8]">Movie Finder</span>
          </span>
        </button>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
