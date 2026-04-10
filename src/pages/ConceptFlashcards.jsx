import { useState, useMemo } from 'react';
import conceptCards from '../data/conceptCards';
import { useLocalStorage } from '../hooks/useLocalStorage';

const categories = ['All', 'General', 'Tactics', 'Strategy', 'Structure', 'Endgame'];

export default function ConceptFlashcards() {
  const [filter, setFilter] = useState('All');
  const [mastered, setMastered] = useLocalStorage('concept-mastered', []);
  const [showMastered, setShowMastered] = useState(false);

  const filtered = useMemo(() => {
    let cards = conceptCards;
    if (filter !== 'All') cards = cards.filter(c => c.category === filter);
    if (!showMastered) cards = cards.filter(c => !mastered.includes(c.id));
    return cards;
  }, [filter, mastered, showMastered]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = filtered[idx % Math.max(filtered.length, 1)];

  function next() { setIdx(i => (i + 1) % filtered.length); setFlipped(false); }
  function prev() { setIdx(i => (i - 1 + filtered.length) % filtered.length); setFlipped(false); }

  function toggleMastered() {
    if (!card) return;
    setMastered(prev => prev.includes(card.id) ? prev.filter(id => id !== card.id) : [...prev, card.id]);
  }

  if (filtered.length === 0) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">&#9813;</div>
        <h1 className="text-3xl font-display text-gold mb-4">Concept Flashcards</h1>
        <p className="text-text-dim mb-4">{showMastered ? 'No cards in this category.' : 'You\'ve mastered all cards in this category!'}</p>
        <button onClick={() => setShowMastered(true)} className="bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Show Mastered Cards</button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Concept Flashcards</h1>
      <p className="text-text-dim text-base mb-6">Review key chess concepts with spaced repetition.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => { setFilter(cat); setIdx(0); setFlipped(false); }} className={`text-xs px-3 py-1.5 rounded-lg transition-all btn-press ${filter === cat ? 'bg-gold text-bg' : 'bg-bg-card border border-bg-hover text-text-dim hover:text-text'}`}>{cat}</button>
        ))}
        <button onClick={() => setShowMastered(!showMastered)} className={`text-xs px-3 py-1.5 rounded-lg transition-all btn-press ml-auto ${showMastered ? 'bg-correct/20 text-correct' : 'bg-bg-card border border-bg-hover text-text-dim'}`}>
          {showMastered ? 'Hiding mastered' : 'Show mastered'}
        </button>
      </div>

      <div className="text-xs text-text-dim mb-4 tabular-nums">
        Card {(idx % filtered.length) + 1} of {filtered.length} &middot; {mastered.length}/{conceptCards.length} mastered
      </div>

      {/* Card */}
      <div onClick={() => setFlipped(!flipped)} className="card-base p-8 min-h-[240px] flex flex-col justify-center cursor-pointer hover:border-gold/20 transition-all relative" style={{ perspective: '1000px' }}>
        {!flipped ? (
          <div className="text-center">
            <p className="text-xs text-text-dim uppercase tracking-wider mb-4">Question</p>
            <p className="text-lg font-semibold leading-relaxed">{card.front}</p>
            <p className="text-xs text-text-dim/50 mt-6">Click to reveal answer</p>
          </div>
        ) : (
          <div className="text-center" style={{ animation: 'cardFadeUp 200ms ease-out' }}>
            <p className="text-xs text-gold uppercase tracking-wider mb-4">Answer</p>
            <p className="text-base text-text-dim leading-relaxed">{card.back}</p>
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-bg-hover text-text-dim">{card.category}</span>
          {mastered.includes(card.id) && <span className="text-correct text-xs">&#10003;</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={prev} className="px-4 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press flex items-center gap-1"><kbd>&larr;</kbd> Prev</button>
        <button onClick={toggleMastered} className={`px-4 py-2 rounded-lg text-base transition-all btn-press ${mastered.includes(card.id) ? 'bg-correct/15 text-correct border border-correct/20' : 'bg-bg-card border border-bg-hover text-text-dim hover:text-text'}`}>
          {mastered.includes(card.id) ? '&#10003; Mastered' : 'Mark as Mastered'}
        </button>
        <button onClick={next} className="px-4 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press flex items-center gap-1">Next <kbd>&rarr;</kbd></button>
      </div>
    </div>
  );
}
