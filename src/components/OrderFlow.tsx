import { useState } from 'react'
import { motion } from 'framer-motion'
import { Printer, Smartphone, Package, Star, ChevronLeft, CreditCard, Check } from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '../context/AppContext'
import { DeliveryFormat, OrderDetails } from '../types'

// ─── Printful integration stub ───────────────────────────────────────────────
/**
 * Production: POST to your backend which calls Printful API:
 *   POST https://api.printful.com/orders
 * with OAuth token + line items (product_id for hardcover book, address, etc.)
 * The backend confirms the order and returns a Printful order ID.
 */
async function submitToPrintful(order: OrderDetails, storyId: string): Promise<string> {
  const API_BASE = import.meta.env.VITE_PRINTFUL_API ?? ''
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 1500))
    return `PF-STUB-${storyId.slice(-6).toUpperCase()}`
  }
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order, storyId }),
  })
  const data = await res.json()
  return data.printfulOrderId
}

// ─── Plans ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'digital',
    label: 'Digital Only',
    price: '$9.99',
    icon: <Smartphone size={28} className="text-blue-500" />,
    features: ['Instant PDF download', 'High-res illustrations', 'Read on any device'],
    highlight: false,
  },
  {
    id: 'print',
    label: 'Printed Book',
    price: '$29.99',
    icon: <Printer size={28} className="text-purple-500" />,
    features: ['Softcover, 8 pages', 'Shipped to your door', 'Vibrant colour print', 'PDF included'],
    highlight: true,
  },
  {
    id: 'both',
    label: 'Monthly Adventure Club',
    price: '$19.99/mo',
    icon: <Star size={28} className="text-yellow-500" />,
    features: [
      'New story every month',
      'Same hero — your child',
      'Digital + printed copy',
      'Cancel anytime',
    ],
    highlight: false,
    badge: 'Most Popular',
  },
] as const

// ─── Component ───────────────────────────────────────────────────────────────

export default function OrderFlow() {
  const { state, dispatch } = useApp()
  const story = state.story!

  const [format, setFormat] = useState<DeliveryFormat>('print')
  const [subscribe, setSubscribe] = useState(false)
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '', country: 'US' })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const needsAddress = format === 'print' || format === 'both'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (needsAddress) {
      if (!address.line1.trim()) e.line1 = 'Address required'
      if (!address.city.trim())  e.city  = 'City required'
      if (!address.zip.trim())   e.zip   = 'ZIP / Postcode required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)

    const order: OrderDetails = {
      format,
      email,
      subscribeMonthly: subscribe,
      ...(needsAddress && {
        addressLine1: address.line1,
        addressLine2: address.line2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      }),
    }

    dispatch({ type: 'SET_ORDER', payload: order })

    if (format === 'print' || format === 'both') {
      await submitToPrintful(order, story.id)
    }

    setSubmitting(false)
    dispatch({ type: 'SET_STEP', payload: 'confirmation' })
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'preview' })}
          className="flex items-center gap-1 text-purple-400 hover:text-purple-600 text-sm font-semibold mb-6"
        >
          <ChevronLeft size={16} /> Back to story
        </button>

        <h1 className="text-3xl font-black text-purple-800 mb-2">Order {story.childName}'s Book 📚</h1>
        <p className="text-gray-500 mb-8">Choose how you'd like to receive this one-of-a-kind storybook.</p>

        {/* ── Plan selector ── */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => {
                setFormat(plan.id === 'both' ? 'both' : plan.id as DeliveryFormat)
                if (plan.id === 'both') setSubscribe(true)
              }}
              className={clsx(
                'relative text-left p-5 rounded-3xl border-2 transition-all',
                format === plan.id || (plan.id === 'both' && subscribe)
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300 bg-white',
              )}
            >
              {'badge' in plan && plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-purple-900 text-xs font-black px-3 py-0.5 rounded-full shadow">
                  {plan.badge}
                </span>
              )}
              <div className="mb-3">{plan.icon}</div>
              <div className="font-black text-gray-800">{plan.label}</div>
              <div className="text-xl font-black text-purple-600 my-1">{plan.price}</div>
              <ul className="space-y-1 mt-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Check size={12} className="text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              {(format === plan.id || (plan.id === 'both' && subscribe)) && (
                <div className="absolute top-3 right-3 bg-purple-500 text-white rounded-full p-0.5">
                  <Check size={14} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ── Subscription toggle ── */}
        {format !== 'both' && (
          <div className="card mb-6 flex items-center justify-between">
            <div>
              <p className="font-black text-gray-800">Add Monthly Subscription</p>
              <p className="text-sm text-gray-500">Get a new adventure every month (+$9.99/mo)</p>
            </div>
            <button
              onClick={() => setSubscribe((s) => !s)}
              className={clsx(
                'w-12 h-7 rounded-full transition-colors relative',
                subscribe ? 'bg-purple-500' : 'bg-gray-200',
              )}
            >
              <span
                className={clsx(
                  'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform',
                  subscribe ? 'translate-x-5' : 'translate-x-0.5',
                )}
              />
            </button>
          </div>
        )}

        {/* ── Form ── */}
        <div className="card space-y-5">
          <h2 className="font-black text-gray-800 text-lg flex items-center gap-2">
            <Package size={20} className="text-purple-500" /> Delivery Details
          </h2>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className={clsx(
                'w-full px-4 py-3 rounded-2xl border-2 outline-none font-semibold text-gray-800 transition-colors',
                errors.email ? 'border-red-400' : 'border-purple-200 focus:border-purple-500',
              )}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            <p className="text-xs text-gray-400 mt-1">We'll send your digital download and order confirmation here.</p>
          </div>

          {needsAddress && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="123 Maple Street"
                  className={clsx(
                    'w-full px-4 py-3 rounded-2xl border-2 outline-none font-semibold text-gray-800 transition-colors',
                    errors.line1 ? 'border-red-400' : 'border-purple-200 focus:border-purple-500',
                  )}
                />
                {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  placeholder="Apt, Suite, etc. (optional)"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Springfield"
                    className={clsx(
                      'w-full px-4 py-3 rounded-2xl border-2 outline-none font-semibold text-gray-800 transition-colors',
                      errors.city ? 'border-red-400' : 'border-purple-200 focus:border-purple-500',
                    )}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">ZIP / Postcode *</label>
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder="12345"
                    className={clsx(
                      'w-full px-4 py-3 rounded-2xl border-2 outline-none font-semibold text-gray-800 transition-colors',
                      errors.zip ? 'border-red-400' : 'border-purple-200 focus:border-purple-500',
                    )}
                  />
                  {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">State / County</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="IL"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 bg-white transition-colors"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="IE">Ireland</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full btn-primary justify-center py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-500 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⏳</motion.span>
                Processing…
              </>
            ) : (
              <><CreditCard size={20} /> Complete Order</>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            🔒 Secure checkout · Powered by Stripe. Print fulfillment via Printful.
          </p>
        </div>
      </div>
    </div>
  )
}
