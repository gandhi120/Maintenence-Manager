'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function addTechnician(phone: string, name: string, projectIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Use admin client for cross-user operations (RLS only allows own-row access on users table)
  const admin = createAdminClient()

  // Check if user with this phone already exists
  const { data: existingUser } = await admin
    .from('users')
    .select('id')
    .eq('mobile_number', phone)
    .single()

  let technicianId: string

  if (existingUser) {
    technicianId = existingUser.id
    // Update role to technician if not already
    await admin
      .from('users')
      .update({ role: 'technician', name })
      .eq('id', technicianId)
  } else {
    // Create new user with a generated UUID
    const { data: newUser, error: insertError } = await admin
      .from('users')
      .insert({
        mobile_number: phone,
        name,
        role: 'technician',
      })
      .select('id')
      .single()

    if (insertError) return { error: insertError.message }
    technicianId = newUser.id
  }

  // Add to selected projects as team member (admin bypasses RLS)
  for (const projectId of projectIds) {
    await admin
      .from('team_members')
      .upsert({
        project_id: projectId,
        user_id: technicianId,
        role: 'technician',
      }, { onConflict: 'project_id,user_id' })
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function getManagerProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('projects')
    .select('id, name, color')
    .eq('owner_id', user.id)
    .order('name')

  return data || []
}
