import React, { useEffect, useMemo } from "react";
import { useChats } from "../../store/chats";
import { useSocket } from "../../store/socket";
import { useAuth } from "../../store/auth";
import { MessageItem } from "./MessageItem";
import { MessageInput } from "./MessageInput";
import { SocketEvents } from "@repo/contracts";
import { Avatar } from "../ui/avatar";
import { Icon } from "../ui/icon";

export function ChatView() {
  const {
    current,
    messages,
    keyOf,
    setMessages,
    addMessage,
    sidebarOpen,
    toggleSidebar,
  } = useChats();
  const {
    socket,
    emitGroupSend,
    requestGroupHistory,
    emitDmSend,
    requestDmHistory,
  } = useSocket();
  const { user } = useAuth();

  const key = useMemo(() => (current ? keyOf(current) : ""), [current, keyOf]);
  const list = key ? messages[key] || [] : [];

  useEffect(() => {
    if (!socket || !current) return;
    if (current.type === "group") {
      const onHistory = (items: any[]) =>
        setMessages(
          keyOf(current),
          items.map((m) => ({ ...m, type: "group" }))
        );
      const onNew = (m: any) =>
        addMessage(keyOf(current), { ...m, type: "group" });
      socket.on(SocketEvents.GroupHistory, onHistory);
      socket.on(SocketEvents.GroupNew, onNew);
      requestGroupHistory(50);
      return () => {
        socket.off(SocketEvents.GroupHistory, onHistory);
        socket.off(SocketEvents.GroupNew, onNew);
      };
    } else {
      const onHistory = (items: any[]) =>
        setMessages(
          keyOf(current),
          items.map((m) => ({ ...m, type: "dm" }))
        );
      const onNew = (m: any) =>
        addMessage(keyOf(current), { ...m, type: "dm" });
      socket.on(SocketEvents.DmHistory, onHistory);
      socket.on(SocketEvents.DmNew, onNew);
      requestDmHistory(current.withId, 50);
      return () => {
        socket.off(SocketEvents.DmHistory, onHistory);
        socket.off(SocketEvents.DmNew, onNew);
      };
    }
  }, [
    socket,
    current,
    keyOf,
    setMessages,
    addMessage,
    requestGroupHistory,
    requestDmHistory,
  ]);

  const title =
    current?.type === "group" ? "Lobby" : `کاربر ${current?.withId}`;
  const subtitle = current?.type === "group" ? "گفتگوی عمومی" : "پیام خصوصی";

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center gap-3 border-b bg-white p-3">
        <button
          className="sm:hidden rounded-md p-2 text-muted-foreground"
          onClick={toggleSidebar}
        >
          <Icon name="arrow-right" />
        </button>
        <Avatar name={title} />
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
        <div className="ms-auto text-sm text-muted-foreground">
          {user?.firstName ? "آنلاین" : ""}
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-background py-3">
        {list.map((m) => (
          <MessageItem key={m.id} msg={m as any} />
        ))}
      </div>
      <MessageInput
        onSend={(t) => {
          if (!current) return;
          if (current.type === "group") emitGroupSend(t);
          else emitDmSend(current.withId, t);
        }}
      />
    </div>
  );
}
