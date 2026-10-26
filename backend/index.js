// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow frontend domain(s)
// CORS_ORIGIN may be a single origin, a comma-separated list, or '*'
const rawCorsOrigin = process.env.CORS_ORIGIN || '*';
const configuredOrigins = rawCorsOrigin === '*'
  ? ['*']
  : rawCorsOrigin.split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow non-browser requests (curl, server-to-server)
  if (configuredOrigins.includes('*')) return true;
  const normalized = origin.replace(/\/+$/, '');
  if (configuredOrigins.includes(normalized)) return true;
  // Always allow local development origins (localhost or 127.0.0.1 on any port)
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)) {
    return true;
  }
  // Always allow Vercel production and preview deployments
  if (/^https:\/\/([a-z0-9-]+\.)?vercel\.app$/.test(normalized) || normalized === 'https://my-portfolio-five-smoky-50.vercel.app') {
    return true;
  }
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Parse JSON and URL‑encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Graceful JSON parsing errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    console.error('JSON parse error:', err);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mongoose model (optional storage)
let ContactModel;
if (process.env.MONGODB_URI) {
  const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  ContactModel = mongoose.model('Contact', contactSchema);

  // Connect to MongoDB (fire‑and‑forget, errors are logged)
  mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}

// Helper – simple validation & sanitisation
function validateContact(body) {
  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message) return 'All fields are required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email address.';
  return null;
}

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  const error = validateContact(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { name, email, subject, message } = req.body;
  if (!process.env.RESEND_API_KEY) {
    console.error('Resend API key missing in .env');
    return res.status(500).json({ error: 'Email service not configured. Please set RESEND_API_KEY.' });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Determine a verified sender address.
  // Priority: RESEND_FROM (full "Name <addr>" string with a real domain) →
  //           RESEND_FROM_EMAIL (e.g. onboarding@resend.dev, free-tier verified sender)
  // If RESEND_FROM is set but its address part is a placeholder domain, fall back to RESEND_FROM_EMAIL.
  const resendFromRaw  = (process.env.RESEND_FROM  || '').trim();
  const resendFromEmail = (process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev').trim();
  let from;
  if (resendFromRaw) {
    // Extract the email address from a "Display Name <addr>" string, or treat the whole value as an address.
    const angleMatch = resendFromRaw.match(/<([^>]+)>/);
    const addrPart = angleMatch ? angleMatch[1] : resendFromRaw;
    // Consider addresses using placeholder/generic domains as unverified; fall back to RESEND_FROM_EMAIL.
    const placeholderDomains = ['example.com', 'yourdomain.com', 'youremail.com', 'your-domain.com'];
    const addrDomain = addrPart.split('@')[1] || '';
    if (placeholderDomains.some(d => addrDomain.toLowerCase().endsWith(d))) {
      // RESEND_FROM has a placeholder domain — use the verified fallback address.
      const displayName = angleMatch ? resendFromRaw.replace(angleMatch[0], '').trim().replace(/[,"]+$/g, '').trim() || 'Portfolio' : 'Portfolio';
      from = `${displayName} <${resendFromEmail}>`;
      console.warn(`RESEND_FROM domain "${addrDomain}" is a placeholder — using RESEND_FROM_EMAIL (${resendFromEmail}) as sender.`);
    } else {
      from = resendFromRaw;
    }
  } else {
    from = `Portfolio <${resendFromEmail}>`;
  }

  const to = process.env.CONTACT_RECIPIENT || resendFromEmail;

  try {
    const { error: sendError } = await resend.emails.send({
      from,
      to,
      subject,
      reply_to: email,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>` +
            `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return res.status(502).json({ error: 'Failed to send email. Please try again later.' });
    }

    if (ContactModel) {
      await ContactModel.create({ name, email, subject, message });
    }

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
