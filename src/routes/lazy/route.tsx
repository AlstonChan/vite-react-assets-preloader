import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/lazy')({
  component: RouteComponent,
});

function RouteComponent() {
  const images: string[] = Object.values(
    import.meta.glob('@/assets/*.{jpg,jpeg,png,webp}', {
      eager: true,
      import: 'default',
    }),
  );

  return (
    <div className="px-4">
      <div className="my-8 flex flex-col items-center gap-4">
        <header>
          <h1 className="mb-8 text-center text-4xl font-bold">Lazy Load Page</h1>
          <p className="mb-4 text-center text-lg text-muted-foreground">
            This page lazy-loads images as they come into the viewport. Scroll down to load more images.
          </p>
        </header>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button size="lg" className="cursor-pointer" variant="secondary" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </div>
      </div>
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
        {images.map((image, i) => (
          <img
            key={i}
            src={`${image}?cache-bust=${crypto.randomUUID()}`}
            onLoad={(e) => {
              console.log(e.currentTarget.naturalHeight);
              e.currentTarget.height = e.currentTarget.naturalHeight;
              e.currentTarget.width = e.currentTarget.naturalWidth;
            }}
            loading="lazy"
            className="mb-4 w-full break-inside-avoid rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
