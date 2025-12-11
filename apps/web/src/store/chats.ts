import { create } from "zustand";
import type { GroupMessageDTO, DmMessageDTO } from "@repo/contracts";

type ChatKey = string;

type ChatTarget =
  | { type: "group"; room: string }
  | { type: "dm"; withId: string };

type ChatMessage =
  | (GroupMessageDTO & { type: "group" })
  | (DmMessageDTO & { type: "dm" });

type ChatsState = {
  current?: ChatTarget;
  messages: Record<ChatKey, ChatMessage[]>;
  sidebarOpen: boolean;
  setCurrent: (t: ChatTarget) => void;
  setMessages: (key: ChatKey, list: ChatMessage[]) => void;
  addMessage: (key: ChatKey, msg: ChatMessage) => void;
  keyOf: (t: ChatTarget) => ChatKey;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useChats = create<ChatsState>()((set, get) => ({
  messages: {},
  sidebarOpen: false,
  setCurrent: (t) => set({ current: t }),
  setMessages: (key, list) =>
    set((s) => ({ messages: { ...s.messages, [key]: list } })),
  addMessage: (key, msg) =>
    set((s) => ({
      messages: { ...s.messages, [key]: [...(s.messages[key] || []), msg] },
    })),
  keyOf: (t) => (t.type === "group" ? `group:${t.room}` : `dm:${t.withId}`),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
