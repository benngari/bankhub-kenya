import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BankLogo } from "@/components/shared/BankLogo";
import { useAllBanks, useBanksByIds } from "@/hooks/useBanks";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { useAppStore } from "@/store/useAppStore";
import { ROUTES } from "@/constants";

const DIGITAL_KEYS = [
  "mobileBanking", "internetBanking", "agencyBanking", "mpesaIntegration",
  "instantTransfers", "qrPayments",
] as const;

const DIGITAL_LABELS: Record<string, string> = {
  mobileBanking: "Mobile Banking",
  internetBanking: "Internet Banking",
  agencyBanking: "Agency Banking",
  mpesaIntegration: "M-PESA Integration",
  instantTransfers: "Instant Transfers",
  qrPayments: "QR Payments",
};

export default function ComparePage() {
  const compareIds = useAppStore((s) => s.compareIds);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const { data: banks = [] } = useBanksByIds(compareIds);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Compare banks</h1>
          <p className="mt-1 text-muted-foreground">Pick up to 4 banks to compare rates, fees, and features.</p>
        </div>
        <div className="flex gap-2">
          {compareIds.length > 0 && (
            <Button variant="outline" onClick={clearCompare}>
              Clear all
            </Button>
          )}
          <Button onClick={() => setPickerOpen(true)} disabled={compareIds.length >= 4} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add bank
          </Button>
        </div>
      </div>

      {banks.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="text-lg font-medium">No banks selected yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add banks from search results or click "Add bank" to start comparing.
          </p>
          <Button className="mt-5" onClick={() => setPickerOpen(true)}>
            Choose banks to compare
          </Button>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-xs text-muted-foreground font-medium w-40"></th>
                {banks.map((bank) => (
                  <th key={bank.id} className="p-0">
                    <div className="relative rounded-2xl border border-border bg-card p-4 shadow-soft text-left">
                      <button
                        onClick={() => toggleCompare(bank.id)}
                        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-secondary"
                        aria-label={`Remove ${bank.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <BankLogo bank={bank} size={36} />
                      <Link to={ROUTES.bank(bank.id)} className="mt-2 block font-display text-sm font-semibold hover:text-forest-600">
                        {bank.shortName}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">{bank.category}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Savings interest" values={banks.map((b) => `${b.rates.savingsInterestMin}% – ${b.rates.savingsInterestMax}%`)} />
              <CompareRow label="Loan rates" values={banks.map((b) => `${b.rates.loanRateMin}% – ${b.rates.loanRateMax}%`)} />
              <CompareRow label="Mortgage rates" values={banks.map((b) => `${b.rates.mortgageRateMin}% – ${b.rates.mortgageRateMax}%`)} />
              <CompareRow label="Monthly account fee" values={banks.map((b) => `KSh ${b.rates.monthlyAccountFee}`)} />
              <CompareRow label="ATM withdrawal fee" values={banks.map((b) => `KSh ${b.rates.atmWithdrawalFee}`)} />
              <CompareRow label="Mobile banking rating" values={banks.map((b) => `${b.rates.mobileBankingRating} / 5`)} highlight />
              <CompareRow label="Customer rating" values={banks.map((b) => `${b.rates.customerRating} / 5`)} highlight />
              <CompareRow label="Branches" values={banks.map((b) => String(b.banking.branchCount))} />
              <CompareRow label="ATMs" values={banks.map((b) => String(b.banking.atmCount))} />
              {DIGITAL_KEYS.map((key) => (
                <tr key={key}>
                  <td className="py-2 pr-4 text-sm text-muted-foreground">{DIGITAL_LABELS[key]}</td>
                  {banks.map((b) => (
                    <td key={b.id} className="rounded-xl bg-card border border-border px-4 py-2.5 text-center">
                      {b.digitalServices[key] ? (
                        <Check className="mx-auto h-4 w-4 text-forest-600" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-muted-foreground" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BankPicker open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}

function CompareRow({ label, values, highlight }: { label: string; values: string[]; highlight?: boolean }) {
  return (
    <tr>
      <td className="py-2 pr-4 text-sm text-muted-foreground">{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium ${
            highlight ? "bg-forest-50 dark:bg-forest-900/20" : "bg-card"
          }`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

function BankPicker({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data: allBanks = [] } = useAllBanks();
  const { query, setQuery, results } = useFuzzySearch(allBanks);
  const compareIds = useAppStore((s) => s.compareIds);
  const toggleCompare = useAppStore((s) => s.toggleCompare);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Add a bank to compare</DialogTitle>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search banks…"
          className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto">
          {results.map((bank) => {
            const selected = compareIds.includes(bank.id);
            return (
              <button
                key={bank.id}
                onClick={() => toggleCompare(bank.id)}
                disabled={!selected && compareIds.length >= 4}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors disabled:opacity-40 ${
                  selected ? "bg-forest-600 text-white" : "hover:bg-secondary"
                }`}
              >
                <BankLogo bank={bank} size={30} />
                <span className="text-sm font-medium flex-1">{bank.name}</span>
                {selected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
