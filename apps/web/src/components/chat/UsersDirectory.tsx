import React from 'react'
import { api } from '../../lib/api'
import type { UsersListItemDTO } from '@repo/contracts'
import { Avatar } from '../ui/avatar'
import { useChats } from '../../store/chats'

export function UsersDirectory() {
  const [users, setUsers] = React.useState<UsersListItemDTO[]>([])
  const [q, setQ] = React.useState('')
  const { setCurrent, closeSidebar } = useChats()
  React.useEffect(() => {
    let mounted = true
    api.listUsers().then((res) => { if (res.ok && mounted) setUsers(res.users) }).catch(() => {})
    return () => { mounted = false }
  }, [])
  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return users
    return users.filter(u => (u.firstName || '').toLowerCase().includes(s) || (u.lastName || '').toLowerCase().includes(s) || u.phone.includes(s))
  }, [users, q])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="جستجوی کاربر" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="max-h-64 overflow-y-auto">
        {filtered.map(u => (
          <button key={u.id} onClick={() => { setCurrent({ type: 'dm', withId: u.id }); closeSidebar() }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">
            <Avatar name={u.firstName ? `${u.firstName} ${u.lastName || ''}` : u.phone} />
            <div className="flex-1 text-right">
              <div className="font-medium">{u.firstName ? `${u.firstName} ${u.lastName || ''}` : u.phone}</div>
              <div className="text-xs text-muted-foreground">{u.phone}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-3 py-2 text-xs text-muted-foreground">کاربری یافت نشد</div>
        )}
      </div>
    </div>
  )
}
