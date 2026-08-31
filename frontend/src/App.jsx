import { useState } from 'react'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useAuth } from './context/AuthContext.jsx'

function App() {
  const { isAuthenticated, loading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d2024] text-[#edf5f2]">
        <div className="flex items-center gap-3 text-sm text-[#9aafab]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#8fcdbc]" />
          Loading workspace
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onLogin={() => setShowRegister(false)} />
    }

    return <Login onRegister={() => setShowRegister(true)} />
  }

  return <Dashboard />
}

export default App