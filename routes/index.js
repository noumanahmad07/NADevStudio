const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', (req, res) => {
  res.render('index', { title: 'NA Dev Studio' });
});

router.post('/contact', contactController.sendMessage);

router.get('/thanks', (req, res) => {
  res.redirect('/?sent=true#contact');
});

module.exports = router;
