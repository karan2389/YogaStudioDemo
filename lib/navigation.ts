export interface NavItemMatchOptions {
  exact?: boolean;
  aliases?: string[];
}

/**
 * Determines whether a dashboard navigation item is active given the current pathname.
 * Handles exact matching, nested routes safely (e.g. /instructor/sessions/[id]),
 * and configured route aliases (e.g. /dashboard -> /dashboard/bookings, /admin/sessions -> /admin/classes).
 */
export function isNavItemActive(
  pathname: string,
  href: string,
  options?: NavItemMatchOptions
): boolean {
  if (!pathname || !href) return false;

  // Normalize paths by stripping trailing slashes (except root "/")
  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const cleanHref = href.length > 1 && href.endsWith("/") ? href.slice(0, -1) : href;

  // 1. Direct exact match
  if (cleanPath === cleanHref) {
    return true;
  }

  // 2. Check explicit aliases
  if (options?.aliases && options.aliases.length > 0) {
    for (const alias of options.aliases) {
      const cleanAlias = alias.length > 1 && alias.endsWith("/") ? alias.slice(0, -1) : alias;
      if (cleanPath === cleanAlias || cleanPath.startsWith(`${cleanAlias}/`)) {
        return true;
      }
    }
  }

  // 3. If exact matching was specified, do not perform nested prefix match
  if (options?.exact) {
    return false;
  }

  // 4. Safe nested matching (e.g., /admin/bookings/book-123 matches /admin/bookings)
  // Check with trailing slash to prevent false prefix matches like /admin/payments matching /admin/payments-extra
  return cleanPath.startsWith(`${cleanHref}/`);
}
