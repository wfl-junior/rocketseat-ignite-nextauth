export type Permission = "users.list" | "users.create" | "metrics.list";
export type Role = "administrator" | "editor";

interface CommonData {
  permissions: Permission[];
  roles: Role[];
}

export interface User extends CommonData {
  email: string;
}

export interface SignInResponse extends CommonData {
  token: string;
  refreshToken: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
