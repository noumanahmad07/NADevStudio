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

const SITEMAP_URLS = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/portfolio', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
];

const PAGE_SEO = {
  home: {
    path: '/',
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
  },
  about: {
    path: '/about',
    title: 'About Us | NA Dev Studio — Web Development Agency in Lahore',
    description:
      'Meet NA Dev Studio — a Lahore-based web development and mobile app agency with 50+ projects delivered. We build custom digital products for startups and businesses in Pakistan and worldwide.',
  },
  services: {
    path: '/services',
    title: 'Services | NA Dev Studio — Web, Mobile & E-Commerce Development',
    description:
      'Website development, mobile apps, full-stack web applications, UI/UX design, e-commerce solutions, and maintenance. Custom digital products from NA Dev Studio in Lahore, Pakistan.',
  },
  portfolio: {
    path: '/portfolio',
    title: 'Portfolio | NA Dev Studio — Web & Mobile App Projects',
    description:
      'Case studies: ShopFlow marketplace, HealthTrack Pro mobile app, DataLens analytics, and OrderEase POS — web and mobile projects built by NA Dev Studio for clients worldwide.',
  },
  contact: {
    path: '/contact',
    title: 'Contact | NA Dev Studio — Start Your Web or App Project',
    description:
      'Contact NA Dev Studio in Lahore, Pakistan. WhatsApp +92 371 5933395 or email hello@nadevstudio.com. Get a project quote within 24 hours.',
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy | NA Dev Studio',
    description:
      'Privacy Policy for NA Dev Studio. How we collect, use, and protect your information when you visit our website or contact us.',
  },
};

function setPageSeo(req, res, pageKey) {
  const page = PAGE_SEO[pageKey];
  if (!page) return;

  const siteUrl = res.locals.siteUrl;
  const canonicalUrl = page.path === '/' ? siteUrl : `${siteUrl}${page.path}`;

  res.locals.canonicalUrl = canonicalUrl;
  res.locals.pageTitle = page.title;
  res.locals.metaDescription = page.description;
  res.locals.structuredData = buildStructuredData(siteUrl, canonicalUrl, page.title, page.description);
}

function applySeoLocals(req, res) {
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  const siteUrl = (process.env.SITE_URL || `${proto}://${host}`).replace(/\/$/, '');
  const canonicalUrl = req.path === '/' ? siteUrl : `${siteUrl}${req.path}`;

  res.locals.siteUrl = siteUrl;
  res.locals.canonicalUrl = canonicalUrl;
  res.locals.pageTitle = PAGE_TITLE;
  res.locals.metaDescription = META_DESCRIPTION;
  res.locals.metaKeywords = KEYWORDS;
  res.locals.ogImage = `${siteUrl}/images/hero-devices-640.webp`;
  res.locals.googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || '';
  res.locals.faqItems = FAQ_ITEMS;
  res.locals.structuredData = buildStructuredData(siteUrl, canonicalUrl, PAGE_TITLE, META_DESCRIPTION);
}

function buildStructuredData(siteUrl, canonicalUrl, pageTitle, pageDescription) {
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
        name: pageTitle,
        description: pageDescription,
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
  const base = siteUrl.replace(/\/$/, '');

  const urls = SITEMAP_URLS.map(
    (entry) => `  <url>
    <loc>${entry.path === '/' ? `${base}/` : `${base}${entry.path}`}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  ).join('\n');

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
  setPageSeo,
  buildSitemap,
  buildRobots,
  SITEMAP_URLS,
  PAGE_SEO,
  FAQ_ITEMS,
  META_DESCRIPTION,
  PAGE_TITLE,
};
