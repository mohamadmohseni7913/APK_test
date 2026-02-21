import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useCreateFake } from '../hooks/useTickets';
import { BsArrowLeft } from 'react-icons/bs';
import type { TicketFormData } from '../types';



const CreateTicket = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TicketFormData>();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { mutate: createTicket, isPending: isCreating } = useCreateFake();

  const onSubmit = (data: TicketFormData) => {
    if (!user) {
      toast.error('کاربر لاگین نیست');
      return;
    }

    createTicket(
      { userId: user.id, data },
      {
        onSuccess: () => {
          toast.success(`تیکت "${data.title}" با موفقیت ایجاد شد`);
          navigate('/tickets'); 
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          toast.error(err.message || 'خطا در ایجاد تیکت');
        },
      }
    );
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        لطفاً ابتدا وارد شوید
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className=" max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className='flex items-end justify-center relative'>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ایجاد تیکت جدید
          </h2>
          <button title='back' className='absolute left-4 top-4 cursor-pointer bg-gray-400 shadow rounded-2xl p-2' onClick={() => navigate('/tickets')}><BsArrowLeft className='text-white' /></button>

        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                عنوان <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'عنوان الزامی است' })}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                توضیحات <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                {...register('description', { required: 'توضیحات الزامی است' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                اولویت <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                {...register('priority', { required: 'اولویت الزامی است' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">انتخاب کنید...</option>
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">بالا</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || isCreating}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'در حال ایجاد...' : 'ایجاد تیکت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;