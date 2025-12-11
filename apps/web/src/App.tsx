import React, { useEffect } from "react";
import { useAuth } from "./store/auth";
import { useSocket } from "./store/socket";
import { useChats } from "./store/chats";
import { AuthScreen } from "./components/auth/AuthScreen";
import { Sidebar } from "./components/chat/Sidebar";
import { ChatView } from "./components/chat/ChatView";

export default function App() {
  const { status, token } = useAuth();
  const { init, disconnect } = useSocket();
  const { setCurrent } = useChats();

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
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <ChatView />
      </div>
    </div>
  );
}
