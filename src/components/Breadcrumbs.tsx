"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(p => p !== '');

    // Don't show breadcrumbs on the home page or api docs
    if (paths.length === 0 || paths[0] === 'api-docs') {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className="breadcrumbs-container">
            <ol className="breadcrumbs-list">
                <li className="breadcrumb-item">
                    <Link href={"/" as any} className="breadcrumb-link tooltip-trigger">
                        <span className="breadcrumb-icon">🏠</span>
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
    );
}
