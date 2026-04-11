import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import { useTheme } from './hooks/useTheme'

// Eagerly load the landing page
import DailyChallenge from './pages/DailyChallenge'

// Lazy load everything else
const OpeningsIndex = lazy(() => import('./pages/OpeningsIndex'))
const OpeningTrainer = lazy(() => import('./pages/OpeningTrainer'))
const TacticsQueue = lazy(() => import('./pages/TacticsQueue'))
const StrategyIndex = lazy(() => import('./pages/StrategyIndex'))
const StrategyLesson = lazy(() => import('./pages/StrategyLesson'))
const EndgameIndex = lazy(() => import('./pages/EndgameIndex'))
const EndgameLesson = lazy(() => import('./pages/EndgameLesson'))
const RepertoireBuilder = lazy(() => import('./pages/RepertoireBuilder'))
const VisualisationDrills = lazy(() => import('./pages/VisualisationDrills'))
const GameReview = lazy(() => import('./pages/GameReview'))
const ProgressDashboard = lazy(() => import('./pages/ProgressDashboard'))
const CriticalMoments = lazy(() => import('./pages/CriticalMoments'))
const PatternRecognition = lazy(() => import('./pages/PatternRecognition'))
const PawnStructures = lazy(() => import('./pages/PawnStructures'))
const CalculationTrainer = lazy(() => import('./pages/CalculationTrainer'))
const OpeningTraps = lazy(() => import('./pages/OpeningTraps'))
const MoveOrderQuiz = lazy(() => import('./pages/MoveOrderQuiz'))
const TheoreticalEndgames = lazy(() => import('./pages/TheoreticalEndgames'))
const PracticalEndgames = lazy(() => import('./pages/PracticalEndgames'))
const WeaknessAnalyzer = lazy(() => import('./pages/WeaknessAnalyzer'))
const ConceptFlashcards = lazy(() => import('./pages/ConceptFlashcards'))
const Glossary = lazy(() => import('./pages/Glossary'))
const Settings = lazy(() => import('./pages/Settings'))
const PlayComputer = lazy(() => import('./pages/PlayComputer'))
const PracticePlay = lazy(() => import('./pages/PracticePlay'))

const BoardNotation = lazy(() => import('./pages/BoardNotation'))
const CheckmatePatterns = lazy(() => import('./pages/CheckmatePatterns'))
const PieceValueGuide = lazy(() => import('./pages/PieceValueGuide'))
const HangingPieces = lazy(() => import('./pages/HangingPieces'))
const CommonMistakes = lazy(() => import('./pages/CommonMistakes'))
const PreMoveChecklist = lazy(() => import('./pages/PreMoveChecklist'))
const GamePhaseGuide = lazy(() => import('./pages/GamePhaseGuide'))
const BlunderDetection = lazy(() => import('./pages/BlunderDetection'))
const LearningPath = lazy(() => import('./pages/LearningPath'))

// Named exports need wrapper
const MiddlegamePlans = lazy(() => import('./pages/MiddlegamePlans').then(m => ({ default: m.PlanIndex })))
const MiddlegamePlanDetail = lazy(() => import('./pages/MiddlegamePlans').then(m => ({ default: m.PlanDetail })))
const MasterGamesIndex = lazy(() => import('./pages/MasterGames').then(m => ({ default: m.GamesIndex })))
const MasterGameViewer = lazy(() => import('./pages/MasterGames').then(m => ({ default: m.GameViewer })))

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

function App() {
  useTheme();
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<DailyChallenge />} />
            <Route path="/openings" element={<OpeningsIndex />} />
            <Route path="/openings/:id" element={<OpeningTrainer />} />
            <Route path="/opening-traps" element={<OpeningTraps />} />
            <Route path="/move-order" element={<MoveOrderQuiz />} />
            <Route path="/tactics" element={<TacticsQueue />} />
            <Route path="/strategy" element={<StrategyIndex />} />
            <Route path="/strategy/:id" element={<StrategyLesson />} />
            <Route path="/endgames" element={<EndgameIndex />} />
            <Route path="/endgames/:id" element={<EndgameLesson />} />
            <Route path="/theoretical-endgames" element={<TheoreticalEndgames />} />
            <Route path="/practical-endgames" element={<PracticalEndgames />} />
            <Route path="/middlegame" element={<MiddlegamePlans />} />
            <Route path="/middlegame/:id" element={<MiddlegamePlanDetail />} />
            <Route path="/critical-moments" element={<CriticalMoments />} />
            <Route path="/pattern-recognition" element={<PatternRecognition />} />
            <Route path="/master-games" element={<MasterGamesIndex />} />
            <Route path="/master-games/:id" element={<MasterGameViewer />} />
            <Route path="/pawn-structures" element={<PawnStructures />} />
            <Route path="/calculation" element={<CalculationTrainer />} />
            <Route path="/repertoire" element={<RepertoireBuilder />} />
            <Route path="/visualisation" element={<VisualisationDrills />} />
            <Route path="/game-review" element={<GameReview />} />
            <Route path="/flashcards" element={<ConceptFlashcards />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/weakness" element={<WeaknessAnalyzer />} />
            <Route path="/play" element={<PlayComputer />} />
            <Route path="/practice-play" element={<PracticePlay />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/notation" element={<BoardNotation />} />
          <Route path="/checkmate-patterns" element={<CheckmatePatterns />} />
          <Route path="/piece-values" element={<PieceValueGuide />} />
          <Route path="/hanging-pieces" element={<HangingPieces />} />
          <Route path="/common-mistakes" element={<CommonMistakes />} />
          <Route path="/pre-move-checklist" element={<PreMoveChecklist />} />
          <Route path="/game-phases" element={<GamePhaseGuide />} />
          <Route path="/blunder-detection" element={<BlunderDetection />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
