interface CollaboratorPosition {
  id: string
  name: string
  color: string
  row: number
  col: number
}

interface CollaboratorCursorsProps {
  positions: CollaboratorPosition[]
}

export function CollaboratorCursors({ positions }: CollaboratorCursorsProps) {
  return (
    <>
      {positions.map((pos) => (
        <div
          key={pos.id}
          className="absolute pointer-events-none transition-all duration-200"
          style={{
            left: `${48 + pos.col * 96}px`,
            top: `${32 + pos.row * 32}px`,
            width: "96px",
            height: "32px",
          }}
        >
          {/* Cell highlight */}
          <div
            className="absolute inset-0 border-2 rounded"
            style={{
              borderColor: pos.color,
              backgroundColor: `${pos.color}15`,
            }}
          />

          {/* Cursor indicator */}
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full" style={{ backgroundColor: pos.color }} />

          {/* Name tag */}
          <div
            className="absolute -top-6 left-0 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap shadow-lg"
            style={{ backgroundColor: pos.color }}
          >
            {pos.name}
          </div>
        </div>
      ))}
    </>
  )
}
