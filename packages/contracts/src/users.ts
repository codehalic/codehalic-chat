export const UsersRoutes = {
  List: '/users/list' as const,
};

export interface UsersListItemDTO {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

export interface UsersListResponse {
  ok: boolean;
  users: UsersListItemDTO[];
}

