export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  two_factor_confirmed_at: string | null;
  current_team_id: number | null;
  profile_photo_path: string | null;
  created_at: string;
  updated_at: string;
  profile_photo_url: string;
  roles: Role[];
}

//profile response
export interface ProfileResponse {
  success: boolean;
  message: string;
  response: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  response: {
    token: string;
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}
