'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { logout } from '@/modules/auth/actions/auth.actions'

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      className="w-full border-danger/30 text-danger hover:bg-danger/10"
      onClick={() => logout()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
