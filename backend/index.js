// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow frontend domain
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, methods: ['GET', 'POST'] }));

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
  const from = process.env.RESEND_FROM || `Portfolio <${process.env.RESEND_FROM_EMAIL || 'no-reply@example.com'}>`;
  const to = process.env.CONTACT_RECIPIENT || process.env.RESEND_FROM_EMAIL || 'no-reply@example.com';

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
