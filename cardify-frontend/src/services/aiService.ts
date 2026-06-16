import api from './api';

export interface FinancialInsightRequest {
  prompt: string;
}

export interface FinancialInsightResponse {
  insight: string;
}

export const generateFinancialInsight = async (
  prompt: string
): Promise<string> => {
  const response = await api.post<FinancialInsightResponse>(
    '/Ai/financial-insight',
    { prompt }
  );

  return response.data.insight;
};