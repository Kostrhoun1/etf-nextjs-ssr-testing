import { Metadata } from 'next';

/**
 * Generate canonical metadata for a page
 * @param path - The path of the page (e.g., '/kde-koupit-etf')
 * @param title - Page title
 * @param description - Page description
 * @param additionalMetadata - Any additional metadata to merge
 */
export function generateCanonicalMetadata(
  path: string,
  title: string,
  description: string,
  additionalMetadata?: Partial<Metadata>
): Metadata {
  const baseUrl = 'https://www.etfpruvodce.cz';
  const canonicalUrl = `${baseUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ETF průvodce.cz',
      type: 'website',
      locale: 'cs_CZ',
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    ...additionalMetadata,
  };
}
