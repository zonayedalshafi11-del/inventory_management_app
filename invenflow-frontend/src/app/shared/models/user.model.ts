export interface UserPermissions {
  manageProducts: boolean;
  manageOrders: boolean;
  viewReports: boolean;
  manageUsers: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  permissions: UserPermissions;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  status?: string;
  lastLogin?: string;
  manageProducts?: boolean;
  manageOrders?: boolean;
  viewReports?: boolean;
  manageUsers?: boolean;
}
