import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

let convexClient: ConvexReactClient | null = null;
if (convexUrl) {
  convexClient = new ConvexReactClient(convexUrl);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    // If VITE_CONVEX_URL is not set yet, fallback gracefully without breaking the site
    return <>{children}</>;
  }
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
