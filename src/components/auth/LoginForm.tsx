import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import { setToken } from '../../utils/cookies';
import { useUserContext } from '../../context/AuthContext';
import { useUsers } from '../../hooks/useUsers';
import toast from 'react-hot-toast';

interface LoginFormData {
  username: string;
  password: string;
}
const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { data: userList, isLoading } = useUsers();

  const onSubmit = (data: LoginFormData) => {
    if (isLoading || !userList) {
      toast.loading("در حال بارگذاری ... لطفا صبر کنید")
      return;
    }

    const matchedUser = userList.find(
      u => u.username === data.username && u.password === data.password
    );

    if (matchedUser) {
      const fakeToken = `mock-token-for-${matchedUser.id}-${Date.now}`;
      setToken(fakeToken);

      const userToSave = {
        id: matchedUser.id,
        username: matchedUser.username,
        is_admin: matchedUser.is_admin ?? false
      };
      localStorage.setItem('mockUser', JSON.stringify(userToSave));
      setUser(userToSave);
      toast.success("با موفقیت وارد شدید");
      setTimeout(() => {
        navigate('/tickets');

      }, 300)
    } else {
      toast.error("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-md  min-w-[320px] sm:min-w-lg px-8 pt-6 pb-8 mb-4 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">ورود</h2>

      <InputField
        label="نام کاربری"
        name="username"
        type="text"
        register={register}
        errors={errors}
        placeholder="نام کاربری"
      />

      <InputField
        label="رمز عبور"
        name="password"
        type="password"
        register={register}
        errors={errors}
        placeholder="رمز عبور"
      />

      <div className="w-full flex items-center justify-center mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
        >
          ورود
        </button>
      </div>

      <p className="text-center text-sm mt-6">
        حساب ندارید؟{' '}
        <a href="/register" className="text-blue-500 hover:underline">
          ثبت‌نام کنید
        </a>
      </p>
    </form>
  );
};

export default LoginForm;