export interface UserItem {
  id: number;
  email: string;
  phone_number: any;
  first_name: string;
  last_name: string;
  photo_url: string;
  status: UserStatus;
  roles: string[];
  created_at: string;
  updated_at: string;
  token: string;
}

export declare type UserStatus = "registered" | "verified" | "active" | "inactive";
export declare type UserRoles = "admin" | "user";
export interface UpdatePasswordFormStateParams {
  old_password: string;
  new_password: string;
}
