import React, { useState } from "react";
import { useAuth } from "../../store/auth";
import { useChats } from "../../store/chats";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Icon } from "../ui/icon";
import { ChatList } from "./ChatList";
import { useTheme } from "../../store/theme";

export function Sidebar() {
  const { user } = useAuth();
  const { setCurrent } = useChats();
  const [search, setSearch] = useState("");
  const [dmTarget, setDmTarget] = useState("");
  const { mode, toggle, setMode } = useTheme();

  return (
    <div className="flex h-full w-80 flex-col border-r bg-white">
      <div className="flex items-center gap-2 p-3">
        <Avatar
          name={
            user?.firstName
              ? `${user.firstName} ${user.lastName || ""}`
              : user?.phone || ""
          }
          size={32}
        />
        <div className="font-semibold">{user?.firstName || user?.phone}</div>
        <div className="ms-auto flex items-center gap-2 text-muted-foreground">
          <button
            className="rounded-md p-2 hover:bg-muted"
            title="تغییر تم"
            onClick={toggle}
          >
            <Icon name={mode === "dark" ? "sun" : "moon"} />
          </button>
          <select
            className="rounded-md border bg-secondary px-2 py-1 text-xs"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            title="حالت نمایش"
          >
            <option value="system">سیستم</option>
            <option value="dark">تاریک</option>
            <option value="light">روشن</option>
          </select>
        </div>
      </div>
      <div className="p-3">
        <div className="relative">
          <Icon name="search" className="absolute right-3 top-2.5" />
          <Input
            className="pr-9"
            placeholder="جستجو"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex gap-2">
          <Input
            placeholder="شناسه کاربر برای پیام خصوصی"
            value={dmTarget}
            onChange={(e) => setDmTarget(e.target.value)}
          />
          <Button
            onClick={() =>
              dmTarget && setCurrent({ type: "dm", withId: dmTarget })
            }
          >
            <Icon name="plus" />
          </Button>
        </div>
      </div>
      <ChatList />
    </div>
  );
}
