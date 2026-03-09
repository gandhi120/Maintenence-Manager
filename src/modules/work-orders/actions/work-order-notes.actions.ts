'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotesForWorkOrder(workOrderId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('work_order_notes')
    .select(`
      *,
      author:users!work_order_notes_author_id_fkey(id, name, avatar_url)
    `)
    .eq('work_order_id', workOrderId)
    .order('created_at', { ascending: true })

  return data || []
}

export async function addNoteToWorkOrder(workOrderId: string, projectId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('work_order_notes')
    .insert({
      work_order_id: workOrderId,
      author_id: user.id,
      content,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    work_order_id: workOrderId,
    actor_id: user.id,
    action: 'note_added',
    description: 'added a note to work order',
  })

  revalidatePath(`/projects/${projectId}`)
  return { data }
}
