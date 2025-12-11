import React from 'react'
import { cn } from '../../lib/cn'

type Props = {
  name: string
  size?: number
  className?: string
}

export function Avatar({ name, size = 40, className }: Props) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')
  return (
    <div
      className={cn('flex items-center justify-center rounded-full bg-blue-500 text-white', className)}
      style={{ width: size, height: size }}
    >
      <span className="text-sm font-semibold">{initials || '?'}</span>
    </div>
  )
}

