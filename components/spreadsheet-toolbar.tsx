"use client"

import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface SpreadsheetToolbarProps {
  onBorderChange: (side: "top" | "right" | "bottom" | "left") => void
  selectedCell: { row: number; col: number } | null
}

export function SpreadsheetToolbar({ onBorderChange, selectedCell }: SpreadsheetToolbarProps) {
  return (
    <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-1">
      <select className="px-2 py-1 text-sm border border-border rounded bg-background">
        <option>Arial</option>
        <option>Times New Roman</option>
        <option>Courier New</option>
      </select>

      <select className="px-2 py-1 text-sm border border-border rounded bg-background ml-2">
        <option>11</option>
        <option>12</option>
        <option>14</option>
        <option>16</option>
      </select>

      <div className="w-px h-6 bg-border mx-2" />

      <button className="p-1.5 hover:bg-secondary rounded" title="粗体">
        <Bold className="w-4 h-4" />
      </button>
      <button className="p-1.5 hover:bg-secondary rounded" title="斜体">
        <Italic className="w-4 h-4" />
      </button>
      <button className="p-1.5 hover:bg-secondary rounded" title="下划线">
        <Underline className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-2" />

      <button className="p-1.5 hover:bg-secondary rounded" title="左对齐">
        <AlignLeft className="w-4 h-4" />
      </button>
      <button className="p-1.5 hover:bg-secondary rounded" title="居中">
        <AlignCenter className="w-4 h-4" />
      </button>
      <button className="p-1.5 hover:bg-secondary rounded" title="右对齐">
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-2" />

      <div className="flex items-center gap-1">
        <button
          className="p-1.5 hover:bg-secondary rounded disabled:opacity-50"
          title="上边框"
          disabled={!selectedCell}
          onClick={() => onBorderChange("top")}
        >
          <div className="w-4 h-4 border-t-2 border-foreground" />
        </button>
        <button
          className="p-1.5 hover:bg-secondary rounded disabled:opacity-50"
          title="右边框"
          disabled={!selectedCell}
          onClick={() => onBorderChange("right")}
        >
          <div className="w-4 h-4 border-r-2 border-foreground" />
        </button>
        <button
          className="p-1.5 hover:bg-secondary rounded disabled:opacity-50"
          title="下边框"
          disabled={!selectedCell}
          onClick={() => onBorderChange("bottom")}
        >
          <div className="w-4 h-4 border-b-2 border-foreground" />
        </button>
        <button
          className="p-1.5 hover:bg-secondary rounded disabled:opacity-50"
          title="左边框"
          disabled={!selectedCell}
          onClick={() => onBorderChange("left")}
        >
          <div className="w-4 h-4 border-l-2 border-foreground" />
        </button>
      </div>
    </div>
  )
}
