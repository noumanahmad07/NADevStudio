const nodemailer = require('nodemailer');

const PLACEHOLDER_VALUES = ['your@gmail.com', 'your_app_password'];

function isEmailConfigured() {
  const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return false;
  if (PLACEHOLDER_VALUES.includes(EMAIL_USER) || PLACEHOLDER_VALUES.includes(EMAIL_PASS)) {
    return false;
  }
  return true;
}

function createTransporter() {
  const port = Number(process.env.EMAIL_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

function sendWithTimeout(transporter, mailOptions, ms = 10000) {
  return Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email delivery timed out')), ms);
    }),
  ]);
}

exports.isEmailConfigured = isEmailConfigured;

exports.sendContactEmail = async ({ name, email, service, budget, message }) => {
  if (!isEmailConfigured()) {
    return { sent: false, reason: 'not_configured' };
  }

  const transporter = createTransporter();
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;

  const html = `
    <h2>New Contact Form Submission — NA Dev Studio</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Service:</strong> ${escapeHtml(service)}</p>
    <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `;

  await sendWithTimeout(transporter, {
    from: `"NA Dev Studio Website" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `New inquiry from ${name} — ${service}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${service}`,
      `Budget: ${budget}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html,
  });

  return { sent: true };
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
