export default function RatingButtons({ onRate }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onRate('hard')}
        aria-label="Rate puzzle as hard"
        className="flex-1 py-2.5 px-4 rounded-lg bg-incorrect/15 text-incorrect hover:bg-incorrect/25 transition-all btn-press font-semibold text-base border border-incorrect/20"
      >
        ✗ Hard
      </button>
      <button
        onClick={() => onRate('medium')}
        aria-label="Rate puzzle as medium"
        className="flex-1 py-2.5 px-4 rounded-lg bg-amber/15 text-amber hover:bg-amber/25 transition-all btn-press font-semibold text-base border border-amber/20"
      >
        Medium
      </button>
      <button
        onClick={() => onRate('easy')}
        aria-label="Rate puzzle as easy"
        className="flex-1 py-2.5 px-4 rounded-lg bg-correct/15 text-correct hover:bg-correct/25 transition-all btn-press font-semibold text-base border border-correct/20"
      >
        ✓ Easy
      </button>
    </div>
  );
}
