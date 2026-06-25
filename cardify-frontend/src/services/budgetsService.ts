import api from './api';

export interface Budget {
  id: string;
  category: string;
  limitAmount: number;
  currentSpent: number;
  remainingAmount: number;
  month: string;
}

export interface CreateBudgetPayload {
  category: string;
  limitAmount: number;
}

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get<Budget[]>('/Budgets');
  return response.data;
};

export const createBudget = async (payload: CreateBudgetPayload): Promise<Budget> => {
  const response = await api.post<Budget>('/Budgets', payload);
  return response.data;
};