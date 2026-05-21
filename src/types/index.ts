
export interface CreditCard {
  id: string;
  cardholderName: string;
  lastFour: string;
  network: 'visa' | 'mastercard' | 'amex';
  balance: number;
  creditLimit: number;
  availableCredit: number;
  expiryDate: string;
  color: 'purple' | 'gold' | 'dark';
  isPrimary: boolean;
}

export type TransactionCategory =
  | 'Shopping'
  | 'Food & Dining'
  | 'Bills & Utilities'
  | 'Transportation'
  | 'Entertainment'
  | 'Healthcare'
  | 'Travel'
  | 'Fuel'
  | 'Groceries'
  | 'Other';

export interface Transaction {
  id: string;
  merchantName: string;
  merchantLogo?: string;
  category: TransactionCategory;
  amount: number;
  date: string;
  cardId: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

export interface SpendingCategory {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlySpend {
  month: string;
  amount: number;
  budget: number;
}

export interface SpendingOverview {
  totalSpend: number;
  categories: SpendingCategory[];
  monthlyTrend: MonthlySpend[];
  monthOverMonthChange: number;
}

export interface DashboardSummary {
  totalBalance: number;
  totalBalanceChange: number;
  totalCreditLimit: number;
  availableCredit: number;
  monthlySpend: number;
  monthlySpendChange: number;
  cashbackEarned: number;
  cashbackChange: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  savingsAmount?: number;
  type: 'saving' | 'alert' | 'insight';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'free' | 'premium';
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
}