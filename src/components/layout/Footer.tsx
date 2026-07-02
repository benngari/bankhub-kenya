import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import { ROUTES } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-forest-950 text-forest-100">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400 text-forest-900">
              <Landmark className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-white">BankHub Kenya</span>
          </div>
          <p className="mt-4 text-sm text-forest-300 leading-relaxed">
            The independent directory of every CBK-licensed bank in Kenya — branches, rates, and
            digital services, all in one place.
          </p>
        </div>

        <FooterCol
          title="Explore"
          links={[
            { label: "Search banks", to: ROUTES.search },
            { label: "Compare banks", to: ROUTES.compare },
            { label: "Branch directory", to: ROUTES.branches },
            { label: "Exchange rates", to: ROUTES.rates },
          ]}
        />
        <FooterCol
          title="Tools"
          links={[
            { label: "Loan calculator", to: `${ROUTES.calculators}?tab=loan` },
            { label: "Mortgage calculator", to: `${ROUTES.calculators}?tab=mortgage` },
            { label: "Savings calculator", to: `${ROUTES.calculators}?tab=savings` },
            { label: "Currency converter", to: `${ROUTES.calculators}?tab=currency` },
          ]}
        />
        <FooterCol
          title="Resources"
          links={[
            { label: "Banking news", to: ROUTES.news },
            { label: "My favorites", to: ROUTES.favorites },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-forest-400">
          <p>© {new Date().getFullYear()} BankHub Kenya. A directory project — not affiliated with the Central Bank of Kenya.</p>
          <p>Rates and figures shown are illustrative placeholder data.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-white mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-forest-300 hover:text-gold-400 transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
