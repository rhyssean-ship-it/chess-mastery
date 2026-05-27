// Page-shape skeleton shown while a lazy-loaded route loads.
// Feels faster than a centred dot bouncer because the user sees a layout
// approximating the page they're about to land on.

function Bar({ w = '100%', h = '0.75rem', className = '' }) {
  return (
    <div
      className={`rounded skeleton ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="page page-wide animate-pulse">
      {/* Title block */}
      <div className="mb-6">
        <Bar w="14rem" h="1.75rem" className="mb-3" />
        <Bar w="22rem" h="0.875rem" />
      </div>

      {/* Two-column hint */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-6">
        <div>
          <Bar w="100%" h="22rem" className="mb-3" />
          <div className="flex gap-2">
            <Bar w="6rem" h="2.25rem" />
            <Bar w="6rem" h="2.25rem" />
            <Bar w="6rem" h="2.25rem" />
          </div>
        </div>
        <div className="space-y-3">
          <Bar w="100%" h="7rem" />
          <Bar w="100%" h="5rem" />
          <Bar w="100%" h="10rem" />
        </div>
      </div>
    </div>
  );
}
