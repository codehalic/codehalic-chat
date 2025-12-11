import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { SocketEvents } from "@repo/contracts";

type SocketState = {
  socket?: Socket;
  connected: boolean;
  init: (token: string) => void;
  disconnect: () => void;
  emitGroupSend: (content: string) => void;
  requestGroupHistory: (limit?: number) => void;
  emitDmSend: (to: string, content: string) => void;
  requestDmHistory: (withId: string, limit?: number) => void;
};

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/chat";

export const useSocket = create<SocketState>()((set, get) => ({
  connected: false,
  init: (token) => {
    const existing = get().socket;
    if (existing) existing.disconnect();
    const s = io(WS_URL, { auth: { token } });
    s.on("connect", () => set({ connected: true }));
    s.on("disconnect", () => set({ connected: false }));
    set({ socket: s });
  },
  disconnect: () => {
    const s = get().socket;
    if (s) s.disconnect();
    set({ socket: undefined, connected: false });
  },
  emitGroupSend: (content) => {
    get().socket?.emit(SocketEvents.GroupSend, { content });
  },
  requestGroupHistory: (limit) => {
    get().socket?.emit(SocketEvents.GroupHistory, { limit });
  },
  emitDmSend: (to, content) => {
    get().socket?.emit(SocketEvents.DmSend, { to, content });
  },
  requestDmHistory: (withId, limit) => {
    get().socket?.emit(SocketEvents.DmHistory, { with: withId, limit });
  },
}));
