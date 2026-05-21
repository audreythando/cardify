import type {
  CreditCard, Transaction, DashboardSummary,
  SpendingOverview, Budget, AISuggestion
} from '../types';

export const mockUser = {
  id: '1',
  name: 'Audrey Thando',
  email: 'audrey@email.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
  plan: 'free' as const,
};

export const mockCards: CreditCard[] = [
  {
    id: '1',
    cardholderName: 'Audrey Thando',
    lastFour: '4242',
    network: 'visa',
    balance: 8245.75,
    creditLimit: 15000,
    availableCredit: 6754.25,
    expiryDate: '08/27',
    color: 'purple',
    isPrimary: true,
  },
  {
    id: '2',
    cardholderName: 'Audrey Thando',
    lastFour: '8819',
    network: 'mastercard',
    balance: 2340.00,
    creditLimit: 8000,
    availableCredit: 5660.00,
    expiryDate: '03/26',
    color: 'gold',
    isPrimary: false,
  },
  {
    id: '3',
    cardholderName: 'Audrey Thando',
    lastFour: '3371',
    network: 'visa',
    balance: 450.20,
    creditLimit: 5000,
    availableCredit: 4549.80,
    expiryDate: '11/28',
    color: 'dark',
    isPrimary: false,
  },
];

export const mockTransactions: Transaction[] = [
  { id: '1', merchantName: 'Amazon.com', category: 'Shopping', amount: -125.50, date: '2024-05-12', cardId: '1', status: 'completed', merchantLogo: '🛒' },
  { id: '2', merchantName: 'Woolworths', category: 'Groceries', amount: -85.40, date: '2024-05-12', cardId: '1', status: 'completed', merchantLogo: '🛍️' },
  { id: '3', merchantName: 'Netflix', category: 'Entertainment', amount: -15.99, date: '2024-05-11', cardId: '1', status: 'completed', merchantLogo: '🎬' },
  { id: '4', merchantName: 'Shell', category: 'Fuel', amount: -60.00, date: '2024-05-11', cardId: '1', status: 'completed', merchantLogo: '⛽' },
  { id: '5', merchantName: 'Uber', category: 'Transportation', amount: -22.45, date: '2024-05-10', cardId: '1', status: 'completed', merchantLogo: '🚗' },
  { id: '6', merchantName: 'Checkers', category: 'Groceries', amount: -112.30, date: '2024-05-09', cardId: '1', status: 'completed', merchantLogo: '🛒' },
  { id: '7', merchantName: 'Spotify', category: 'Entertainment', amount: -6.99, date: '2024-05-08', cardId: '2', status: 'completed', merchantLogo: '🎵' },
  { id: '8', merchantName: 'Pick n Pay', category: 'Groceries', amount: -95.60, date: '2024-05-07', cardId: '1', status: 'completed', merchantLogo: '🛍️' },
  { id: '9', merchantName: 'Takealot', category: 'Shopping', amount: -234.00, date: '2024-05-06', cardId: '1', status: 'completed', merchantLogo: '📦' },
  { id: '10', merchantName: 'Steers', category: 'Food & Dining', amount: -45.50, date: '2024-05-05', cardId: '2', status: 'completed', merchantLogo: '🍔' },
  { id: '11', merchantName: 'Salary', category: 'Other', amount: 25000, date: '2024-05-01', cardId: '1', status: 'completed', merchantLogo: '💰' },
  { id: '12', merchantName: 'Discovery Vitality', category: 'Healthcare', amount: -149.00, date: '2024-05-03', cardId: '2', status: 'pending', merchantLogo: '❤️' },
];

export const mockDashboardSummary: DashboardSummary = {
  totalBalance: 8245.75,
  totalBalanceChange: 12.5,
  totalCreditLimit: 15000,
  availableCredit: 6754.25,
  monthlySpend: 2345.60,
  monthlySpendChange: -8.2,
  cashbackEarned: 245.60,
  cashbackChange: 18.7,
};

export const mockSpendingOverview: SpendingOverview = {
  totalSpend: 2345.60,
  categories: [
    { category: 'Shopping', amount: 850.40, percentage: 36, color: '#7C5CFC' },
    { category: 'Food & Dining', amount: 520.30, percentage: 22, color: '#FF5A7E' },
    { category: 'Bills & Utilities', amount: 310.20, percentage: 13, color: '#FFB547' },
    { category: 'Transportation', amount: 280.50, percentage: 12, color: '#00D4AA' },
    { category: 'Entertainment', amount: 200.10, percentage: 9, color: '#38BDF8' },
    { category: 'Other', amount: 184.10, percentage: 8, color: '#A78BFA' },
  ],
  monthlyTrend: [
    { month: 'Jan', amount: 1900, budget: 2500 },
    { month: 'Feb', amount: 2100, budget: 2500 },
    { month: 'Mar', amount: 2800, budget: 2500 },
    { month: 'Apr', amount: 2200, budget: 2500 },
    { month: 'May', amount: 2345, budget: 2500 },
  ],
  monthOverMonthChange: -8.2,
};

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Shopping', limit: 1000, spent: 850.40, period: 'monthly' },
  { id: '2', category: 'Food & Dining', limit: 600, spent: 520.30, period: 'monthly' },
  { id: '3', category: 'Entertainment', limit: 250, spent: 200.10, period: 'monthly' },
  { id: '4', category: 'Transportation', limit: 300, spent: 280.50, period: 'monthly' },
  { id: '5', category: 'Healthcare', limit: 500, spent: 149.00, period: 'monthly' },
];

export const mockAISuggestions: AISuggestion[] = [
  { id: '1', title: 'You spent 18% less on dining', description: 'Great progress! You\'re on track with your Food & Dining budget.', type: 'insight' },
  { id: '2', title: 'Shopping is 36% of your total spend', description: 'Consider setting a stricter shopping budget to improve savings.', savingsAmount: 120, type: 'alert' },
  { id: '3', title: 'You can save $120 by switching to a different plan', description: 'Bundling your streaming services could save you money monthly.', savingsAmount: 120, type: 'saving' },
];