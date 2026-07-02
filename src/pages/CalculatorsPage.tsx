import { useMemo, useState } from "react";
import type * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useExchangeRates } from "@/hooks/useBanks";
import { formatCurrency } from "@/lib/utils";

const loanSchema = z.object({
  principal: z.coerce.number().positive("Enter an amount greater than 0"),
  rate: z.coerce.number().positive("Enter a rate greater than 0").max(60, "That rate looks too high"),
  years: z.coerce.number().positive("Enter a loan term").max(40, "That term looks too long"),
});
type LoanForm = z.infer<typeof loanSchema>;

function amortizedMonthlyPayment(principal: number, annualRatePct: number, years: number) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export default function CalculatorsPage() {
  const [params] = useSearchParams();
  const initialTab = params.get("tab") || "loan";

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Financial calculators</h1>
      <p className="mt-1 text-muted-foreground">Estimate payments, savings growth, and currency conversions.</p>

      <Tabs defaultValue={initialTab} className="mt-8">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="loan">Loan</TabsTrigger>
          <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="fd">Fixed Deposit</TabsTrigger>
          <TabsTrigger value="currency">Currency Converter</TabsTrigger>
          <TabsTrigger value="interest">Simple Interest</TabsTrigger>
        </TabsList>

        <TabsContent value="loan">
          <AmortizingCalculator title="Loan calculator" defaultRate={15} defaultYears={3} />
        </TabsContent>
        <TabsContent value="mortgage">
          <AmortizingCalculator title="Mortgage calculator" defaultRate={13} defaultYears={20} />
        </TabsContent>
        <TabsContent value="savings">
          <SavingsCalculator />
        </TabsContent>
        <TabsContent value="fd">
          <FixedDepositCalculator />
        </TabsContent>
        <TabsContent value="currency">
          <CurrencyConverter />
        </TabsContent>
        <TabsContent value="interest">
          <SimpleInterestCalculator />
        </TabsContent>
      </Tabs>

      <p className="mt-8 text-xs text-muted-foreground">
        These calculators use illustrative formulas for guidance only — actual bank offers depend on
        credit assessment, fees, and product terms. Always confirm figures with the bank directly.
      </p>
    </div>
  );
}

function AmortizingCalculator({ title, defaultRate, defaultYears }: { title: string; defaultRate: number; defaultYears: number }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<LoanForm>({
    resolver: zodResolver(loanSchema),
    defaultValues: { principal: 500000, rate: defaultRate, years: defaultYears },
    mode: "onChange",
  });

  const values = watch();
  const result = useMemo(() => {
    const parsed = loanSchema.safeParse(values);
    if (!parsed.success) return null;
    const { principal, rate, years } = parsed.data;
    const monthly = amortizedMonthlyPayment(principal, rate, years);
    const total = monthly * years * 12;
    return { monthly, total, interest: total - principal };
  }, [values]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <Field label="Loan amount (KSh)" error={errors.principal?.message}>
            <Input type="number" step="1000" {...register("principal")} />
          </Field>
          <Field label="Annual interest rate (%)" error={errors.rate?.message}>
            <Input type="number" step="0.1" {...register("rate")} />
          </Field>
          <Field label="Loan term (years)" error={errors.years?.message}>
            <Input type="number" step="1" {...register("years")} />
          </Field>
        </CardContent>
      </Card>

      <Card className="bg-forest-900 text-white border-forest-900">
        <CardContent className="p-6 space-y-5">
          <h3 className="font-display text-sm font-medium text-forest-200">Estimated results</h3>
          <ResultRow label="Monthly payment" value={result ? formatCurrency(result.monthly) : "—"} big />
          <ResultRow label="Total repayment" value={result ? formatCurrency(result.total) : "—"} />
          <ResultRow label="Total interest" value={result ? formatCurrency(result.interest) : "—"} />
        </CardContent>
      </Card>
    </div>
  );
}

function SavingsCalculator() {
  const [initial, setInitial] = useState(50000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let balance = initial;
    for (let m = 0; m < years * 12; m++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
    const contributed = initial + monthly * years * 12;
    return { balance, contributed, growth: balance - contributed };
  }, [initial, monthly, rate, years]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Savings calculator</h2>
          <Field label="Starting balance (KSh)">
            <Input type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} />
          </Field>
          <Field label="Monthly contribution (KSh)">
            <Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} />
          </Field>
          <Field label="Annual interest rate (%)">
            <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </Field>
          <Field label="Years">
            <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
          </Field>
        </CardContent>
      </Card>
      <Card className="bg-forest-900 text-white border-forest-900">
        <CardContent className="p-6 space-y-5">
          <h3 className="font-display text-sm font-medium text-forest-200">Projected results</h3>
          <ResultRow label="Final balance" value={formatCurrency(result.balance)} big />
          <ResultRow label="Total contributed" value={formatCurrency(result.contributed)} />
          <ResultRow label="Interest earned" value={formatCurrency(result.growth)} />
        </CardContent>
      </Card>
    </div>
  );
}

function FixedDepositCalculator() {
  const [principal, setPrincipal] = useState(200000);
  const [rate, setRate] = useState(9);
  const [months, setMonths] = useState(12);

  const maturity = useMemo(() => principal * (1 + (rate / 100) * (months / 12)), [principal, rate, months]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Fixed deposit calculator</h2>
          <Field label="Deposit amount (KSh)">
            <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
          </Field>
          <Field label="Annual interest rate (%)">
            <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </Field>
          <Field label="Term (months)">
            <Input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
          </Field>
        </CardContent>
      </Card>
      <Card className="bg-forest-900 text-white border-forest-900">
        <CardContent className="p-6 space-y-5">
          <h3 className="font-display text-sm font-medium text-forest-200">At maturity</h3>
          <ResultRow label="Maturity value" value={formatCurrency(maturity)} big />
          <ResultRow label="Interest earned" value={formatCurrency(maturity - principal)} />
        </CardContent>
      </Card>
    </div>
  );
}

function CurrencyConverter() {
  const { data: rates = [] } = useExchangeRates();
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KES");

  const result = useMemo(() => {
    const fromRate = rates.find((r) => r.code === from)?.sell ?? 1;
    const toRate = rates.find((r) => r.code === to)?.sell ?? 1;
    const inKes = from === "KES" ? amount : amount * fromRate;
    return to === "KES" ? inKes : inKes / toRate;
  }, [rates, amount, from, to]);

  return (
    <Card className="max-w-xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Currency converter</h2>
        <Field label="Amount">
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="From">
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm">
              {rates.map((r) => (
                <option key={r.code} value={r.code}>{r.code}</option>
              ))}
            </select>
          </Field>
          <Field label="To">
            <select value={to} onChange={(e) => setTo(e.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm">
              {rates.map((r) => (
                <option key={r.code} value={r.code}>{r.code}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="rounded-2xl bg-forest-50 dark:bg-forest-900/20 p-5 text-center">
          <p className="font-display text-2xl font-bold">
            {amount.toLocaleString()} {from} ≈ {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Using indicative selling rates</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(2);

  const interest = (principal * rate * years) / 100;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Simple interest calculator</h2>
          <Field label="Principal (KSh)">
            <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
          </Field>
          <Field label="Annual interest rate (%)">
            <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </Field>
          <Field label="Years">
            <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
          </Field>
        </CardContent>
      </Card>
      <Card className="bg-forest-900 text-white border-forest-900">
        <CardContent className="p-6 space-y-5">
          <h3 className="font-display text-sm font-medium text-forest-200">Results</h3>
          <ResultRow label="Interest earned" value={formatCurrency(interest)} big />
          <ResultRow label="Total value" value={formatCurrency(principal + interest)} />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ResultRow({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p className="text-xs text-forest-300">{label}</p>
      <p className={big ? "font-display text-3xl font-bold" : "font-display text-lg font-semibold"}>{value}</p>
    </div>
  );
}
