import React from "react";
import { cn } from "../../lib/cn";
import {
  Paperclip,
  Smile,
  Send,
  Search,
  Plus,
  Phone,
  Settings,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Lock,
  Sun,
  Moon,
} from "lucide-react";

type Props = {
  name:
    | "paperclip"
    | "smile"
    | "send"
    | "search"
    | "plus"
    | "phone"
    | "settings"
    | "arrow-right"
    | "smartphone"
    | "shield"
    | "lock"
    | "sun"
    | "moon";
  size?: number;
  className?: string;
};

const map = {
  paperclip: Paperclip,
  smile: Smile,
  send: Send,
  search: Search,
  plus: Plus,
  phone: Phone,
  settings: Settings,
  "arrow-right": ArrowRight,
  smartphone: Smartphone,
  shield: ShieldCheck,
  lock: Lock,
  sun: Sun,
  moon: Moon,
};

export function Icon({ name, size = 20, className }: Props) {
  const C = map[name];
  return <C size={size} className={cn("text-primary-foreground", className)} />;
}
