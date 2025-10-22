"use client"

import { useRef, useEffect } from "react"
import type { SheetData } from "@/lib/sheets-data"

interface SpreadsheetGridProps {
  sheet: SheetData
  selectedCell: { row: number; col: number } | null
  onCellClick: (row: number, col: number) => void
  onCellDoubleClick?: (row: number, col: number) => void
  isEditing?: boolean
  editValue?: string
  onEditChange?: (value: string) => void
  onEditComplete?: (value: string) => void
  onEditCancel?: () => void
}

export function SpreadsheetGrid({
  sheet,
  selectedCell,
  onCellClick,
  onCellDoubleClick,
  isEditing,
  editValue,
  onEditChange,
  onEditComplete,
  onEditCancel,
}: SpreadsheetGridProps) {
  const columnLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const editInputRef = useRef<HTMLInputElement>(null)

  const getCellWidth = (colIndex: number, rowIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`
    const cellSize = sheet.cellSizes?.[cellKey]
    if (cellSize?.width) return cellSize.width
    if (sheet.columnWidths?.[colIndex]) return sheet.columnWidths[colIndex]
    return 96 // 默认宽度 24 * 4 = 96px
  }

  const getCellHeight = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`
    const cellSize = sheet.cellSizes?.[cellKey]
    if (cellSize?.height) return cellSize.height
    if (sheet.rowHeights?.[rowIndex]) return sheet.rowHeights[rowIndex]
    return 32 // 默认高度 8 * 4 = 32px
  }

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  return (
    <div className="inline-block min-w-full">
      {/* Column headers */}
      <div className="flex sticky top-0 z-10 bg-muted">
        <div className="w-12 h-8 border-r border-b border-border bg-muted flex-shrink-0" />
        {Array.from({ length: sheet.cols }).map((_, i) => (
          <div
            key={i}
            style={{ width: getCellWidth(i, 0) }}
            className="h-8 border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted flex-shrink-0"
          >
            {columnLabels[i]}
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: sheet.rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {/* Row header */}
          <div
            style={{ height: getCellHeight(rowIndex, 0) }}
            className="w-12 border-r border-b border-border bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0"
          >
            {rowIndex + 1}
          </div>

          {/* Cells */}
          {Array.from({ length: sheet.cols }).map((_, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            const cellValue = sheet.data[rowIndex]?.[colIndex] || ""
            const borders = sheet.borders?.[`${rowIndex}-${colIndex}`]
            const isEditingThisCell = isEditing && isSelected
            const cellWidth = getCellWidth(colIndex, rowIndex)
            const cellHeight = getCellHeight(rowIndex, colIndex)

            return (
              <div
                key={colIndex}
                className={`border-r border-b border-border flex items-center px-2 text-sm cursor-cell flex-shrink-0 relative ${
                  isSelected ? "ring-2 ring-primary ring-inset bg-accent/30" : "hover:bg-muted/50"
                }`}
                style={{
                  width: cellWidth,
                  height: cellHeight,
                  minWidth: cellWidth,
                  minHeight: cellHeight,
                  borderTopWidth: borders?.top ? "2px" : undefined,
                  borderRightWidth: borders?.right ? "2px" : undefined,
                  borderBottomWidth: borders?.bottom ? "2px" : undefined,
                  borderLeftWidth: borders?.left ? "2px" : undefined,
                  borderColor: borders ? "hsl(var(--foreground))" : undefined,
                }}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onDoubleClick={() => onCellDoubleClick?.(rowIndex, colIndex)}
              >
                {isEditingThisCell ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => onEditChange?.(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onEditComplete?.(editValue || "")
                      } else if (e.key === "Escape") {
                        onEditCancel?.()
                      }
                    }}
                    onBlur={() => onEditComplete?.(editValue || "")}
                    className="w-full h-full bg-transparent border-none outline-none px-0"
                  />
                ) : (
                  <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap" title={cellValue}>
                    {cellValue}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
