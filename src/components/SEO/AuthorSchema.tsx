/**
 * Author Schema Component
 *
 * Provides structured data about the author (Tomáš Kostrhoun) and organization (ETF průvodce.cz)
 * Critical for E-E-A-T (Expertise, Experience, Authoritativeness, Trust) signals in Google
 *
 * Used for:
 * - Financial content authority
 * - Author attribution on articles
 * - Trust signals for YMYL (Your Money Your Life) content
 */

export default function AuthorSchema() {
  // Person schema - Tomáš Kostrhoun
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://etfpruvodce.cz/o-nas#tomas-kostrhoun",
    "name": "Tomáš Kostrhoun",
    "givenName": "Tomáš",
    "familyName": "Kostrhoun",
    "jobTitle": "Founder & Author, ETF průvodce.cz",
    "description": "Finanční odborník s 12+ lety praxe v českém bankovnictví (MONETA Money Bank, Česká spořitelna). Zakladatel a autor ETF průvodce.cz – nezávislé vzdělávací platformy o ETF: srovnání, kalkulačky a výnosy přepočtené do korun, bez reklam a provizí.",

    // Work experience and credentials
    "alumniOf": [
      {
        "@type": "Organization",
        "name": "MONETA Money Bank",
        "url": "https://www.moneta.cz",
        "sameAs": "https://en.wikipedia.org/wiki/Moneta_Money_Bank"
      },
      {
        "@type": "Organization",
        "name": "Česká spořitelna",
        "url": "https://www.csas.cz",
        "sameAs": "https://en.wikipedia.org/wiki/Česká_spořitelna"
      }
    ],

    "worksFor": {
      "@type": "Organization",
      "@id": "https://etfpruvodce.cz#organization",
      "name": "ETF průvodce.cz",
      "url": "https://etfpruvodce.cz"
    },

    // Credentials and expertise
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "professional experience",
        "competencyRequired": "12+ years in banking and financial services",
        "educationalLevel": "Senior roles in Czech retail banking (MONETA Money Bank, Česká spořitelna)"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "achievement",
        "competencyRequired": "Portfolio & risk management",
        "educationalLevel": "Managed multi-billion CZK portfolio"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "achievement",
        "competencyRequired": "Digital innovation",
        "educationalLevel": "Led digital banking innovation, incl. first end-to-end online mortgage in the Czech Republic"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "leadership",
        "competencyRequired": "Team management",
        "educationalLevel": "Led teams of 30+ FTE"
      }
    ],

    // Areas of expertise — investičně vedené (web je o ETF), bankovnictví jako kredibilita
    "knowsAbout": [
      "ETF investing",
      "Exchange Traded Funds",
      "Index investing",
      "Investment strategy",
      "Portfolio management",
      "Asset allocation",
      "Personal finance",
      "Financial planning",
      "Czech financial markets",
      "Banking",
      "Financial services",
      "Risk management",
      "Financial products",
      "Fintech innovation"
    ],

    // Contact and social proof
    "email": "info@etfpruvodce.cz",
    "url": "https://etfpruvodce.cz/o-nas",
    "sameAs": [
      "https://www.linkedin.com/in/tomas-kostrhoun-b34a6831",
      "https://x.com/ETFpruvodce"
    ],

    // Additional trust signals
    "nationality": {
      "@type": "Country",
      "name": "Czech Republic"
    },
    "workLocation": {
      "@type": "Place",
      "name": "Prague, Czech Republic"
    }
  };

  // Organization schema - ETF průvodce.cz
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "WebSite"],
    "@id": "https://etfpruvodce.cz#organization",
    "name": "ETF průvodce.cz",
    "legalName": "ETF průvodce.cz",
    "url": "https://etfpruvodce.cz",
    "logo": {
      "@type": "ImageObject",
      "url": "https://etfpruvodce.cz/logo.png",
      "width": 200,
      "height": 60,
      "caption": "ETF průvodce.cz logo"
    },
    "description": "Největší český průvodce ETF fondy. Srovnání 4300+ ETF fondů, aktuální výkonnost přepočítaná do českých korun, nezávislé recenze brokerů. Jedinečná databáze ETF pro české investory.",
    "foundingDate": "2024",
    "founder": {
      "@id": "https://etfpruvodce.cz/o-nas#tomas-kostrhoun"
    },
    "sameAs": [
      "https://x.com/ETFpruvodce"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "info@etfpruvodce.cz"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Czech Republic"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Czech investors",
      "geographicArea": {
        "@type": "Country",
        "name": "Czech Republic"
      }
    },
    // What the organization offers
    "knowsAbout": [
      "ETF funds comparison",
      "Investment education",
      "Broker reviews",
      "Financial calculators",
      "Portfolio strategies",
      "Czech market focus"
    ],
    "slogan": "Největší český průvodce ETF fondy"
  };

  return (
    <>
      {/* Author/Person schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      {/* Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
