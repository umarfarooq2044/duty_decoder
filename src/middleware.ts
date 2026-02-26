import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // API routes — pass through
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    // AEO & SEO Redirects on calculation pages
    if (pathname.startsWith("/calculate/")) {
        const pathParts = pathname.split('/');
        if (pathParts.length >= 3) {
            const slug = pathParts[2];
            // Match trailing -uuid or -timestamp to catch legacy routes
            const legacySlugMatch = slug?.match(/^(.*)-[a-f0-9]{8,}$|^(.*)-\d{10,}$/);

            if (legacySlugMatch) {
                const cleanBase = legacySlugMatch[1] || legacySlugMatch[2];
                if (cleanBase) {
                    const url = request.nextUrl.clone();
                    url.pathname = `/calculate/${cleanBase}`;
                    return NextResponse.redirect(url, 301);
                }
            }
        }

        const response = NextResponse.next();
        response.headers.set("x-robots-tag", "noarchive");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*", "/calculate/:path*"],
};
