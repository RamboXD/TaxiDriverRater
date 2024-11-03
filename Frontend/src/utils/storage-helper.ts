const TOKEN = {
  ACCESS: 'accessToken',
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN.ACCESS);
};

export const setTokens = (access: string) => {
  localStorage.setItem(TOKEN.ACCESS, access);
};

export const getTokens = (): {
  access: string | null;
} => {
  const access = localStorage.getItem(TOKEN.ACCESS);

  return {
    access,
  };
};
