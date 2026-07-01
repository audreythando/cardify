import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  token: string;
}

export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/login", payload);

  localStorage.setItem("cardify_token", response.data.token);
  localStorage.setItem("cardify_user", JSON.stringify(response.data));

  window.dispatchEvent(new Event("cardify-user-updated"));

  return response.data;
};

export const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/register", payload);

  localStorage.setItem("cardify_token", response.data.token);
  localStorage.setItem("cardify_user", JSON.stringify(response.data));

  window.dispatchEvent(new Event("cardify-user-updated"));

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("cardify_token");
  localStorage.removeItem("cardify_user");
};

export const googleLogin = async (accessToken: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/google", { credential: accessToken });

  localStorage.setItem("cardify_token", response.data.token);
  localStorage.setItem("cardify_user", JSON.stringify(response.data));

  window.dispatchEvent(new Event("cardify-user-updated"));

  return response.data;
};