const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'contact-submissions.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

exports.saveSubmission = (data) => {
  ensureDir();
  const entry = { ...data, receivedAt: new Date().toISOString() };
  let list = [];

  if (fs.existsSync(FILE)) {
    try {
      list = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch {
      list = [];
    }
  }

  list.push(entry);
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
  return entry;
};
