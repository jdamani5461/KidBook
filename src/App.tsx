import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import LandingPage from './components/LandingPage'
import OnboardingWizard from './components/OnboardingWizard'
import GeneratingScreen from './components/GeneratingScreen'
import StoryReader from './components/StoryReader'
import OrderFlow from './components/OrderFlow'
import ConfirmationPage from './components/ConfirmationPage'

function Router() {
  const { state } = useApp()

  const view = () => {
    switch (state.step) {
      case 'landing':      return <LandingPage />
      case 'onboarding':   return <OnboardingWizard />
      case 'generating':   return <GeneratingScreen />
      case 'preview':      return <StoryReader />
      case 'order':        return <OrderFlow />
      case 'confirmation': return <ConfirmationPage />
      default:             return <LandingPage />
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {view()}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
