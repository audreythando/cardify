import api from './api';

export interface DashboardSummary {
  totalBalance: number;
  totalCreditLimit: number;
  availableCredit: number;
  totalSpentThisMonth: number;
  totalCards: number;
  totalTransactions: number;
  totalBudgets: number;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>('/Dashboard/summary');
  return response.data;
};

export interface SpendingByCategory {
  category: string;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  creditCardId: string;
  merchantName: string;
  category: string;
  amount: number;
  transactionDate: string;
  status: string;
}

export interface Card {
  id: string;
  cardHolderName: string;
  cardNumber: string;
  cardType: string;
  balance: number;
  creditLimit: number;
  availableCredit: number;
  expiryDate: string;
  isActive: boolean;
}

export interface AiInsight {
  title: string;
  message: string;
  insightType: string;
}

export const getSpendingByCategory = async (): Promise<SpendingByCategory[]> => {
  const response = await api.get<SpendingByCategory[]>('/Dashboard/spending-by-category');
  return response.data;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/Transactions');
  return response.data;
};

export const getCards = async (): Promise<Card[]> => {
  const response = await api.get<Card[]>('/Cards');
  return response.data;
};

export const getAiInsights = async (): Promise<AiInsight[]> => {
  const response = await api.get<AiInsight[]>('/Dashboard/ai-insights');
  return response.data;
};

export interface CreateCardPayload {
  cardHolderName: string;
  cardNumber: string;
  cardType: string;
  balance: number;
  creditLimit: number;
  expiryDate: string;
}

export const createCard = async (payload: CreateCardPayload): Promise<Card> => {
  const response = await api.post<Card>('/Cards', payload);
  return response.data;
};

export interface CreateTransactionPayload {
  creditCardId: string;
  merchantName: string;
  category: string;
  amount: number;
}

export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  const response = await api.post<Transaction>('/Transactions', payload);
  return response.data;
};