"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { SheetData } from "@/lib/sheets-data"

interface SheetTabsProps {
  sheets: SheetData[]
  activeSheet: number
  onSheetChange: (index: number) => void
}

export function SheetTabs({ sheets, activeSheet, onSheetChange }: SheetTabsProps) {
  const [showAddToast, setShowAddToast] = useState(false)

  const handleAddClick = () => {
    setShowAddToast(true)
    setTimeout(() => setShowAddToast(false), 3000)
  }

  return (
    <>
      <div className="h-10 border-t border-border bg-background flex items-center px-2 gap-1">
        {sheets.map((sheet, index) => (
          <button
            key={index}
            onClick={() => onSheetChange(index)}
            className={`px-4 py-1.5 text-sm rounded transition-colors ${
              activeSheet === index
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-secondary text-foreground"
            }`}
          >
            {sheet.name}
          </button>
        ))}
        <button onClick={handleAddClick} className="p-1.5 hover:bg-secondary rounded ml-2">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showAddToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-background border border-border rounded-lg shadow-lg px-4 py-3 z-50">
          <p className="text-sm">您暂无添加sheet的权限</p>
        </div>
      )}
    </>
  )
}
