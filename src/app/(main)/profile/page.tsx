import { getProfile } from '@/modules/profile/actions/profile.actions'
import { ProfileView } from '@/modules/profile/components/profile-view'

export default async function ProfilePage() {
  let profile = null
  try {
    profile = await getProfile()
  } catch {
    // Supabase not configured
  }

  return <ProfileView profile={profile} />
}
