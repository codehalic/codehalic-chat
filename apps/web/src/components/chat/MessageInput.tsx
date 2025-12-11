import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { Button } from '../ui/button'

type Props = { onSend: (text: string) => void }

export function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('')
  const submit = () => {
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }
  return (
    <div className="flex items-center gap-2 border-t bg-white p-2">
      <button className="rounded-md p-2 text-muted-foreground hover:bg-muted"><Icon name="paperclip" /></button>
      <input className="flex-1 rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="پیام بنویسید" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      <button className="rounded-md p-2 text-muted-foreground hover:bg-muted"><Icon name="smile" /></button>
      <Button onClick={submit} className="gap-2"><Icon name="send" />ارسال</Button>
    </div>
  )
}

