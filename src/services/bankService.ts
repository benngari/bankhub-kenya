import banksData from "@/data/banks.json";
import branchesData from "@/data/branches.json";
import newsData from "@/data/news.json";
import ratesData from "@/data/exchangeRates.json";
import type { Bank, Branch, NewsArticle, ExchangeRate } from "@/types/bank";

const banks = banksData as Bank[];
const branches = branchesData as Branch[];
const news = newsData as NewsArticle[];
const rates = ratesData as ExchangeRate[];

/**
 * This service layer intentionally mimics an async API contract (Promises,
 * network-shaped latency) so the data source can later be swapped for
 * Supabase / Firebase / a REST API without touching any component code.
 */
const LATENCY = 220;

function simulateNetwork<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
}

export const bankService = {
  getAllBanks: (): Promise<Bank[]> => simulateNetwork(banks),

  getBankById: (id: string): Promise<Bank | undefined> =>
    simulateNetwork(banks.find((b) => b.id === id)),

  getFeaturedBanks: (): Promise<Bank[]> =>
    simulateNetwork(banks.filter((b) => b.isFeatured)),

  getBanksByIds: (ids: string[]): Promise<Bank[]> =>
    simulateNetwork(banks.filter((b) => ids.includes(b.id))),

  getBranchesByBank: (bankId: string): Promise<Branch[]> =>
    simulateNetwork(branches.filter((b) => b.bankId === bankId)),

  getAllBranches: (): Promise<Branch[]> => simulateNetwork(branches),

  getStats: () =>
    simulateNetwork({
      totalBanks: banks.length,
      totalBranches: branches.reduce((sum, _b) => sum, branches.length),
      totalAtms: banks.reduce((sum, b) => sum + b.banking.atmCount, 0),
      countiesCovered: 47,
    }),

  getNews: (): Promise<NewsArticle[]> => simulateNetwork(news),

  getExchangeRates: (): Promise<ExchangeRate[]> => simulateNetwork(rates),
};
