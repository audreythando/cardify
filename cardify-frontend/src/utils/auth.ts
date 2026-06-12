export const isAuthenticated = () => {
  return !!localStorage.getItem('cardify_token');
};

export const logout = () => {
  localStorage.removeItem('cardify_token');
  localStorage.removeItem('cardify_user');
};