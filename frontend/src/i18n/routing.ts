import { defineRouting } from 'next-intl/routing';
import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';


/**
 * @module routing-config
 * 
 * This module defines routing configuration for internationalization (i18n) in a Next.js app
 * using `next-intl`. It sets up routing and locale management, and provides utilities for
 * navigating between localized versions of paths.
 * 
 * The routing configuration specifies the supported locales, default locale, and how
 * localized pathnames are handled within the app.
 * 
 * @example
 * // Example usage
 * import { Link, useRouter } from '@/i18n/routing'; 
import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
 * 
 * // Usage of Link component to render localized links
 * <Link href="/about">About Us</Link>
 */

/**
 * List of supported locales in the application.
 * This is used for locale-based routing and rendering localized content.
 * 
 * @type {string[]}
 */
export const locales =  ['en', "de", "bn", 'ru'];

/**
 * The `routing` object is created by calling `defineRouting`, which configures the internationalization 
 * routing for the application. It includes supported locales, default locale, locale prefix, and pathnames.
 * 
 * - `locales`: An array of supported locales (English, German, Bangla, Russian).
 * - `defaultLocale`: The fallback locale used when no valid locale is provided, in this case, 'en'.
 * - `localePrefix`: Defines how the locale will be used in the URL path. For example, if `"always"`, the locale will always appear in the URL.
 * - `pathnames`: A mapping of pathnames to their localized versions. The current configuration only maps `/` to `/`.
 * 
 * @example
 * routing.locales // ['en', 'de', 'bn', 'ru']
 * routing.defaultLocale // 'en'
 * routing.pathnames // { '/': '/' }
 */
export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'en',
  localePrefix: "always",  // The locale will always appear in the URL path.
  pathnames: {
    '/': '/',  // Map the root path (/) to itself (i.e., no change).
  }
}); 

/**
 * Type representing the possible localized pathnames based on the defined routing.
 * This type is inferred from the keys of `routing.pathnames`.
 * 
 * @type {keyof typeof routing.pathnames}
 */
export type Pathnames = keyof typeof routing.pathnames;

/**
 * Type representing a single locale from the list of supported locales.
 * This type ensures that only valid locales are used within the application.
 * 
 * @type {('en' | 'de' | 'bn' | 'ru')}
 */
export type Locale = (typeof routing.locales)[number];

/**
 * `createLocalizedPathnamesNavigation` is a utility function from `next-intl/navigation` that
 * provides several helpful methods for working with localized pathnames.
 * 
 * The following utilities are exported:
 * 
 * - **Link**: A component that creates localized links based on the current locale.
 * - **getPathname**: A function to get the current pathname based on the locale.
 * - **redirect**: A function that allows redirecting to a specific localized path.
 * - **usePathname**: A hook that provides the current pathname in the context of the locale.
 * - **useRouter**: A hook that provides access to the Next.js router with localized path management.
 * 
 * @example
 * // Example usage of Link component for navigation
 * <Link href="/about">About Us</Link>
 * 
 * @example
 * // Example usage of usePathname hook to get the current localized pathname
 * const currentPath = usePathname();
 */
export const { Link, getPathname, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation(routing);
