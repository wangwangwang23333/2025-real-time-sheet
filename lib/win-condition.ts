interface Position {
  sheet: number
  row: number
  col: number
}

interface AllPositions {
  user: Position
  collaboratorA: Position
  collaboratorB: Position
  collaboratorC: Position
  collaboratorD: Position
}

// Define the target positions for each cursor to win
const TARGET_POSITIONS = {
  user: { sheet: 0, row: 9, col: 5 },
  collaboratorA: { sheet: 1, row: 9, col: 4 },
  collaboratorB: { sheet: 2, row: 9, col: 0 },
  collaboratorC: { sheet: 3, row: 3, col: 0 },
  collaboratorD: { sheet: 4, row: 4, col: 6 },
}

export function checkWinCondition(positions: AllPositions): boolean {
  return (
    positions.user.sheet === TARGET_POSITIONS.user.sheet &&
    positions.user.row === TARGET_POSITIONS.user.row &&
    positions.user.col === TARGET_POSITIONS.user.col &&
    positions.collaboratorA.sheet === TARGET_POSITIONS.collaboratorA.sheet &&
    positions.collaboratorA.row === TARGET_POSITIONS.collaboratorA.row &&
    positions.collaboratorA.col === TARGET_POSITIONS.collaboratorA.col &&
    positions.collaboratorB.sheet === TARGET_POSITIONS.collaboratorB.sheet &&
    positions.collaboratorB.row === TARGET_POSITIONS.collaboratorB.row &&
    positions.collaboratorB.col === TARGET_POSITIONS.collaboratorB.col &&
    positions.collaboratorC.sheet === TARGET_POSITIONS.collaboratorC.sheet &&
    positions.collaboratorC.row === TARGET_POSITIONS.collaboratorC.row &&
    positions.collaboratorC.col === TARGET_POSITIONS.collaboratorC.col &&
    positions.collaboratorD.sheet === TARGET_POSITIONS.collaboratorD.sheet &&
    positions.collaboratorD.row === TARGET_POSITIONS.collaboratorD.row &&
    positions.collaboratorD.col === TARGET_POSITIONS.collaboratorD.col
  )
}
