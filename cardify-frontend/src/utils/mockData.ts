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
    creditLimit: 50000,
    availableCredit: 41754.25,
    expiryDate: '08/27',
    color: 'purple',
    isPrimary: true,
  },
  {
    id: '2',
    cardholderName: 'Audrey Thando',
    lastFour: '8819',
    network: 'mastercard',
    balance: 12340.00,
    creditLimit: 25000,
    availableCredit: 12660.00,
    expiryDate: '03/26',
    color: 'gold',
    isPrimary: false,
  },
  {
    id: '3',
    cardholderName: 'Audrey Thando',
    lastFour: '3371',
    network: 'visa',
    balance: 3450.20,
    creditLimit: 15000,
    availableCredit: 11549.80,
    expiryDate: '11/28',
    color: 'dark',
    isPrimary: false,
  },
];

export const mockTransactions: Transaction[] = [
  { id: '1', merchantName: 'Takealot', category: 'Shopping', amount: -1250.00, date: '2024-05-12', cardId: '1', status: 'completed', merchantLogo: '📦' },
  { id: '2', merchantName: 'Woolworths Food', category: 'Groceries', amount: -854.30, date: '2024-05-12', cardId: '1', status: 'completed', merchantLogo: '🛍️' },
  { id: '3', merchantName: 'Netflix', category: 'Entertainment', amount: -169.00, date: '2024-05-11', cardId: '1', status: 'completed', merchantLogo: '🎬' },
  { id: '4', merchantName: 'Shell Garage', category: 'Fuel', amount: -650.00, date: '2024-05-11', cardId: '1', status: 'completed', merchantLogo: '⛽' },
  { id: '5', merchantName: 'Uber', category: 'Transportation', amount: -224.50, date: '2024-05-10', cardId: '1', status: 'completed', merchantLogo: '🚗' },
  { id: '6', merchantName: 'Checkers', category: 'Groceries', amount: -1123.00, date: '2024-05-09', cardId: '1', status: 'completed', merchantLogo: '🛒' },
  { id: '7', merchantName: 'Spotify', category: 'Entertainment', amount: -69.99, date: '2024-05-08', cardId: '2', status: 'completed', merchantLogo: '🎵' },
  { id: '8', merchantName: 'Pick n Pay', category: 'Groceries', amount: -956.00, date: '2024-05-07', cardId: '1', status: 'completed', merchantLogo: '🛍️' },
  { id: '9', merchantName: 'Superbalist', category: 'Shopping', amount: -2340.00, date: '2024-05-06', cardId: '1', status: 'completed', merchantLogo: '👗' },
  { id: '10', merchantName: 'Steers', category: 'Food & Dining', amount: -145.50, date: '2024-05-05', cardId: '2', status: 'completed', merchantLogo: '🍔' },
  { id: '11', merchantName: 'Salary — Capitec', category: 'Other', amount: 45000, date: '2024-05-01', cardId: '1', status: 'completed', merchantLogo: '💰' },
  { id: '12', merchantName: 'Discovery Health', category: 'Healthcare', amount: -1490.00, date: '2024-05-03', cardId: '2', status: 'pending', merchantLogo: '❤️' },
  { id: '13', merchantName: 'Edu-Loan', category: 'Bills & Utilities', amount: -3100.00, date: '2024-05-02', cardId: '1', status: 'completed', merchantLogo: '📚' },
  { id: '14', merchantName: 'Nando\'s', category: 'Food & Dining', amount: -320.00, date: '2024-05-04', cardId: '2', status: 'completed', merchantLogo: '🍗' },
  { id: '15', merchantName: 'Cape Union Mart', category: 'Shopping', amount: -899.00, date: '2024-05-06', cardId: '3', status: 'completed', merchantLogo: '🧥' },
];

export const mockDashboardSummary: DashboardSummary = {
  totalBalance: 8245.75,
  totalBalanceChange: 12.5,
  totalCreditLimit: 90000,
  availableCredit: 65964.05,
  monthlySpend: 13641.29,
  monthlySpendChange: -8.2,
  cashbackEarned: 1245.60,
  cashbackChange: 18.7,
};

export const mockSpendingOverview: SpendingOverview = {
  totalSpend: 13641.29,
  categories: [
    { category: 'Shopping', amount: 4489.00, percentage: 33, color: '#7C5CFC' },
    { category: 'Groceries', amount: 2933.30, percentage: 21, color: '#00D4AA' },
    { category: 'Bills & Utilities', amount: 3100.00, percentage: 23, color: '#FFB547' },
    { category: 'Food & Dining', amount: 465.50, percentage: 3, color: '#FF5A7E' },
    { category: 'Transportation', amount: 224.50, percentage: 2, color: '#A78BFA' },
    { category: 'Entertainment', amount: 238.99, percentage: 2, color: '#38BDF8' },
    { category: 'Healthcare', amount: 1490.00, percentage: 11, color: '#34D399' },
    { category: 'Fuel', amount: 650.00, percentage: 5, color: '#FB923C' },
  ],
  monthlyTrend: [
    { month: 'Jan', amount: 11200, budget: 15000 },
    { month: 'Feb', amount: 13400, budget: 15000 },
    { month: 'Mar', amount: 16800, budget: 15000 },
    { month: 'Apr', amount: 12200, budget: 15000 },
    { month: 'May', amount: 13641, budget: 15000 },
  ],
  monthOverMonthChange: -8.2,
};

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Shopping', limit: 5000, spent: 4489.00, period: 'monthly' },
  { id: '2', category: 'Groceries', limit: 3500, spent: 2933.30, period: 'monthly' },
  { id: '3', category: 'Entertainment', limit: 500, spent: 238.99, period: 'monthly' },
  { id: '4', category: 'Transportation', limit: 800, spent: 224.50, period: 'monthly' },
  { id: '5', category: 'Healthcare', limit: 2000, spent: 1490.00, period: 'monthly' },
  { id: '6', category: 'Food & Dining', limit: 1000, spent: 465.50, period: 'monthly' },
];

export const mockAISuggestions: AISuggestion[] = [
  { id: '1', title: 'You spent 18% less on dining', description: 'Great progress! You\'re on track with your Food & Dining budget.', type: 'insight' },
  { id: '2', title: 'Shopping is 33% of your total spend', description: 'Consider setting a stricter shopping budget to improve savings.', savingsAmount: 1200, type: 'alert' },
  { id: '3', title: 'You can save R120 by switching to a different plan', description: 'Bundling your streaming services could save you money monthly.', savingsAmount: 120, type: 'saving' },
];