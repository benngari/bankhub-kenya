import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Menu, X, Moon, Sun, Bell, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/store/useAppStore";
import { useThemeSync } from "@/hooks/useTheme";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { SearchCommand } from "@/components/shared/SearchCommand";

const NAV_LINKS = [
  { to: ROUTES.search, label: "Search" },
  { to: ROUTES.compare, label: "Compare" },
  { to: ROUTES.calculators, label: "Calculators" },
  { to: ROUTES.branches, label: "Branches" },
  { to: ROUTES.rates, label: "Rates" },
  { to: ROUTES.news, label: "News" },
];

export function Header() {
  useThemeSync();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const favoriteBankIds = useAppStore((s) => s.favoriteBankIds);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 glass">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to={ROUTES.home} className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-900 text-gold-400">
            <Landmark className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            BankHub <span className="text-forest-600">Kenya</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "px-3.5 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-forest-600 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex text-muted-foreground gap-2 min-w-[9rem] justify-start"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            Search banks…
            <kbd className="ml-auto hidden md:inline text-[10px] rounded border border-border bg-secondary px-1.5 py-0.5">
              /
            </kbd>
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search className="h-4.5 w-4.5" />
          </Button>

          <Dialog open={notifOpen} onOpenChange={(v) => { setNotifOpen(v); if (v) markAllRead(); }}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-4.5 w-4.5" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold-400" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Notifications</DialogTitle>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-xl border border-border p-3 text-sm">
                    {n.message}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            className="relative hidden sm:inline-flex"
            aria-label="Favorites"
            onClick={() => navigate(ROUTES.favorites)}
          >
            <Heart className="h-4.5 w-4.5" />
            {favoriteBankIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-forest-600 text-[10px] text-white">
                {favoriteBankIds.length}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -60, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 60, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
              </motion.span>
            </AnimatePresence>
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border"
          >
            <nav className="container py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "px-3.5 py-2.5 rounded-xl text-sm font-medium",
                      isActive ? "bg-forest-600 text-white" : "hover:bg-secondary"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to={ROUTES.favorites}
                onClick={() => setOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary"
              >
                Favorites
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
