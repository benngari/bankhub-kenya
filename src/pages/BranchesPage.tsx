import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Phone, Clock, Landmark, Accessibility } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BankLogo } from "@/components/shared/BankLogo";
import { useAllBranches, useAllBanks } from "@/hooks/useBanks";
import { useBranchFuzzySearch } from "@/hooks/useFuzzySearch";
import { COUNTIES_KENYA, ROUTES } from "@/constants";
import type { Branch } from "@/types/bank";

export default function BranchesPage() {
  const { data: branches = [], isLoading } = useAllBranches();
  const { data: banks = [] } = useAllBanks();
  const bankMap = useMemo(() => Object.fromEntries(banks.map((b) => [b.id, b])), [banks]);

  const { query, setQuery, results } = useBranchFuzzySearch<Branch>(branches, [
    "name",
    "county",
    "town",
  ] as (keyof Branch)[]);
  const [county, setCounty] = useState<string>("all");

  const filtered = useMemo(
    () => (county === "all" ? results : results.filter((b) => b.county === county)),
    [results, county]
  );

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Branch directory</h1>
      <p className="mt-1 text-muted-foreground">
        {branches.length} branches across {banks.length} banks — search by branch name, town, or county.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search branch name, town, or county…"
            className="h-12 pl-11"
          />
        </div>
        <select
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          className="h-12 rounded-xl border border-input bg-background px-3.5 text-sm sm:w-56"
        >
          <option value="all">All counties</option>
          {COUNTIES_KENYA.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {isLoading ? "Loading…" : `${filtered.length} branch${filtered.length === 1 ? "" : "es"} found`}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
          : filtered.map((branch) => {
              const bank = bankMap[branch.bankId];
              return (
                <div key={branch.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  {bank && (
                    <Link to={ROUTES.bank(bank.id)} className="flex items-center gap-2.5 mb-3">
                      <BankLogo bank={bank} size={30} />
                      <span className="text-sm font-semibold hover:text-forest-600">{bank.shortName}</span>
                    </Link>
                  )}
                  <p className="font-medium text-sm">{branch.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {branch.address}, {branch.county}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                    <Phone className="h-3.5 w-3.5" /> {branch.phone}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                    <Clock className="h-3.5 w-3.5" /> {branch.hours}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {branch.hasAtm && (
                      <Badge variant="secondary" className="gap-1">
                        <Landmark className="h-3 w-3" /> ATM
                      </Badge>
                    )}
                    {branch.wheelchairAccessible && (
                      <Badge variant="secondary" className="gap-1">
                        <Accessibility className="h-3 w-3" /> Accessible
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {!isLoading && filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">No branches match your search.</p>
      )}
    </div>
  );
}
