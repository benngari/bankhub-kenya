import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageLoader } from "@/components/shared/PageLoader";
import { ROUTES } from "@/constants";

const HomePage = lazy(() => import("@/pages/HomePage"));
const SearchResultsPage = lazy(() => import("@/pages/SearchResultsPage"));
const BankProfilePage = lazy(() => import("@/pages/BankProfilePage"));
const ComparePage = lazy(() => import("@/pages/ComparePage"));
const CalculatorsPage = lazy(() => import("@/pages/CalculatorsPage"));
const BranchesPage = lazy(() => import("@/pages/BranchesPage"));
const NewsPage = lazy(() => import("@/pages/NewsPage"));
const ExchangeRatesPage = lazy(() => import("@/pages/ExchangeRatesPage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.search} element={<SearchResultsPage />} />
            <Route path="/banks/:bankId" element={<BankProfilePage />} />
            <Route path={ROUTES.compare} element={<ComparePage />} />
            <Route path={ROUTES.calculators} element={<CalculatorsPage />} />
            <Route path={ROUTES.branches} element={<BranchesPage />} />
            <Route path={ROUTES.news} element={<NewsPage />} />
            <Route path={ROUTES.rates} element={<ExchangeRatesPage />} />
            <Route path={ROUTES.favorites} element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
