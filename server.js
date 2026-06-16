require('dotenv').config();

const express = require('express');
const compression = require('compression');
const { engine } = require('express-handlebars');
const path = require('path');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
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
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  const siteUrl = (process.env.SITE_URL || `${proto}://${host}`).replace(/\/$/, '');
  res.locals.siteUrl = siteUrl;
  res.locals.metaDescription =
    'NA Dev Studio designs and develops modern websites and mobile apps for brands worldwide. Web development, mobile apps, UI/UX, and e-commerce — based in Lahore, Pakistan.';
  res.locals.canonicalUrl = `${siteUrl}${req.path === '/' ? '' : req.path}`;
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
