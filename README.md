# Bandit Towing & Transport Website

Professional website for Bandit Towing & Transport, Cary, NC.

---

## 📁 Project Structure

```
bandit-towing/
├── index.html              # Main website
├── css/
│   └── style.css           # All styles
├── js/
│   └── main.js             # Gallery logic & interactions
├── images/
│   ├── logo-full.png       # Full logo with firebird
│   └── bandit-text.png     # "Bandit" text logo
├── admin/
│   ├── index.html          # Password-protected admin panel
│   └── config.js           # Admin password config
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deploy to GoDaddy via FTP
├── .gitignore
└── README.md
```

---

## 🚀 Deploying to GitHub + GoDaddy

### Step 1 — Push to GitHub

```bash
cd bandit-towing
git init
git add .
git commit -m "Initial website launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bandit-towing.git
git push -u origin main
```

### Step 2 — Add FTP Secrets to GitHub

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these three secrets:

| Secret Name    | Value                                  |
|----------------|----------------------------------------|
| `FTP_SERVER`   | Your GoDaddy FTP host (e.g. `ftp.yourdomain.com`) |
| `FTP_USERNAME` | Your GoDaddy FTP username              |
| `FTP_PASSWORD` | Your GoDaddy FTP password              |

**Finding your GoDaddy FTP credentials:**
- Log in to GoDaddy → My Products → Web Hosting → Manage
- Go to **File Manager** or **FTP** settings
- The server is usually `ftp.yourdomain.com`
- Username and password were set when you created your hosting account

### Step 3 — Connect domain (if not done)

1. In GoDaddy, go to **Domains** → your domain → **DNS**
2. Point the A record to your hosting IP (GoDaddy shows this in hosting settings)

### Step 4 — Every future update

Just push to GitHub — the site deploys automatically:
```bash
git add .
git commit -m "Update gallery / content"
git push
```

---

## 🔐 Admin Panel

Access the gallery manager at: `yourdomain.com/admin/`

**Default password:** `bandit2019`

**Change the default password** by either:
- Editing `admin/config.js` and changing `ADMIN_PASSWORD`
- Logging into the admin panel and using the "Change Password" section (saves to browser)

**What the admin can do:**
- Upload photos (drag & drop or click — multiple at once)
- Remove photos
- Add YouTube/Facebook video embeds
- Remove videos
- Change the admin password

**Note:** Photos and videos are stored in the browser's `localStorage`. This is fine for a small gallery. If you want to store photos permanently across all devices/browsers, a backend or cloud storage upgrade would be needed — ask your developer.

---

## 📞 Contact Info on Site

- Phone: (919) 656-9468
- Email: justin@bandittowing.com
- Address: 1804 Holt Road, Cary, NC 27519

---

## ✏️ Making Content Changes

| What to change | Where |
|---|---|
| Phone number | `index.html` — search `656-9468` |
| Email address | `index.html` — search `justin@bandittowing` |
| Hours | `index.html` — Services Hours section |
| Prices | `index.html` — Services section |
| Testimonials | `index.html` — Testimonials section |
| Colors/fonts | `css/style.css` — `:root` variables |
| Google Map location | `index.html` — find `maps/embed` iframe |
