import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import OpeningsIndex from './pages/OpeningsIndex'
import OpeningTrainer from './pages/OpeningTrainer'
import TacticsQueue from './pages/TacticsQueue'
import StrategyIndex from './pages/StrategyIndex'
import StrategyLesson from './pages/StrategyLesson'
import EndgameIndex from './pages/EndgameIndex'
import EndgameLesson from './pages/EndgameLesson'
import RepertoireBuilder from './pages/RepertoireBuilder'
import VisualisationDrills from './pages/VisualisationDrills'
import GameReview from './pages/GameReview'
import ProgressDashboard from './pages/ProgressDashboard'

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      {/* Main content: offset for sidebar on desktop, top bar on mobile */}
      <main className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/openings" element={<OpeningsIndex />} />
          <Route path="/openings/:id" element={<OpeningTrainer />} />
          <Route path="/tactics" element={<TacticsQueue />} />
          <Route path="/strategy" element={<StrategyIndex />} />
          <Route path="/strategy/:id" element={<StrategyLesson />} />
          <Route path="/endgames" element={<EndgameIndex />} />
          <Route path="/endgames/:id" element={<EndgameLesson />} />
          <Route path="/repertoire" element={<RepertoireBuilder />} />
          <Route path="/visualisation" element={<VisualisationDrills />} />
          <Route path="/game-review" element={<GameReview />} />
          <Route path="/progress" element={<ProgressDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
