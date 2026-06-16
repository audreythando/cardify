import api from './api';

export interface NotificationSettings {
  spendingAlerts: boolean;
  budgetWarnings: boolean;
  aiInsights: boolean;
  weeklyReport: boolean;
  unusualActivity: boolean;
}

export interface AiSettings {
  autoInsights: boolean;
  spendingPredictions: boolean;
  anomalyDetection: boolean;
  personalisation: boolean;
}

export interface SettingsResponse {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  notifications: NotificationSettings;
  ai: AiSettings;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber: string | null;
}

export const getSettings = async (): Promise<SettingsResponse> => {
  const response = await api.get<SettingsResponse>('/Settings');
  return response.data;
};

export const updateProfile = async (
  payload: UpdateProfileRequest
): Promise<SettingsResponse> => {
  const response = await api.put<SettingsResponse>('/Settings/profile', payload);
  return response.data;
};

export const updatePreferences = async (
  notifications: NotificationSettings,
  ai: AiSettings
): Promise<SettingsResponse> => {
  const response = await api.put<SettingsResponse>('/Settings/preferences', {
    notifications,
    ai,
  });
  return response.data;
};