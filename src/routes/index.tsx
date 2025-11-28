import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <div className="max-w-2xl text-center">
        <header className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Vite React Assets Preloader Demo</h1>
          <p className="text-center text-lg text-muted-foreground">
            This demo showcases preloading image assets before rendering the page and compares it with lazy-loading.
          </p>
        </header>
        <div className="flex flex-col gap-4 md:flex-row md:justify-center">
          <Button size="lg" asChild>
            <Link to="/preload">Go to Preload Page</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/lazy">Go to Lazy Load Page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
