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
import { PlanIndex, PlanDetail } from './pages/MiddlegamePlans'
import CriticalMoments from './pages/CriticalMoments'
import PatternRecognition from './pages/PatternRecognition'
import { GamesIndex, GameViewer } from './pages/MasterGames'
import PawnStructures from './pages/PawnStructures'
import CalculationTrainer from './pages/CalculationTrainer'

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
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
          <Route path="/middlegame" element={<PlanIndex />} />
          <Route path="/middlegame/:id" element={<PlanDetail />} />
          <Route path="/critical-moments" element={<CriticalMoments />} />
          <Route path="/pattern-recognition" element={<PatternRecognition />} />
          <Route path="/master-games" element={<GamesIndex />} />
          <Route path="/master-games/:id" element={<GameViewer />} />
          <Route path="/pawn-structures" element={<PawnStructures />} />
          <Route path="/calculation" element={<CalculationTrainer />} />
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
