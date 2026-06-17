const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { setPageSeo, PAGE_SEO } = require('../utils/seo');

function renderHomePage(req, res, pageKey) {
  setPageSeo(req, res, pageKey);
  const page = PAGE_SEO[pageKey];
  res.render('index', {
    title: 'NA Dev Studio',
    scrollSection: page.scrollSection,
  });
}

router.get('/', (req, res) => {
  renderHomePage(req, res, 'home');
});

router.get('/about', (req, res) => {
  renderHomePage(req, res, 'about');
});

router.get('/services', (req, res) => {
  renderHomePage(req, res, 'services');
});

router.get('/portfolio', (req, res) => {
  renderHomePage(req, res, 'portfolio');
});

router.get('/contact', (req, res) => {
  renderHomePage(req, res, 'contact');
});

router.get('/privacy-policy', (req, res) => {
  setPageSeo(req, res, 'privacy');
  res.render('privacy-policy', { title: 'NA Dev Studio' });
});

router.post('/contact', contactController.sendMessage);

router.get('/thanks', (req, res) => {
  res.redirect('/contact?sent=true');
});

module.exports = router;
