import React from 'react'
import { useChats } from '../../store/chats'
import { Avatar } from '../ui/avatar'

type ItemProps = {
  active?: boolean
  title: string
  preview?: string
  time?: string
  unread?: number
  onClick?: () => void
}

function ListItem({ active, title, preview, time, unread = 0, onClick }: ItemProps) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 px-3 py-2 ${active ? 'bg-secondary' : ''}`}>
      <Avatar name={title} />
      <div className="flex-1 text-right">
        <div className="flex items-center gap-2">
          <div className="font-medium">{title}</div>
          {unread > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">{unread}</span>}
          <div className="ms-auto text-xs text-muted-foreground">{time}</div>
        </div>
        {preview && <div className="line-clamp-1 text-xs text-muted-foreground">{preview}</div>}
      </div>
    </button>
  )
}

export function ChatList() {
  const { messages, current, setCurrent } = useChats()

  const items = Object.entries(messages).map(([key, list]) => {
    const last = list[list.length - 1]
    if (key.startsWith('group:')) {
      return {
        key,
        title: 'Lobby',
        preview: last?.content,
        time: last ? new Date(last.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        unread: 0,
        onClick: () => setCurrent({ type: 'group', room: 'room:lobby' }),
      }
    }
    const withId = key.substring('dm:'.length)
    const unread = list.filter((m: any) => m.type === 'dm' && m.recipientId === withId && m.delivered === false).length
    return {
      key,
      title: `کاربر ${withId}`,
      preview: last?.content,
      time: last ? new Date(last.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      unread,
      onClick: () => setCurrent({ type: 'dm', withId }),
    }
  })

  const activeKey = current ? (current.type === 'group' ? `group:${current.room}` : `dm:${current.withId}`) : undefined

  return (
    <div className="flex-1 overflow-y-auto">
      {items.length === 0 && (
        <div className="px-3 py-2 text-xs text-muted-foreground">هنوز گفتگویی ندارید</div>
      )}
      {items.map((i) => (
        <ListItem key={i.key} active={i.key === activeKey} title={i.title} preview={i.preview} time={i.time} unread={i.unread} onClick={i.onClick} />
      ))}
    </div>
  )
}

