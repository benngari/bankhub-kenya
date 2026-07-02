import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppNotification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Favorites
  favoriteBankIds: string[];
  toggleFavorite: (bankId: string) => void;
  isFavorite: (bankId: string) => boolean;

  // Recently viewed
  recentlyViewed: string[];
  addRecentlyViewed: (bankId: string) => void;
  clearRecentlyViewed: () => void;

  // Search history
  searchHistory: string[];
  addSearchTerm: (term: string) => void;
  clearSearchHistory: () => void;

  // Bookmarked branches
  bookmarkedBranchIds: string[];
  toggleBookmarkBranch: (branchId: string) => void;

  // Notifications
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  // Compare tray
  compareIds: string[];
  toggleCompare: (bankId: string) => void;
  clearCompare: () => void;
}

const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    message: "CBK held the base lending rate steady this week — see what it means for loans.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "n2",
    message: "USD/KES moved — check the latest exchange rates before you transfer.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "n3",
    message: "New: compare mobile banking ratings side by side on the Compare page.",
    read: true,
    createdAt: new Date().toISOString(),
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      favoriteBankIds: [],
      toggleFavorite: (bankId) =>
        set((s) => ({
          favoriteBankIds: s.favoriteBankIds.includes(bankId)
            ? s.favoriteBankIds.filter((id) => id !== bankId)
            : [...s.favoriteBankIds, bankId],
        })),
      isFavorite: (bankId) => get().favoriteBankIds.includes(bankId),

      recentlyViewed: [],
      addRecentlyViewed: (bankId) =>
        set((s) => ({
          recentlyViewed: [bankId, ...s.recentlyViewed.filter((id) => id !== bankId)].slice(0, 8),
        })),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      searchHistory: [],
      addSearchTerm: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        set((s) => ({
          searchHistory: [trimmed, ...s.searchHistory.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 10),
        }));
      },
      clearSearchHistory: () => set({ searchHistory: [] }),

      bookmarkedBranchIds: [],
      toggleBookmarkBranch: (branchId) =>
        set((s) => ({
          bookmarkedBranchIds: s.bookmarkedBranchIds.includes(branchId)
            ? s.bookmarkedBranchIds.filter((id) => id !== branchId)
            : [...s.bookmarkedBranchIds, branchId],
        })),

      notifications: seedNotifications,
      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      compareIds: [],
      toggleCompare: (bankId) =>
        set((s) => {
          if (s.compareIds.includes(bankId)) {
            return { compareIds: s.compareIds.filter((id) => id !== bankId) };
          }
          if (s.compareIds.length >= 4) return s;
          return { compareIds: [...s.compareIds, bankId] };
        }),
      clearCompare: () => set({ compareIds: [] }),
    }),
    { name: "bankhub-kenya-store" }
  )
);
