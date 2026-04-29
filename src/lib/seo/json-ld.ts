import { author, site, agency } from '@/lib/config/site';
import { services } from '@/data/services';
import { faqItems } from '@/data/faq';

export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: agency.name,
        url: site.url,
        description: 'Professional web development agency specializing in landing pages, WordPress development, and AI integrations.',
        founder: {
            '@type': 'Person',
            name: author.fullName,
        },
        areaServed: 'Worldwide',
        serviceType: services.map(s => s.title),
        priceRange: '$50 - $10,000+',
        sameAs: [
            author.social.github,
            author.social.linkedin,
            author.social.instagram,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            email: author.email,
            contactType: 'customer service',
            availableLanguage: 'English',
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lahore',
            addressCountry: 'PK',
        },
    };
}

export function getWebPageSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Shabih. | Web Development & AI Integration Agency',
        description: 'Professional web development agency building landing pages, WordPress sites, and AI-powered applications.',
        url: site.url,
        provider: {
            '@type': 'ProfessionalService',
            name: agency.name,
        },
    };
}

export function getFAQSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}
