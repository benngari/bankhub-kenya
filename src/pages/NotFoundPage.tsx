import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function NotFoundPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-28 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-900 text-gold-400">
        <Landmark className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">We couldn't find that page or bank profile.</p>
      <div className="mt-6 flex gap-3">
        <Link to={ROUTES.home}>
          <Button>Go home</Button>
        </Link>
        <Link to={ROUTES.search}>
          <Button variant="outline">Search banks</Button>
        </Link>
      </div>
    </div>
  );
}
