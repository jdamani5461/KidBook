import { motion } from 'framer-motion'
import { Mail, Printer, Star, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ConfirmationPage() {
  const { state, dispatch } = useApp()
  const story = state.story!
  const order = state.order!

  const isPrint = order.format === 'print' || order.format === 'both'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-8xl mb-6 inline-block"
        >
          🎉
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-purple-800 mb-3"
        >
          It's on its way!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-lg mb-8"
        >
          {story.childName}'s adventure is ready. Check your inbox!
        </motion.p>

        {/* What's happening */}
        <div className="card text-left space-y-4 mb-8">
          <h2 className="font-black text-gray-800 text-lg">What happens next</h2>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Mail size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Confirmation email sent</p>
              <p className="text-gray-500 text-xs">Check {order.email} for your download link and receipt.</p>
            </div>
          </div>

          {isPrint && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Printer size={16} className="text-purple-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Print order placed with Printful</p>
                <p className="text-gray-500 text-xs">Your book will be printed and shipped within 3–5 business days to {order.city}, {order.country}.</p>
              </div>
            </div>
          )}

          {order.subscribeMonthly && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <Star size={16} className="text-yellow-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Monthly Adventure Club — Active!</p>
                <p className="text-gray-500 text-xs">A brand new story starring {story.childName} will arrive every month. You can cancel anytime from your account.</p>
              </div>
            </div>
          )}
        </div>

        {/* Share prompt */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 mb-8 border border-purple-100">
          <p className="font-black text-gray-800 mb-1">Share the magic 🌟</p>
          <p className="text-sm text-gray-500 mb-4">
            Know another parent who'd love a personalised storybook?
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {['📱 WhatsApp', '📧 Email', '📋 Copy Link'].map((label) => (
              <button
                key={label}
                className="px-4 py-2 bg-white border-2 border-purple-200 rounded-2xl text-sm font-bold text-purple-600 hover:bg-purple-50 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="btn-primary mx-auto"
        >
          Create Another Story <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
