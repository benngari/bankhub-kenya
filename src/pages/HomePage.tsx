import { useState } from "react";
import type * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, ShieldCheck, Landmark, MapPin, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BankCard } from "@/components/shared/BankCard";
import { useAllBanks, useFeaturedBanks, useStats, useExchangeRates } from "@/hooks/useBanks";
import { useAppStore } from "@/store/useAppStore";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { CATEGORIES, POPULAR_SEARCHES, ROUTES } from "@/constants";
import { formatNumber } from "@/lib/utils";
import { BankLogo } from "@/components/shared/BankLogo";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: banks = [] } = useAllBanks();
  const { data: featured = [], isLoading: loadingFeatured } = useFeaturedBanks();
  const { data: stats } = useStats();
  const { data: rates = [] } = useExchangeRates();
  const addSearchTerm = useAppStore((s) => s.addSearchTerm);

  const [heroQuery, setHeroQuery] = useState("");
  const { results } = useFuzzySearch(banks);
  const suggestions = heroQuery ? results.slice(0, 5) : [];

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!heroQuery.trim()) return;
    addSearchTerm(heroQuery);
    navigate(`${ROUTES.search}?q=${encodeURIComponent(heroQuery)}`);
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-mesh-hero">
        <div className="container relative py-20 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white/70 dark:bg-white/5 px-4 py-1.5 text-xs font-medium text-forest-700 dark:text-forest-300 backdrop-blur"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {stats ? `${stats.totalBanks} CBK-licensed institutions indexed` : "Loading directory…"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight sm:text-6xl"
          >
            Every Kenyan bank,
            <span className="block text-forest-600">one search away.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground sm:text-lg"
          >
            Branches, SWIFT codes, rates, and digital services for commercial, microfinance,
            digital, Islamic, and investment banks — searchable instantly, typos and all.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleHeroSearch}
            className="relative mx-auto mt-9 max-w-xl"
          >
            <div className="relative flex items-center rounded-full border border-border bg-card shadow-lift">
              <Search className="ml-5 h-5 w-5 shrink-0 text-muted-foreground" />
              <Input
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Try “Equity”, “KCB”, “EQBLKENA”, or “Kisumu”…"
                className="h-14 border-0 shadow-none rounded-full text-base focus-visible:ring-0"
              />
              <Button type="submit" size="lg" className="mr-1.5 shrink-0">
                Search
              </Button>
            </div>
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[110%] z-20 rounded-2xl border border-border bg-card p-2 text-left shadow-lift">
                {suggestions.map((b) => (
                  <Link
                    key={b.id}
                    to={ROUTES.bank(b.id)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary"
                  >
                    <BankLogo bank={b} size={32} />
                    <span className="text-sm font-medium">{b.name}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{b.banking.swiftCode}</span>
                  </Link>
                ))}
              </div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-muted-foreground">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => navigate(`${ROUTES.search}?q=${encodeURIComponent(term)}`)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium hover:border-forest-400 hover:text-forest-600 transition-colors"
              >
                {term}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <StatBlock icon={Landmark} label="Banks" value={stats?.totalBanks} />
            <StatBlock icon={MapPin} label="Branches" value={stats?.totalBranches} />
            <StatBlock icon={CreditCard} label="ATMs" value={stats?.totalAtms} />
            <StatBlock icon={TrendingUp} label="Counties" value={stats?.countiesCovered} />
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-16">
        <SectionHeading eyebrow="Browse by type" title="Find the right kind of bank" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              onClick={() => navigate(`${ROUTES.search}?category=${encodeURIComponent(cat.label)}`)}
              className="group rounded-2xl border border-border bg-card p-5 text-left shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all"
            >
              <p className="font-display text-base font-semibold group-hover:text-forest-600 transition-colors">
                {cat.label}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FEATURED BANKS */}
      <section className="bg-secondary/40 py-16">
        <div className="container">
          <div className="flex items-end justify-between">
            <SectionHeading eyebrow="Featured" title="Widely used across Kenya" />
            <Link to={ROUTES.search} className="hidden sm:flex items-center gap-1 text-sm font-medium text-forest-600 hover:gap-2 transition-all">
              View all banks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loadingFeatured
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full" />)
              : featured.map((bank, i) => <BankCard key={bank.id} bank={bank} index={i} />)}
          </div>
        </div>
      </section>

      {/* EXCHANGE RATE TICKER */}
      <section className="py-16">
        <div className="container">
          <SectionHeading eyebrow="Live-style rates" title="Today's indicative exchange rates" />
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {rates.map((r) => (
              <div key={r.code} className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
                <p className="font-mono text-xs text-muted-foreground">{r.code}</p>
                <p className="mt-1 font-display text-lg font-bold">{r.sell.toFixed(2)}</p>
                <p className={`mt-0.5 text-xs ${r.change >= 0 ? "text-forest-600" : "text-destructive"}`}>
                  {r.change >= 0 ? "▲" : "▼"} {Math.abs(r.change)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to={ROUTES.rates}>
              <Button variant="outline">See full rates & currency converter</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="rounded-3xl bg-forest-900 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Not sure which bank fits you?</h2>
          <p className="mx-auto mt-3 max-w-lg text-forest-200">
            Compare fees, rates, and digital features side by side — pick with confidence.
          </p>
          <Link to={ROUTES.compare}>
            <Button size="lg" variant="accent" className="mt-6">
              Compare banks now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-soft backdrop-blur">
      <Icon className="mx-auto h-5 w-5 text-forest-600" />
      <p className="mt-2 font-display text-2xl font-bold">{value ? formatNumber(value) : "—"}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">{eyebrow}</p>
      <h2 className="mt-1.5 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
    </div>
  );
}
