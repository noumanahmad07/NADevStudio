require('dotenv').config();

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
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

app.use('/', indexRoutes);

if (!require('./utils/mailer').isEmailConfigured()) {
  console.warn(
    'Contact form: SMTP not configured — submissions will be saved to data/contact-submissions.json'
  );
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
