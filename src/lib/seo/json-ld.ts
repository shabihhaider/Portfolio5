import { author, site, agency } from '@/lib/config/site';
import { services } from '@/data/services';
import { faqItems } from '@/data/faq';
import { caseStudies, type CaseStudy } from '@/data/case-studies';

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

export function getCaseStudySchema(study: CaseStudy) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${study.title} Case Study`,
        description: study.tagline,
        url: `${site.url}/work/${study.slug}`,
        author: {
            '@type': 'Person',
            name: author.fullName,
        },
        publisher: {
            '@type': 'Organization',
            name: agency.name,
            url: site.url,
        },
        articleSection: study.category,
        ...(study.techStack && { keywords: study.techStack.join(', ') }),
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
                { '@type': 'ListItem', position: 2, name: 'Work', item: `${site.url}/work` },
                { '@type': 'ListItem', position: 3, name: study.title, item: `${site.url}/work/${study.slug}` },
            ],
        },
    };
}

export function getWorkPageSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Case Studies — Shabih.',
        description: 'Portfolio of web development and AI integration projects.',
        url: `${site.url}/work`,
        numberOfItems: caseStudies.length,
        itemListElement: caseStudies.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.title,
            url: `${site.url}/work/${s.slug}`,
        })),
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
