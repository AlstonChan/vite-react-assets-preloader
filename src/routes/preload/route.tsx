import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/preload")({
  component: RouteComponent,
});

interface CacheBustImage {
  original: string;
  cacheBusted: string;
}

function RouteComponent() {
  const imageUrls: string[] = Object.values(
    import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp}", {
      eager: true,
      import: "default",
    }),
  );

  const [isLoading, setIsLoading] = useState(imageUrls.length > 0);
  const [loadedImages, setLoadedImages] = useState<Array<CacheBustImage>>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  const hasInitRef = useRef(false);

  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;

    if (imageUrls.length === 0) return;

    const images: Array<CacheBustImage> = [];

    const preloadImage = (url: string): Promise<CacheBustImage> => {
      return new Promise((resolve, reject) => {
        // We still do the cache bust to ensure we get a fresh fetch
        const cacheBustedUrl = `${url}?cache-bust=${crypto.randomUUID()}`;
        const img = new Image();

        img.onload = async () => {
          try {
            // decode() puts the image in GPU memory
            await img.decode();
            setLoadedCount((count) => count + 1);
            resolve({ original: url, cacheBusted: cacheBustedUrl });
          } catch (decodeError) {
            console.error(`Error decoding image: ${url}`, decodeError);
            setLoadedCount((count) => count + 1);
            reject(new Error(`Failed to decode image: ${url}`));
          }
        };
        img.onerror = () => {
          console.error(`Error loading image: ${url}`);
          setLoadedCount((count) => count + 1);
          reject(new Error(`Failed to load image: ${url}`));
        };
        img.src = cacheBustedUrl;
      });
    };

    Promise.allSettled(imageUrls.map(preloadImage)).then((results) => {
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          images.push(result.value);
        }
      });
      setLoadedImages(images);
      setTimeout(() => setIsLoading(false), 0);
    });
  }, [imageUrls]);

  const loadingProgress = imageUrls.length > 0 ? Math.round((loadedCount / imageUrls.length) * 100) : 100;

  return (
    <div className="relative min-h-screen">
      {/* 1. LOADING OVERLAY 
        We use `absolute` and `z-50` to cover the content.
        We use a transition on opacity to make the reveal smooth.
        pointer-events-none ensures we can click buttons immediately after it fades.
      */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500",
          isLoading ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="w-full max-w-md px-4">
          <h2 className="mb-6 text-center text-2xl font-semibold">Loading Images...</h2>
          <Progress value={loadingProgress} className="mb-4 w-full" />
          <p className="text-center text-lg font-medium">{loadingProgress}%</p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {loadedCount} of {imageUrls.length} images loaded
          </p>
        </div>
      </div>

      {/* 2. ACTUAL CONTENT 
        We render this ALWAYS. Even when isLoading is true.
        This allows the browser to perform the layout and paint the <img> tags
        BEHIND the white loading screen.
      */}
      <div className="px-4 py-8">
        <div className="my-8 flex flex-col items-center gap-4">
          <header>
            <h1 className="mb-8 text-center text-4xl font-bold">Preload Page</h1>
            <p className="mb-4 text-center text-lg text-muted-foreground">
              This page preloads all images before rendering.
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
          {loadedImages.map((image, i) => (
            <img
              key={i}
              src={image.cacheBusted}
              className="mb-4 w-full break-inside-avoid rounded-xl"
              // Since we preloaded it, we tell the browser:
              // "Don't render this frame until this image is ready to display."
              decoding="sync"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
