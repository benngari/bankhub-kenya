import { useEffect, useMemo, useState } from "react";
import type * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BankCard } from "@/components/shared/BankCard";
import { useAllBanks } from "@/hooks/useBanks";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES } from "@/constants";
import type { BankCategory } from "@/types/bank";

export default function SearchResultsPage() {
  const [params, setParams] = useSearchParams();
  const { data: banks = [], isLoading } = useAllBanks();
  const { query, setQuery, results } = useFuzzySearch(banks);
  const [category, setCategory] = useState<BankCategory | "all">(
    (params.get("category") as BankCategory) || "all"
  );
  const addSearchTerm = useAppStore((s) => s.addSearchTerm);
  const searchHistory = useAppStore((s) => s.searchHistory);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = params.get("q");
    if (q) setQuery(q);
    const c = params.get("category") as BankCategory | null;
    if (c) setCategory(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (category !== "all") next.set("category", category);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  const filtered = useMemo(
    () => (category === "all" ? results : results.filter((b) => b.category === category)),
    [results, category]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) addSearchTerm(query);
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Search banks</h1>
      <p className="mt-1 text-muted-foreground">
        Search by name, acronym, bank code, SWIFT code, product, branch, or county.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Equity, KCB, EQBLKENA, Kisumu, Mortgages…"
            className="h-12 rounded-full pl-11 pr-4 text-base"
            autoFocus
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => setShowFilters((s) => !s)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {category !== "all" && <Badge className="ml-1">{category}</Badge>}
        </Button>
      </form>

      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            All categories
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.label} active={category === c.label} onClick={() => setCategory(c.label)}>
              {c.label}
            </FilterChip>
          ))}
        </div>
      )}

      {!query && searchHistory.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Recent searches:</span>
          {searchHistory.slice(0, 6).map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-forest-400 hover:text-forest-600"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
        </p>
        {(query || category !== "all") && (
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full" />)
          : filtered.map((bank, i) => <BankCard key={bank.id} bank={bank} index={i} />)}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">No banks match your search.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a shorter term, a bank acronym, or clear your filters.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-forest-600 bg-forest-600 text-white"
          : "border-border bg-card hover:border-forest-400"
      }`}
    >
      {children}
    </button>
  );
}
