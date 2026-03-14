
import { useState } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  // Mock AI processing function - generates demo responses
  const mockAIProcess = (text) => {
    return new Promise((resolve) => {
      // Simulate processing delay
      setTimeout(() => {
        const responses = [
          {
            type: 'text_analysis',
            content: `Your text contains ${text.split(' ').length} words.`,
            sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
            length: text.length
          },
          {
            type: 'creative_enhancement',
            content: `Enhanced version:\n"${text.toUpperCase()}"`,
            style: 'emphasized',
            wordCount: text.split(' ').length
          },
          {
            type: 'summary',
            content: `Summary: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
            originalLength: text.length,
            compressed: true
          }
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        resolve(randomResponse)
      }, 1500) // 1.5 second delay to simulate processing
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) {
      return
    }

    setIsLoading(true)

    try {
      const data = await mockAIProcess(input)
      setResult(data)
      setInput('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-3">PhotoGen</h1>
              <p className="text-lg text-purple-200">
                Transform your ideas with AI
              </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-500/20 mb-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="textInput" className="block text-sm font-semibold text-gray-200 mb-3">
                    Describe what you want
                  </label>
                  <textarea
                      id="textInput"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your text or describe what you'd like the AI to process..."
                      className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                      disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                  ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2m-9-8l9 2m-9-2l-9 2" />
                        </svg>
                        Submit to AI
                      </>
                  )}
                </button>
              </form>
            </div>

            {/* Result Card */}
            {result && (
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-green-500/20">
                  <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Result
                  </h2>
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-green-500/10">
              <pre className="text-gray-200 text-sm whitespace-pre-wrap break-words">
                {JSON.stringify(result, null, 2)}
              </pre>
                  </div>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-12 text-center text-gray-400 text-sm">
              <p>Your text will be securely sent to the AI for processing</p>
            </div>
          </div>
        </div>
      </>
  )
}

export default App
