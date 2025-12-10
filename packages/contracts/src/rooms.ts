export const Rooms = {
  Lobby: 'room:lobby' as const,
  userRoom: (userId: string) => `user:${userId}` as const,
};

