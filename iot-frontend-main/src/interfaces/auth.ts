declare type IdentifierType = "email" | "phone";

export interface RegisterResponse {
  email: string;
  fullname: string;
  verify_url?: string;
}

export interface RegisterPayload {
  email: string;
  fullname: string;
  password: string;
  type: IdentifierType;
  debug?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  type: IdentifierType;
}
