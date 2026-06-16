const KEYWORDS = [
  'NA Dev Studio',
  'web development Lahore',
  'website development Pakistan',
  'mobile app development Lahore',
  'web development agency',
  'custom website development',
  'e-commerce development',
  'UI UX design Lahore',
  'full stack development',
  'software development Pakistan',
  'freelance web developer Lahore',
  'React development',
  'Next.js development',
].join(', ');

const META_DESCRIPTION =
  'NA Dev Studio is a web development and mobile app agency in Lahore, Pakistan. Custom websites, e-commerce stores, UI/UX design, and full-stack applications for clients worldwide.';

const PAGE_TITLE =
  'NA Dev Studio | Web & Mobile App Development Agency in Lahore, Pakistan';

const FAQ_ITEMS = [
  {
    question: 'What services does NA Dev Studio offer?',
    answer:
      'NA Dev Studio offers website development, mobile app development, full-stack web applications, UI/UX design, e-commerce solutions, and ongoing maintenance and support for businesses worldwide.',
  },
  {
    question: 'Where is NA Dev Studio located?',
    answer:
      'NA Dev Studio is based in Lahore, Pakistan, and works with clients locally and internationally through remote collaboration.',
  },
  {
    question: 'Do you build e-commerce websites?',
    answer:
      'Yes. We build custom e-commerce platforms and online stores with secure payments, inventory management, vendor dashboards, and SEO-friendly product pages.',
  },
  {
    question: 'How long does a website or app project take?',
    answer:
      'Most MVPs and business websites are delivered in 2–4 weeks. Larger web apps and mobile products typically take 4–8 weeks depending on scope and features.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Yes. NA Dev Studio serves clients worldwide with transparent communication, weekly progress updates, and dedicated project channels.',
  },
];

function applySeoLocals(req, res) {
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  const siteUrl = (process.env.SITE_URL || `${proto}://${host}`).replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${req.path === '/' ? '' : req.path}`;

  res.locals.siteUrl = siteUrl;
  res.locals.canonicalUrl = canonicalUrl;
  res.locals.pageTitle = PAGE_TITLE;
  res.locals.metaDescription = META_DESCRIPTION;
  res.locals.metaKeywords = KEYWORDS;
  res.locals.ogImage = `${siteUrl}/images/hero-devices-640.webp`;
  res.locals.googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || '';
  res.locals.faqItems = FAQ_ITEMS;
  res.locals.structuredData = buildStructuredData(siteUrl, canonicalUrl);
}

function buildStructuredData(siteUrl, canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'NA Dev Studio',
        url: siteUrl,
        logo: `${siteUrl}/images/logo.webp`,
        email: 'hello@nadevstudio.com',
        telephone: '+923715933395',
        sameAs: [
          'https://www.facebook.com/profile.php?id=61590967071451',
          'https://www.instagram.com/na_dev_studio',
          'https://github.com/noumanahmad07/NADevStudio',
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: 'NA Dev Studio',
        description: META_DESCRIPTION,
        url: siteUrl,
        image: `${siteUrl}/images/hero-devices-640.webp`,
        email: 'hello@nadevstudio.com',
        telephone: '+923715933395',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lahore',
          addressRegion: 'Punjab',
          addressCountry: 'PK',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 31.5204,
          longitude: 74.3587,
        },
        areaServed: ['Pakistan', 'Worldwide'],
        knowsAbout: [
          'Web Development',
          'Mobile App Development',
          'E-Commerce Development',
          'UI/UX Design',
          'Full-Stack Development',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'NA Dev Studio',
        description: META_DESCRIPTION,
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: PAGE_TITLE,
        description: META_DESCRIPTION,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#localbusiness` },
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}

function buildSitemap(siteUrl) {
  const lastmod = new Date().toISOString().split('T')[0];
  const sections = [
    { loc: siteUrl, priority: '1.0' },
    { loc: `${siteUrl}/#services`, priority: '0.9' },
    { loc: `${siteUrl}/#portfolio`, priority: '0.8' },
    { loc: `${siteUrl}/#why-us`, priority: '0.8' },
    { loc: `${siteUrl}/#contact`, priority: '0.9' },
  ];

  const urls = sections
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots(siteUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

module.exports = {
  applySeoLocals,
  buildSitemap,
  buildRobots,
  FAQ_ITEMS,
  META_DESCRIPTION,
  PAGE_TITLE,
};
