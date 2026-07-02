import { useEffect, useState } from "react";
import type * as React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, Share2, Copy, Printer, Download, Globe, Phone, Mail, MessageCircle,
  Check, ExternalLink, Building2, CalendarDays, Users, Landmark, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BranchList } from "@/components/shared/BranchList";
import { useBank, useBranchesByBank } from "@/hooks/useBanks";
import { useAppStore } from "@/store/useAppStore";

const DIGITAL_LABELS: Record<string, string> = {
  mobileBanking: "Mobile Banking",
  internetBanking: "Internet Banking",
  agencyBanking: "Agency Banking",
  visa: "Visa",
  mastercard: "Mastercard",
  applePay: "Apple Pay",
  googlePay: "Google Pay",
  samsungPay: "Samsung Pay",
  mpesaIntegration: "M-PESA Integration",
  airtelMoney: "Airtel Money",
  qrPayments: "QR Payments",
  instantTransfers: "Instant Transfers",
  rtgs: "RTGS",
  eft: "EFT",
  standingOrders: "Standing Orders",
  directDebits: "Direct Debits",
};

export default function BankProfilePage() {
  const { bankId } = useParams();
  const { data: bank, isLoading, isError } = useBank(bankId);
  const { data: branches = [] } = useBranchesByBank(bankId);
  const isFavorite = useAppStore((s) => (bank ? s.isFavorite(bank.id) : false));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (bank) addRecentlyViewed(bank.id);
  }, [bank, addRecentlyViewed]);

  if (isError) return <Navigate to="/404" replace />;

  if (isLoading || !bank) {
    return (
      <div className="container py-10 space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  function copy(value: string, field: string) {
    navigator.clipboard?.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  function share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: bank!.name, url }).catch(() => {});
    } else {
      copy(url, "share");
    }
  }

  function downloadProfile() {
    const lines = [
      `${bank!.name} (${bank!.acronym})`,
      bank!.tagline,
      "",
      `Founded: ${bank!.founded}`,
      `Headquarters: ${bank!.headquarters}`,
      `CEO: ${bank!.ceo}`,
      `Ownership: ${bank!.ownership}`,
      `Category: ${bank!.category}`,
      "",
      `Bank Code: ${bank!.banking.bankCode}`,
      `SWIFT Code: ${bank!.banking.swiftCode}`,
      `CBK License: ${bank!.banking.cbkLicense}`,
      `Branches: ${bank!.banking.branchCount}`,
      `ATMs: ${bank!.banking.atmCount}`,
      `Counties Served: ${bank!.banking.countiesServed}`,
      "",
      `Customer Care: ${bank!.contact.customerCare}`,
      `Email: ${bank!.contact.email}`,
      `Website: ${bank!.contact.website}`,
      "",
      "Products:",
      ...bank!.products.map((p) => `- ${p}`),
      "",
      bank!.description,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bank!.acronym}-profile.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="pb-16">
      {/* Header banner */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bank.colorFrom}, ${bank.colorTo})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="container relative py-10 sm:py-14 text-white">
          <Link to="/search" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back to search
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col sm:flex-row sm:items-center gap-5"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 font-display text-2xl font-bold backdrop-blur">
              {bank.logoInitials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold">{bank.name}</h1>
                <Badge className="bg-white/20 border-white/30 text-white">{bank.category}</Badge>
              </div>
              <p className="mt-1 text-white/85">{bank.tagline}</p>
            </div>
            <div className="sm:ml-auto flex flex-wrap gap-2 no-print">
              <Button variant="secondary" size="sm" onClick={() => toggleFavorite(bank.id)} className="gap-1.5">
                <Heart className={isFavorite ? "h-4 w-4 fill-forest-700 text-forest-700" : "h-4 w-4"} />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              <Button variant="secondary" size="sm" onClick={share} className="gap-1.5">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button variant="secondary" size="sm" onClick={() => window.print()} className="gap-1.5">
                <Printer className="h-4 w-4" /> Print
              </Button>
              <Button variant="secondary" size="sm" onClick={downloadProfile} className="gap-1.5">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mt-8">
        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickFact icon={CalendarDays} label="Founded" value={String(bank.founded)} />
          <QuickFact icon={Landmark} label="Ownership" value={bank.ownership} />
          <QuickFact icon={Building2} label="Branches" value={String(bank.banking.branchCount)} />
          <QuickFact icon={Users} label="Counties" value={String(bank.banking.countiesServed)} />
        </div>

        <Tabs defaultValue="overview" className="mt-10">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="banking">Banking Info</TabsTrigger>
            <TabsTrigger value="digital">Digital Services</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="branches">Branches ({branches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-display text-lg font-semibold">About {bank.shortName}</h2>
                <p className="leading-relaxed text-muted-foreground">{bank.description}</p>
              </div>
              <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-soft h-fit">
                <InfoRow label="CEO" value={bank.ceo} />
                <InfoRow label="Parent company" value={bank.parentCompany} />
                <InfoRow label="Headquarters" value={bank.headquarters} />
                <InfoRow label="Customer rating" value={`${bank.rates.customerRating} / 5`} />
                <a
                  href={bank.contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:underline pt-1"
                >
                  Official website <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {bank.contact.wikipedia && (
                  <a
                    href={bank.contact.wikipedia}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:underline"
                  >
                    Wikipedia <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ContactCard icon={Phone} label="Customer Care" value={bank.contact.customerCare} />
              <ContactCard icon={MessageCircle} label="WhatsApp" value={bank.contact.whatsapp} />
              <ContactCard icon={Mail} label="Email" value={bank.contact.email} />
              <ContactCard icon={Globe} label="Website" value={bank.contact.website} isLink />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(bank.contact.social).map(([platform, handle]) =>
                handle ? (
                  <Badge key={platform} variant="outline" className="capitalize">
                    {platform}: {handle}
                  </Badge>
                ) : null
              )}
            </div>
          </TabsContent>

          <TabsContent value="banking">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CopyableFact
                label="Bank Code"
                value={bank.banking.bankCode}
                copied={copiedField === "bankCode"}
                onCopy={() => copy(bank.banking.bankCode, "bankCode")}
              />
              <CopyableFact
                label="SWIFT Code"
                value={bank.banking.swiftCode}
                copied={copiedField === "swift"}
                onCopy={() => copy(bank.banking.swiftCode, "swift")}
              />
              <QuickFact icon={Landmark} label="CBK License" value={bank.banking.cbkLicense} mono />
              <QuickFact icon={Building2} label="Branch Count" value={String(bank.banking.branchCount)} />
              <QuickFact icon={Building2} label="ATM Count" value={String(bank.banking.atmCount)} />
              <QuickFact icon={Users} label="Counties Served" value={String(bank.banking.countiesServed)} />
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-sm font-semibold mb-4">Indicative rates & fees</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <RateStat label="Savings interest" value={`${bank.rates.savingsInterestMin}% – ${bank.rates.savingsInterestMax}%`} />
                <RateStat label="Loan rate" value={`${bank.rates.loanRateMin}% – ${bank.rates.loanRateMax}%`} />
                <RateStat label="Mortgage rate" value={`${bank.rates.mortgageRateMin}% – ${bank.rates.mortgageRateMax}%`} />
                <RateStat label="Monthly account fee" value={`KSh ${bank.rates.monthlyAccountFee}`} />
                <RateStat label="ATM withdrawal fee" value={`KSh ${bank.rates.atmWithdrawalFee}`} />
                <RateStat label="Mobile banking rating" value={`${bank.rates.mobileBankingRating} / 5`} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="digital">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(bank.digitalServices).map(([key, enabled]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between rounded-xl border p-3.5 ${
                    enabled ? "border-forest-200 bg-forest-50 dark:bg-forest-900/20 dark:border-forest-800" : "border-border bg-secondary/40 opacity-60"
                  }`}
                >
                  <span className="text-sm font-medium">{DIGITAL_LABELS[key]}</span>
                  {enabled ? (
                    <Check className="h-4 w-4 text-forest-600" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex flex-wrap gap-2">
              {bank.products.map((p) => (
                <Badge key={p} variant="default" className="text-sm px-3.5 py-1.5">
                  {p}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="branches">
            <BranchList branches={branches} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function QuickFact({ icon: Icon, label, value, mono }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5 shadow-soft">
      <Icon className="h-4 w-4 text-forest-600" />
      <p className={`mt-2 text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, isLink }: { icon: React.ElementType; label: string; value: string; isLink?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <Icon className="h-4.5 w-4.5 text-forest-600" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      {isLink ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm font-medium text-forest-600 hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium break-all">{value}</p>
      )}
    </div>
  );
}

function CopyableFact({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <button
      onClick={onCopy}
      className="group flex flex-col items-start rounded-xl border border-border bg-card p-3.5 text-left shadow-soft hover:border-forest-400 transition-colors"
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        {copied ? <Check className="h-3.5 w-3.5 text-forest-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-forest-600" />}
      </div>
      <span className="mt-1.5 font-mono text-sm font-semibold">{value}</span>
    </button>
  );
}

function RateStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-base font-semibold">{value}</p>
    </div>
  );
}
