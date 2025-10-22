"use client"

import { useState } from "react"
import { FileText, HelpCircle, X } from "lucide-react"

export function SpreadsheetHeader() {
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)

  const handleShareClick = () => {
    setShowShareToast(true)
    setTimeout(() => setShowShareToast(false), 3000)
  }

  return (
    <>
      <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-sm font-medium">10月11日王立友生日聚会安排</h1>
            {/* </CHANGE> */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["禾川", "Redefinition", "追逐", "一壤"].map((name, i) => (
                  <div
                    key={name}
                    className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                    style={{
                      backgroundColor: ["#9333ea", "#34a853", "#fbbc04", "#ea4335"][i],
                    }}
                    title={name}
                  >
                    {name[0]}
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-background bg-gray-400 flex items-center justify-center text-xs font-medium text-white">
                  你
                </div>
              </div>
              <span>5 人正在协作</span>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={handleShareClick} className="px-4 py-1.5 text-sm hover:bg-secondary rounded">
            共享
          </button>
          <button onClick={() => setShowHelpDialog(true)} className="p-2 hover:bg-secondary rounded">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {showHelpDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg w-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">使用说明</h2>
              <button onClick={() => setShowHelpDialog(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              这是一个简单的在线表格编辑器，麻烦各位朋友尽管完成生日聚会的统筹工作{"\n"}
              工作中的一些注意事项：{"\n"}
              1. 本表格仅供本次生日聚会使用，请勿用于其他用途。{"\n"}
              2. 请勿删除或修改他人已填写的信息，以免造成<b>混乱</b>。{"\n"}
              3. 乱加框线可能导致其他人<b>无法</b>正常参与工作，请谨慎操作。{"\n"}
              4. 尽管工作条件有限，但我们也会优先<b>参与表格工作的人的需求</b>，毕竟和喜欢的东西待在一起才会更加快乐嘛。{"\n"}
              感谢大家的配合，祝我们到达那一刻后，能有一个难忘且愉快的生日聚会！
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpDialog(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-background border border-border rounded-lg shadow-lg px-4 py-3 z-50">
          <p className="text-sm">您暂无分享表格的权限</p>
        </div>
      )}
    </>
  )
}
