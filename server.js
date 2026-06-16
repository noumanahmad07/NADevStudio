require('dotenv').config();

const express = require('express');
const compression = require('compression');
const { engine } = require('express-handlebars');
const path = require('path');
const indexRoutes = require('./routes/index');

const { applySeoLocals } = require('./utils/seo');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml; charset=UTF-8');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain; charset=UTF-8');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.use(compression());
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
    setHeaders(res, filePath) {
      if (/\.(woff2|webp|png|jpg|svg|ico)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: {
      json: (context) => JSON.stringify(context),
    },
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  applySeoLocals(req, res);
  next();
});

app.use('/', indexRoutes);

if (!require('./utils/mailer').isEmailConfigured()) {
  console.warn(
    'Contact form: SMTP not configured — submissions will be saved to data/contact-submissions.json'
  );
}

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
