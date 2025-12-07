import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  
  // Allow short code redirects (any path that's not /api, /sign-in, /sign-up, or /)
  // This allows public access to redirect routes like /abc123
  if (!pathname.startsWith("/api") && 
      !pathname.startsWith("/sign-in") && 
      !pathname.startsWith("/sign-up") &&
      pathname !== "/") {
    return; // Public access for redirect routes like /abc123
  }
  
  // Protect all other routes (home page and API routes) except public ones
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

