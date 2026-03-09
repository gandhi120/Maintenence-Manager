'use client'

import { useState, useEffect } from 'react'
import { Send, MessageSquare } from 'lucide-react'
import { getNotesForWorkOrder, addNoteToWorkOrder } from '@/modules/work-orders/actions/work-order-notes.actions'

interface Note {
  id: string
  content: string
  created_at: string
  author?: { id: string; name: string; avatar_url: string | null } | null
}

const demoNotes: Note[] = [
  {
    id: '1',
    content: 'Inspected hydraulic lines. Seal replacement needed. Parts ordered.',
    created_at: '2026-03-08T14:30:00Z',
    author: { id: '1', name: 'Amit Sharma', avatar_url: null },
  },
  {
    id: '2',
    content: 'Parts arrived. Scheduling repair for tomorrow morning.',
    created_at: '2026-03-09T10:15:00Z',
    author: { id: '1', name: 'Amit Sharma', avatar_url: null },
  },
  {
    id: '3',
    content: 'Repair completed. Testing under load.',
    created_at: '2026-03-10T16:45:00Z',
    author: { id: '2', name: 'Priya Patel', avatar_url: null },
  },
]

interface WorkOrderNotesTimelineProps {
  workOrderId: string
  projectId: string
}

export function WorkOrderNotesTimeline({ workOrderId, projectId }: WorkOrderNotesTimelineProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (workOrderId === 'demo') {
      setNotes(demoNotes)
      setLoading(false)
      return
    }

    getNotesForWorkOrder(workOrderId).then((data) => {
      setNotes(data.length > 0 ? data : demoNotes)
      setLoading(false)
    }).catch(() => {
      setNotes(demoNotes)
      setLoading(false)
    })
  }, [workOrderId])

  const handleAddNote = async () => {
    if (!newNote.trim() || workOrderId === 'demo') return

    setSubmitting(true)
    const result = await addNoteToWorkOrder(workOrderId, projectId, newNote.trim())
    if (!result.error) {
      // Refetch notes
      const updated = await getNotesForWorkOrder(workOrderId)
      setNotes(updated)
      setNewNote('')
    }
    setSubmitting(false)
  }

  return (
    <div className="bg-[#18181B] border border-[#3F3F46] rounded-xl p-4">
      <h3 className="text-base font-semibold text-[#FAFAFA] mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Repair Notes
      </h3>

      {loading ? (
        <p className="text-sm text-[#A1A1AA] text-center py-4">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-[#A1A1AA] text-center py-4">No notes yet</p>
      ) : (
        <div className="space-y-4 mb-4">
          {notes.map((note, index) => (
            <div key={note.id} className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {note.author?.name?.charAt(0) || '?'}
                </div>
                {index < notes.length - 1 && (
                  <div className="w-px flex-1 bg-[#3F3F46] my-1 min-h-[20px]" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[#FAFAFA]">{note.author?.name || 'Unknown'}</span>
                  <span className="text-xs text-[#A1A1AA]">
                    {new Date(note.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-[#A1A1AA]">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Note Form */}
      <div className="flex gap-2 pt-2 border-t border-[#3F3F46]">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 h-10 px-3 rounded-lg border border-[#3F3F46] bg-[#27272A] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 text-[#FAFAFA] text-sm placeholder:text-[#52525B]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleAddNote()
            }
          }}
        />
        <button
          onClick={handleAddNote}
          disabled={submitting || !newNote.trim()}
          className="h-10 px-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
