export default function RatingButtons({ onRate }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onRate('hard')}
        className="flex-1 py-2 px-4 rounded bg-incorrect/20 text-incorrect hover:bg-incorrect/30 transition-colors font-semibold text-sm"
      >
        Hard &#10007;
      </button>
      <button
        onClick={() => onRate('medium')}
        className="flex-1 py-2 px-4 rounded bg-amber/20 text-amber hover:bg-amber/30 transition-colors font-semibold text-sm"
      >
        Medium
      </button>
      <button
        onClick={() => onRate('easy')}
        className="flex-1 py-2 px-4 rounded bg-correct/20 text-correct hover:bg-correct/30 transition-colors font-semibold text-sm"
      >
        Easy &#10003;
      </button>
    </div>
  );
}
