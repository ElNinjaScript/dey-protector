'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'

export default function Home() {
  const [luaCode, setLuaCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [loadstringCode, setLoadstringCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!luaCode.trim()) {
      setError('Please paste your Lua code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: luaCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to generate URL')
        return
      }

      setGeneratedUrl(data.fileUrl)
      setLoadstringCode(data.loadstringUrl)
      setCopied(false)
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLoadstring = async () => {
    if (loadstringCode) {
      try {
        await navigator.clipboard.writeText(loadstringCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        setError('Failed to copy to clipboard')
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            DEY-PROTECTOR
          </h1>
          <p className="text-xl text-slate-400 mb-2">
            Secure Roblox Lua Script Protection
          </p>
          <p className="text-sm text-slate-500">
            Generate secure URLs for your Lua scripts with DEY-PROTECTOR
          </p>
        </div>

        {/* Main Container */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Input Section */}
          <div className="flex flex-col">
            <div className="relative">
              <label className="text-sm font-semibold text-slate-300 mb-3 block">
                Paste Your Lua Code
              </label>
              <textarea
                value={luaCode}
                onChange={(e) => setLuaCode(e.target.value)}
                placeholder="Paste your Lua script here..."
                className="w-full h-80 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-100 placeholder-slate-500 resize-none font-mono text-sm"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Protection'
              )}
            </button>
          </div>

          {/* Right: Output Section */}
          <div className="flex flex-col">
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {generatedUrl ? (
              <div className="space-y-4">
                {/* File URL */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Protected File URL
                  </label>
                  <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p className="text-slate-200 text-sm break-all font-mono">
                      {generatedUrl}
                    </p>
                  </div>
                </div>

                {/* Loadstring Command */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">
                    Loadstring Command
                  </label>
                  <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between gap-2">
                    <p className="text-slate-200 text-sm break-all font-mono flex-1">
                      {loadstringCode}
                    </p>
                    <button
                      onClick={handleCopyLoadstring}
                      className="ml-2 p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Share the loadstring command</strong> securely with trusted developers
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-6 bg-slate-800/30 border border-slate-700 rounded-lg flex items-center justify-center text-center">
                <p className="text-slate-400">
                  Your generated URLs and loadstring commands will appear here
                </p>
              </div>
            )}
          </div>
        </div>


      </div>
    </main>
  )
}
