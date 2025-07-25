import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Country code to full country name mapping
export const COUNTRY_NAME_MAP: Record<string, string> = {
  usa: 'United States',
  us: 'United States',
  unitedstates: 'United States',
  'united states': 'United States',
  'united states of america': 'United States',
  can: 'Canada',
  ca: 'Canada',
  cnd: 'Canada',
  canada: 'Canada',
  mex: 'Mexico',
  mx: 'Mexico',
  gbr: 'United Kingdom',
  uk: 'United Kingdom',
  'united kingdom': 'United Kingdom',
  'united kingdom of great britain': 'United Kingdom',
  eng: 'England',
  england: 'England',
  fra: 'France',
  fr: 'France',
  france: 'France',
  deu: 'Germany',
  ger: 'Germany',
  de: 'Germany',
  germany: 'Germany',
  esp: 'Spain',
  es: 'Spain',
  spain: 'Spain',
  ita: 'Italy',
  it: 'Italy',
  italy: 'Italy',
  cze: 'Czech Republic',
  czech: 'Czech Republic',
  'czech republic': 'Czech Republic',
  est: 'Estonia',
  estonia: 'Estonia',
  cyp: 'Cyprus',
  cyprus: 'Cyprus',
  kor: 'South Korea',
  'south korea': 'South Korea',
  malta: 'Malta',
  mlt: 'Malta',
  bel: 'Belgium',
  belgium: 'Belgium',
  aut: 'Austria',
  austria: 'Austria',
  tpe: 'Taiwan',
  svk: 'Slovakia',
  swi: 'Switzerland',
  switzerland: 'Switzerland',
  aus: 'Australia',
  aru: 'Aruba',
  aho: 'Netherlands Antilles',
  // Add more as needed
};

export function normalizeCountryName(country: string): string {
  if (!country) return '';
  const trimmed = country.trim().toLowerCase();
  return COUNTRY_NAME_MAP[trimmed] ||
    trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
