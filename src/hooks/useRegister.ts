import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { setToken } from '../utils/cookies';
import { useUserContext } from '../context/AuthContext';
import type { User } from '../types';

interface RegisterData {
  username: string;
  password: string;
  email?: string;
}

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserContext();

  return useMutation<
    { user: User; accessToken: string },
    Error,
    RegisterData
  >({
    mutationFn: async (data: RegisterData) => {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email || `${data.username}@example.com`,
          is_admin: false, 
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'ثبت‌نام ناموفق');
      }
      const newUser = await res.json(); 
      const fakeToken = `mock-token-${newUser.id}-${Date.now()}`;
      setToken(fakeToken);
      localStorage.setItem('mockUser', JSON.stringify(newUser));

      return { user: newUser, accessToken: fakeToken };
    },
    onSuccess: ({ user }) => {
      setUser(user);
      toast.success('ثبت‌نام با موفقیت انجام شد! حالا می‌تونی وارد شی.');
      queryClient.invalidateQueries({ queryKey: ['user'] }); 
    },
    onError: (err) => {
      toast.error(err.message || 'خطا در ثبت‌نام');
      console.error('Register error:', err);
    },
  });
};