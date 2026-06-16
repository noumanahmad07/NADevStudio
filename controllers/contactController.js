const mailer = require('../utils/mailer');
const submissions = require('../utils/submissions');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function wantsJson(req) {
  return req.headers.accept && req.headers.accept.includes('application/json');
}

function respond(req, res, status, payload) {
  if (wantsJson(req)) {
    return res.status(status).json(payload);
  }

  if (payload.success) {
    return res.redirect('/?sent=true#contact');
  }

  const code = payload.error === 'validation' ? 'validation' : 'send';
  return res.redirect(`/?error=${code}#contact`);
}

exports.sendMessage = async (req, res) => {
  if (req.body.website) {
    return respond(req, res, 200, { success: true, message: 'Message sent successfully.' });
  }

  const { name, email, service, budget, message } = req.body;

  const trimmed = {
    name: String(name || '').trim(),
    email: String(email || '').trim(),
    service: String(service || '').trim(),
    budget: String(budget || '').trim(),
    message: String(message || '').trim(),
  };

  if (
    !trimmed.name ||
    !trimmed.email ||
    !trimmed.service ||
    !trimmed.budget ||
    !trimmed.message
  ) {
    return respond(req, res, 400, {
      success: false,
      error: 'validation',
      message: 'Please fill in all fields correctly and try again.',
    });
  }

  if (!isValidEmail(trimmed.email)) {
    return respond(req, res, 400, {
      success: false,
      error: 'validation',
      message: 'Please enter a valid email address.',
    });
  }

  if (trimmed.message.length < 10) {
    return respond(req, res, 400, {
      success: false,
      error: 'validation',
      message: 'Please provide a bit more detail about your project.',
    });
  }

  try {
    submissions.saveSubmission(trimmed);

    let emailSent = false;
    if (mailer.isEmailConfigured()) {
      const result = await mailer.sendContactEmail(trimmed);
      emailSent = result.sent;
    }

    return respond(req, res, 200, {
      success: true,
      emailSent,
      message: emailSent
        ? "Message sent successfully! We'll get back to you within 24 hours."
        : "Message received! We'll get back to you within 24 hours.",
    });
  } catch (err) {
    console.error('Contact form failed:', err.message);
    return respond(req, res, 500, {
      success: false,
      error: 'send',
      message: 'Something went wrong. Please try again or email us directly at hello@nadevstudio.com.',
    });
  }
};
