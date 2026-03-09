'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { CreateProjectModal } from './create-project-modal'

export function CreateProjectButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
      <CreateProjectModal open={open} onOpenChange={setOpen} />
    </>
  )
}
