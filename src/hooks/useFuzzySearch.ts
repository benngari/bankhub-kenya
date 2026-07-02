import { useMemo, useState } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";
import type { Bank } from "@/types/bank";

const FUSE_OPTIONS: IFuseOptions<Bank> = {
  includeScore: true,
  threshold: 0.34, // typo tolerance sweet spot
  ignoreLocation: true,
  minMatchCharLength: 1,
  keys: [
    { name: "name", weight: 0.35 },
    { name: "shortName", weight: 0.25 },
    { name: "acronym", weight: 0.25 },
    { name: "banking.bankCode", weight: 0.1 },
    { name: "banking.swiftCode", weight: 0.15 },
    { name: "products", weight: 0.08 },
    { name: "category", weight: 0.05 },
    { name: "headquarters", weight: 0.03 },
  ],
};

/**
 * Instant, fuzzy, typo-tolerant, case-insensitive search across bank
 * names, acronyms, codes, products, and location fields.
 */
export function useFuzzySearch(banks: Bank[]) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => new Fuse(banks, FUSE_OPTIONS), [banks]);

  const results = useMemo(() => {
    if (!query.trim()) return banks;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query, banks]);

  return { query, setQuery, results };
}

/** Search that also matches on branch county/town, used by the branch directory. */
export function useBranchFuzzySearch<T extends object>(
  items: T[],
  keys: IFuseOptions<T>["keys"]
) {
  const [query, setQuery] = useState("");
  const fuse = useMemo(
    () => new Fuse(items, { includeScore: true, threshold: 0.3, ignoreLocation: true, keys }),
    [items, keys]
  );
  const results = useMemo(() => {
    if (!query.trim()) return items;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query, items]);

  return { query, setQuery, results };
}
