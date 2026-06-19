const fs = require('fs');
const path = require('path');
const { buildSitemap } = require('../utils/seo');

const staticSitemap = path.join(__dirname, '..', 'public', 'sitemap.xml');

module.exports = (req, res) => {
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const siteUrl = `${proto}://${host}`.replace(/\/$/, '');

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    if (fs.existsSync(staticSitemap)) {
      return res.status(200).send(fs.readFileSync(staticSitemap, 'utf8'));
    }

    res.status(200).send(buildSitemap(siteUrl));
  } catch (err) {
    console.error('sitemap error:', err);
    res.status(500).send('Sitemap unavailable');
  }
};
