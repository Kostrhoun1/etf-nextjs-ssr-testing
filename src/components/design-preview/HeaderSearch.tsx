import { Search } from 'lucide-react';

/* Kompaktní vyhledávání ETF v hlavičce – odešle dotaz do screeneru (?q=).
   Nativní GET formulář, funguje bez JS. Skryté na úzkých obrazovkách. */
export default function HeaderSearch() {
  return (
    <form action="/design-preview/srovnani" role="search" className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 h-9 focus-within:border-teal-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-colors">
      <Search className="w-4 h-4 text-slate-400 shrink-0" />
      <input
        type="search"
        name="q"
        placeholder="Hledat ETF…"
        aria-label="Hledat ETF"
        className="w-36 xl:w-44 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
      />
    </form>
  );
}
