import React from "react";
import type { GroupMessageDTO, DmMessageDTO } from "@repo/contracts";
import { useAuth } from "../../store/auth";

type Props = {
  msg: (GroupMessageDTO | DmMessageDTO) & { type: "group" | "dm" };
};

export function MessageItem({ msg }: Props) {
  const { user } = useAuth();
  const mine = msg.senderId === user?.id;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} px-3`}>
      <div className={`bubble ${mine ? "mine" : "other"} animate-message-in`}>
        <div>{msg.content}</div>
        <div className="message-time">
          {new Date(msg.createdAt).toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
