import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';


export const locales =  ['en', "de", "bn", 'ru'];
export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'en',
  localePrefix:"always",
  pathnames: {
    '/':   '/',
 
 
  }
});



export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const {Link, getPathname, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation(routing);