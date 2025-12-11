import React, { useEffect } from "react";
import { useAuth } from "./store/auth";
import { useSocket } from "./store/socket";
import { useChats } from "./store/chats";
import { cn } from './lib/cn'
import { AuthScreen } from "./components/auth/AuthScreen";
import { Sidebar } from "./components/chat/Sidebar";
import { ChatView } from "./components/chat/ChatView";

export default function App() {
  const { status, token } = useAuth();
  const { init, disconnect } = useSocket();
  const { setCurrent, sidebarOpen } = useChats();

  useEffect(() => {
    if (status === "authenticated" && token) {
      init(token);
      setCurrent({ type: "group", room: "room:lobby" });
    } else {
      disconnect();
    }
  }, [status, token, init, disconnect, setCurrent]);

  if (status !== "authenticated") return <AuthScreen />;

  return (
    <div className="flex h-full">
      <div className={cn("sm:block", sidebarOpen ? "block" : "hidden", "sm:static sm:w-auto fixed inset-y-0 right-0 z-50 w-80")}> 
        <Sidebar />
      </div>
      <div className="flex-1">
        <ChatView />
      </div>
    </div>
  );
}
