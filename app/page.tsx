"use client"

import { useState, useEffect, useCallback } from "react"
import { SpreadsheetHeader } from "@/components/spreadsheet-header"
import { SpreadsheetToolbar } from "@/components/spreadsheet-toolbar"
import { SpreadsheetGrid } from "@/components/spreadsheet-grid"
import { SheetTabs } from "@/components/sheet-tabs"
import { CollaboratorCursors } from "@/components/collaborator-cursors"
import { sheetsData, type SheetData } from "@/lib/sheets-data"
import { checkWinCondition } from "@/lib/win-condition"

export default function SpreadsheetPage() {
  const [activeSheet, setActiveSheet] = useState(0)
  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([
    { row: 0, col: 0 }, // sheet1
    { row: 0, col: 0 }, // sheet2
    { row: 0, col: 0 }, // sheet3
    { row: 0, col: 0 }, // sheet4
    { row: 0, col: 0 }, // sheet5
  ])
  const [sheets, setSheets] = useState<SheetData[]>(sheetsData)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")

  // Collaborator positions for each sheet
  const [collaboratorPositions, setCollaboratorPositions] = useState({
    1: { row: 2, col: 2 }, // Collaborator A on sheet2
    2: { row: 5, col: 5 }, // Collaborator B on sheet3
    3: { row: 1, col: 8 }, // Collaborator C on sheet4
    4: { row: 3, col: 3 }, // Collaborator D on sheet5
  })

  const selectedCell = selectedCells[activeSheet]

  const canMove = (
    sheet: SheetData,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    direction: "up" | "down" | "left" | "right",
  ): boolean => {
    // 检查目标位置是否在表格范围内
    if (toRow < 0 || toRow >= sheet.rows || toCol < 0 || toCol >= sheet.cols) {
      return false
    }

    const fromKey = `${fromRow}-${fromCol}`
    const toKey = `${toRow}-${toCol}`
    const fromBorders = sheet.borders?.[fromKey]
    const toBorders = sheet.borders?.[toKey]

    // 检查当前单元格是否有阻挡该方向的边框
    if (direction === "up" && fromBorders?.top) return false
    if (direction === "down" && fromBorders?.bottom) return false
    if (direction === "left" && fromBorders?.left) return false
    if (direction === "right" && fromBorders?.right) return false

    // 检查目标单元格是否有阻挡进入的边框
    if (direction === "up" && toBorders?.bottom) return false
    if (direction === "down" && toBorders?.top) return false
    if (direction === "left" && toBorders?.right) return false
    if (direction === "right" && toBorders?.left) return false

    return true
  }

  const handleCellEdit = (value: string) => {
    const newSheets = [...sheets]
    const sheet = newSheets[activeSheet]

    if (!sheet.data[selectedCell.row]) {
      sheet.data[selectedCell.row] = []
    }

    sheet.data[selectedCell.row][selectedCell.col] = value
    setSheets(newSheets)
    setIsEditing(false)
  }

  const handleBorderChange = (side: "top" | "right" | "bottom" | "left") => {
    const newSheets = [...sheets]
    const sheet = newSheets[activeSheet]

    if (!sheet.borders) {
      sheet.borders = {}
    }

    const key = `${selectedCell.row}-${selectedCell.col}`
    if (!sheet.borders[key]) {
      sheet.borders[key] = {}
    }

    sheet.borders[key][side] = !sheet.borders[key][side]
    setSheets(newSheets)
  }

  const updateSelectedCell = (row: number, col: number) => {
    const newSelectedCells = [...selectedCells]
    newSelectedCells[activeSheet] = { row, col }
    setSelectedCells(newSelectedCells)
  }

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isEditing) return

      // Only handle arrow keys when on sheet1 (index 0)
      if (activeSheet !== 0) return

      const currentSheet = sheets[activeSheet]
      const { row, col } = selectedCell

      let newRow = row
      let newCol = col
      let moved = false
      let direction: "up" | "down" | "left" | "right" | null = null

      switch (e.key) {
        case "Enter":
          setIsEditing(true)
          setEditValue(currentSheet.data[row]?.[col] || "")
          e.preventDefault()
          return
        case "ArrowUp":
          if (canMove(currentSheet, row, col, row - 1, col, "up")) {
            newRow = row - 1
            moved = true
            direction = "up"
          }
          e.preventDefault()
          break
        case "ArrowDown":
          if (canMove(currentSheet, row, col, row + 1, col, "down")) {
            newRow = row + 1
            moved = true
            direction = "down"
          }
          e.preventDefault()
          break
        case "ArrowLeft":
          if (canMove(currentSheet, row, col, row, col - 1, "left")) {
            newCol = col - 1
            moved = true
            direction = "left"
          }
          e.preventDefault()
          break
        case "ArrowRight":
          if (canMove(currentSheet, row, col, row, col + 1, "right")) {
            newCol = col + 1
            moved = true
            direction = "right"
          }
          e.preventDefault()
          break
      }

      if (moved && direction) {
        updateSelectedCell(newRow, newCol)
        updateCollaboratorPositions(direction, newRow, newCol)
      }
    },
    [activeSheet, selectedCell, sheets, isEditing],
  )

  // Update collaborator positions based on hidden rules
  const updateCollaboratorPositions = (
    direction: "up" | "down" | "left" | "right",
    userRow: number,
    userCol: number,
  ) => {
    setCollaboratorPositions((prev) => {
      const newPositions = { ...prev }

      // Collaborator A (sheet2): Same direction as user
      const sheetA = sheets[1]
      let newARow = prev[1].row
      let newACol = prev[1].col

      if (direction === "up" && canMove(sheetA, newARow, newACol, newARow - 1, newACol, "up")) {
        newARow--
      } else if (direction === "down" && canMove(sheetA, newARow, newACol, newARow + 1, newACol, "down")) {
        newARow++
      } else if (direction === "left" && canMove(sheetA, newARow, newACol, newARow, newACol - 1, "left")) {
        newACol--
      } else if (direction === "right" && canMove(sheetA, newARow, newACol, newARow, newACol + 1, "right")) {
        newACol++
      }
      newPositions[1] = { row: newARow, col: newACol }

      // Collaborator B (sheet3): Opposite direction
      const sheetB = sheets[2]
      let newBRow = prev[2].row
      let newBCol = prev[2].col

      if (direction === "up" && canMove(sheetB, newBRow, newBCol, newBRow + 1, newBCol, "down")) {
        newBRow++
      } else if (direction === "down" && canMove(sheetB, newBRow, newBCol, newBRow - 1, newBCol, "up")) {
        newBRow--
      } else if (direction === "left" && canMove(sheetB, newBRow, newBCol, newBRow, newBCol + 1, "right")) {
        newBCol++
      } else if (direction === "right" && canMove(sheetB, newBRow, newBCol, newBRow, newBCol - 1, "left")) {
        newBCol--
      }
      newPositions[2] = { row: newBRow, col: newBCol }

      // Collaborator C (sheet4): Move to boundary in the same direction
      const sheetC = sheets[3]
      let newCRow = prev[3].row
      let newCCol = prev[3].col

      if (direction === "up") {
        while (canMove(sheetC, newCRow, newCCol, newCRow - 1, newCCol, "up")) {
          newCRow--
        }
      } else if (direction === "down") {
        while (canMove(sheetC, newCRow, newCCol, newCRow + 1, newCCol, "down")) {
          newCRow++
        }
      } else if (direction === "left") {
        while (canMove(sheetC, newCRow, newCCol, newCRow, newCCol - 1, "left")) {
          newCCol--
        }
      } else if (direction === "right") {
        while (canMove(sheetC, newCRow, newCCol, newCRow, newCCol + 1, "right")) {
          newCCol++
        }
      }
      newPositions[3] = { row: newCRow, col: newCCol }

      // Collaborator D (sheet5): Random empty cell
      const sheetD = sheets[4]
      const emptyCells: Array<{ row: number; col: number }> = []

      for (let r = 0; r < sheetD.rows; r++) {
        for (let c = 0; c < sheetD.cols; c++) {
          if (!sheetD.data[r]?.[c] || sheetD.data[r][c] === "") {
            emptyCells.push({ row: r, col: c })
          }
        }
      }

      if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        newPositions[4] = randomCell
      }

      return newPositions
    })
  }

  useEffect(() => {
    const userPosition = { sheet: 0, ...selectedCells[0] }
    const allPositions = {
      user: userPosition,
      collaboratorA: { sheet: 1, ...collaboratorPositions[1] },
      collaboratorB: { sheet: 2, ...collaboratorPositions[2] },
      collaboratorC: { sheet: 3, ...collaboratorPositions[3] },
      collaboratorD: { sheet: 4, ...collaboratorPositions[4] },
    }

    if (checkWinCondition(allPositions)) {
      // Win! Redirect to success page
      setTimeout(() => {
        window.location.href = "/2025-real-time-sheet/success"
      }, 500)
    }
  }, [selectedCells, collaboratorPositions])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex flex-col h-screen">
      <SpreadsheetHeader />
      <SpreadsheetToolbar onBorderChange={handleBorderChange} selectedCell={selectedCell} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto relative">
          <SpreadsheetGrid
            sheet={sheets[activeSheet]}
            selectedCell={selectedCell}
            onCellClick={(row, col) => {
              updateSelectedCell(row, col)
              setIsEditing(false)
            }}
            onCellDoubleClick={(row, col) => {
              updateSelectedCell(row, col)
              setIsEditing(true)
              setEditValue(sheets[activeSheet].data[row]?.[col] || "")
            }}
            isEditing={isEditing}
            editValue={editValue}
            onEditChange={setEditValue}
            onEditComplete={handleCellEdit}
            onEditCancel={() => setIsEditing(false)}
          />

          {/* Show collaborator cursor only on their respective sheets */}
          {activeSheet > 0 && (
            <CollaboratorCursors
              positions={[
                {
                  id: ["A", "B", "C", "D"][activeSheet - 1],
                  name: ["禾川", "Redefinition", "追逐", "一壤"][activeSheet - 1],
                  color: ["#9333ea", "#34a853", "#fbbc04", "#ea4335"][activeSheet - 1],
                  ...collaboratorPositions[activeSheet as 1 | 2 | 3 | 4],
                },
              ]}
            />
          )}
        </div>

        <SheetTabs sheets={sheets} activeSheet={activeSheet} onSheetChange={setActiveSheet} />
      </div>
    </div>
  )
}
