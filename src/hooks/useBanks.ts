import { useQuery } from "@tanstack/react-query";
import { bankService } from "@/services/bankService";

export function useAllBanks() {
  return useQuery({ queryKey: ["banks"], queryFn: bankService.getAllBanks });
}

export function useFeaturedBanks() {
  return useQuery({ queryKey: ["banks", "featured"], queryFn: bankService.getFeaturedBanks });
}

export function useBank(id: string | undefined) {
  return useQuery({
    queryKey: ["bank", id],
    queryFn: () => bankService.getBankById(id as string),
    enabled: !!id,
  });
}

export function useBanksByIds(ids: string[]) {
  return useQuery({
    queryKey: ["banks", "byIds", ids],
    queryFn: () => bankService.getBanksByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useBranchesByBank(bankId: string | undefined) {
  return useQuery({
    queryKey: ["branches", bankId],
    queryFn: () => bankService.getBranchesByBank(bankId as string),
    enabled: !!bankId,
  });
}

export function useAllBranches() {
  return useQuery({ queryKey: ["branches", "all"], queryFn: bankService.getAllBranches });
}

export function useStats() {
  return useQuery({ queryKey: ["stats"], queryFn: bankService.getStats });
}

export function useNews() {
  return useQuery({ queryKey: ["news"], queryFn: bankService.getNews });
}

export function useExchangeRates() {
  return useQuery({ queryKey: ["rates"], queryFn: bankService.getExchangeRates });
}
