import { useState, useCallback, useRef } from 'react'
import PhotoUploader from "./PhotoUploader.jsx";

function App() {
  const [input, setInput] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  const fetchAIGeneration = useCallback(async (prompt, file) => {
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      // Створюємо FormData згідно зі структурою Swagger
      const formData = new FormData()
      formData.append('file', file)
      formData.append('prompt', prompt)

      const generateResponse = await fetch('http://localhost:8080/enchance', {
        method: 'POST',
        // Content-Type НЕ ВКАЗУЄМО! Браузер сам додасть 'multipart/form-data; boundary=...'
        body: formData,
        signal,
      })

      if (!generateResponse.ok) {
        throw new Error(`Generation request failed: ${generateResponse.status}`)
      }

      const generateData = await generateResponse.json()
      const taskId = generateData.message

      // Polling status (залишаємо вашу логіку очікування)
      let isComplete = false
      const maxAttempts = 30
      let attempts = 0
      const pollInterval = 2000

      while (!isComplete && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval))

        const statusResponse = await fetch(`http://localhost:8080/status/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal,
        })

        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.status}`)
        }

        const statusData = await statusResponse.json()

        if (statusData.message === 'COMPLETED') {
          isComplete = true
        } else if (statusData.message === 'IN_PROGRESS') {
          attempts++
          continue
        } else {
          throw new Error(`Unexpected status: ${statusData.message}`)
        }
      }

      if (!isComplete) {
        throw new Error('Generation timeout: task did not complete in time')
      }

      const resultResponse = await fetch(`http://localhost:8080/result/${taskId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      })

      if (!resultResponse.ok) {
        throw new Error(`Result fetch failed: ${resultResponse.status}`)
      }

      return await resultResponse.json()
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      throw new Error(`Failed to fetch AI response: ${err.message}`)
    }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    if (!input.trim()) {
      setError("Будь ласка, введіть промпт.")
      return
    }

    if (!imageFile) {
      setError("Будь ласка, завантажте фото.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchAIGeneration(input, imageFile)
      setResult(data)
      setInput('')
      // Якщо після успішного результату хочете очистити фото:
      // setImageFile(null) 
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [input, imageFile, fetchAIGeneration])

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-3">SellShot</h1>
            <p className="text-lg text-purple-200">
              Transform your ideas with AI
            </p>
          </div>

          {/* Передаємо callbacks для керування файлом */}
          <PhotoUploader
              onImageSelect={(file) => setImageFile(file)}
              onImageRemove={() => setImageFile(null)}
              disabled={isLoading}
          />

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
                  disabled={isLoading || !imageFile || !input.trim()}
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

          {/* Error Card */}
          {error && (
              <div className="bg-red-900/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-red-500/20 mb-8">
                <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Error
                </h2>
                <p className="text-red-200">{error}</p>
              </div>
          )}

          {/* Result Card */}
          {result && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-green-500/20 mb-8">
                <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Result
                </h2>
                <div className="space-y-4">
                  {result.description && (
                      <p className="text-gray-200">{result.description}</p>
                  )}

                  {result.images && result.images.length > 0 && (
                      <div className="space-y-4">
                        {result.images.map((image, index) => (
                            <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-green-500/10 shadow-inner">
                              <p className="text-gray-400 text-xs mb-3 truncate" title={image.file_name}>
                                {image.file_name}
                              </p>
                              <div className="flex justify-center">
                                <img
                                    src={image.url}
                                    alt={image.file_name || 'Згенероване зображення'}
                                    className="max-w-full h-auto max-h-96 rounded-md border border-slate-600 shadow-lg object-contain"
                                />
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* Info Section */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>Your text and image will be securely sent to the AI for processing</p>
          </div>
        </div>
      </div>
  )
}

export default App