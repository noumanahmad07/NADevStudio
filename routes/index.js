const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { setPageSeo } = require('../utils/seo');

function renderPage(req, res, pageKey, view) {
  setPageSeo(req, res, pageKey);
  res.render(view, { title: 'NA Dev Studio' });
}

router.get('/', (req, res) => {
  renderPage(req, res, 'home', 'index');
});

router.get('/about', (req, res) => {
  renderPage(req, res, 'about', 'about');
});

router.get('/services', (req, res) => {
  renderPage(req, res, 'services', 'services');
});

router.get('/portfolio', (req, res) => {
  renderPage(req, res, 'portfolio', 'portfolio');
});

router.get('/contact', (req, res) => {
  renderPage(req, res, 'contact', 'contact');
});

router.get('/privacy-policy', (req, res) => {
  renderPage(req, res, 'privacy', 'privacy-policy');
});

router.post('/contact', contactController.sendMessage);

router.get('/thanks', (req, res) => {
  res.redirect('/contact?sent=true');
});

module.exports = router;
