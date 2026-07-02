import { useMemo, useState } from "react";
import { MapPin, Phone, Clock, Landmark, Accessibility, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Branch } from "@/types/bank";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function BranchList({ branches }: { branches: Branch[] }) {
  const [query, setQuery] = useState("");
  const bookmarked = useAppStore((s) => s.bookmarkedBranchIds);
  const toggleBookmark = useAppStore((s) => s.toggleBookmarkBranch);

  const filtered = useMemo(() => {
    if (!query.trim()) return branches;
    const q = query.toLowerCase();
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.county.toLowerCase().includes(q) ||
        b.town.toLowerCase().includes(q)
    );
  }, [branches, query]);

  if (branches.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No branch data available for this bank yet.</p>;
  }

  return (
    <div>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search branch, town, or county…"
          className="pl-10"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {filtered.map((branch) => (
          <div key={branch.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{branch.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="h-3.5 w-3.5" /> {branch.address}, {branch.county}
                </p>
              </div>
              <button
                onClick={() => toggleBookmark(branch.id)}
                className={cn(
                  "shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium",
                  bookmarked.includes(branch.id)
                    ? "border-forest-600 bg-forest-600 text-white"
                    : "border-border text-muted-foreground"
                )}
              >
                {bookmarked.includes(branch.id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {branch.phone}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {branch.hours}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {branch.hasAtm && (
                <Badge variant="secondary" className="gap-1">
                  <Landmark className="h-3 w-3" /> ATM on-site
                </Badge>
              )}
              {branch.wheelchairAccessible && (
                <Badge variant="secondary" className="gap-1">
                  <Accessibility className="h-3 w-3" /> Accessible
                </Badge>
              )}
              <Button
                asChild
                variant="link"
                size="sm"
                className="h-auto p-0 ml-auto text-xs"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
