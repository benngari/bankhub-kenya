import { useMemo, useState } from "react";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/hooks/useBanks";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types/bank";

const CATEGORIES: (NewsArticle["category"] | "All")[] = [
  "All", "CBK", "Loans", "Digital Banking", "Investments", "Forex", "Fintech",
];

export default function NewsPage() {
  const { data: news = [], isLoading } = useNews();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () => (category === "All" ? news : news.filter((n) => n.category === category)),
    [news, category]
  );

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Banking news</h1>
      <p className="mt-1 text-muted-foreground">Regulatory updates and industry trends from across Kenya's banking sector.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              category === c ? "border-forest-600 bg-forest-600 text-white" : "border-border bg-card hover:border-forest-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)
          : filtered.map((article) => (
              <article key={article.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift transition-shadow">
                <Badge variant="default">{article.category}</Badge>
                <h2 className="mt-3 font-display text-base font-semibold leading-snug">{article.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{article.summary}</p>
                <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {article.readMinutes} min read
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(article.date)}</p>
              </article>
            ))}
      </div>
    </div>
  );
}
