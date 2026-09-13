// this page handles both kinds of donations, i toggle the form fields based on the type chosen
// i deliberately did not require login here, since a donation should not have a signup wall in front of it

import { useState, FormEvent } from 'react';

const API_URL = import.meta.env.VITE_API_URL as string;

export default function Donate() {
  const [type, setType] = useState<'money' | 'food_parcel'>('money');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: donorName,
          donor_email: donorEmail || undefined,
          type,
          amount: type === 'money' ? Number(amount) : undefined,
          item_description: type === 'food_parcel' ? itemDescription : undefined,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || 'i could not save that donation');
      }

      setMessage(body.message || 'thank you for the donation');
      setDonorName('');
      setDonorEmail('');
      setAmount('');
      setItemDescription('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-hero text-3xl text-charcoal">Support the food parcel drive</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Give cash toward groceries or tell us what you are dropping off, no account needed.
      </p>

      {/* this toggle switches which fields show up below, money needs an amount, food needs a description */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setType('money')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            type === 'money' ? 'bg-gold text-ink' : 'border border-gold/40 text-charcoal'
          }`}
        >
          give cash
        </button>
        <button
          type="button"
          onClick={() => setType('food_parcel')}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            type === 'food_parcel' ? 'bg-gold text-ink' : 'border border-gold/40 text-charcoal'
          }`}
        >
          log a food parcel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal">Your name</label>
          <input
            type="text"
            required
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal">Email (optional)</label>
          <input
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
          />
        </div>

        {type === 'money' ? (
          <div>
            <label className="block text-sm font-medium text-charcoal">Amount (ZAR)</label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-charcoal">What are you dropping off</label>
            <textarea
              required
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              rows={3}
              placeholder="e.g. 10kg maize meal, 4 tins of beans, cooking oil"
              className="mt-1 w-full rounded-md border border-gold/40 bg-ivory px-4 py-2 focus:border-gold"
            />
          </div>
        )}

        {message && <p className="rounded-md bg-gold-light/30 px-4 py-2 text-sm text-charcoal">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3 font-medium text-ink hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? 'sending' : type === 'money' ? 'donate now' : 'log this donation'}
        </button>
      </form>
    </div>
  );
}
