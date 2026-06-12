import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  token: string;
}

export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/login", payload);

  localStorage.setItem("cardify_token", response.data.token);
  localStorage.setItem("cardify_user", JSON.stringify(response.data));

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("cardify_token");
  localStorage.removeItem("cardify_user");
};