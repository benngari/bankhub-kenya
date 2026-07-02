import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BankCard } from "@/components/shared/BankCard";
import { useBanksByIds } from "@/hooks/useBanks";
import { useAppStore } from "@/store/useAppStore";
import { ROUTES } from "@/constants";

export default function FavoritesPage() {
  const favoriteBankIds = useAppStore((s) => s.favoriteBankIds);
  const recentlyViewed = useAppStore((s) => s.recentlyViewed);
  const clearRecentlyViewed = useAppStore((s) => s.clearRecentlyViewed);
  const { data: favorites = [] } = useBanksByIds(favoriteBankIds);
  const { data: recent = [] } = useBanksByIds(recentlyViewed);

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Your favorites</h1>
      <p className="mt-1 text-muted-foreground">Saved banks and your recently viewed profiles.</p>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <Heart className="h-4.5 w-4.5 text-forest-600" /> Saved banks ({favorites.length})
        </h2>
        {favorites.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">You haven't saved any banks yet.</p>
            <Link to={ROUTES.search}>
              <Button className="mt-4" size="sm">Browse banks</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((bank, i) => (
              <BankCard key={bank.id} bank={bank} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recently viewed</h2>
          {recent.length > 0 && (
            <button onClick={clearRecentlyViewed} className="text-xs text-muted-foreground hover:text-foreground">
              Clear history
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Banks you view will show up here.</p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((bank, i) => (
              <BankCard key={bank.id} bank={bank} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
