import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAllBanks } from "@/hooks/useBanks";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { useAppStore } from "@/store/useAppStore";
import { ROUTES } from "@/constants";
import { BankLogo } from "@/components/shared/BankLogo";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const { data: banks = [] } = useAllBanks();
  const { query, setQuery, results } = useFuzzySearch(banks);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const addSearchTerm = useAppStore((s) => s.addSearchTerm);
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed);

  const shown = results.slice(0, 7);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, setQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Global "/" shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        onOpenChange(true);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  function goTo(bankId: string) {
    addRecentlyViewed(bankId);
    if (query.trim()) addSearchTerm(query);
    onOpenChange(false);
    navigate(ROUTES.bank(bankId));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, shown.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (shown[activeIndex]) goTo(shown[activeIndex].id);
      else if (query.trim()) {
        addSearchTerm(query);
        onOpenChange(false);
        navigate(`${ROUTES.search}?q=${encodeURIComponent(query)}`);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-xl top-[18%] translate-y-0">
        <DialogTitle className="sr-only">Search banks</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, acronym, SWIFT code, county…"
            className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {shown.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No banks match "{query}". Try a bank name, acronym, or SWIFT code.
            </p>
          )}
          {shown.map((bank, i) => (
            <button
              key={bank.id}
              onClick={() => goTo(bank.id)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                i === activeIndex ? "bg-forest-600 text-white" : "hover:bg-secondary"
              }`}
            >
              <BankLogo bank={bank} size={36} />
              <span className="flex-1 min-w-0">
                <span className="block truncate text-sm font-medium">{bank.name}</span>
                <span className={`block truncate text-xs ${i === activeIndex ? "text-white/70" : "text-muted-foreground"}`}>
                  {bank.banking.swiftCode} · {bank.category}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 opacity-60 shrink-0" />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> {banks.length} licensed banks indexed
          </span>
          <span>↑↓ to navigate · ↵ to select · esc to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
