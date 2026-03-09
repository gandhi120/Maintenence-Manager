export interface AuthUser {
  id: string
  name: string
  mobile_number: string
  avatar_url: string | null
  role: 'owner' | 'manager' | 'technician'
  created_at: string
}
