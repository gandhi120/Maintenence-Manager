'use server'

import { createClient } from '@/lib/supabase/server'

export async function getNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get recent activity relevant to the user
  const { data } = await supabase
    .from('activity_log')
    .select(`
      *,
      actor:users!activity_log_actor_id_fkey(id, name, avatar_url),
      project:projects(id, name, color)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  return data || []
}
