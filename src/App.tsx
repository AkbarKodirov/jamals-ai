import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './landing/Landing'
import { useAuth } from './lib/auth'

const AuthPage = lazy(() => import('./auth/AuthPage'))
const AppShell = lazy(() => import('./app/AppShell'))
const Legal = lazy(() => import('./legal/Legal'))

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function Loading() {
  return (
    <div className="grid min-h-svh place-items-center bg-ink">
      <img src="/humo-mark.svg" alt="" className="size-10 animate-pulse" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/privacy" element={<Legal page="privacy" />} />
        <Route path="/terms" element={<Legal page="terms" />} />
        <Route
          path="/app/*"
          element={
            <Protected>
              <AppShell />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
