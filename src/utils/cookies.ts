import Cookies from 'js-cookie';

const TOKEN_KEY = 'access_token';

const COOKIE_OPTIONS = {
  expires: 1 / 24,          
  path: '/',
  secure: import.meta.env.PROD,
  sameSite: 'strict' as const,
};

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
};

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const deleteToken = () => {
  Cookies.remove(TOKEN_KEY);
};