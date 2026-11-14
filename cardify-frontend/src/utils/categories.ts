// Spending categories shared by budgets and transactions. Keep in sync with
// SpendingCategories.All in the API, which rejects anything not listed here.
export const SPENDING_CATEGORIES = [
  'Groceries',
  'Shopping',
  'Entertainment',
  'Transportation',
  'Healthcare',
  'Food & Dining',
  'Bills & Utilities',
  'Fuel',
  'Travel',
  'Other',
] as const;
