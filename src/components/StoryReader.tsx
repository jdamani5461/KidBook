import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingCart, Download, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { THEME_META } from '../engine/storyTemplates'

export default function StoryReader() {
  const { state, dispatch } = useApp()
  const story = state.story!
  const [pageIndex, setPageIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showCover, setShowCover] = useState(true)

  const meta = THEME_META[story.theme]
  const page = story.pages[pageIndex]
  const isFirst = pageIndex === 0
  const isLast = pageIndex === story.pages.length - 1

  const go = (dir: number) => {
    setDirection(dir)
    setPageIndex((i) => Math.max(0, Math.min(story.pages.length - 1, i + dir)))
  }

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  if (showCover) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <div
            className={`${meta.color} rounded-4xl p-10 shadow-2xl text-white mb-6`}
          >
            <div className="text-8xl mb-4 animate-float">{meta.emoji}</div>
            <h1 className="text-3xl font-black leading-tight mb-3">{story.title}</h1>
            <p className="text-white/80 font-semibold">A personalised adventure by IntelliaKidStory</p>

            {story.status === 'generating' && (
              <div className="mt-4 text-sm bg-white/20 rounded-2xl px-4 py-2">
                ✨ Illustrations still loading…
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setShowCover(false)}
              className="btn-primary text-lg px-8 py-4"
            >
              Read the Story 📖
            </button>
          </div>

          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'onboarding' })}
            className="mt-4 text-sm text-purple-400 hover:text-purple-600 transition-colors"
          >
            ← Create another story
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Toolbar ── */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => setShowCover(true)}
          className="flex items-center gap-1 text-purple-500 font-semibold text-sm hover:text-purple-700 transition-colors"
        >
          <X size={16} /> Close
        </button>

        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.emoji}</span>
          <span className="font-black text-gray-700 text-sm truncate max-w-[160px]">{story.title}</span>
        </div>

        <span className="text-sm text-gray-400 font-semibold">
          {pageIndex + 1} / {story.pages.length}
        </span>
      </div>

      {/* ── Page ── */}
      <div className="flex-1 flex items-stretch max-w-3xl mx-auto w-full px-4 py-8 gap-4 flex-col md:flex-row">

        {/* Illustration */}
        <div className="md:w-1/2 rounded-3xl overflow-hidden bg-purple-50 shadow-lg flex items-center justify-center min-h-[220px] relative">
          {page.illustrationUrl ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={pageIndex}
                src={page.illustrationUrl}
                alt={`Illustration for page ${pageIndex + 1}`}
                className="w-full h-full object-cover"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>
          ) : (
            <div className="text-center p-8">
              <div className="text-6xl mb-3 animate-float">{page.emoji}</div>
              <div className="text-purple-300 text-sm font-semibold">Illustration loading…</div>
              <div className="mt-3 w-24 h-1.5 bg-purple-200 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-purple-400 rounded-full"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={pageIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="text-4xl mb-4">{page.emoji}</div>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {page.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => go(-1)}
              disabled={isFirst}
              className="btn-secondary disabled:opacity-30 py-2 px-4 text-sm"
            >
              <ChevronLeft size={18} /> Prev
            </button>

            {/* Page dots */}
            <div className="flex gap-1.5">
              {story.pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > pageIndex ? 1 : -1); setPageIndex(i) }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === pageIndex ? 'bg-purple-600 w-4' : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>

            {isLast ? (
              <button
                onClick={() => dispatch({ type: 'SET_STEP', payload: 'order' })}
                className="btn-primary py-2 px-4 text-sm bg-gradient-to-r from-purple-600 to-pink-500"
              >
                Order Book <ShoppingCart size={16} />
              </button>
            ) : (
              <button
                onClick={() => go(1)}
                className="btn-primary py-2 px-4 text-sm"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Order CTA banner ── */}
      {!isLast && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-black text-sm">Love the story?</p>
            <p className="text-white/80 text-xs">Order a printed hardcover or subscribe for monthly adventures.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: 'SET_STEP', payload: 'order' })}
              className="flex items-center gap-1 bg-yellow-400 text-purple-900 font-black px-4 py-2 rounded-2xl text-sm hover:bg-yellow-300 transition-colors"
            >
              <ShoppingCart size={14} /> Order
            </button>
            <button className="flex items-center gap-1 bg-white/20 text-white font-bold px-3 py-2 rounded-2xl text-sm hover:bg-white/30 transition-colors">
              <Download size={14} /> PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
