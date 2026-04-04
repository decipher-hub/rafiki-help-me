import { Donation } from '../models/Donation.js';

export async function handleCreateDonation(req, res) {
  try {
    const { donor_name, donor_email, amount, payment_method, message, photo_url } = req.body;

    if (!donor_name || !donor_email || amount == null || !payment_method) {
      return res.status(400).json({
        error: 'Missing fields: donor_name, donor_email, amount, and payment_method are required',
      });
    }

    const method = String(payment_method).toLowerCase();
    if (method !== 'mpesa' && method !== 'bank') {
      return res.status(400).json({ error: 'payment_method must be "mpesa" or "bank"' });
    }

    const numAmount = Number(amount);
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const id = await Donation.createDonation({
      donor_name: String(donor_name).trim(),
      donor_email: String(donor_email).trim(),
      amount: numAmount,
      payment_method: method,
      message: message != null ? String(message) : null,
      photo_url: photo_url != null ? String(photo_url) : null,
    });

    res.status(201).json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleListDonations(req, res) {
  try {
    const donations = await Donation.listDonations(Number(req.query.limit));
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
