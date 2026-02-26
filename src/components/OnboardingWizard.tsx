import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '../context/AppContext'
import { ChildProfile, StoryTheme } from '../types'
import { THEME_META } from '../engine/storyTemplates'
import { generateStory } from '../engine/storyTemplates'
import { submitFineTuneJob, generateAllIllustrations } from '../engine/illustrationPipeline'

// ─── Step definitions ────────────────────────────────────────────────────────

const TOTAL_STEPS = 6  // 0=photos 1=name/age 2=theme 3=interests 4=bestfriend+fears 5=place

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full bg-purple-100 rounded-full h-2 mb-8">
      <motion.div
        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
        animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        transition={{ type: 'spring', bounce: 0.3 }}
      />
    </div>
  )
}

function StepLabel({ current, total }: { current: number; total: number }) {
  return (
    <p className="text-sm text-purple-400 font-semibold mb-1">
      Step {current + 1} of {total}
    </p>
  )
}

// ─── Main wizard ─────────────────────────────────────────────────────────────

export default function OnboardingWizard() {
  const { dispatch } = useApp()
  const [step, setStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState(5)
  const [theme, setTheme] = useState<StoryTheme>('dinosaurs')
  const [interests, setInterests] = useState<string[]>([])
  const [interestInput, setInterestInput] = useState('')
  const [bestFriend, setBestFriend] = useState('')
  const [fears, setFears] = useState('')
  const [favoritePlace, setFavoritePlace] = useState('')

  const addInterest = () => {
    const v = interestInput.trim()
    if (v && !interests.includes(v) && interests.length < 6) {
      setInterests([...interests, v])
      setInterestInput('')
    }
  }

  const removeInterest = (i: string) => setInterests(interests.filter((x) => x !== i))

  const handlePhotoChange = useCallback((files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).slice(0, 3 - photoFiles.length)
    const newUrls = newFiles.map((f) => URL.createObjectURL(f))
    setPhotoFiles((prev) => [...prev, ...newFiles].slice(0, 3))
    setPhotoUrls((prev) => [...prev, ...newUrls].slice(0, 3))
  }, [photoFiles])

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(photoUrls[idx])
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx))
    setPhotoUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return photoFiles.length >= 2
      case 1: return childName.trim().length >= 2 && childAge >= 3 && childAge <= 10
      case 2: return true // theme always has a default
      case 3: return interests.length >= 1
      case 4: return bestFriend.trim().length >= 1
      case 5: return favoritePlace.trim().length >= 1
      default: return false
    }
  }

  const handleFinish = async () => {
    const profile: ChildProfile = {
      name: childName.trim(),
      age: childAge,
      photos: photoFiles,
      photoUrls,
      theme,
      interests,
      bestFriend: bestFriend.trim(),
      fears: fears.trim(),
      favoritePlace: favoritePlace.trim(),
    }

    dispatch({ type: 'SET_PROFILE', payload: profile })
    dispatch({ type: 'SET_STEP', payload: 'generating' })

    // Generate story structure
    const story = generateStory(profile)
    dispatch({ type: 'SET_STORY', payload: story })

    // Start async illustration pipeline
    const { loraUrl } = await submitFineTuneJob({
      childId: story.id,
      photoUrls: profile.photoUrls,
    })

    await generateAllIllustrations(
      story.pages,
      loraUrl,
      (pageId, url) => {
        dispatch({ type: 'UPDATE_PAGE_ILLUSTRATION', payload: { pageId, url } })
      },
    )

    dispatch({ type: 'SET_STEP', payload: 'preview' })
  }

  // ─── Step content ──────────────────────────────────────────────────────────

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-black text-purple-800 mb-2">📸 Upload Photos</h2>
            <p className="text-gray-500 text-sm mb-6">
              Upload 2–3 clear photos of your child. Our AI uses these to create
              recognisable illustrations of them in every scene.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {photoUrls.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-purple-200 shadow">
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {photoFiles.length < 3 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center gap-2 text-purple-400 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Upload size={28} />
                  <span className="text-xs font-semibold">Add Photo</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotoChange(e.target.files)}
            />

            <p className="text-xs text-gray-400">
              ✅ Photos are processed securely and used only for illustration generation.
            </p>
          </div>
        )

      case 1:
        return (
          <div>
            <h2 className="text-2xl font-black text-purple-800 mb-2">👶 About Your Child</h2>
            <p className="text-gray-500 text-sm mb-6">Their name and age help us craft the perfect story voice.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Child's Name *</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Sophie"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 transition-colors"
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Age: {childAge} years old</label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>3 yrs</span><span>10 yrs</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 2: {
        const themes = Object.entries(THEME_META) as [StoryTheme, typeof THEME_META[StoryTheme]][]
        return (
          <div>
            <h2 className="text-2xl font-black text-purple-800 mb-2">🌍 Choose an Adventure</h2>
            <p className="text-gray-500 text-sm mb-6">Pick the world your child will explore as the hero.</p>

            <div className="grid grid-cols-2 gap-3">
              {themes.map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={clsx(
                    'p-4 rounded-2xl border-2 text-left transition-all',
                    theme === key
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{meta.emoji}</span>
                    {theme === key && (
                      <span className="ml-auto bg-purple-500 text-white rounded-full p-0.5">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <div className="font-black text-sm text-gray-800">{meta.label}</div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{meta.description}</p>
                </button>
              ))}
            </div>
          </div>
        )
      }

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-black text-purple-800 mb-2">❤️ Favourite Things</h2>
            <p className="text-gray-500 text-sm mb-6">
              What does {childName || 'your child'} love? These interests are woven throughout the story.
              Add up to 6 tags.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                placeholder="e.g. drawing, cats, football…"
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 transition-colors"
                maxLength={25}
              />
              <button
                onClick={addInterest}
                disabled={!interestInput.trim() || interests.length >= 6}
                className="px-4 py-3 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[48px]">
              {interests.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-bold text-sm"
                >
                  {t}
                  <button onClick={() => removeInterest(t)} className="text-purple-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs text-gray-400">{interests.length}/6 interests added</p>
          </div>
        )

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-black text-purple-800 mb-2">🤝 Friends & Fears</h2>
            <p className="text-gray-500 text-sm mb-6">
              Their best friend becomes a sidekick character. Their fear becomes something they bravely overcome in the story.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Best Friend's Name *</label>
                <input
                  type="text"
                  value={bestFriend}
                  onChange={(e) => setBestFriend(e.target.value)}
                  placeholder="e.g. Liam, or 'their dog Biscuit'"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 transition-colors"
                  maxLength={40}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Something they find scary <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={fears}
                  onChange={(e) => setFears(e.target.value)}
                  placeholder="e.g. the dark, loud noises, big dogs…"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 transition-colors"
                  maxLength={60}
                />
                <p className="text-xs text-gray-400 mt-1">We'll turn this into something they courageously overcome 💪</p>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div>
            <h2 className="text-2xl font-black text-purple-800 mb-2">🏡 Favourite Place</h2>
            <p className="text-gray-500 text-sm mb-6">
              Where does {childName || 'your child'} feel most at home? We'll set key story scenes here.
            </p>

            <input
              type="text"
              value={favoritePlace}
              onChange={(e) => setFavoritePlace(e.target.value)}
              placeholder="e.g. our back garden, Grandma's kitchen, the park nearby…"
              className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 transition-colors"
              maxLength={60}
            />

            <div className="mt-8 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100">
              <h3 className="font-black text-purple-700 mb-3">Story Preview</h3>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div><span className="font-bold text-gray-800">Hero:</span> {childName || '—'}, {childAge} years old</div>
                <div><span className="font-bold text-gray-800">World:</span> {THEME_META[theme].emoji} {THEME_META[theme].label}</div>
                <div><span className="font-bold text-gray-800">Interests:</span> {interests.join(', ') || '—'}</div>
                <div><span className="font-bold text-gray-800">Sidekick:</span> {bestFriend || '—'}</div>
                <div><span className="font-bold text-gray-800">Setting:</span> {favoritePlace || '—'}</div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Back to landing */}
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'landing' })}
          className="flex items-center gap-1 text-purple-400 hover:text-purple-600 text-sm font-semibold mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="card shadow-2xl">
          <StepLabel current={step} total={TOTAL_STEPS} />
          <ProgressBar step={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              {stepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-30"
            >
              <ChevronLeft size={18} /> Back
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-40"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed()}
                className="btn-primary bg-gradient-to-r from-purple-600 to-pink-500 disabled:opacity-40"
              >
                ✨ Create My Story!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
