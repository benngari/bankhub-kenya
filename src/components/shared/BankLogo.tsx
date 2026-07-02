import type { Bank } from "@/types/bank";

export function BankLogo({ bank, size = 44, className }: { bank: Bank; size?: number; className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-display font-bold text-white shadow-soft ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${bank.colorFrom}, ${bank.colorTo})`,
      }}
      aria-hidden
    >
      {bank.logoInitials}
    </div>
  );
}
