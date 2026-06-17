const { buildSitemap } = require('../utils/seo');

module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const siteUrl = `${proto}://${host}`.replace(/\/$/, '');

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(buildSitemap(siteUrl));
};
