export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiError {
  title: string;
  errors: Record<string, string[]> | { message: string };
}

export interface AuthResponse {
  token: string;
  user: CurrentUser;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  primaryOrganizationId: number;
  memberId?: number;
  isSystemAdmin?: boolean;
}
