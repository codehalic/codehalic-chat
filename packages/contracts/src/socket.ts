export const SocketEvents = {
  GroupSend: 'group:send' as const,
  GroupNew: 'group:new' as const,
  GroupHistory: 'group:history' as const,
  DmSend: 'dm:send' as const,
  DmNew: 'dm:new' as const,
  DmHistory: 'dm:history' as const,
};

export interface GroupSendRequest {
  content: string;
}

export interface GroupMessageDTO {
  id: string;
  room: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export type GroupHistoryResponse = GroupMessageDTO[];

export interface GroupHistoryRequest {
  limit?: number;
}

export interface DmSendRequest {
  to: string;
  content: string;
}

export interface DmMessageDTO {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  delivered?: boolean;
}

export type DmHistoryRequest = { with: string; limit?: number };
export type DmHistoryResponse = DmMessageDTO[];

