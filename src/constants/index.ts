import type { BankCategory } from "@/types/bank";

export const ROUTES = {
  home: "/",
  search: "/search",
  bank: (id: string) => `/banks/${id}`,
  compare: "/compare",
  calculators: "/calculators",
  branches: "/branches",
  news: "/news",
  rates: "/rates",
  favorites: "/favorites",
} as const;

export const CATEGORIES: { label: BankCategory; description: string }[] = [
  { label: "Commercial Bank", description: "Full-service retail & corporate banking" },
  { label: "Microfinance Bank", description: "Inclusive lending for individuals & groups" },
  { label: "Digital Bank", description: "Mobile-first, branch-light banking" },
  { label: "Islamic Bank", description: "Sharia-compliant, interest-free banking" },
  { label: "Investment Bank", description: "Corporate, treasury & wealth services" },
];

export const POPULAR_SEARCHES = [
  "Equity", "KCB", "Co-op", "NCBA", "Absa", "Stanbic", "DTB", "I&M", "Family Bank", "Gulf African",
];

export const COUNTIES_KENYA = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu","Kiambu","Machakos","Kajiado","Kilifi",
  "Meru","Nyeri","Kakamega","Bungoma","Kericho","Nandi","Trans Nzoia","Laikipia","Embu",
  "Garissa","Kisii",
];
