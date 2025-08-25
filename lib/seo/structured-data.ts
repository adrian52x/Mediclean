import { Metadata } from 'next'

// Base site configuration
const SITE_CONFIG = {
  name: 'Dezinfect MD',
  url: 'https://www.dezinfect.md',
  logo: 'https://www.dezinfect.md/images/med-logo.png',
  description: 'Magazin online cu dezinfectanți profesionali și echipamente medicale în Moldova',
  address: {
    street: 'Str. Nicolae Zelinski 36/6',
    city: 'Chișinău',
    country: 'MD'
  },
  contact: {
    phone: '+37379410042',
    email: 'contact@dezinfect.md'
  }
}

// Category configurations for products
export const PRODUCT_CATEGORIES = {
  disinfectants: {
    title: 'Dezinfectanți Medicali',
    description: 'Dezinfectanți medicali profesionali pentru spitale, clinici și cabinete medicale. Produse certificate pentru dezinfectarea suprafețelor și instrumentelor medicale.',
    keywords: [
      'dezinfectanți medicali Moldova',
      'dezinfectanți profesionali',
      'dezinfectanți spitale',
      'dezinfectanți cabinet medical',
      'dezinfectanți stomatologie'
    ]
  },
  equipment: {
    title: 'Echipamente Medicale',
    description: 'Echipamente medicale de înaltă calitate pentru instituții medicale din Moldova. Instrumentar medical profesional și echipamente pentru cabinete medicale.',
    keywords: [
      'echipamente medicale Moldova',
      'instrumentar medical',
      'echipamente stomatologice',
      'echipamente cabinet medical',
      'aparate medicale'
    ]
  }
}

// Base keywords for all pages
const BASE_KEYWORDS = [
  'produse medicale Moldova',
  'consumabile medicale',
  'produse pentru spitale',
  'echipamente cabinet medical',
  'produse sanitare',
  'medicina generală',
  'stomatologie Moldova'
]

// Generate metadata for products page
export function generateProductsMetadata(category?: string): Metadata {
  const categoryConfig = category ? PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES] : null
  
  const title = categoryConfig 
    ? `${categoryConfig.title} | ${SITE_CONFIG.name}`
    : `Produse Medicale Profesionale | ${SITE_CONFIG.name}`
    
  const description = categoryConfig?.description || 
    'Descoperă gama completă de produse medicale profesionale - dezinfectanți, echipamente și consumabile medicale pentru instituții de sănătate din Moldova.'

  const keywords = categoryConfig 
    ? [...categoryConfig.keywords, ...BASE_KEYWORDS]
    : BASE_KEYWORDS

  const url = `${SITE_CONFIG.url}/products${category ? `?category=${category}` : ''}`

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: SITE_CONFIG.name,
      locale: 'ro_MD',
      images: [
        {
          url: SITE_CONFIG.logo,
          width: 800,
          height: 600,
          alt: `${SITE_CONFIG.name} - Produse Medicale`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SITE_CONFIG.logo]
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}

// Generate structured data for products page
export function generateProductsSchema(category?: string) {
  const categoryConfig = category ? PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES] : null
  
  const getProductItems = () => {
    if (category === 'disinfectants') {
      return [
        {
          '@type': 'Product',
          name: 'Dezinfectanți pentru suprafețe',
          category: 'Dezinfectanți Medicali'
        },
        {
          '@type': 'Product', 
          name: 'Dezinfectanți pentru instrumentar',
          category: 'Dezinfectanți Medicali'
        }
      ]
    }
    
    if (category === 'equipment') {
      return [
        {
          '@type': 'Product',
          name: 'Echipamente stomatologice',
          category: 'Echipamente Medicale'
        },
        {
          '@type': 'Product',
          name: 'Instrumentar medical',
          category: 'Echipamente Medicale'  
        }
      ]
    }
    
    return []
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryConfig ? `Produse ${categoryConfig.title}` : 'Produse Medicale',
    description: 'Colecție completă de produse medicale profesionale pentru instituții de sănătate',
    url: `${SITE_CONFIG.url}/products${category ? `?category=${category}` : ''}`,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Produse Medicale',
      description: 'Lista produselor medicale disponibile',
      numberOfItems: '50+',
      itemListElement: getProductItems()
    },
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: SITE_CONFIG.logo
    }
  }
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SITE_CONFIG.name,
    "image": SITE_CONFIG.logo,
    "description": SITE_CONFIG.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.street,
      "addressLocality": SITE_CONFIG.address.city,
      "addressCountry": SITE_CONFIG.address.country
    },
    "url": SITE_CONFIG.url,
    "telephone": SITE_CONFIG.contact.phone,
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$",
    "currenciesAccepted": "MDL",
    "paymentAccepted": "Cash, Credit Card"
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": "2",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Dezinfectanți Medicali",
          "url": `${SITE_CONFIG.url}/products?category=disinfectants`
        },
        {
          "@type": "SiteNavigationElement", 
          "position": 2,
          "name": "Echipamente Medicale",
          "url": `${SITE_CONFIG.url}/products?category=equipment`
        }
      ]
    }
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "logo": SITE_CONFIG.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SITE_CONFIG.contact.phone,
      "contactType": "customer service",
      "availableLanguage": ["Romanian", "Russian"]
    }
  };
}
