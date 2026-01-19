'use client'

import React from "react"

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

export default function FilePage() {
  const params = useParams()
  const fileId = params.fileId as string

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [clicked, setClicked] = useState(0)
  const [unlockedSecondStage, setUnlockedSecondStage] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const exclamationRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartXRef = useRef(0)

  // Fetch the code
  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await fetch(`/api/file/${fileId}`)
        const data = await response.json()

        if (response.ok) {
          setCode(data.code)
        }
      } catch (error) {
        console.error('Failed to fetch code:', error)
      } finally {
        setLoading(false)
      }
    }

    if (fileId) {
      fetchCode()
    }
  }, [fileId])

  // Handle the "access denied!" text clicks (3 clicks to unlock second stage)
  const handleAccessDeniedClick = () => {
    const newClickCount = clicked + 1
    setClicked(newClickCount)

    if (newClickCount >= 3) {
      setUnlockedSecondStage(true)
    }
  }

  // Handle mouse/touch down for drag start
  const handleDragStart = (e: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => {
    if (!unlockedSecondStage) return

    e.preventDefault()
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragStartXRef.current = clientX
  }

  // Handle mouse/touch move for dragging
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !exclamationRef.current) return

      const clientX = e instanceof TouchEvent ? e.touches[0].clientX : (e as MouseEvent).clientX
      const delta = clientX - dragStartXRef.current

      // Only allow dragging to the left (negative delta)
      if (delta < 0) {
        const newOffset = Math.max(delta, -200) // Max 200px to the left
        setDragOffset(newOffset)

        // Check if dragged far enough to the left to reveal
        if (newOffset <= -150) {
          setRevealed(true)
          setIsDragging(false)
        }
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMove as EventListener)
      document.addEventListener('touchmove', handleMove as EventListener)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchend', handleEnd)

      return () => {
        document.removeEventListener('mousemove', handleMove as EventListener)
        document.removeEventListener('touchmove', handleMove as EventListener)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300">
        <p>File not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div
        ref={containerRef}
        className="w-full max-w-2xl relative"
        style={{
          minHeight: revealed ? 'auto' : '200px',
        }}
      >
        {revealed ? (
          // Revealed Code Section
          <div className="w-full p-6 bg-slate-800/50 border border-slate-700 rounded-lg animate-in fade-in duration-500">
            <pre className="text-sm text-slate-100 overflow-auto max-h-96 font-mono">
              <code>{code}</code>
            </pre>
          </div>
        ) : (
          // Access Denied Section with Hidden Unlock
          <div className="flex items-center justify-center min-h-96 cursor-default">
            <div className="text-center select-none">
              {!unlockedSecondStage ? (
                // First Stage: Click to unlock
                <div
                  onClick={handleAccessDeniedClick}
                  className="text-white text-6xl font-bold cursor-pointer hover:text-slate-200 transition-colors select-none"
                >
                  access denied!
                </div>
              ) : (
                // Second Stage: Drag unlock
                <div className="relative inline-block w-96">
                  <div className="text-white text-6xl font-bold select-none">
                    access denied
                    <span
                      ref={exclamationRef}
                      onMouseDown={handleDragStart as React.MouseEventHandler<HTMLSpanElement>}
                      onTouchStart={handleDragStart as React.TouchEventHandler<HTMLSpanElement>}
                      className="inline-block cursor-grab active:cursor-grabbing"
                      style={{
                        transform: `translateX(${dragOffset}px)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        userSelect: 'none',
                        touchAction: 'none',
                      }}
                    >
                      !
                    </span>
                  </div>


                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
