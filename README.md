# NA Dev Studio

Production-ready Node.js website for **NA Dev Studio** — a freelance digital agency offering web and mobile app development services.

Built with Express, Handlebars, and Nodemailer. The design is a fully responsive single-page marketing site with animated sections, portfolio showcase, and a working contact form.

## Features

- Server-rendered Handlebars templates with reusable partials
- Sticky navbar with scroll effects and smooth anchor navigation
- Scroll-reveal animations and animated hero stat counters
- Contact form with server-side validation and email delivery via SMTP
- Success/error feedback via URL query parameters

## Installation

1. **Clone or copy the project** into your workspace.

2. **Install dependencies:**

   ```bash
   cd nadevstudio
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your SMTP credentials:

   ```
   PORT=3000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_TO=hello@nadevstudio.com
   ```

   For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) rather than your regular account password.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

For production:

```bash
npm start
```

## Folder Structure

```
nadevstudio/
├── package.json
├── .env.example
├── .gitignore
├── server.js                  # Express entry point
├── public/
│   ├── css/
│   │   └── style.css          # All site styles
│   ├── js/
│   │   └── main.js            # Client-side interactions
│   └── images/                # Static image assets
├── views/
│   ├── layouts/
│   │   └── main.hbs           # Base HTML layout
│   ├── partials/              # Reusable page sections
│   └── index.hbs              # Home page (assembles partials)
├── routes/
│   └── index.js               # GET /, POST /contact, GET /thanks
├── controllers/
│   └── contactController.js   # Form validation and redirects
└── utils/
    └── mailer.js              # Nodemailer SMTP utility
```

## Routes

| Method | Path       | Description                          |
|--------|------------|--------------------------------------|
| GET    | `/`        | Renders the main landing page        |
| POST   | `/contact` | Processes contact form submission    |
| GET    | `/thanks`  | Redirects to `/?sent=true#contact`   |

## Deployment

### VPS (DigitalOcean, Linode, AWS EC2, etc.)

1. **Provision a server** with Node.js 18+ installed.

2. **Upload the project** via Git, SCP, or CI/CD pipeline.

3. **Install dependencies and configure `.env`** on the server.

4. **Run with a process manager** (recommended):

   ```bash
   npm install -g pm2
   pm2 start server.js --name nadevstudio
   pm2 save
   pm2 startup
   ```

5. **Put Nginx in front** as a reverse proxy:

   ```nginx
   server {
       listen 80;
       server_name nadevstudio.com www.nadevstudio.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable HTTPS** with Let's Encrypt:

   ```bash
   sudo certbot --nginx -d nadevstudio.com -d www.nadevstudio.com
   ```

7. Open port 80/443 in your firewall and point your domain's DNS A record to the server IP.

### Shared Hosting (cPanel, Plesk with Node.js support)

1. Upload project files via FTP or Git deploy.

2. In the hosting panel, create a **Node.js application** pointing to `server.js`.

3. Set environment variables in the panel (matching `.env.example`).

4. Map your domain or subdomain to the Node.js app.

5. Ensure the host supports outbound SMTP on port 587 for contact form emails.

### Environment Checklist for Production

- Set `NODE_ENV=production`
- Use real SMTP credentials (never commit `.env`)
- Configure `EMAIL_TO` to your business inbox
- Use PM2 or similar for automatic restarts
- Enable HTTPS via reverse proxy or hosting panel

## License

MIT
