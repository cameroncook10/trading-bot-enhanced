import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Activity from './pages/Activity'
import Signals from './pages/Signals'
import History from './pages/History'
import Markets from './pages/Markets'
import Learning from './pages/Learning'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/history" element={<History />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
