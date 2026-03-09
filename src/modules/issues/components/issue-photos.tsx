'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface IssuePhotosProps {
  imageUrls: string[]
}

export function IssuePhotos({ imageUrls }: IssuePhotosProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!imageUrls.length) return null

  return (
    <>
      <div className="px-4">
        <h3 className="text-sm font-semibold text-primary mb-2">Photos</h3>
        <div className="flex gap-2 overflow-x-auto">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setViewerOpen(true) }}
              className="h-20 w-20 rounded-lg overflow-hidden shrink-0 bg-elevated"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen viewer */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(i => i - 1)}
              className="absolute left-4 p-2 rounded-full bg-white/10"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}
          {currentIndex < imageUrls.length - 1 && (
            <button
              onClick={() => setCurrentIndex(i => i + 1)}
              className="absolute right-4 p-2 rounded-full bg-white/10"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          )}
          <img
            src={imageUrls[currentIndex]}
            alt=""
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </>
  )
}
