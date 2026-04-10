export default function MoveList({ history, currentIndex, onSelectMove }) {
  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] || null,
      whiteIdx: i,
      blackIdx: i + 1,
    });
  }

  return (
    <div className="bg-bg-card rounded-lg p-3 max-h-80 overflow-y-auto">
      <table className="w-full text-sm">
        <tbody>
          {pairs.map(p => (
            <tr key={p.number}>
              <td className="text-text-dim w-8 pr-2 text-right">{p.number}.</td>
              <td
                className={`px-2 py-0.5 cursor-pointer rounded transition-colors ${
                  currentIndex === p.whiteIdx ? 'bg-gold text-bg font-semibold' : 'hover:bg-bg-hover'
                }`}
                onClick={() => onSelectMove(p.whiteIdx)}
              >
                {p.white?.move?.san || p.white?.san || ''}
              </td>
              <td
                className={`px-2 py-0.5 cursor-pointer rounded transition-colors ${
                  p.black && currentIndex === p.blackIdx ? 'bg-gold text-bg font-semibold' : 'hover:bg-bg-hover'
                }`}
                onClick={() => p.black && onSelectMove(p.blackIdx)}
              >
                {p.black?.move?.san || p.black?.san || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
