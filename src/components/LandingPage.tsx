import { motion } from 'framer-motion'
import { BookOpen, Star, Sparkles, Printer, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { THEME_META } from '../engine/storyTemplates'
import { StoryTheme } from '../types'

const THEMES = Object.entries(THEME_META) as [StoryTheme, typeof THEME_META[StoryTheme]][]

export default function LandingPage() {
  const { dispatch } = useApp()

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 opacity-10 text-8xl pointer-events-none select-none overflow-hidden leading-tight">
          🌟⭐✨💫🌟⭐✨💫🌟⭐✨💫🌟⭐✨💫🌟⭐✨💫
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center mb-4 animate-float"
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="80" height="80" rx="20" fill="white" fillOpacity="0.2"/>
              <path d="M16 56V24C16 22.9 16.9 22 18 22H38C38 22 38 58 38 58H18C16.9 58 16 57.1 16 56Z" fill="white" fillOpacity="0.9"/>
              <path d="M64 56V24C64 22.9 63.1 22 62 22H42C42 22 42 58 42 58H62C63.1 58 64 57.1 64 56Z" fill="white" fillOpacity="0.7"/>
              <path d="M38 22H42V58H38V22Z" fill="#FBBF24"/>
              <polygon points="40,10 42.5,17 50,17 44,21.5 46.5,28.5 40,24 33.5,28.5 36,21.5 30,17 37.5,17" fill="#FBBF24"/>
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-4 leading-tight"
          >
            Kid<span className="text-yellow-300">Book</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-xl md:text-2xl font-semibold mb-2 text-purple-100"
          >
            Your child is the hero of their own adventure.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg text-purple-200 mb-10 max-w-2xl mx-auto"
          >
            Upload a few photos, answer 5 quick questions, and we'll craft a
            fully personalised storybook — complete with AI illustrations of
            your child — delivered digitally or printed to your door.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'onboarding' })}
            className="inline-flex items-center gap-3 px-10 py-5 bg-yellow-400 text-purple-900 font-black text-xl rounded-3xl shadow-2xl hover:bg-yellow-300 transition-colors"
          >
            Create Our Story <ArrowRight size={24} />
          </motion.button>

          <p className="mt-4 text-sm text-purple-200">Free preview · No credit card required</p>
        </div>
      </header>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-center text-purple-800 mb-12">
          How It Works ✨
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '📸',
              step: 1,
              title: 'Upload Photos',
              desc: 'Share 2–3 photos of your child. Our AI learns their unique face to create recognisable illustrations.',
              color: 'bg-pink-100 border-pink-300',
            },
            {
              icon: '💬',
              step: 2,
              title: 'Answer 5 Questions',
              desc: "Tell us their name, age, favourite things, best friend, and the one thing they'd love to conquer.",
              color: 'bg-yellow-100 border-yellow-300',
            },
            {
              icon: '🎨',
              step: 3,
              title: 'Receive Your Book',
              desc: 'We generate a unique story with custom illustrations. Order a printed copy or download instantly.',
              color: 'bg-purple-100 border-purple-300',
            },
          ].map(({ icon, step, title, desc, color }) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step * 0.1 }}
              className={`card border-2 ${color} text-center relative`}
            >
              <div className="text-5xl mb-3">{icon}</div>
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-purple-600 text-white font-black rounded-full flex items-center justify-center text-lg shadow">
                {step}
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Story themes ── */}
      <section className="bg-gradient-to-b from-purple-50 to-pink-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-purple-800 mb-4">
            7 Adventure Worlds 🌍
          </h2>
          <p className="text-center text-gray-500 mb-10">Each story is uniquely generated — no two children get the same book.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {THEMES.map(([key, meta], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card text-center hover:shadow-2xl hover:-translate-y-1 transition-all cursor-default"
              >
                <div className="text-4xl mb-2">{meta.emoji}</div>
                <div className={`inline-block px-2 py-0.5 rounded-full text-white text-xs font-bold mb-2 ${meta.color}`}>
                  {meta.label}
                </div>
                <p className="text-gray-500 text-xs leading-snug">{meta.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: <Sparkles className="text-purple-500" size={28} />, title: 'AI Illustrations', desc: 'Fine-tuned Stable Diffusion creates recognisable illustrations of your child in every scene.' },
            { icon: <BookOpen className="text-pink-500" size={28} />, title: 'Truly Unique Stories', desc: '8-page narrative personalised with your child\'s name, interests, best friend, and favourite place.' },
            { icon: <Printer className="text-blue-500" size={28} />, title: 'Print-on-Demand', desc: 'Order a beautifully printed hardcover or softcover via our Printful integration.' },
            { icon: <Star className="text-yellow-500" size={28} />, title: 'Monthly Subscriptions', desc: 'New adventure every month featuring the same character — your child — in a continuing series.' },
          ].map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card flex gap-4 items-start"
            >
              <div className="shrink-0 mt-1">{icon}</div>
              <div>
                <h3 className="font-black text-gray-800 text-lg mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-violet-600 to-pink-500 py-20 text-center text-white">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-black mb-4"
        >
          Ready to write their story? 🚀
        </motion.h2>
        <p className="text-purple-200 mb-8 text-lg">It only takes 5 minutes to create a book they'll treasure forever.</p>
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'onboarding' })}
          className="inline-flex items-center gap-2 px-10 py-5 bg-yellow-400 text-purple-900 font-black text-xl rounded-3xl shadow-2xl hover:bg-yellow-300 transition-colors"
        >
          Start for Free <ArrowRight size={24} />
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2026 KidBook · Privacy · Terms · hello@kidbook.ai
      </footer>
    </div>
  )
}
