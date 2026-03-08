import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import URLChecker from './pages/URLChecker'

// App.jsx is like a TV remote — it decides what "channel" (page) to show
// based on the URL in the browser address bar

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080b10' }}>
      {/* Navbar shows on every page */}
      <Navbar />

      {/* Routes decides which page component to render */}
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/check"      element={<URLChecker />} />
      </Routes>
    </div>
  )
}

export default App