import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField'; 
import { useRegister } from '../../hooks/useRegister';

interface RegisterFormData {
  username: string;
  password: string;
  email?: string;
}

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  const { mutate: registerUser, isPending: isRegistering } = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data, {
      onSuccess: () => {
        navigate('/login'); 
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-xl min-w-lg px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center">ثبت‌نام</h2>
      <InputField
        label="نام کاربری"
        name="username"
        type="text"
        register={register}
        errors={errors}
        placeholder="نام کاربری"
      />

      <InputField
        label="ایمیل"
        name="email"
        type="email"
        register={register}
        errors={errors}
        placeholder="ایمیل (اختیاری)"
      />

      <InputField
        label="رمز عبور"
        name="password"
        type="password"
        register={register}
        errors={errors}
        placeholder="رمز عبور"
      />

      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={isRegistering}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isRegistering ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </button>
      </div>

      <p className="text-center text-sm mt-4">
        حساب دارید؟ <a href="/login" className="text-blue-500 hover:underline">ورود کنید</a>
      </p>
    </form>
  );
};

export default RegisterForm;