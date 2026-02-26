import { createContext, useContext, useReducer, ReactNode } from 'react'
import { AppStep, ChildProfile, Story, OrderDetails } from '../types'

// ─── State ───────────────────────────────────────────────────────────────────

interface AppState {
  step: AppStep
  profile: ChildProfile | null
  story: Story | null
  order: OrderDetails | null
  generationProgress: number   // 0–100
}

const initialState: AppState = {
  step: 'landing',
  profile: null,
  story: null,
  order: null,
  generationProgress: 0,
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_STEP'; payload: AppStep }
  | { type: 'SET_PROFILE'; payload: ChildProfile }
  | { type: 'SET_STORY'; payload: Story }
  | { type: 'UPDATE_PAGE_ILLUSTRATION'; payload: { pageId: number; url: string } }
  | { type: 'SET_ORDER'; payload: OrderDetails }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'RESET' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'SET_STORY':
      return { ...state, story: action.payload }
    case 'UPDATE_PAGE_ILLUSTRATION': {
      if (!state.story) return state
      const pages = state.story.pages.map((p) =>
        p.id === action.payload.pageId ? { ...p, illustrationUrl: action.payload.url } : p,
      )
      const allDone = pages.every((p) => p.illustrationUrl)
      return {
        ...state,
        story: {
          ...state.story,
          pages,
          status: allDone ? 'ready' : 'generating',
        },
        generationProgress: Math.round(
          (pages.filter((p) => p.illustrationUrl).length / pages.length) * 100,
        ),
      }
    }
    case 'SET_ORDER':
      return { ...state, order: action.payload }
    case 'SET_PROGRESS':
      return { ...state, generationProgress: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
