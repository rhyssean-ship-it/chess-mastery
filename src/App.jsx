import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import BottomNav from './components/BottomNav'
import LoadingSkeleton from './components/LoadingSkeleton'
import Home from './pages/Home'
import { useTheme } from './hooks/useTheme'
import { recordVisit } from './services/activityTracker'

// Eagerly load the learning-path landing
import LearningPath from './pages/LearningPath'

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
const GameAnalysis = lazy(() => import('./pages/GameAnalysis'))
const PuzzleRush = lazy(() => import('./pages/PuzzleRush'))
const MyMistakes = lazy(() => import('./pages/MyMistakes'))
const EndgameDrills = lazy(() => import('./pages/EndgameDrills'))
const DailyCalculation = lazy(() => import('./pages/DailyCalculation'))
const BlindfoldLadder = lazy(() => import('./pages/BlindfoldLadder'))
const PatternDojo = lazy(() => import('./pages/PatternDojo'))
const RatingEstimator = lazy(() => import('./pages/RatingEstimator'))
const SavedReviews = lazy(() => import('./pages/SavedReviews'))
const LearnIndex = lazy(() => import('./pages/SectionIndex').then(m => ({ default: m.LearnIndex })))
const TrainIndex = lazy(() => import('./pages/SectionIndex').then(m => ({ default: m.TrainIndex })))
const ProfileIndex = lazy(() => import('./pages/SectionIndex').then(m => ({ default: m.ProfileIndex })))

const BoardNotation = lazy(() => import('./pages/BoardNotation'))
const CheckmatePatterns = lazy(() => import('./pages/CheckmatePatterns'))
const PieceValueGuide = lazy(() => import('./pages/PieceValueGuide'))
const HangingPieces = lazy(() => import('./pages/HangingPieces'))
const CommonMistakes = lazy(() => import('./pages/CommonMistakes'))
const PreMoveChecklist = lazy(() => import('./pages/PreMoveChecklist'))
const GamePhaseGuide = lazy(() => import('./pages/GamePhaseGuide'))
const BlunderDetection = lazy(() => import('./pages/BlunderDetection'))
const DailyChallenge = lazy(() => import('./pages/DailyChallenge'))

// Named exports need wrapper
const MiddlegamePlans = lazy(() => import('./pages/MiddlegamePlans').then(m => ({ default: m.PlanIndex })))
const MiddlegamePlanDetail = lazy(() => import('./pages/MiddlegamePlans').then(m => ({ default: m.PlanDetail })))
const MasterGamesIndex = lazy(() => import('./pages/MasterGames').then(m => ({ default: m.GamesIndex })))
const MasterGameViewer = lazy(() => import('./pages/MasterGames').then(m => ({ default: m.GameViewer })))

function Loading() { return <LoadingSkeleton />; }

function RouteTracker() {
  const location = useLocation();
  useEffect(() => { recordVisit(location.pathname); }, [location.pathname]);
  return null;
}

function App() {
  useTheme();
  return (
    <div className="min-h-screen">
      <Nav />
      <RouteTracker />
      <main className="lg:ml-52 pt-16 lg:pt-0 pb-24 lg:pb-0 min-h-screen">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/learn" element={<LearnIndex />} />
            <Route path="/train" element={<TrainIndex />} />
            <Route path="/profile" element={<ProfileIndex />} />
            <Route path="/profile/reviews" element={<SavedReviews />} />
            <Route path="/daily" element={<DailyChallenge />} />
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
            <Route path="/play/analysis" element={<GameAnalysis />} />
            <Route path="/puzzle-rush" element={<PuzzleRush />} />
            <Route path="/my-mistakes" element={<MyMistakes />} />
            <Route path="/endgame-drills" element={<EndgameDrills />} />
            <Route path="/daily-calculation" element={<DailyCalculation />} />
            <Route path="/blindfold-ladder" element={<BlindfoldLadder />} />
            <Route path="/pattern-dojo" element={<PatternDojo />} />
            <Route path="/rating-estimator" element={<RatingEstimator />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/notation" element={<BoardNotation />} />
          <Route path="/checkmate-patterns" element={<CheckmatePatterns />} />
          <Route path="/piece-values" element={<PieceValueGuide />} />
          <Route path="/hanging-pieces" element={<HangingPieces />} />
          <Route path="/common-mistakes" element={<CommonMistakes />} />
          <Route path="/pre-move-checklist" element={<PreMoveChecklist />} />
          <Route path="/game-phases" element={<GamePhaseGuide />} />
          <Route path="/blunder-detection" element={<BlunderDetection />} />
          {/* /learning-path redirects to / */}
          <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
