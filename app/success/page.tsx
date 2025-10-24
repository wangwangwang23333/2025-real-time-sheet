export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center space-y-6 p-8">
        <div className="text-6xl">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900">信息已破译</h1>
        <p className="text-xl text-gray-600 max-w-md">王立友博士：{"\n"}很高兴你能走到这里，接下来我们会带您进入最重要的网页，您需要破解出指定地点</p>
        <div className="pt-4">
          <a
            href="/emoji-match-game"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往
          </a>
        </div>
      </div>
    </div>
  )
}
