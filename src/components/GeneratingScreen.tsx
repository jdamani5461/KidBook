import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const STAGES = [
  { threshold: 0,   icon: '📸', label: "Learning your child's features\u2026" },
  { threshold: 15,  icon: '✍️', label: 'Writing the story…' },
  { threshold: 30,  icon: '🎨', label: 'Painting the illustrations…' },
  { threshold: 60,  icon: '🖌️', label: 'Adding finishing touches…' },
  { threshold: 85,  icon: '📖', label: 'Binding the pages…' },
  { threshold: 95,  icon: '✨', label: 'Almost ready!' },
]

export default function GeneratingScreen() {
  const { state } = useApp()
  const progress = state.generationProgress

  const currentStage = [...STAGES].reverse().find((s) => progress >= s.threshold) ?? STAGES[0]

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl mb-6 inline-block"
        >
          {currentStage.icon}
        </motion.div>

        <h2 className="text-3xl font-black text-purple-800 mb-2">
          Creating {state.profile?.name}'s Story
        </h2>

        <p className="text-gray-500 mb-8 text-lg">{currentStage.label}</p>

        {/* Progress bar */}
        <div className="bg-purple-100 rounded-full h-4 overflow-hidden mb-3 shadow-inner">
          <motion.div
            className="h-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400"
            animate={{ width: `${Math.max(progress, 5)}%` }}
            transition={{ type: 'spring', bounce: 0.2 }}
          />
        </div>

        <p className="text-sm font-semibold text-purple-400 mb-8">{progress}% complete</p>

        {/* Floating stage indicators */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Photo AI', icon: '📸', done: progress > 25 },
            { label: 'Story',    icon: '📝', done: progress > 50 },
            { label: 'Art',      icon: '🎨', done: progress > 90 },
          ].map(({ label, icon, done }) => (
            <motion.div
              key={label}
              animate={done ? { scale: [1, 1.1, 1] } : {}}
              className={`card text-center py-3 transition-all ${
                done ? 'bg-green-50 border-2 border-green-300' : 'opacity-60'
              }`}
            >
              <div className="text-2xl">{done ? '✅' : icon}</div>
              <div className="text-xs font-bold text-gray-600 mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-xs text-gray-400">
          This usually takes 30–60 seconds. We're creating a truly unique book just for {state.profile?.name}.
        </p>
      </div>
    </div>
  )
}
