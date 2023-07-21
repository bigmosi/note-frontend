
let isAuthenticated = false;

export const checkAuthentication = () => {
  return isAuthenticated;
};

export const login = async (username, password) => {
  isAuthenticated = true;
};
