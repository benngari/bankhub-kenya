import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, Scale } from "lucide-react";
import type { Bank } from "@/types/bank";
import { BankLogo } from "@/components/shared/BankLogo";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export function BankCard({ bank, index = 0 }: { bank: Bank; index?: number }) {
  const isFavorite = useAppStore((s) => s.isFavorite(bank.id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const compareIds = useAppStore((s) => s.compareIds);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const inCompare = compareIds.includes(bank.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-lift hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <Link to={ROUTES.bank(bank.id)} className="flex items-center gap-3 min-w-0">
          <BankLogo bank={bank} />
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold group-hover:text-forest-600 transition-colors">
              {bank.shortName}
            </h3>
            <p className="truncate text-xs text-muted-foreground">{bank.tagline}</p>
          </div>
        </Link>
        <button
          onClick={() => toggleFavorite(bank.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-forest-600 transition-colors"
        >
          <Heart className={cn("h-4.5 w-4.5", isFavorite && "fill-forest-600 text-forest-600")} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant="default">{bank.category}</Badge>
        <Badge variant="outline" className="font-mono">{bank.banking.swiftCode}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-secondary/60 py-2">
          <p className="font-display text-sm font-bold">{bank.banking.branchCount}</p>
          <p className="text-[10px] text-muted-foreground">Branches</p>
        </div>
        <div className="rounded-xl bg-secondary/60 py-2">
          <p className="font-display text-sm font-bold">{bank.banking.atmCount}</p>
          <p className="text-[10px] text-muted-foreground">ATMs</p>
        </div>
        <div className="rounded-xl bg-secondary/60 py-2 flex flex-col items-center justify-center">
          <p className="font-display text-sm font-bold flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-gold-400 text-gold-400" /> {bank.rates.customerRating}
          </p>
          <p className="text-[10px] text-muted-foreground">Rating</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {bank.banking.countiesServed} counties
        </p>
        <button
          onClick={() => toggleCompare(bank.id)}
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            inCompare ? "bg-forest-600 text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <Scale className="h-3.5 w-3.5" /> {inCompare ? "Added" : "Compare"}
        </button>
      </div>
    </motion.div>
  );
}
