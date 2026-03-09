import { getProfile, getTeamMembers } from '@/modules/profile/actions/profile.actions'
import { ProfileView } from '@/modules/profile/components/profile-view'

export default async function ProfilePage() {
  let profile = null
  let teamMembers: Array<{
    id: string
    user: { id: string; name: string; mobile_number: string; avatar_url: string | null } | null
    role: string
  }> = []

  try {
    const [profileData, teamData] = await Promise.all([
      getProfile(),
      getTeamMembers(),
    ])
    profile = profileData
    teamMembers = (teamData || []) as typeof teamMembers
  } catch {
    // Supabase not configured
  }

  return <ProfileView profile={profile} teamMembers={teamMembers} />
}
