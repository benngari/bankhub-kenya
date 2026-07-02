import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useExchangeRates } from "@/hooks/useBanks";

export default function ExchangeRatesPage() {
  const { data: rates = [], isLoading } = useExchangeRates();

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Exchange rates</h1>
      <p className="mt-1 text-muted-foreground">
        Indicative buy/sell rates against the Kenyan Shilling. Actual rates vary by bank and transaction size.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Currency</th>
              <th className="px-5 py-3 font-medium">Buy</th>
              <th className="px-5 py-3 font-medium">Sell</th>
              <th className="px-5 py-3 font-medium">24h change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              : rates.map((r) => (
                  <tr key={r.code} className="bg-card hover:bg-secondary/40">
                    <td className="px-5 py-4">
                      <span className="font-medium">{r.name}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">{r.code}</span>
                    </td>
                    <td className="px-5 py-4 font-mono">{r.symbol} {r.buy.toFixed(2)}</td>
                    <td className="px-5 py-4 font-mono">{r.symbol} {r.sell.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 font-medium ${r.change >= 0 ? "text-forest-600" : "text-destructive"}`}>
                        {r.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {Math.abs(r.change).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Rates shown are illustrative mock data for demonstration purposes and do not reflect live market rates.
      </p>
    </div>
  );
}
