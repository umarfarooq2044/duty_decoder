"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

export function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(p => p !== '');

    // Don't show breadcrumbs on the home page or api docs
    if (paths.length === 0 || paths[0] === 'api-docs') {
        return null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com";
    const itemListElement = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl + "/"
        }
    ];

    paths.forEach((path, index) => {
        const href = `${baseUrl}/${paths.slice(0, index + 1).join('/')}/`;
        let displayPath = path;
        const routeMatch = path.match(/(.+?)-from-([a-z]{2})-to-([a-z]{2})(?:-\w+)?$/i);
        if (routeMatch) {
            try {
                const productPart = routeMatch[1] || "";
                const originCode = (routeMatch[2] || "").toUpperCase();
                const destCode = (routeMatch[3] || "").toUpperCase();
                const originName = new Intl.DisplayNames(['en'], { type: 'region' }).of(originCode) || originCode;
                const destName = new Intl.DisplayNames(['en'], { type: 'region' }).of(destCode) || destCode;
                displayPath = `${productPart} from ${originName} to ${destName}`;
            } catch (e) {}
        }
        const formattedPath = displayPath
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());

        itemListElement.push({
            "@type": "ListItem",
            "position": index + 2,
            "name": formattedPath,
            "item": href
        });
    });

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": itemListElement
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav aria-label="Breadcrumb" className="breadcrumbs-container">
            <ol className="breadcrumbs-list">
                <li className="breadcrumb-item">
                    <Link href={"/" as any} className="breadcrumb-link tooltip-trigger">
                        <Home style={{ width: "1rem", height: "1rem" }} />
                        <span className="sr-only">Home</span>
                        <div className="tooltip">Return to Hub</div>
                    </Link>
                </li>

                {paths.map((path, index) => {
                    const isLast = index === paths.length - 1;
                    const href = `/${paths.slice(0, index + 1).join('/')}`;

                    // If it's a generated route slug, translate country codes first
                    let displayPath = path;
                    const routeMatch = path.match(/(.+?)-from-([a-z]{2})-to-([a-z]{2})(?:-\w+)?$/i);
                    if (routeMatch) {
                        try {
                            const productPart = routeMatch[1] || "";
                            const originCode = (routeMatch[2] || "").toUpperCase();
                            const destCode = (routeMatch[3] || "").toUpperCase();
                            const originName = new Intl.DisplayNames(['en'], { type: 'region' }).of(originCode) || originCode;
                            const destName = new Intl.DisplayNames(['en'], { type: 'region' }).of(destCode) || destCode;

                            displayPath = `${productPart} from ${originName} to ${destName}`;
                        } catch (e) {
                            // ignore translation errors
                        }
                    }

                    // Format the path string (e.g. 'medical-devices' -> 'Medical Devices')
                    const formattedPath = displayPath
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, char => char.toUpperCase());

                    return (
                        <li key={path} className="breadcrumb-item">
                            <span className="breadcrumb-separator">›</span>
                            {isLast ? (
                                <span className="breadcrumb-current" aria-current="page">
                                    {formattedPath}
                                </span>
                            ) : (
                                <Link href={href as any} className="breadcrumb-link">
                                    {formattedPath}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
        </>
    );
}
